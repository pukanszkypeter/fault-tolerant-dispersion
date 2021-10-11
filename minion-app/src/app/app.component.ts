import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setCalculatedContainerHeight();
  }

  ngOnInit() {
    this.setCalculatedContainerHeight();
  }

  setCalculatedContainerHeight(): void {
    const headerHeight = document.getElementById('app-header').clientHeight;
    const documentHeight = document.body.clientHeight;

    let contentContainer = document.getElementById('content-container');
    contentContainer.style.height = documentHeight - headerHeight + 'px';
  }

}
