import { LogicalOperator } from './../models/enums/logical-operator.enum';
import { ALL_USERS_NOT_SELF, SELF } from './../models/target-criteria.interface';
import { QUERY_ROLE, STOP_ACTION, BOOST_DEFENSE_MINOR, REDIRECT_KILL, PROTECT, PROTECT_AND_KILL } from './../models/role-action.interface';
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
            this.getEscortRole(),
            this.getBodyguardRole()
            /*
                Bodyguard
                Doctor
                Vigilante
                Consig

                Lookout
                Veteran
                Jailor
                Godfather

                Transporter
                Spy
                Janitor

                Mayor
                Medium
            */
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
            abilities: [
                {
                    allowedPhases: [
                        PhaseCategory.NIGHT
                    ],
                    targets: {
                        logicalOperator: LogicalOperator.OR,
                        criteria: [
                            {
                                quantifier: Quantifier.NONE,
                                alignment: Alignment.EVIL,
                            }
                        ]
                    },
                    ability: QUEUED_KILL
                }
            ],
            maxTargets: 1,
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
            abilities: [
                {
                    allowedPhases: [
                        PhaseCategory.NIGHT
                    ],
                    targets: {
                        logicalOperator: LogicalOperator.AND,
                        criteria: ALL_USERS_NOT_SELF
                    },
                    ability: QUERY_ALIGNMENT
                },
            ],
            maxTargets: 1,
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
            abilities: [
                {
                    allowedPhases: [
                        PhaseCategory.NIGHT
                    ],
                    targets: {
                        logicalOperator: LogicalOperator.AND,
                        criteria: ALL_USERS_NOT_SELF
                    },
                    ability: QUERY_ROLE
                },
            ],
            maxTargets: 1,
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
            abilities: [
                {
                    allowedPhases: [
                        PhaseCategory.NIGHT
                    ],
                    targets: {
                        logicalOperator: LogicalOperator.AND,
                        criteria: ALL_USERS_NOT_SELF
                    },
                    ability: STOP_ACTION
                },
            ],
            maxTargets: 1,
            winConditions: GOOD_WIN_CONDITION_COLLECTION,
            queryImmunity: [],
            mutationImmunity: [],
            attack: CombatPower.NONE,
            defense: CombatPower.NONE,
        };
    }

    private getBodyguardRole(): Role {
        return {
            icon: '',
            name: 'Bodyguard',
            description: '',
            roleType: RoleType.Protective,
            alignment: Alignment.GOOD,
            abilities: [
                {
                    allowedPhases: [
                        PhaseCategory.NIGHT
                    ],
                    targets: {
                        logicalOperator: LogicalOperator.AND,
                        criteria: ALL_USERS_NOT_SELF
                    },
                    ability: PROTECT_AND_KILL
                },
                {
                    allowedPhases: [
                        PhaseCategory.NIGHT
                    ],
                    targets: {
                        logicalOperator: LogicalOperator.AND,
                        criteria: SELF
                    },
                    ability: {
                        actions: [BOOST_DEFENSE_MINOR]
                    }
                }
            ],
            maxTargets: 1,
            winConditions: GOOD_WIN_CONDITION_COLLECTION,
            queryImmunity: [],
            mutationImmunity: [],
            attack: CombatPower.UNSTOPPABLE,
            defense: CombatPower.NONE,
        };
    }
}
