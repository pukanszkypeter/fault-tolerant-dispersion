import { Component, OnInit } from '@angular/core';
import {ActiveLinkService} from "../../services/client-side/active-link/active-link.service";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private activeLinkService: ActiveLinkService) { }

  ngOnInit(): void {
    this.activeLinkService.setActiveLink(null, true);
  }

}
