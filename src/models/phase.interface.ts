import { PhaseStyle } from './enums/phase-style.enum';
import { Transition } from './transition.interface';
import { Alignment } from './enums/alignment.enum';
import { Quantifier } from './enums/quantifier.enum';
import { CountdownConfig } from 'ngx-countdown';

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
    RESOLVE_QUEUED_ACTIONS,
    REMOVE_ALL_BOOSTS
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
    countdownConfig?: CountdownConfig;
    beginActions?: PhaseAction[];
    endActions?: PhaseAction[];
    transitions: Transition[];
}
