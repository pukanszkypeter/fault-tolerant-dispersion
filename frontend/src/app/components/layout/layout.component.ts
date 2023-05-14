import { Component } from "@angular/core";
import { Page, pages } from "app/models/utils/Pages";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent {
  pages: readonly Page[] = pages;
}
