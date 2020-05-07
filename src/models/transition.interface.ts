import { Phase } from './phase.interface';
import { GameState } from './game-State.enum';
import { TransitionOperator } from './operator.enum';

export interface TransitionCondition {
    state: GameState;
    amount?: number;
    operator?: TransitionOperator;
}

export interface Transition {
    target: string;
    conditions: TransitionCondition[];
}
