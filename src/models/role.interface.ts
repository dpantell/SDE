import { PhaseActionMap, ActionQuery, ActionMutation, QUEUED_KILL, QUERY_ALIGNMENT } from './role-action.interface';
import { RoleType } from './role.enum';
import { Alignment } from './alignment.enum';
import { WinCollection, GOOD_WIN_CONDITION_COLLECTION, EVIL_WIN_CONDITION_COLLECTION } from './win-condition.interface';
import { Descriptor } from './descriptor.interface';
import { PhaseCategory } from './phase.interface';

export enum CombatPower {
    NONE,
    BASIC,
    UNSTOPPABLE
}

export interface Role {
    icon: string;
    name: string;
    description: string;
    roleType: RoleType;
    alignment: Alignment;
    actionMap: PhaseActionMap[];
    winConditions: WinCollection;
    queryImmunity: ActionQuery[];
    mutationImmunity: ActionMutation[];

    attack: CombatPower;
    defense: CombatPower;
}
