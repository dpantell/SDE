import { RoleType } from './enums/role.enum';
import { Alignment } from './enums/alignment.enum';
import { Quantifier } from './enums/quantifier.enum';
import { ActorState } from './enums/actor-state.enum';
import { LogicalOperator } from './enums/logical-operator.enum';

export interface TargetCriteria {
    quantifier: Quantifier;
    alignment?: Alignment;
    roleType?: RoleType;
    state?: ActorState;
}

export interface TargetCollection {
    operator: LogicalOperator;
    conditions: TargetCriteria[];
}