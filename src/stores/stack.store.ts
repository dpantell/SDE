import { v4 as uuidv4 } from 'uuid';
import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { RoleAction, PriorityLevel, ActionMutation, ActionQuery } from 'src/models/role-action.interface';
import { each, partition, isNil, map, filter, find } from 'lodash';
import { User } from 'src/models/user.interface';
import { PhaseAction, PhaseVerb } from 'src/models/phase.interface';
import { StackActionItem } from 'src/models/stack-action-item.interface';
import { UserStore } from './user.store';
import { PhaseStore } from './phase.store';

@Injectable({ providedIn: 'root' })
export class StackStore {

    constructor(
        private userStore: UserStore,
        private phaseStore: PhaseStore
    ) {
    }

    @observable public stack: StackActionItem[];

    @action resetState(): void {

        this.stack = [];
    }

    @action addActionToStack(requestor: User, target: User, roleAction: RoleAction): void {
        console.log(`User: "${requestor.name}" with Role: "${requestor.role.name}" requested to perform Action: "${roleAction.name}" on User "${target.name}"`);

        const existingUserActions: StackActionItem[] = this.stack.filter(sa => sa.requestor.id === requestor.id);

        // TODO: Make sure that forced actions aren't overwritten 
        // (e.g. witch creates action request, user just selects a new target and it's removed)
        // If user already has more existing actions than allowed, remove all previous actions
        if (existingUserActions.length >= requestor.role.maxActionTargets) {
            this.stack = this.stack.filter(sa => sa.requestor.id !== requestor.id);
        }

        const stackAction: StackActionItem = {
            id: uuidv4(),
            requestor,
            target,
            action: roleAction
        };

        this.stack.push(stackAction);
    }

    @action popStackItem(resolvedItem: StackActionItem): void {

        this.stack = this.stack.filter(item => item.id !== resolvedItem.id);
    }

    @action resolveStack(): void {

        this.stack = this.reprioritizeStack(this.stack);

        each(this.stack, item => {

            // TODO: Figure out why modifying the stack still returns the item
            const hasItem = !isNil(find(this.stack, stackItem => stackItem.id === item.id));

            if (hasItem) {

                this.executeStackActionItem(item);
            }
        });
    }

    @action performTransition(): void {

        this.executePhaseActions(this.phaseStore.currentPhase.endActions);

        this.phaseStore.next();

        this.executePhaseActions(this.phaseStore.currentPhase.beginActions);
    }

    public executePhaseActions(actions: PhaseAction[]) {

        each(actions, phaseAction => this.executePhaseAction(phaseAction));
    }

    private executePhaseAction(phaseAction: PhaseAction) {

        switch (phaseAction.verb) {

            case PhaseVerb.RESOLVE_QUEUED_ACTIONS: {

                if (this.stack.length > 0) {

                    this.resolveStack();
                }
                break;
            }
            default: return;
        }
    }

    private executeStackActionItem(stackActionItem: StackActionItem) {

        // TODO: Will this work with Witch? What type of action does she dispatch?

        const isQuery = !isNil(stackActionItem.action.requestedQuery);
        const isMutation = !isNil(stackActionItem.action.requestedMutation);

        if (isQuery && isMutation) {

            console.log('Action attempted to be executed, but it has both query and mutation. Not currently supported');

        } else if (isQuery) {

            this.executeActionQuery(stackActionItem);

        } else if (isMutation) {

            this.executeActionMutation(stackActionItem);
        }

        this.popStackItem(stackActionItem);
    }

    private executeActionQuery(stackItem: StackActionItem) {
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
        }
        // Private message the requestor the information
        // Server.whisper(stackItem.requestor, queryResults)
        console.log(`The results of your query: ${queryResults}`);
    }

    private executeActionMutation(stackItem: StackActionItem): void {
        // TODO: Do we want another validity check on the action?
        const { requestor, target, action: roleAction } = stackItem;

        switch (stackItem.action.requestedMutation) {
            case ActionMutation.KILL: {

                if (requestor.role.attack > target.role.defense) {
                    this.userStore.markUserAsDead(stackItem.target);
                } else {
                    console.log('Your target was too strong to kill!');
                }

                break;
            }

            case ActionMutation.STOP_ACTION: {

                const existingUserActions: StackActionItem[] = this.stack.filter(sa => sa.requestor.id === target.id);

                if (existingUserActions) {
                    // TODO: Let the target know that they were roleblocked
                    this.stack = this.stack.filter(sa => sa.requestor.id !== target.id);
                    console.log(`${target.name} was roleblocked!`);
                }

                break;
            }

        }
    }

    private reprioritizeStack(items: StackActionItem[]): StackActionItem[] {

        const lowPriorityActions = filter(items, item => item.action.priorty === PriorityLevel.LOW || isNil(item.action.priorty));
        const medPriorityActions = filter(items, item => item.action.priorty === PriorityLevel.MEDIUM);
        const highPriorityActions = filter(items, item => item.action.priorty === PriorityLevel.HIGH);

        return [
            ...highPriorityActions,
            ...medPriorityActions,
            ...lowPriorityActions,
        ];
    }
}
