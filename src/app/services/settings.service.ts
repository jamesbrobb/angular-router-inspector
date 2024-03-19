import {Injectable} from "@angular/core";
import {GUARD_TYPES, GuardResult, SettingsData, TRIGGER_TYPES} from "./settings";
import {BehaviorSubject} from "rxjs";


const STORAGE_KEY = 'route-example-settings';


const DEFAULT_SETTINGS: SettingsData = {
    resetOnStart: true,
    onlyDelayFilteredGuards: false,
    guardDelay: 0,
    guardDelayRandom: 0,
    resolveDelay: 0,
    resolveDelayRandom: 0,
    selectedTypeFilters: [...TRIGGER_TYPES],
    selectedGuardFilters: [...GUARD_TYPES],
    guardsToFail: [],
    failResolvers: false
}


@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    readonly #data = new BehaviorSubject<SettingsData>(DEFAULT_SETTINGS);
    readonly data$ = this.#data.asObservable();

    readonly guardResults: GuardResult[] = [];

    get data() {
        return this.#data.value;
    }

    constructor() {
        this.#data.next(this.#retrieveData());
    }

    updateData(value: SettingsData) {
        this.#data.next(this.#cleanData(value));
        this.#saveData();
    }

    addGuardResultsForRoute(path: string) {
        GUARD_TYPES
            .filter(guardType => guardType !== 'CanDeactivate')
            .map(guardType => {
                let result = this.#data.value.guardsToFail.find(guardResult => {
                    return guardResult.path === path && guardResult.guardType === guardType;
                });

                if(!result) {
                    result = {path, guardType};
                }

                return result;
            })
            .forEach(guardResult => {
                this.guardResults.push(guardResult);
            });
    }

    resetFilters() {
        this.#data.next({
            ...this.#data.value,
            selectedTypeFilters: [...TRIGGER_TYPES],
            selectedGuardFilters: [...GUARD_TYPES],
            guardsToFail: []
        });
    }

    #cleanData(value: SettingsData) {
        value = {...value};
        value.guardDelay = Math.max(Math.min(value.guardDelay, 5000), 0);
        value.guardDelayRandom = Math.max(Math.min(value.guardDelayRandom, 5000), 0);

        if(!value.selectedGuardFilters) {
            value.selectedGuardFilters = this.#data.value.selectedGuardFilters || [];
        }

        return value;
    }

    #retrieveData(): SettingsData {
        const settings = localStorage.getItem(STORAGE_KEY);

        if(!settings) {
            return DEFAULT_SETTINGS;
        }

        return {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(settings)
        }
    }

    #saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#data.value));
    }
}