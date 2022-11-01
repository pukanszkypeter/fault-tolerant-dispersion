import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { SnackbarService } from "../../../services/client-side/utils/snackbar.service";
import { LanguageService } from "../../../services/client-side/utils/language.service";
import { MatRadioChange } from "@angular/material/radio";
import { MatSelectChange } from "@angular/material/select";
import { GraphType } from 'src/app/models/utils/GraphType';
import { AlgorithmType } from 'src/app/models/utils/AlgorithmType';
import { VisualizationService } from 'src/app/services/server-side/python-engine/visualization-service/visualization.service';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {

  /** Summary Chart */

  summaryOptions = ['average', 'max', 'min', 'tests'];
  summaryBy = new FormControl('', [Validators.required]);

  xAxis = new FormControl('algorithm', [Validators.required])

  SUMMARY_LOADING = false;

  plainSummary: any[] = [];
  summary: any[] = [];

  /** Group By Chart */
  graphTypes = Object.keys(GraphType);
  graphType = new FormControl('', [Validators.required]);

  algorithmTypes = Object.keys(AlgorithmType);
  algorithmType = new FormControl('', [Validators.required]);

  groupBy = new FormControl('nodes', [Validators.required]);

  LOADING = false;
  NO_TEST_FOUND = false;

  result: any[] = [];

  /** Detail By Chart */

  detailBy = new FormControl('', [Validators.required]);
  graphTypeDetail = new FormControl('', [Validators.required]);
  algorithmTypeDetail = new FormControl('', [Validators.required]);

  DETAIL_LOADING = false;
  NO_DETAIL_FOUND = false;

  detail: {custom: number, nodes: number, robots: number, components: number}[] = [];
  detailColumns = ['custom', 'nodes', 'robots', 'components'];

  constructor(private visualizationService: VisualizationService,
              private snackBarService: SnackbarService,
              private languageService: LanguageService) { }

  ngOnInit(): void {
  }

  summarize(): void {
    this.SUMMARY_LOADING = true;
    this.summary = [];
    this.visualizationService.summarize(this.summaryBy.value)
      .subscribe(res => {
        this.plainSummary = res;
        this.summary = this.createSummary(this.plainSummary, this.xAxis.value !== 'algorithm');
        setTimeout(() => this.SUMMARY_LOADING = false, 1000);
      }, err => {
        console.log(err);
        this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        setTimeout(() => this.SUMMARY_LOADING = false, 1000);
      });
  }

  createSummary(steps: any[], afterGraph: boolean): any[] {
    let result = [];
    for (let custom_type_one of afterGraph ? this.graphTypes : this.algorithmTypes) {
      let series = [];
      let values = steps.filter(step => afterGraph ? step[2] === custom_type_one.valueOf() : step[1] === custom_type_one.valueOf());
      for (let custom_type_two of afterGraph ? this.algorithmTypes : this.graphTypes) {
        let value = values.filter(value => afterGraph ? value[1] === custom_type_two.valueOf() : value[2] === custom_type_two.valueOf());
        if (value.length === 1) {
          series.push({name: this.languageService.getTranslatedText(custom_type_two.valueOf()), value: value[0][0]});
        } else {
          series.push({name: this.languageService.getTranslatedText(custom_type_two.valueOf()), value: 0});
        }
      }
      result.push({name: this.languageService.getTranslatedText(custom_type_one.valueOf()), series: series});
    }
    return result;
  }

  switchView(event: MatRadioChange | MatSelectChange): void {
    if (this.plainSummary.length) {
      if (event instanceof MatRadioChange) {
        this.summary = this.createSummary(this.plainSummary, event.value !== 'algorithm');
      } else {
        this.summarize();
      }
    }
  }

  query(): void {
    this.LOADING = true;
    this.NO_TEST_FOUND = false;
    this.result = [];
    this.visualizationService.groupBy(this.algorithmType.value, this.graphType.value, this.groupBy.value)
      .subscribe(res => {
        if (res.series.length > 0) {
          this.result.push(res);
        } else {
          this.NO_TEST_FOUND = true;
        }
        setTimeout(() => this.LOADING = false, 1000);
      }, err => {
        console.log(err);
        this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        setTimeout(() => this.LOADING = false, 1000);
      });
  }

  detailByQuery(): void {
    this.DETAIL_LOADING = true;
    this.NO_DETAIL_FOUND = false;
    this.detail = [];
    this.visualizationService.detailBy(this.detailBy.value, this.algorithmTypeDetail.value, this.graphTypeDetail.value)
      .subscribe(res => {
        if (res.length > 0) {
          for (let list of res) {
            this.detail.push({custom: list[0], nodes: list[1], robots: list[2], components: list[3]});
          }
        } else {
          this.NO_DETAIL_FOUND = true;
        }
        setTimeout(() => this.DETAIL_LOADING = false, 1000);
      }, err => {
        console.log(err);
        this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        setTimeout(() => this.DETAIL_LOADING = false, 1000);
      });
  }

  detailByQueryChange(): void {
    if (this.detail.length > 0) {
      this.detailByQuery();
    }
  }

}
