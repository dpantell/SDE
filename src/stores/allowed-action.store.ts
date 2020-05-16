import { computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { User } from 'src/models/user.interface';
import { each, includes, filter, map, every, some, isNil } from 'lodash';
import { AllowedAction, RoleAction } from 'src/models/role-action.interface';
import { TargetCriteria } from 'src/models/target-criteria.interface';
import { PhaseStore } from './phase.store';
import { ITransformer, createTransformer } from 'mobx-utils';
import { UserStore } from './user.store';
import { Quantifier } from 'src/models/enums/quantifier.enum';
import { Alignment } from 'src/models/enums/alignment.enum';
import { LogicalOperator } from 'src/models/enums/logical-operator.enum';

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

        const { targetCriteria, logicalOperator } = allowedAction.targetCollection;

        let result: boolean = false;

        if (logicalOperator === LogicalOperator.AND) {

            result = every(targetCriteria, criteria => this.isCriteriaMet(target, criteria));

        } else {

            result = some(targetCriteria, criteria => this.isCriteriaMet(target, criteria));
        }

        return result;
    }

    private isCriteriaMet(target: User, criteria: TargetCriteria): boolean {

        // if it's 0 (none), none of the things can match
        // if it's all, all of the things must match
        // if it's accused, the accused must match all of these things
        // if it's self, *me* must match all of these things
        // if it's targets, somehow get my targets and make sure the target id matches all

        switch (criteria.quantifier) {

            case Quantifier.ALL: {

                const isMatch = this.isCriteriaMatch(target, criteria);

                return isMatch;
            }

            case Quantifier.NONE: {

                const isMatch = !this.isCriteriaMatch(target, criteria);

                return isMatch;
            }

            case Quantifier.ACCUSED: {

                const isMatch = this.isCriteriaMatch(target, criteria);

                return isMatch;
            }

            case Quantifier.SELF: {

                const isMatch = this.isTargetMe(target);

                return isMatch;
            }

            case Quantifier.NOT_SELF: {

                const isMatch = !this.isTargetMe(target);

                return isMatch;
            }

            case Quantifier.TARGETS: {

                const isMatch = this.isCriteriaMatch(target, criteria);

                return isMatch;
            }
        }
    }

    private isCriteriaMatch(target: User, criteria: TargetCriteria): boolean {

        const correctAlignment = isNil(criteria.alignment) ||
            (criteria.alignment === target.role.alignment || criteria.alignment === Alignment.ANY);
        const correctRoleType = isNil(criteria.roleType) || (criteria.roleType && criteria.roleType === target.role.roleType);
        const correctState = isNil(criteria.state) || (criteria.state && criteria.state === target.role.state);

        const isMatch = correctAlignment
            && correctRoleType
            && correctState;

        return isMatch;
    }

    private isTargetMe(target: User): boolean {

        const isMatch = target.id === this.userStore.me.id;

        return isMatch;
    }
}
