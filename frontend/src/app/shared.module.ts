import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustomSnackBarComponent } from "./services/client/snack-bar.service";
import { MaterialModule } from "./material/material.module";
import { AppRoutingModule } from "./app-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { MarkdownModule } from "ngx-markdown";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    TranslateModule,
    MarkdownModule.forChild(),
  ],
  declarations: [CustomSnackBarComponent],
  exports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    TranslateModule,
    CustomSnackBarComponent,
    MarkdownModule,
  ],
})
export class SharedModule {}
