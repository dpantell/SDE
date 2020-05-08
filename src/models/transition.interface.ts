import { Phase } from './phase.interface';
import { GameState } from './game-State.enum';
import { Comparator } from './comparator.enum';

export interface TransitionCondition {
    state: GameState;
    amount?: number;
    operator?: Comparator;
}

export interface Transition {
    target: string;
    conditions: TransitionCondition[];
}
