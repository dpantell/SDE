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

export const NO_DESCRIPTION: Descriptor = {
    icon: '',
    name: '',
    description: '',
};

const mafioso: Role = {
    ...NO_DESCRIPTION,
    roleType: RoleType.Killing,
    alignment: Alignment.EVIL,
    actionMap: [
        {
            phases: [
                PhaseCategory.NIGHT
            ],
            actions: [
                QUEUED_KILL
            ]
        },
    ],
    winConditions: EVIL_WIN_CONDITION_COLLECTION,
    queryImmunity: [],
    mutationImmunity: [],
    attack: CombatPower.NONE,
    defense: CombatPower.NONE,
};

const sheriff: Role = {
    icon: '',
    name: 'Sheriff',
    description: '',
    roleType: RoleType.Invest,
    alignment: Alignment.GOOD,
    actionMap: [
        {
            phases: [
                PhaseCategory.NIGHT
            ],
            actions: [
                QUERY_ALIGNMENT
            ]
        },
    ],
    winConditions: GOOD_WIN_CONDITION_COLLECTION,
    queryImmunity: [],
    mutationImmunity: [],
    attack: CombatPower.NONE,
    defense: CombatPower.NONE,
};

// Escort
// SK