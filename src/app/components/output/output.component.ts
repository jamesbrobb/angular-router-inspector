import {Component, inject} from '@angular/core';
import {Logger} from "../../services/logger";
import {AsyncPipe, LowerCasePipe, NgClass} from "@angular/common";
import {SettingsService} from "../../services/settings.service";
import {map} from "rxjs";


@Component({
  selector: 'logging-output',
  standalone: true,
  imports: [
    AsyncPipe,
    LowerCasePipe,
    NgClass
  ],
  templateUrl: './output.component.html',
  styleUrl: './output.component.scss'
})
export class OutputComponent {

  readonly #logger = inject(Logger);
  readonly #settings = inject(SettingsService);

  readonly selectedFilters$ = this.#settings.data$.pipe(
      map(data => {
        return [
          ...data.selectedTypeFilters.map(filter => filter.toLowerCase()),
          ...data.selectedGuardFilters.map(filter => filter.toLowerCase())
        ]
      })
  );

  readonly messages$ = this.#logger.messages$;
}
