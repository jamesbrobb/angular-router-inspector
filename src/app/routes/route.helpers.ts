import {inject} from "@angular/core";
import {
    ActivatedRouteSnapshot, CanActivateChildFn,
    CanActivateFn, CanDeactivateFn,
    CanMatchFn, LoadChildrenCallback, ResolveFn,
    Route,
    RouterStateSnapshot,
    UrlSegment
} from "@angular/router";
import {interval, map, Observable, tap} from "rxjs";

import {Logger, LoggerMsg, LoggerMsgTrigger, LoggerMsgType} from "../services/logger";
import {RouteComponent} from "../components/route/route.component";
import {SettingsService} from "../services/settings.service";
import {GUARD_TYPES} from "../services/settings";


export type RouteConfig = {
    path: string
    redirectsFrom?: string[]
    children?: RouteConfig[]
    loadChildren?: LoadChildrenCallback
    loadComponent?: LoadChildrenCallback
}


function log(
    createdBy: string,
    trigger: LoggerMsgTrigger,
    type: LoggerMsgType,
    currentPath: string,
    result?: boolean | undefined
): Observable<boolean> {

    const logger = inject(Logger),
        settings = inject(SettingsService).data,
        start = Date.now();

    let delay = 0;

    switch(trigger) {
        case 'Resolve':

            if(settings.selectedTypeFilters.includes(trigger)) {
                delay = settings.resolveDelay;
            }

            if(delay > 0) {
                delay += Math.random() * settings.resolveDelayRandom;
            }

            if(result === undefined) {
                result = !settings.failResolvers;
            }

            break;

        case 'Guard':

            delay = settings.guardDelay;

            if(delay > 0) {
                delay += Math.random() * settings.guardDelayRandom;
            }

            if(settings.onlyDelayFilteredGuards) {
                if(!settings.selectedTypeFilters.includes(trigger) ||
                    !settings.selectedGuardFilters.includes(type as typeof GUARD_TYPES[number])) {
                    delay = 0;
                }
            }

            if(result === undefined) {
                result = !settings.guardsToFail.some((guardResult) => {
                    return createdBy === guardResult.path && type === guardResult.guardType;
                });
            }

            break;
    }

    const msg: LoggerMsg = {
        createdBy,
        trigger,
        type,
        currentPath
    };

    logger.addMessage(msg);

    return interval(delay).pipe(
        map(arg => result as boolean),
        tap(() => {
            const end = Date.now();
            msg.success = result;
            msg.executionTime = end - start;
        }),
        map(arg => {
            if(trigger === 'Resolve' && settings.failResolvers) {
                throw new Error('Resolve failed');
            }
            return arg;
        })
    );
}

function createRouteFn(createdBy: string, trigger: LoggerMsgTrigger, type: LoggerMsgType, result?: boolean | undefined) {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
        return log(createdBy, trigger, type, route.routeConfig?.path || 'empty path', result);
    }
}

const canMatch: (path: string) => CanMatchFn = (path: string) => (route: Route, segments: UrlSegment[]) => {
    return log(path,'Guard', 'CanMatch', route.path || 'empty path');
    // redirect on fail
        /*.pipe(map(arg => {
            if(!arg) {
               console.log(`Can't match route: ${route.path} with segments: ${segments}`);
               return new UrlTree(
                   new UrlSegmentGroup([], {})
               );
            }

           return arg;
        }));*/
}

const canActivate: (path: string) => CanActivateFn = (path: string) => createRouteFn(path,'Guard', 'CanActivate');
const canActivateChild: (path: string) => CanActivateChildFn = (path: string) => createRouteFn(path,'Guard', 'CanActivateChild');
const canDeactivate: (path: string) => CanDeactivateFn<any> = (path: string) =>
    <T>(component: T, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) => {

        let allowDeactivation = true;

        if(component instanceof Object && 'allowDeactivation' in component) {
            allowDeactivation = component.allowDeactivation as boolean;
        }

        return log(path, 'Guard', 'CanDeactivate', currentRoute.routeConfig?.path || 'empty path', allowDeactivation);
    }

const resolve: (path: string) => ResolveFn<any> = (path: string) => createRouteFn(path,'Resolve', 'Resolve');


export function createRoute(
    path: string,
    children?: Route[],
    loadChildren?: LoadChildrenCallback,
    loadComponent?: any
): Route {
    const route: Route = {
        path,
        canMatch: [canMatch(path)],
        canActivate: [canActivate(path)],
        canActivateChild: [canActivateChild(path)],
        canDeactivate: [canDeactivate(path)],
        resolve: {
            data: resolve(path)
        }
    }

    if(!loadComponent) {
        route.component = RouteComponent;
    }

    if(children && children.length > 0) {
        route.children = children;
    }

    if(loadChildren) {
        route.loadChildren = loadChildren;
    }

    if(loadComponent) {
        route.loadComponent = loadComponent;
    }

    return route;
}


export function createRoutes(configs: RouteConfig[]): Route[] {

    const result: Route[] = []

    configs.forEach((route) => {

        route.redirectsFrom?.forEach((redirect) => {
            result.push({
                path: redirect,
                redirectTo: route.path,
                pathMatch: 'full'
            })
        });

        let children = undefined,
            loadChildren = undefined;

        if(route.loadChildren) {
            loadChildren = route.loadChildren;
        } else if(route.children) {
            children = createRoutes(route.children);
        }

        result.push(createRoute(route.path, children, loadChildren, route.loadComponent));
    })

    return result;
}