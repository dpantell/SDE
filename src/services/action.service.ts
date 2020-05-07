import { Injectable } from '@angular/core';
import { PhaseAction } from 'src/models/phase.interface';
import { each } from 'lodash';

@Injectable({ providedIn: 'root' })
export class ActionService {

    public executePhaseActions(actions: PhaseAction[]) {

        each(actions, action => this.executeAction(action));
    }

    public executeQueuedActions(actions: any[]) { // RoleAction

        each(actions, action => this.executeAction(action));
    }

    private executeAction(action: PhaseAction) {

    }
}