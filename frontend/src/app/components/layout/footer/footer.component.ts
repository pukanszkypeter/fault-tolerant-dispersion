import { Component, Input } from "@angular/core";
import { Page } from "src/app/models/utils/Pages";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  @Input() pages: readonly Page[] = [];
}
