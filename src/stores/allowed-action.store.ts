import { computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { User } from 'src/models/user.interface';
import { each, includes, filter, map } from 'lodash';
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
