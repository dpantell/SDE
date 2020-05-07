import { Injectable } from '@angular/core';
import { PhaseAction } from 'src/models/phase.interface';

@Injectable({ providedIn: 'root' })
export class ActionService {

    public executePhaseActions(actions: PhaseAction[]) {

    }

    public executeQueuedActions(actions: any[]) { // RoleAction

    }

    private executeAction(action: PhaseAction): boolean {

        return true;
    }
}