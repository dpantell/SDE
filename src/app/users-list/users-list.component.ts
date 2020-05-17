import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StackStore } from 'src/stores/stack.store';
import { AllowedAbility, RoleAction } from 'src/models/role-action.interface';
import { UserStore } from 'src/stores/user.store';
import { PhaseStore } from 'src/stores/phase.store';
import { User } from 'src/models/user.interface';
import { AllowedActionStore } from 'src/stores/allowed-action.store';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {

    constructor(
        public stackStore: StackStore,
        public userStore: UserStore,
        public allowedActionStore: AllowedActionStore
    ) { }

    public forceAction(requestorId: string, targetId: string): void {

        const forcedRequestor = this.userStore.aliveUsers.find(user => user.id === requestorId);
        const forcedTarget = this.userStore.aliveUsers.find(user => user.id === targetId);
        const forcedRequestorAction = forcedRequestor.role.abilities[0].ability.actions[0];

        this.stackStore.addActionToStack(
            forcedRequestor,
            forcedTarget,
            forcedRequestorAction
        );
    }
}
