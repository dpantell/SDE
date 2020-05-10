import { QUERY_ROLE, STOP_ACTION } from './../models/role-action.interface';
import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { PhaseCategory } from 'src/models/phase.interface';
import { Role, CombatPower } from 'src/models/role.interface';
import { EVIL_WIN_CONDITION_COLLECTION, GOOD_WIN_CONDITION_COLLECTION } from 'src/models/win-condition.interface';
import { RoleType } from 'src/models/enums/role.enum';
import { Alignment } from 'src/models/enums/alignment.enum';
import { QUEUED_KILL, QUERY_ALIGNMENT } from 'src/models/role-action.interface';
import { Quantifier } from 'src/models/enums/quantifier.enum';

@Injectable({ providedIn: 'root' })
export class RoleStore {

    @observable public roles: Role[];

    @action resetState(): void {

        this.roles = this.getRoles();
    }

    private getRoles(): Role[] {

        const roles: Role[] = [
            this.getMafiosoRole(),
            this.getSheriffRole(),
            this.getInvestigatorRole(),
            this.getEscortRole()
        ];

        return roles;
    }

    private getMafiosoRole(): Role {

        return {
            icon: '',
            name: 'Mafioso',
            description: '',
            roleType: RoleType.Killing,
            alignment: Alignment.EVIL,
            allowedActions: [
                {
                    allowablePhases: [
                        PhaseCategory.NIGHT
                    ],
                    targetCriteria: [
                        {
                            quantifier: Quantifier.NONE,
                            alignment: Alignment.EVIL,
                        }
                    ],
                    action: QUEUED_KILL
                }
            ],
            maxActionTargets: 1,
            winConditions: EVIL_WIN_CONDITION_COLLECTION,
            queryImmunity: [],
            mutationImmunity: [],
            attack: CombatPower.BASIC,
            defense: CombatPower.NONE,
        };
    }

    private getSheriffRole(): Role {

        return {
            icon: '',
            name: 'Sheriff',
            description: '',
            roleType: RoleType.Invest,
            alignment: Alignment.GOOD,
            allowedActions: [
                {
                    allowablePhases: [
                        PhaseCategory.NIGHT
                    ],
                    targetCriteria: [
                        {
                            quantifier: Quantifier.ALL,
                            alignment: Alignment.GOOD
                        },
                        {
                            quantifier: Quantifier.ALL,
                            alignment: Alignment.EVIL
                        },
                        {
                            quantifier: Quantifier.ALL,
                            alignment: Alignment.NEUTRAL
                        }
                    ],
                    action: QUERY_ALIGNMENT
                },
            ],
            maxActionTargets: 1,
            winConditions: GOOD_WIN_CONDITION_COLLECTION,
            queryImmunity: [],
            mutationImmunity: [],
            attack: CombatPower.NONE,
            defense: CombatPower.NONE,
        };
    }

    private getInvestigatorRole(): Role {

        return {
            icon: '',
            name: 'Investigator',
            description: '',
            roleType: RoleType.Invest,
            alignment: Alignment.GOOD,
            allowedActions: [
                {
                    allowablePhases: [
                        PhaseCategory.NIGHT
                    ],
                    targetCriteria: [],
                    action: QUERY_ROLE
                },
            ],
            maxActionTargets: 1,
            winConditions: GOOD_WIN_CONDITION_COLLECTION,
            queryImmunity: [],
            mutationImmunity: [],
            attack: CombatPower.NONE,
            defense: CombatPower.NONE,
        };
    }

    private getEscortRole(): Role {
        return {
            icon: '',
            name: 'Escort',
            description: '',
            roleType: RoleType.Support,
            alignment: Alignment.GOOD,
            allowedActions: [
                {
                    allowablePhases: [
                        PhaseCategory.NIGHT
                    ],
                    targetCriteria: [],
                    action: STOP_ACTION
                },
            ],
            maxActionTargets: 1,
            winConditions: GOOD_WIN_CONDITION_COLLECTION,
            queryImmunity: [],
            mutationImmunity: [],
            attack: CombatPower.NONE,
            defense: CombatPower.NONE,
        };
    }
}
