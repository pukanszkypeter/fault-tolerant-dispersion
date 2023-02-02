import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { AlgorithmType } from "src/app/models/core/AlgorithmType";
import {
  FormStrategy,
  manipulateGraphSettings,
} from "src/app/models/core/GraphSettings";
import { GraphType } from "src/app/models/core/GraphType";

@Component({
  selector: "app-simulator",
  templateUrl: "./simulator.component.html",
  styleUrls: ["./simulator.component.scss"],
})
export class SimulatorComponent {
  graphTypes = Object.keys(GraphType);
  isGraphSettingsPanelOpen = false;
  graphTypeFormControl = new FormControl("", [Validators.required]);

  defaultSettings = new FormControl(false);

  // Quick
  graphData: any = null;

  algorithmTypes = Object.keys(AlgorithmType);
  algorithmTypeFormControl = new FormControl("", [Validators.required]);

  handleDefaultSettingsToggleChange(): void {
    manipulateGraphSettings(
      this.graphTypeFormControl.value as GraphType,
      this.defaultSettings.value ? FormStrategy.CUSTOM : FormStrategy.DEFAULT
    );
    if (this.graphTypeFormControl.value === GraphType.GNP_RANDOM) {
      this.setEdgePropabilityText();
    }
  }

  configureGraph(): void {}

  /** Quick and dirty */
  setEdgePropabilityText(): void {
    const propability =
      Number(
        (document.getElementById("propability") as HTMLInputElement).value
      ) * 100;
    const propabilityText = document.getElementById("propability-text");
    propabilityText!.textContent = String(propability.toFixed(0));
  }
}
