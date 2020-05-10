import { computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { User } from 'src/models/user.interface';
import { each, includes, filter, map, every, some } from 'lodash';
import { AllowedAction, RoleAction } from 'src/models/role-action.interface';
import { TargetCriteria } from 'src/models/target-criteria.interface';
import { PhaseStore } from './phase.store';
import { ITransformer, createTransformer } from 'mobx-utils';
import { UserStore } from './user.store';
import { Quantifier } from 'src/models/enums/quantifier.enum';

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

            if (this.allowedPhaseActions.length === 0) { return []; }

            const allowedActions = filter(this.allowedPhaseActions, allowedAction => {

                return this.isActionAllowed(allowedAction, target);
            });

            const roleActions = map(allowedActions, allowedAction => allowedAction.action);

            return roleActions;
        });
    }

    private isActionAllowed(allowedAction: AllowedAction, target: User): boolean {

        const targetCriteria: TargetCriteria[] = allowedAction.targetCriteria;

        const result: boolean = some(targetCriteria, criteria => {

            // if it's 0 (none), none of the things can match
            // if it's all, all of the things must match
            // if it's accused, the accused must match all of these things
            // if it's self, *me* must match all of these things
            // if it's targets, somehow get my targets and make sure the target id matches all

            switch (criteria.quantifier) {
                case Quantifier.ALL: {
                    break;
                }
                case Quantifier.NONE: {
                    if (criteria.alignment === target.role.alignment) { return false; }
                    if (criteria.roleType && criteria.roleType === target.role.roleType) { return false; }
                    if (criteria.state && criteria.state === target.role.state) { return false; }
                    return true;
                }
                case Quantifier.ACCUSED: {
                    // if (target.id !== this.userStore.accused.id) { return false; }
                    break;
                }
                case Quantifier.SELF: {
                    if (target.id !== this.userStore.me.id) { return false; }
                    break;
                }
                case Quantifier.TARGETS: {
                    // if (target.id !== ) { return false; }
                    break;
                }

            }

            if (criteria.alignment !== target.role.alignment) { return false; }
            if (criteria.roleType && criteria.roleType !== target.role.roleType) { return false; }
            if (criteria.state && criteria.state !== target.role.state) { return false; }

            return true;
        });

        return result;
    }
}
