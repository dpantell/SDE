import { PhaseCategory } from './phase.interface';
import { TargetCriteria, TargetCollection } from './target-criteria.interface';

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
    allowedPhases: PhaseCategory[];
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

export const ACTION_QUEUED_KILL = {
    icon: '',
    name: 'Kill',
    description: 'Kill this user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const QUEUED_KILL: RoleAbility = {
    actions: [ACTION_QUEUED_KILL]
};

export const IMMEDIATE_KILL: RoleAction = {
    icon: '',
    name: 'Immediate Kill',
    description: 'Kill this user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const QUERY_ALIGNMENT: RoleAbility = {
    actions: [{
        icon: '',
        name: 'Investigate Alignment',
        description: 'Investigate to determine the alignment of the user',
        type: RoleActionType.QUEUE,
        priorty: PriorityLevel.LOW,
        requestedQuery: ActionQuery.ALIGNMENT
    }]
};

export const QUERY_ROLE: RoleAbility = {
    actions: [{
        icon: '',
        name: 'Investigate Role',
        description: 'Investigate to determine the role of the user',
        type: RoleActionType.QUEUE,
        priorty: PriorityLevel.LOW,
        requestedQuery: ActionQuery.ROLE
    }]
};

export const STOP_ACTION: RoleAbility = {
    actions: [{
        icon: '',
        name: 'Role Block',
        description: 'Stop the target user from performing their action',
        type: RoleActionType.QUEUE,
        priorty: PriorityLevel.HIGH,
        requestedMutation: ActionMutation.STOP_ACTION
    }]
};

export const PROTECT: RoleAbility = {
    actions: [{
        icon: '',
        name: 'Protect',
        description: 'Protect the target from dying',
        type: RoleActionType.QUEUE,
        priorty: PriorityLevel.MEDIUM,
        requestedMutation: ActionMutation.PROTECT
    }]
};

export const PROTECT_AND_KILL: RoleAbility = {
    actions: [{
        icon: '',
        name: 'Protect',
        description: 'Protect the target from dying',
        type: RoleActionType.QUEUE,
        priorty: PriorityLevel.MEDIUM,
        requestedMutation: ActionMutation.PROTECT,
        trigger: ACTION_QUEUED_KILL
    }]
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

