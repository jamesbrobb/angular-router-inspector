import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppShellLayoutComponent} from "@jamesbenrobb/app-shell";
import {NgClass} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {MatButton} from "@angular/material/button";
import {SettingsPanelComponent} from "./components/settings-panel/settings-panel.component";
import {OutputComponent} from "./components/output/output.component";
import {MatIcon} from "@angular/material/icon";
import {Logger} from "./services/logger";
import {SettingsService} from "./services/settings.service";
import {RouteEventHandler} from "./services/route-event-handler";
import {routeConfigs} from "./routes/route.config";
import {RouteConfig} from "./routes/route.helpers";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass,
    MatDivider,
    MatButton,
    AppShellLayoutComponent,
    SettingsPanelComponent,
    OutputComponent,
    MatIcon
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  readonly #logger = inject(Logger);
  readonly #settings = inject(SettingsService);

  protected readonly routeEventHandler = inject(RouteEventHandler);
  protected outputAscending = true;

  constructor() {
    this.#createSettings(routeConfigs);
  }

  clearOutput(): void {
    this.#logger.clear();
  }

  resetFilters(): void {
    this.#settings.resetFilters();
  }

  // TODO - move this
  #createSettings(routeConfig: RouteConfig[]) {

    routeConfig.forEach((route) => {
      this.#settings.addGuardResultsForRoute(route.path);

      if(route.children) {
        this.#createSettings(route.children);
      }
    });
  }
}
