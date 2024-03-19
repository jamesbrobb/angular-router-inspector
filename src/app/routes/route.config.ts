import {RouteConfig} from "./route.helpers";
import {lazyChildRoute} from "./lazy-child";
import {lazyRoutes} from "./lazy-routes";


export const routeConfigs: RouteConfig[] = [{
  path: 'a',
  redirectsFrom: [''],
}, {
  path: 'b1',
  children: [
    {
      path: 'b2',
      children: [
        {
          path: 'b3',
          children: [
            {
              path: 'b4',
              children: [
                {
                  path: 'b5',
                  children: [
                    {
                      path: 'b6'
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
  ]
}, {
  path: 'c',
  children: [
    { path: 'c-1' },
    { path: 'c-2' },
    {
      path: 'c-3',
      children: [
        { path: 'c-3-1' },
        { path: 'c-3-2' },
        {
          path: 'c-3-3',
          children: [
            { path: 'c-3-3-1' },
            { path: 'c-3-3-2' },
            {
              path: 'c-3-3-3',
              children: [
                { path: 'c-3-3-3-1' },
                { path: 'c-3-3-3-2' },
                { path: 'c-3-3-3-3' }
              ]
            }
          ]
        }
      ]
    }
  ]
}, {
  path: 'd-load-component',
  loadComponent: lazyChildRoute,
  children: [{
    path: 'd-1',
  }, {
    path: 'd-2',
  }]
}, {
  path: 'e-lazy-module',
  loadChildren: () => import('./lazy-module').then(m => m.LAZY_MODULE_ROUTES),
  children: lazyRoutes[0].children
}];
