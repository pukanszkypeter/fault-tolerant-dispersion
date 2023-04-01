import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { DarkModeService } from "angular-dark-mode";
import { SimulatorService } from "src/app/services/client/simulator.service";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";

@Component({
  selector: "app-settings-config-dialog",
  templateUrl: "./settings-config-dialog.component.html",
  styleUrls: ["./settings-config-dialog.component.scss"],
})
export class SettingsConfigDialogComponent {
  darkMode$: Observable<boolean> = this.darkMode.darkMode$;

  constructor(
    public dialogRef: MatDialogRef<SettingsConfigDialogComponent>,
    private darkMode: DarkModeService,
    private simulator: SimulatorService,
    @Inject(MAT_DIALOG_DATA) public data: { faultsConfigured: boolean }
  ) {}

  increaseDelay(): void {
    this.simulator.increaseDelay();
  }

  decreaseDelay(): void {
    this.simulator.decreaseDelay();
  }

  get delay(): number {
    return this.simulator.delay;
  }

  toggleSaveResults(event: MatSlideToggleChange) {
    this.simulator.toggleSaveResults(event.checked);
  }

  get saveResults(): boolean {
    return this.simulator.saveResults;
  }

  toggleShowInformations(event: MatSlideToggleChange) {
    this.simulator.toggleShowInformations(event.checked);
  }

  get showInformations(): boolean {
    return this.simulator.showInformations;
  }

  toggleSimulateFaults(event: MatSlideToggleChange) {
    this.simulator.toggleSimulateFaults(event.checked);
  }

  get simulateFaults(): boolean {
    return this.simulator.simulateFaults;
  }
}
