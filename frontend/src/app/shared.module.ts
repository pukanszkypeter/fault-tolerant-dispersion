import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustomSnackBarComponent } from "./services/utils/snack-bar.service";
import { MaterialModule } from "./material/material.module";
import { AppRoutingModule } from "./app-routing.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, MaterialModule, AppRoutingModule, TranslateModule],
  declarations: [CustomSnackBarComponent],
  exports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    TranslateModule,
    CustomSnackBarComponent,
  ],
})
export class SharedModule {}
