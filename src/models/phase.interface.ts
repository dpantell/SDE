import { PhaseStyle } from './phase-style.enum';
import { Transition } from './transition.interface';
import { Alignment } from './alignment.enum';
import { Quantifier } from './quantifier.enum';

export enum PhaseCategory {
    DAY,
    NIGHT,
    SUNSET,
    SUNRISE
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
    alignment?: Alignment;
    quantifier: Quantifier;
}

export interface Phase {
    name: string;
    category: PhaseCategory;
    style?: PhaseStyle;
    beginActions?: PhaseAction[];
    endActions?: PhaseAction[];
    transitions: Transition[];
}
