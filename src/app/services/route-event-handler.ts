import {inject, Injectable} from "@angular/core";
import {Logger, LoggerMsg, LoggerMsgType} from "./logger";
import {
    EventType,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationSkipped,
    NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart,
    Router, RouterEvent, RoutesRecognized
} from "@angular/router";
import {SettingsService} from "./settings.service";
import {tap} from "rxjs";


@Injectable({
    providedIn: "root"
})
export class RouteEventHandler {

    navigating = false;

    readonly #logger = inject(Logger);
    readonly #router = inject(Router);
    readonly #settings = inject(SettingsService).data;

    constructor() {
        this.#router.events.pipe(
            tap(event => {

                if(event instanceof NavigationStart) {

                    if(this.#settings.resetOnStart) {
                        this.#logger.clear();
                    }

                    this.navigating = true;
                }

                if(event instanceof NavigationEnd ||
                    event instanceof NavigationCancel ||
                    event instanceof NavigationError ||
                    event instanceof NavigationSkipped) {
                    this.navigating = false;
                }

                if(event instanceof RouteConfigLoadStart ||
                    event instanceof RouteConfigLoadEnd ||
                    event instanceof RoutesRecognized) {
                    console.log(this.#router.getCurrentNavigation());
                }

                const type: LoggerMsgType = EventType[event.type] as LoggerMsgType;

                let currentPath: string = '',
                    trigger: LoggerMsg['trigger'] = 'RouterEvent';

                if(event instanceof RouterEvent) {
                    currentPath = event.url;
                }

                if('snapshot' in event) {
                    trigger = 'ActivationEvent';
                    currentPath = event.snapshot.routeConfig?.path || 'empty path';
                }

                this.#logger.addMessage({trigger, type, currentPath});
            })
        ).subscribe();
    }
}