import { Comparator } from './enums/comparator.enum';
import { Quantifier } from './enums/quantifier.enum';
import { LogicalOperator } from './enums/logical-operator.enum';
import { Alignment } from './enums/alignment.enum';
import { RoleType } from './enums/role.enum';
import { Descriptor } from './descriptor.interface';
import { ActorTarget } from './actor-target.interface';
import { ActorState } from './enums/actor-state.enum';

export interface WinCollection {
    operator: LogicalOperator;
    conditions: WinCondition[];
}

export interface NumericComparision {
    comparator: Comparator;
    amount: number;
}

export interface WinCondition {
    name: string;
    description: string;
    target: ActorTarget;
    condition: WinStateCondition;
}

export interface WinStateCondition {
    state: ActorState;
    equality: NumericComparision;
}

export const NONE: NumericComparision = {
    comparator: Comparator.EQ,
    amount: 0
};

export const ALL_DEAD: WinStateCondition = {
    equality: NONE,
    state: ActorState.ALIVE
};

export const ALL_ALIVE: WinStateCondition = {
    equality: NONE,
    state: ActorState.DEAD
};

export const NO_DESCRIPTION: Descriptor = {
    icon: '',
    name: '',
    description: '',
};

export const ALL_GOOD_DEAD: WinCondition = {
    ...NO_DESCRIPTION,
    target: {
        quantifier: Quantifier.ALL,
        alignment: Alignment.GOOD,
    },
    condition: ALL_DEAD
};

export const ALL_EVIL_DEAD: WinCondition = {
    ...NO_DESCRIPTION,
    target: {
        quantifier: Quantifier.ALL,
        alignment: Alignment.EVIL,
    },
    condition: ALL_DEAD
};

export const SELF_DEAD: WinCondition = {
    ...NO_DESCRIPTION,
    target: {
        quantifier: Quantifier.SELF
    },
    condition: ALL_DEAD
};

export const ALL_NEUTRAL_DEAD: WinCondition = {
    ...NO_DESCRIPTION,
    target: {
        quantifier: Quantifier.ALL,
        alignment: Alignment.NEUTRAL,
    },
    condition: ALL_DEAD
};

export const ALL_NEUTRAL_KILLING_DEAD: WinCondition = {
    ...NO_DESCRIPTION,
    target: {
        quantifier: Quantifier.ALL,
        alignment: Alignment.NEUTRAL,
        role: RoleType.Killing
    },
    condition: ALL_DEAD
};

export const ALL_TARGETS_DEAD: WinCondition = {
    ...NO_DESCRIPTION,
    target: {
        quantifier: Quantifier.TARGETS,
    },
    condition: ALL_DEAD
};

export const NO_TARGETS_DEAD: WinCondition = {
    ...NO_DESCRIPTION,
    target: {
        quantifier: Quantifier.TARGETS,
    },
    condition: ALL_ALIVE
};

export const ONE_TARGET_DEAD: WinCondition = {
    ...NO_DESCRIPTION,
    target: {
        quantifier: Quantifier.TARGETS,
    },
    condition: {
        equality: {
            comparator: Comparator.GTE,
            amount: 1
        },
        state: ActorState.ALIVE
    }
};

export const EVIL_WIN_CONDITION_COLLECTION: WinCollection = {
    operator: LogicalOperator.AND,
    conditions: [
        ALL_GOOD_DEAD,
        ALL_NEUTRAL_KILLING_DEAD
    ]
};

export const GOOD_WIN_CONDITION_COLLECTION: WinCollection = {
    operator: LogicalOperator.AND,
    conditions: [
        ALL_EVIL_DEAD,
        ALL_NEUTRAL_KILLING_DEAD
    ]
};

export const JESTER_COLLECTION: WinCollection = {
    operator: LogicalOperator.AND,
    conditions: [
        SELF_DEAD
    ]
};

export const SERIAL_KILLER_COLLECTION: WinCollection = {
    operator: LogicalOperator.AND,
    conditions: [
        ALL_GOOD_DEAD,
        ALL_EVIL_DEAD
    ]
};

export const EXECUTIONER_COLLECTION: WinCollection = {
    operator: LogicalOperator.AND,
    conditions: [
        ONE_TARGET_DEAD
    ]
};
