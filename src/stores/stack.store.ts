import { v4 as uuidv4 } from 'uuid';
import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { RoleAction, PriorityLevel, ActionMutation, ActionQuery, BoostAction as StatAction, Stat, BoostAction } from 'src/models/role-action.interface';
import { each, isNil, filter, find, map, includes, sortBy, reverse, cloneDeep } from 'lodash';
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
    @observable private executedStack: StackActionItem[];

    @action resetState(): void {

        this.stack = [];
        this.executedStack = [];
    }

    @action addActionToStack(requestor: User, target: User, roleAction: RoleAction): void {
        console.log(`User: "${requestor.name}" with Role: "${requestor.role.name}" requested to perform Action: "${roleAction.name}" on User "${target.name}"`);

        const existingUserActions: StackActionItem[] = this.stack.filter(sa => sa.requestor.id === requestor.id);

        // TODO: Make sure that forced actions aren't overwritten
        // (e.g. witch creates action request, user just selects a new target and it's removed)
        // If user already has more existing actions than allowed, remove all previous actions
        if (existingUserActions.length >= requestor.role.maxTargets) {
            this.removeStackItems(existingUserActions);
        }

        const stackAction: StackActionItem = {
            id: uuidv4(),
            requestor,
            target,
            delay: roleAction.delay,
            action: roleAction
        };

        this.stack.push(stackAction);
    }

    @action removeStackItem(stackItem: StackActionItem): void {

        this.stack = this.stack.filter(item => item.id !== stackItem.id);
    }

    @action removeStackItems(stackItems: StackActionItem[]): void {

        each(stackItems, item => this.removeStackItem(item));
    }

    @action resolveStack(): void {

        this.stack = this.reprioritizeStack(this.stack);

        for (let i = 0; i < this.stack.length;) {

            const item = this.stack[i];

            const canActionResolve = this.canActionResolve(item);

            if (canActionResolve) {
                this.executeStackActionItem(item);
                i = 0;
            } else {
                i++;
            }

        }

    }

    @action performTransition(): void {

        this.executePhaseActions(this.phaseStore.currentPhase.endActions);

        this.phaseStore.next();

        this.executePhaseActions(this.phaseStore.currentPhase.beginActions);
    }

    public executePhaseActions(actions: PhaseAction[]) {

        each(actions, phaseAction => this.executePhaseAction(phaseAction));
    }

    private canActionResolve(item: StackActionItem): boolean {

        return this.doesActionExist(item)
            && this.isActionDelayDone(item);
    }

    private doesActionExist(item: StackActionItem): boolean {

        const hasItem = !isNil(find(this.stack, stackItem => stackItem.id === item.id));

        return hasItem;
    }

    private isActionDelayDone(item: StackActionItem): boolean {

        if (!isNil(item.delay)) {

            item.delay--;

            return item.delay <= 0;

        } else {

            return true;
        }
    }

    private executePhaseAction(phaseAction: PhaseAction) {

        switch (phaseAction.verb) {

            case PhaseVerb.RESOLVE_QUEUED_ACTIONS: {

                if (this.stack.length > 0) {

                    this.resolveStack();
                }
                break;
            }
            case PhaseVerb.REMOVE_ALL_BOOSTS: {

                // TODO: Only reset stats on any characters who are currently boosted
                // TODO: Handle boost duration by decrementing duration and only clearing when duration = 0
                this.userStore.resetAllUserStats();

                break;
            }
            case PhaseVerb.CLEAR_EXECUTED_STACK: {

                this.executedStack = [];
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

        this.removeLegitStackItem(stackActionItem);
    }

    private removeLegitStackItem(stackItem: StackActionItem) {

        this.executedStack.push(cloneDeep(stackItem));

        this.removeStackItem(stackItem);
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

                const visitedNames = map(filter(this.executedStack, item => item.target.id === stackItem.target.id), a => a.requestor.name);

                queryResults = `${stackItem.target.name} was visited by: ${visitedNames.join(', ')}`;
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

        switch (roleAction.requestedMutation) {
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
                    this.removeStackItems(existingUserActions);
                    console.log(`${target.name} was roleblocked!`);
                }

                break;
            }

            case ActionMutation.PROTECT: {
                const killAgainstTarget = this.stack.find(sa =>
                    sa.target.id === target.id &&
                    sa.action?.requestedMutation === ActionMutation.KILL
                );

                if (killAgainstTarget) {

                    this.removeStackItem(killAgainstTarget);

                    if (roleAction.trigger) {
                        console.log('Protect Action Trigger happened');

                        // Trigger kill on self
                        const killSelfAction: StackActionItem = {
                            id: uuidv4(),
                            requestor: killAgainstTarget.requestor,
                            target: requestor,
                            action: roleAction.trigger
                        };

                        // Trigger kill on requestor
                        const killAttackerAction: StackActionItem = {
                            id: uuidv4(),
                            requestor,
                            target: killAgainstTarget.requestor,
                            action: roleAction.trigger
                        };

                        this.stack.push(killSelfAction);
                        this.stack.push(killAttackerAction);
                        this.stack = this.reprioritizeStack(this.stack);

                    }
                    console.log('You protected your target!');
                }

                break;
            }

            case ActionMutation.BOOST_STAT: {

                const boostAction = (roleAction as BoostAction);

                switch (boostAction.targetStat) {
                    case Stat.ATTACK: {

                        target.role.attack += boostAction.statAmount;
                        break;
                    }

                    case Stat.DEFENSE: {

                        target.role.defense += boostAction.statAmount;
                        break;
                    }
                }

                break;
            }

            case ActionMutation.DRAIN_STAT: {

                const statAction = (roleAction as StatAction);

                switch (statAction.targetStat) {

                    case Stat.ATTACK: {
                        target.role.attack -= statAction.statAmount;
                        break;
                    }

                    case Stat.DEFENSE: {
                        target.role.defense -= statAction.statAmount;
                        break;
                    }
                }

                break;
            }

            case ActionMutation.REDIRECT_ACTION: {

            }

        }
    }

    private reprioritizeStack(items: StackActionItem[]): StackActionItem[] {

        return reverse(sortBy(items, item => item.action.priorty));
    }
}
