import {debounceTime, tap} from "rxjs";
import {Component, DestroyRef, effect, inject, viewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ContentHideComponent} from "@jamesbenrobb/ui";
import {SettingsService} from "../../services/settings.service";
import {GUARD_TYPES, TRIGGER_TYPES} from "../../services/settings";


@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [
    ContentHideComponent,
    MatCheckbox,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    AsyncPipe
  ],
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss'
})
export class SettingsPanelComponent {

  readonly form = viewChild.required<NgForm>('form');

  readonly #destroyRef = inject(DestroyRef);
  readonly settings = inject(SettingsService);

  protected data$ = this.settings.data$;

  protected readonly typeFilterOptions = TRIGGER_TYPES;
  protected readonly guardFilterOptions = GUARD_TYPES;

  constructor() {
    effect(() => {
      this.form().valueChanges?.pipe(
          debounceTime(250),
          tap((value) => {
            this.settings.updateData(value);
          }),
          takeUntilDestroyed(this.#destroyRef),
      ).subscribe();
    });
  }
}
