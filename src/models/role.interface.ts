import { AllowedAbility, ActionQuery, ActionMutation } from './role-action.interface';
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
    abilities: AllowedAbility[];
    maxTargets: number;
    winConditions: WinCollection;
    queryImmunity: ActionQuery[];
    mutationImmunity: ActionMutation[];

    state?: any;

    attack: CombatPower;
    defense: CombatPower;
}
