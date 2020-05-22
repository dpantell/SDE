import { computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { User } from 'src/models/user.interface';
import { each, includes, filter, map, every, some, isNil, flatten } from 'lodash';
import { AllowedAbility, RoleAction } from 'src/models/role-action.interface';
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

    @computed private get allowedActions(): AllowedAbility[] {

        return this.userStore.me.role.abilities;
    }

    @computed private get allowedPhaseActions(): AllowedAbility[] {

        return filter(this.allowedActions, allowedAction => this.isActionEnabledInPhase(allowedAction));
    }

    private isActionEnabledInPhase(allowedAction: AllowedAbility): boolean {

        const isCurrentPhaseNameAllowed = includes(allowedAction.phases.phaseNames, this.phaseStore.currentPhase.name);

        if (allowedAction.phases.enabledPhaseCycleCount) {

            const count = this.phaseStore.phaseCycleCount;
            const { start, repeat } = allowedAction.phases.enabledPhaseCycleCount;

            return isCurrentPhaseNameAllowed
                && count >= start
                && (count - start) % repeat === 0;
        }

        return isCurrentPhaseNameAllowed;
    }

    private allowedTargetActions(): ITransformer<User, RoleAction[]> {

        return createTransformer<User, RoleAction[]>((target: User) => {

            if (this.allowedPhaseActions.length === 0) { return []; }

            const allowedActions = filter(this.allowedPhaseActions, allowedAction => {

                return this.isActionAllowed(allowedAction, target);
            });

            const roleActions = flatten(map(allowedActions, allowedAction => allowedAction.ability.actions));

            return roleActions;
        });
    }

    private isActionAllowed(allowedAction: AllowedAbility, target: User): boolean {

        const { criteria: targetCriteria, logicalOperator } = allowedAction.targets;

        let result: boolean = false;

        if (logicalOperator === LogicalOperator.AND) {

            result = every(targetCriteria, criteria => this.isCriteriaMet(target, criteria));

        } else {

            result = some(targetCriteria, criteria => this.isCriteriaMet(target, criteria));
        }

        return result;
    }

    private isCriteriaMet(target: User, criteria: TargetCriteria): boolean {

        switch (criteria.quantifier) {

            case Quantifier.ALL: {

                const isMatch = this.doesCriteriaMatch(target, criteria);

                return isMatch;
            }

            case Quantifier.NONE: {

                const isMatch = !this.doesCriteriaMatch(target, criteria);

                return isMatch;
            }

            case Quantifier.ACCUSED: {

                const isMatch = this.doesCriteriaMatch(target, criteria);

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

                const isMatch = this.doesCriteriaMatch(target, criteria);

                return isMatch;
            }
        }
    }

    private doesCriteriaMatch(target: User, criteria: TargetCriteria): boolean {

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
