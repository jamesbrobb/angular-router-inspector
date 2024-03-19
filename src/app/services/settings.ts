
export type TriggerType = typeof TRIGGER_TYPES[number];

export type GuardType = typeof GUARD_TYPES[number];
export type ResolveType = typeof RESOLVE_TYPES[number];

export type RouterNavigationEvent = typeof ROUTER_NAVIGATION_EVENTS[number];
export type RouteEvent = typeof ROUTE_EVENTS[number];
export type ActivationEvent = typeof ACTIVATION_EVENTS[number];
export type ResolveEvent = typeof RESOLVE_EVENTS[number];
export type GuardEvent = typeof GUARD_EVENTS[number];

export type RouteEventTypes = RouterNavigationEvent | RouteEvent | ActivationEvent | ResolveEvent | GuardEvent;


export const TRIGGER_TYPES = [
    'RouterEvent',
    'ActivationEvent',
    'Guard',
    'Resolve'
] as const;

export const GUARD_TYPES = [
    'CanMatch',
    'CanActivate',
    'CanActivateChild',
    'CanDeactivate'
] as const;

export const RESOLVE_TYPES = [
    'Resolve'
] as const;

export const ROUTER_NAVIGATION_EVENTS = [
    'NavigationStart',
    'NavigationEnd',
    'NavigationCancel',
    'NavigationError',
    'NavigationSkipped'
] as const;

export const ROUTE_EVENTS = [
    'RouteConfigLoadStart',
    'RouteConfigLoadEnd',
    'RoutesRecognized',
] as const;

export const ACTIVATION_EVENTS = [
    'ActivationStart',
    'ActivationEnd',
    'ChildActivationStart',
    'ChildActivationEnd'
] as const;

export const RESOLVE_EVENTS = [
    'ResolveStart',
    'ResolveEnd'
] as const;

export const GUARD_EVENTS = [
    'GuardsCheckStart',
    'GuardsCheckEnd'
] as const;


export type SettingsData = {
    resetOnStart: boolean
    onlyDelayFilteredGuards: boolean
    guardDelay: number
    guardDelayRandom: number
    resolveDelay: number
    resolveDelayRandom: number
    selectedTypeFilters: TriggerType[]
    selectedGuardFilters: GuardType[]
    guardsToFail: GuardResult[]
    failResolvers: boolean
}


export type GuardResult = {
    path: string,
    guardType: GuardType
}