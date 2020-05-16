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

export interface AllowedAction {
    action: RoleAction;
    allowablePhases: PhaseCategory[];
    targetCollection: TargetCollection;
}

export interface RoleAction {
    icon: string;
    name: string;
    description: string;

    type: RoleActionType;
    priorty: PriorityLevel;
    age: number;

    requestedQuery?: ActionQuery;
    requestedMutation?: ActionMutation;
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

export const QUEUED_KILL: RoleAction = {
    icon: '',
    name: 'Kill',
    description: 'Kill this user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    age: 1,
    requestedMutation: ActionMutation.KILL
};

export const IMMEDIATE_KILL: RoleAction = {
    icon: '',
    name: 'Immediate Kill',
    description: 'Kill this user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    age: 1,
    requestedMutation: ActionMutation.KILL
};

export const QUERY_ALIGNMENT: RoleAction = {
    icon: '',
    name: 'Investigate Alignment',
    description: 'Investigate to determine the alignment of the user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    age: 1,
    requestedQuery: ActionQuery.ALIGNMENT
};

export const QUERY_ROLE: RoleAction = {
    icon: '',
    name: 'Investigate Role',
    description: 'Investigate to determine the role of the user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    age: 1,
    requestedQuery: ActionQuery.ROLE
};

export const STOP_ACTION: RoleAction = {
    icon: '',
    name: 'Role Block',
    description: 'Stop the target user from performing their action',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.HIGH,
    age: 1,
    requestedMutation: ActionMutation.STOP_ACTION
};



export const BOOST_DEFENSE_MINOR: BoostAction = {
    icon: '',
    name: 'Boost Defense minor',
    description: 'Raise defense by 1',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.MEDIUM,
    age: 1,
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
    age: 1,
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
    age: 1,
    requestedMutation: ActionMutation.DRAIN_STAT,
    targetStat: Stat.DEFENSE,
    statAmount: 1,
    statDuration: 1
};

