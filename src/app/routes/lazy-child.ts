import {LoadChildrenCallback} from "@angular/router";

export const lazyChildRoute: LoadChildrenCallback = () => import('../components/loaded-child/loaded-child.component').then(m => m.LoadedChildComponent);