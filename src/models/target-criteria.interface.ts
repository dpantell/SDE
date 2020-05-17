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
    logicalOperator: LogicalOperator;
    criteria: TargetCriteria[];
}

export const ALL_USERS_NOT_SELF: TargetCriteria[] = [
    {
        quantifier: Quantifier.ALL,
        alignment: Alignment.ANY
    },
    {
        quantifier: Quantifier.NOT_SELF,
    },
];

export const SELF: TargetCriteria[] = [
    {
        quantifier: Quantifier.SELF
    }
];
