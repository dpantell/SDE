import { RoleStore } from 'src/stores/role.store';
import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Role } from 'src/models/role.interface';
import { User } from 'src/models/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { each, includes, first, filter, flatMap, map } from 'lodash';
import { NameService } from 'src/services/name.service';
import { AllowedAction, RoleAction } from 'src/models/role-action.interface';
import { TargetCriteria } from 'src/models/target-criteria.interface';
import { PhaseStore } from './phase.store';
import { ITransformer, createTransformer } from 'mobx-utils';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class AllowedActionStore {

    allowedActionsAgainstTarget: ITransformer<User, RoleAction[]> = this.allowedTargetActions();

    constructor(
        private userStore: UserStore,
        private phaseStore: PhaseStore
    ) {
    }

    @computed private get allowedActions(): AllowedAction[] {

        return this.userStore.me.role.allowedActions;
    }

    @computed private get allowedPhaseActions(): AllowedAction[] {

        return filter(this.allowedActions, allowedAction => this.isActionEnabledInPhase(allowedAction));
    }

    private isActionEnabledInPhase(allowedAction: AllowedAction): boolean {

        return includes(allowedAction.allowablePhases, this.phaseStore.currentPhase.category);
    }

    private allowedTargetActions(): ITransformer<User, RoleAction[]> {

        return createTransformer<User, RoleAction[]>((target: User) => {

            const allowedActions = filter(this.allowedPhaseActions, allowedAction => {

                return this.isActionAllowed(allowedAction, target);
            });

            const roleActions = map(allowedActions, allowedAction => allowedAction.action);

            return roleActions;
        });
    }

    private isActionAllowed(allowedAction: AllowedAction, target: User): boolean {

        const targetCriteria: TargetCriteria[] = allowedAction.targetCriteria;

        each(targetCriteria, criteria => {

            if (criteria.alignment !== target.role.alignment) { return false; }
            if (criteria.roleType && criteria.roleType !== target.role.roleType) { return false; }
        });

        return true;
    }
}
