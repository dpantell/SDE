import { PhaseActionMap, ActionQuery, ActionMutation } from './role-action.interface';
import { RoleType } from './enums/role.enum';
import { Alignment } from './enums/alignment.enum';
import { WinCollection } from './win-condition.interface';

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
    maxActionTargets: number;
    winConditions: WinCollection;
    queryImmunity: ActionQuery[];
    mutationImmunity: ActionMutation[];

    attack: CombatPower;
    defense: CombatPower;
}
