import { GameStateStore } from './../stores/gamestate.store';
import { Injectable } from '@angular/core';
import { RoleAction, ActionMutation, ActionQuery } from 'src/models/role-action.interface';
import { User } from 'src/models/user.interface';
import { Alignment } from 'src/models/enums/alignment.enum';
import { StackActionItem } from 'src/models/stack-action-item.interface';

@Injectable({ providedIn: 'root' })
export class StackService {

    // constructor(private gameStateStore: GameStateStore) { }

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

    public executeActionQuery(stackItem: StackActionItem): any {
        // TODO: Do we want another validity check on the action?
        let queryResults: any;

        switch (stackItem.action.requestedQuery) {
            case ActionQuery.ALIGNMENT: {
                queryResults = stackItem.target.role.alignment;
                break;
            }
            case ActionQuery.ROLE: {
                // TODO: Fuzzy query vs Accurate query (return role group vs exact role)
                queryResults = stackItem.target.role.name;
                break;
            }
            case ActionQuery.VISITED: {
                queryResults = 'NOT IMPLEMENTED - VISITED';
                break;
            }
            case ActionQuery.VISITED_BY: {
                queryResults = 'NOT IMPLEMENTED - VISITED BY';
                break;
            }
            default: return null;
        }
        // Private message the requestor the information
        // Server.whisper(stackItem.requestor, queryResults)
        console.log(`The results of your query: ${queryResults}`);
    }

    public executeActionMutation(stackItem: StackActionItem): void {
        // TODO: Do we want another validity check on the action?
        switch (stackItem.action.requestedMutation) {
            case ActionMutation.KILL: {
                // this.gameStateStore.markUserAsDead(stackItem.target);
                break;
            }

        }
    }
}
