import {RouteConfig} from "./route.helpers";


export const lazyRoutes: RouteConfig[] = [{
    path: '',
    children: [
        { path: 'e-1' },
        { path: 'e-2' },
        {
            path: 'e-3',
            children: [
                { path: 'e-3-1' }
            ]
        }
    ]
}];