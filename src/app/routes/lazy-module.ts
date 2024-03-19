import {Route} from "@angular/router";
import {createRoutes} from "./route.helpers";
import {lazyRoutes} from "./lazy-routes";


export const LAZY_MODULE_ROUTES: Route[] = createRoutes(lazyRoutes);