import { RoleType } from './role.enum';
import { Alignment } from './alignment.enum';
import { Quantifier } from './quantifier.enum';
import { ActorState } from './actor-state.enum';
import { LogicalOperator } from './logical-operator.enum';

export interface ActorTarget {
    quantifier: Quantifier;
    alignment?: Alignment;
    role?: RoleType;
    state?: ActorState;
}

export interface TargetCollection {
    operator: LogicalOperator;
    conditions: ActorTarget[];
}
