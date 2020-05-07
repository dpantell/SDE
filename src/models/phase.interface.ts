import { PhaseStyle } from './phase-style.enum';
import { Transition } from './transition.interface';

export enum PhaseCategory {
    DAY,
    NIGHT,
    SUNSET,
    SUNRISE
}

export enum Alignment {
    GOOD,
    NEUTRAL,
    EVIL
}

export enum PhaseNoun {
    ALL,
    ACCUSED
}

export enum PhaseVerb {
    MUTE,
    UNMUTE,
    KILL,
    RESURRECT,
    RESOLVE_QUEUED_ACTIONS
}

export interface PhaseAction {
    verb: PhaseVerb;
    noun: PhaseNoun;
    alignment?: Alignment;
}

export interface Phase {
    name: string;
    category: PhaseCategory;
    style?: PhaseStyle;
    beginActions?: PhaseAction[];
    endActions?: PhaseAction[];
    transitions: Transition[];
}
