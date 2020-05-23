import { PhaseCriteria } from './phase.interface';
import { TargetCollection } from './target-criteria.interface';

export enum RoleActionType {
    IMMEDIATE,
    QUEUE
}

export enum RoleActionVerb {
    KILL,
}

export enum ActionQuery {
    ROLE,
    ALIGNMENT,
    VISITED,
    VISITED_BY
}

export enum ActionMutation {
    KILL,
    PROTECT,
    REDIRECT_ACTION,
    BOOST_STAT,
    DRAIN_STAT,
    STOP_ACTION,
    FORCE_ACTION,
    CREATE_PRIVATE_CHAT
}

export enum PriorityLevel {
    LOWEST,
    LOW,
    MEDIUM,
    HIGH,
    HIGHEST
}

export interface AllowedAbility {
    ability: RoleAbility;
    abilityName?: string;
    phases: PhaseCriteria;
    targets: TargetCollection;
}

export interface RoleAbility {
    actions: RoleAction[];
}

export interface RoleAction {
    icon: string;
    name: string;
    description: string;

    type: RoleActionType;
    priorty: PriorityLevel;
    delay?: number;

    requestedQuery?: ActionQuery;
    requestedMutation?: ActionMutation;
    trigger?: RoleAction;
}

export enum Stat {
    ATTACK,
    DEFENSE
}

export interface BoostAction extends RoleAction {
    targetStat: Stat;
    statDuration: number;
    statAmount: number;
}

export interface RedirectAction extends RoleAction {
    allowedActions: (ActionQuery | ActionMutation)[];
}

// Actions
export const QUEUED_KILL_ACTION = {
    icon: '',
    name: 'Kill',
    description: 'Kill this user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const PROTECT_ACTION: RoleAction = {
    icon: '',
    name: 'Protect',
    description: 'Protect the target from dying',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.MEDIUM,
    requestedMutation: ActionMutation.PROTECT
};

export const IMMEDIATE_KILL_ACTION: RoleAction = {
    icon: '',
    name: 'Immediate Kill',
    description: 'Kill this target',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const QUERY_ALIGNMENT_ACTION: RoleAction = {
    icon: '',
    name: 'Investigate Alignment',
    description: 'Investigate to determine the alignment of the target',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedQuery: ActionQuery.ALIGNMENT
};

export const QUERY_ROLE_ACTION: RoleAction = {
    icon: '',
    name: 'Investigate Role',
    description: 'Investigate to determine the role of the target',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedQuery: ActionQuery.ROLE
};

export const QUERY_VISITED_BY_ACTION: RoleAction = {
    icon: '',
    name: 'Investigate Visited By',
    description: 'Discover all users who visited your target',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOWEST,
    requestedQuery: ActionQuery.VISITED_BY
};

export const PROTECT_AND_KILL_ACTION: RoleAction = {
    icon: '',
    name: 'Protect',
    description: 'Protect the target from dying',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.MEDIUM,
    requestedMutation: ActionMutation.PROTECT,
    trigger: QUEUED_KILL_ACTION
};

export const ROLE_BLOCK_ACTION: RoleAction = {
    icon: '',
    name: 'Role Block',
    description: 'Stop the target user from performing their action',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.HIGH,
    requestedMutation: ActionMutation.STOP_ACTION
};

// Boost Actions
export const BOOST_DEFENSE_MINOR: BoostAction = {
    icon: '',
    name: 'Boost Defense minor',
    description: 'Raise defense by 1',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.MEDIUM,
    delay: 1,
    requestedMutation: ActionMutation.BOOST_STAT,
    targetStat: Stat.DEFENSE,
    statAmount: 1,
    statDuration: 1
};

export const BOOST_ATTACK_MINOR: BoostAction = {
    icon: '',
    name: 'Boost Defense minor',
    description: 'Raise defense by 1',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.MEDIUM,
    delay: 1,
    requestedMutation: ActionMutation.BOOST_STAT,
    targetStat: Stat.ATTACK,
    statAmount: 1,
    statDuration: 1
};

export const DRAIN_DEFENSE_MINOR: BoostAction = {
    icon: '',
    name: 'Boost Defense minor',
    description: 'Raise defense by 1',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.MEDIUM,
    delay: 1,
    requestedMutation: ActionMutation.DRAIN_STAT,
    targetStat: Stat.DEFENSE,
    statAmount: 1,
    statDuration: 1
};

// Redirect actions
export const REDIRECT_KILL: RedirectAction = {
    icon: '',
    name: 'Redirect Kill',
    description: 'Redirect Kill',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.MEDIUM,
    requestedMutation: ActionMutation.REDIRECT_ACTION,
    allowedActions: [
        ActionMutation.KILL
    ]
};


// Abilities
export const QUEUED_KILL: RoleAbility = {
    actions: [QUEUED_KILL_ACTION]
};

export const PROTECT: RoleAbility = {
    actions: [PROTECT_ACTION]
};

export const QUERY_ALIGNMENT: RoleAbility = {
    actions: [QUERY_ALIGNMENT_ACTION]
};

export const QUERY_ROLE: RoleAbility = {
    actions: [QUERY_ROLE_ACTION]
};

export const STOP_ACTION: RoleAbility = {
    actions: [ROLE_BLOCK_ACTION]
};

export const PROTECT_AND_KILL: RoleAbility = {
    actions: [PROTECT_AND_KILL_ACTION]
};

export const QUERY_VISITED_BY: RoleAbility = {
    actions: [QUERY_VISITED_BY_ACTION]
};


