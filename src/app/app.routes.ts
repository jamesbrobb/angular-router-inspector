import { Routes } from '@angular/router';
import {createRoutes} from "./routes/route.helpers";
import {routeConfigs} from "./routes/route.config";
import {FourOhFourComponent} from "./components/four-oh-four/four-oh-four.component";


export const routes: Routes = [
  ...createRoutes(routeConfigs),
  {
    path: '**',
    component: FourOhFourComponent
  }
];
