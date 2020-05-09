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

export const NO_DESCRIPTION: Descriptor = {
    icon: '',
    name: '',
    description: '',
};

export const QUEUED_KILL: RoleAction = {
    ...NO_DESCRIPTION,
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const IMMEDIATE_KILL: RoleAction = {
    ...NO_DESCRIPTION,
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedMutation: ActionMutation.KILL
};

export const QUERY_ALIGNMENT: RoleAction = {
    ...NO_DESCRIPTION,
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedQuery: ActionQuery.ALIGNMENT
};

export const QUERY_ROLE: RoleAction = {
    ...NO_DESCRIPTION,
    type: RoleActionType.QUEUE,
    priorty: PriorityLevel.LOW,
    requestedQuery: ActionQuery.ROLE
};
