import { Injectable } from '@angular/core';
import { PhaseAction } from 'src/models/phase.interface';
import { each } from 'lodash';
import { RoleAction, ActionMutation } from 'src/models/role-action.interface';
import { User } from 'src/models/user.interface';
import { Alignment } from 'src/models/enums/alignment.enum';

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

    public isTargetUserAllowableForAction(requestor: User, target: User, action: RoleAction): boolean {

        const requestorIsGood: boolean = requestor.role.alignment === Alignment.GOOD;
        const requestorIsEvil: boolean = requestor.role.alignment === Alignment.EVIL;

        const targetIsGood: boolean = target.role.alignment === Alignment.GOOD;
        const targetIsEvil: boolean = target.role.alignment === Alignment.EVIL;

        const requestorAndTargetHaveSameAlignment: boolean = requestor.role.alignment === target.role.alignment;

        const requestorOnlyHasAQuery: boolean = action.requestedQuery && !action.requestedMutation;
        const requestorAndTargetAreSameUser: boolean = requestor.id === target.id;

        const isKillAction: boolean = action.requestedMutation === ActionMutation.KILL;

        // TODO: Can good queries be made against knowns (mayor/ressed town)?
        if (requestorOnlyHasAQuery && requestorIsGood) { return true; }

        // TODO: Some roles can self-target (transporter, doc, bg, etc.) - some have separate button to dispatch self-target option
        if (requestorAndTargetAreSameUser) { return false; }

        // Evils cannot query other evils (Evil same-side query rule)
        if (requestorOnlyHasAQuery && requestorIsEvil && targetIsEvil) { return false; }

        // Evils cannot attack other evils (Evil same-side attack rule)
        if (requestorIsEvil && targetIsEvil && isKillAction) { return false; }

        return true;
    }
}
