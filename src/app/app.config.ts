import {ApplicationConfig} from '@angular/core';
import {getJBRAppShellProviders} from "@jamesbenrobb/app-shell";
import {getJBRAppShellAngularRouterProviders} from "@jamesbenrobb/app-shell-routing-adaptors";

import { routes } from './app.routes';
import {convertRoutes} from "./routes/route-to-nav.convertor";
import {routeConfigs} from "./routes/route.config";


export const appConfig: ApplicationConfig = {
  providers: [
    getJBRAppShellProviders({
      displayBreadcrumbs: false
    }),
    getJBRAppShellAngularRouterProviders(
      routes,
      convertRoutes(routeConfigs)
    )
  ]
};
