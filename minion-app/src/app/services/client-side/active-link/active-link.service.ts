import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveLinkService {

  constructor() { }

  setActiveLink(index?: number, error?: boolean): void {
    const links = document.getElementsByClassName('sidebar-link');
    for (let i = 0; i < links.length; i++) {
      if (i == index && !error) {
        links.item(i).classList.remove('text-black');
        links.item(i).classList.add('active');
        links.item(i).classList.add('text-white');
      } else {
        links.item(i).classList.add('text-black');
        links.item(i).classList.remove('active');
        links.item(i).classList.remove('text-white');
      }
    }
  }

}
