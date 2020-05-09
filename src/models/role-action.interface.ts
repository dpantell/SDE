import { PhaseCategory } from './phase.interface';
import { Descriptor } from './descriptor.interface';

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

export interface PhaseActionMap {
    phases: PhaseCategory[];
    actions: RoleAction[];
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
    name: 'Queued Kill',
    description: '',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const IMMEDIATE_KILL: RoleAction = {
    icon: '',
    name: 'Immediate Kill',
    description: '',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const QUERY_ALIGNMENT: RoleAction = {
    icon: '',
    name: 'Query Alignment',
    description: '',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedQuery: ActionQuery.ALIGNMENT
};

export const QUERY_ROLE: RoleAction = {
    icon: '',
    name: 'Query Role',
    description: '',
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedQuery: ActionQuery.ROLE
};
