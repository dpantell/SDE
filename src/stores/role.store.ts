import { LogicalOperator } from './../models/enums/logical-operator.enum';
import { ALL_USERS_NOT_SELF, SELF, ALL_USERS } from './../models/target-criteria.interface';
import { QUERY_ROLE, STOP_ACTION, BOOST_DEFENSE_MINOR, PROTECT, QUERY_VISITED_BY, PROTECT_AND_KILL } from './../models/role-action.interface';
import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Role, CombatPower } from 'src/models/role.interface';
import { EVIL_WIN_CONDITION_COLLECTION, GOOD_WIN_CONDITION_COLLECTION } from 'src/models/win-condition.interface';
import { RoleType } from 'src/models/enums/role.enum';
import { Alignment } from 'src/models/enums/alignment.enum';
import { QUEUED_KILL, QUERY_ALIGNMENT } from 'src/models/role-action.interface';
import { Quantifier } from 'src/models/enums/quantifier.enum';
import { cloneDeep, each } from 'lodash';
import { PhaseStore } from './phase.store';

@Injectable({ providedIn: 'root' })
export class RoleStore {

    constructor(
        private phaseStore: PhaseStore,
    ) {
    }

    @observable public DEFAULT_ROLE_MAP: Map<string, Role>;

    @observable public roles: Role[];

    @action resetState(): void {

        const roles = this.getRoles();

        this.roles = [...roles];

        this.DEFAULT_ROLE_MAP = new Map<string, Role>();

        each([...roles], role => this.DEFAULT_ROLE_MAP.set(role.name, cloneDeep(role)));
    }

    private getRoles(): Role[] {

        const roles: Role[] = [
            this.getMafiosoRole(),
            this.getSheriffRole(),
            this.getInvestigatorRole(),
            this.getEscortRole(),
            this.getBodyguardRole(), // needs ability limit
            this.getDoctorRole(), // needs ability limit
            this.getVigilanteRole(), // needs ability limit
            this.getConsigliereRole(),
            this.getLookoutRole()
            /*
                Veteran
                Spy
                Godfather
                Transporter
                Janitor

                Mayor
                Jailor
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
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
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
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
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
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
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
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
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
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
                    targets: {
                        logicalOperator: LogicalOperator.AND,
                        criteria: ALL_USERS_NOT_SELF
                    },
                    ability: PROTECT_AND_KILL
                },
                {
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
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

    private getDoctorRole(): Role {
        return {
            icon: '',
            name: 'Doctor',
            description: '',
            roleType: RoleType.Protective,
            alignment: Alignment.GOOD,
            abilities: [
                {
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
                    targets: {
                        logicalOperator: LogicalOperator.AND,
                        criteria: ALL_USERS_NOT_SELF
                    },
                    ability: PROTECT
                },
                {
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
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
            attack: CombatPower.NONE,
            defense: CombatPower.NONE,
        };
    }

    private getVigilanteRole(): Role {

        return {
            icon: '',
            name: 'Vigilante',
            description: '',
            roleType: RoleType.Killing,
            alignment: Alignment.GOOD,
            abilities: [
                {
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                        enabledPhaseCycleCount: {
                            start: 1,
                            repeat: 1
                        }
                    },
                    targets: {
                        logicalOperator: LogicalOperator.AND,
                        criteria: ALL_USERS_NOT_SELF
                    },
                    ability: QUEUED_KILL
                }
            ],
            maxTargets: 1,
            winConditions: GOOD_WIN_CONDITION_COLLECTION,
            queryImmunity: [],
            mutationImmunity: [],
            attack: CombatPower.BASIC,
            defense: CombatPower.NONE,
        };
    }

    private getConsigliereRole(): Role {

        return {
            icon: '',
            name: 'Consigliere',
            description: '',
            roleType: RoleType.Invest,
            alignment: Alignment.EVIL,
            abilities: [
                {
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
                    targets: {
                        logicalOperator: LogicalOperator.OR,
                        criteria: [
                            {
                                quantifier: Quantifier.NONE,
                                alignment: Alignment.EVIL,
                            }
                        ]
                    },
                    ability: QUERY_ROLE
                },
            ],
            maxTargets: 1,
            winConditions: EVIL_WIN_CONDITION_COLLECTION,
            queryImmunity: [],
            mutationImmunity: [],
            attack: CombatPower.NONE,
            defense: CombatPower.NONE,
        };
    }

    private getLookoutRole(): Role {

        return {
            icon: '',
            name: 'Lookout',
            description: '',
            roleType: RoleType.Invest,
            alignment: Alignment.GOOD,
            abilities: [
                {
                    phases: {
                        phaseNames: this.phaseStore.nightPhaseNames,
                    },
                    targets: {
                        logicalOperator: LogicalOperator.AND,
                        criteria: ALL_USERS
                    },
                    ability: QUERY_VISITED_BY
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


}
