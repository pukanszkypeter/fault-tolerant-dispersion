import { Component, OnInit } from '@angular/core';
import {ActiveLinkService} from "../../../services/client-side/active-link/active-link.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private activeLinkService: ActiveLinkService) { }

  ngOnInit(): void {
    this.activeLinkService.setActiveLink(0);
  }

}
