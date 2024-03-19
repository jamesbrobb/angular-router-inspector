import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {GuardType, ResolveType, RouteEventTypes, TriggerType} from "./settings";


export type LoggerMsgType = GuardType | ResolveType | RouteEventTypes
export type LoggerMsgTrigger = TriggerType

export type LoggerMsg = {
    trigger: LoggerMsgTrigger
    type: LoggerMsgType
    createdBy?: string
    currentPath?: string,
    success?: boolean
    executionTime?: number
}

@Injectable({
    providedIn: "root"
})
export class Logger {

    readonly #messages = new BehaviorSubject<LoggerMsg[]>([]);
    readonly messages$ = this.#messages.asObservable();

    addMessage(msg: LoggerMsg) {
        const messages = [...this.#messages.value];
        messages.push(msg);
        this.#messages.next(messages);
    }

    clear() {
        this.#messages.next([]);
    }
}