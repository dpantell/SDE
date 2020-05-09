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

export interface RoleActionCollection {
    enabledPhases: PhaseCategory[];
    actions: RoleAction[];
}

export interface RoleAction {
    icon: string;
    name: string;
    description: string;

    type: RoleActionType;
    requestedQuery?: ActionQuery;
    requestedMutation?: ActionMutation;
}

const NO_DESCRIPTION: Descriptor = {
    icon: '',
    name: '',
    description: '',
};

const QUEUED_KILL: RoleAction = {
    ...NO_DESCRIPTION,
    type: RoleActionType.QUEUE,
    requestedMutation: ActionMutation.KILL
};

const IMMEDIATE_KILL: RoleAction = {
    ...NO_DESCRIPTION,
    type: RoleActionType.QUEUE,
    requestedMutation: ActionMutation.KILL
};

const QUERY_ALIGNMENT: RoleAction = {
    ...NO_DESCRIPTION,
    type: RoleActionType.QUEUE,
    requestedQuery: ActionQuery.ALIGNMENT
};

const QUERY_ROLE: RoleAction = {
    ...NO_DESCRIPTION,
    type: RoleActionType.QUEUE,
    requestedQuery: ActionQuery.ROLE
};
