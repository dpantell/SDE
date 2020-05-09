import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { RoleAction, PriorityLevel } from 'src/models/role-action.interface';
import { Role } from 'src/models/role.interface';
import { each } from 'lodash';
import { User } from 'src/models/user.interface';

@Injectable({ providedIn: 'root' })
export class StackStore {

    @observable public stack: RoleAction[];

    @action resetState(): void {

        this.stack = [];
    }
    @action addActionToStack(user: User, roleAction: RoleAction): void {
        console.log(`User: "${user.name}" with Role: "${user.role.name}" requested to perform action: "${roleAction.name}"`);

        this.stack.push(roleAction);

        this.reprioritizeStack();
    }

    @action resolveStack(): void {
        each(this.stack, roleAction => {

            if (roleAction.requestedMutation) {
                // Find the target in the game state
                // set the correct property to the new value
                // update gamestate
            }

            if (roleAction.requestedQuery) {
                // Find the target in the game state
                // Find the requested data
                // return to user
            }

        });
    }

    public getStack(): RoleAction[] {

        console.log(JSON.stringify(this.stack, null, 2));
        return this.stack;
    }

    private reprioritizeStack(): void {
        const lowPriorityActions = [];
        const medPriorityActions = [];
        const highPriorityActions = [];

        each(this.stack, roleAction => {
            switch (roleAction.priorty) {
                case PriorityLevel.LOW: {
                    lowPriorityActions.push(roleAction);
                    return;
                }
                case PriorityLevel.MEDIUM: {
                    medPriorityActions.push(roleAction);
                    return;
                }
                case PriorityLevel.HIGH: {
                    highPriorityActions.push(roleAction);
                    return;
                }
                default: {
                    lowPriorityActions.push(roleAction);
                }
            }
        });

        const reprioritizedStack: RoleAction[] = [...highPriorityActions, ...medPriorityActions, ...lowPriorityActions];

        this.stack = reprioritizedStack;
    }

}

export interface StackActionItem {
    target: any;
    actions: RoleAction[];
}
