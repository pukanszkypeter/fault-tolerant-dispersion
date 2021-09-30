import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setCalculatedContainerHeight();
  }

  ngOnInit() {
    this.setCalculatedContainerHeight();
    
    const homeClass = document.getElementsByClassName('sidebar-link').item(0).classList;
    homeClass.remove('text-black');
    homeClass.add('text-white');
    homeClass.add('active');
    this.handleActiveLinkStyle();
  }

  setCalculatedContainerHeight(): void {
    const headerHeight = document.getElementById('app-header').clientHeight;
    const documentHeight = document.body.clientHeight;

    let contentContainer = document.getElementById('content-container');
    contentContainer.style.height = documentHeight - headerHeight + 'px';
  }

  handleActiveLinkStyle(): void {
    const sidebarLinks = document.getElementsByClassName('sidebar-link');
    for (let i = 0; i < sidebarLinks.length; i++) {
      sidebarLinks.item(i).addEventListener('click', () => {
        const oldActive = document.getElementsByClassName('active sidebar-link').item(0).classList;
        oldActive.remove('text-white');
        oldActive.remove('active');
        oldActive.add('text-black');

        sidebarLinks.item(i).classList.remove('text-black');
        sidebarLinks.item(i).classList.add('active');
        sidebarLinks.item(i).classList.add('text-white');
      });
    }
  }

}
