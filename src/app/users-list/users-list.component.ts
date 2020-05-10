import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StackStore } from 'src/stores/stack.store';
import { PhaseActionMap } from 'src/models/role-action.interface';
import { UserStore } from 'src/stores/user.store';
import { PhaseStore } from 'src/stores/phase.store';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {

    constructor(
        public stackStore: StackStore,
        public phaseStore: PhaseStore,
        public userStore: UserStore
    ) {
    }

    public isActionEnabledDuringPhase(action: PhaseActionMap): boolean {

        return !!action.phases.find(phase => phase === this.phaseStore.currentPhase.category);
    }

}
