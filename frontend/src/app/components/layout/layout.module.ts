import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared.module";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { LayoutComponent } from "./layout.component";
import { MainComponent } from "./main/main.component";

@NgModule({
  imports: [SharedModule],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
  ],
  exports: [LayoutComponent, HeaderComponent, MainComponent, FooterComponent],
})
export class LayoutModule {}
