import { PhaseCategory } from './phase.interface';
import { TargetCriteria } from './target-criteria.interface';

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
    targetCriteria: TargetCriteria[];
}

export interface RoleAction {
    icon: string;
    name: string;
    description: string;

    type: RoleActionType;
    priorty: PriorityLevel;

    requestedQuery?: ActionQuery;
    requestedMutation?: ActionMutation;
}

export const QUEUED_KILL: RoleAction = {
    icon: '',
    name: 'Kill',
    description: 'Kill this user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const IMMEDIATE_KILL: RoleAction = {
    icon: '',
    name: 'Immediate Kill',
    description: 'Kill this user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const QUERY_ALIGNMENT: RoleAction = {
    icon: '',
    name: 'Investigate Alignment',
    description: 'Investigate to determine the alignment of the user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedQuery: ActionQuery.ALIGNMENT
};

export const QUERY_ROLE: RoleAction = {
    icon: '',
    name: 'Investigate Role',
    description: 'Investigate to determine the role of the user',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedQuery: ActionQuery.ROLE
};

export const STOP_ACTION: RoleAction = {
    icon: '',
    name: 'Role Block',
    description: 'Stop the target user from performing their action',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.MEDIUM,
    requestedMutation: ActionMutation.STOP_ACTION
};
