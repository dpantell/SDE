import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { PhaseCategory } from 'src/models/phase.interface';
import { Role, CombatPower } from 'src/models/role.interface';
import { EVIL_WIN_CONDITION_COLLECTION, GOOD_WIN_CONDITION_COLLECTION } from 'src/models/win-condition.interface';
import { RoleType } from 'src/models/role.enum';
import { Alignment } from 'src/models/alignment.enum';
import { QUEUED_KILL, QUERY_ALIGNMENT } from 'src/models/role-action.interface';

@Injectable({ providedIn: 'root' })
export class RoleStore {

    @observable public roles: Role[];

    @action resetState(): void {

        this.roles = this.getRoles();
    }

    private getRoles(): Role[] {

        const roles: Role[] = [
            this.getMafiosoRole(),
            this.getSheriffRole()
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
    }

    private getSheriffRole(): Role {

        return {
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
    }
}