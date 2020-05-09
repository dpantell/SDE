import { Phase } from './phase.interface';
import { GameState } from './enums/game-state.enum';
import { Comparator } from './enums/comparator.enum';

export interface TransitionCondition {
    state: GameState;
    amount?: number;
    operator?: Comparator;
}

export interface Transition {
    target: string;
    conditions: TransitionCondition[];
}
