import { Comparator } from './comparator.enum';
import { Quantifier } from './quantifier.enum';
import { LogicalOperator } from './logical-operator.enum';
import { Alignment } from './alignment.enum';
import { RoleType } from './role.enum';

export enum WinState {
    DEAD,
    ALIVE
}

export interface WinCollection {
    operator: LogicalOperator;
    conditions: WinCondition[];
}

export interface NumericComparision {
    comparator: Comparator;
    amount: number;
}

export interface WinTarget {
    quantifier: Quantifier;
    alignment?: Alignment;
    role?: RoleType;
}

// Game state assertion
// This game object (or collection of objects) is in some given state

// target (game object)
// equality (is, is not, is greater than)
// state (this amount/condition)

export interface Descriptor {
    name: string;
    description: string;
}

export interface WinCondition {
    name: string;
    description: string;
    target: WinTarget;
    condition: WinStateCondition;
    collection?: WinCollection;
}

export interface WinStateCondition {
    state: WinState;
    equality: NumericComparision;
}

export const NONE: NumericComparision = {
    comparator: Comparator.EQ,
    amount: 0
};

export const ALL_DEAD: WinStateCondition = {
    equality: NONE,
    state: WinState.ALIVE
};

// Lawful | Neutral | Chaotic
// Good   | Neutral | Evil
// Town | Mafia | Neutral
// Invest | Killing | Support | Protective | Deception | Benign | Chaos | (Evil)
// Win condition for: Mafia

export const NO_DESCRIPTION: Descriptor = {
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

// Win condition for: Executioner
{
    // target dead
}

