import { Phase } from './phase.interface';
import { GameState } from './game-State.enum';
import { Operator } from './operator.enum';

export interface TransitionCondition {
    state: GameState;
    amount?: number;
    operator?: Operator;
}

export interface Transition {
    target: Phase;
    conditions: TransitionCondition[];
}
