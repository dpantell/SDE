import { RedirectAction } from './../models/role-action.interface';
import { v4 as uuidv4 } from 'uuid';
import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { RoleAction, PriorityLevel, ActionMutation, ActionQuery, BOOST_DEFENSE_MINOR, BoostAction as StatAction, Stat, BoostAction } from 'src/models/role-action.interface';
import { each, partition, isNil, map, filter, find, assign } from 'lodash';
import { User } from 'src/models/user.interface';
import { PhaseAction, PhaseVerb } from 'src/models/phase.interface';
import { StackActionItem } from 'src/models/stack-action-item.interface';
import { UserStore } from './user.store';
import { PhaseStore } from './phase.store';
import { Action } from 'rxjs/internal/scheduler/Action';

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
        if (existingUserActions.length >= requestor.role.maxTargets) {
            this.stack = this.stack.filter(sa => sa.requestor.id !== requestor.id);
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

    @action popStackItem(resolvedItem: StackActionItem): void {

        this.stack = this.stack.filter(item => item.id !== resolvedItem.id);
    }

    @action resolveStack(): void {

        this.stack = this.reprioritizeStack(this.stack);

        each(this.stack, item => {

            // TODO: Figure out why modifying the stack still returns the item
            const canActionResolve = this.canActionResolve(item);

            if (canActionResolve) {

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

            case ActionMutation.PROTECT: {
                const killAgainstTarget = this.stack.find(sa =>
                    sa.target.id === target.id &&
                    sa.action?.requestedMutation === ActionMutation.KILL
                );

                if (killAgainstTarget) {

                }

                break;
            }

            case ActionMutation.BOOST_STAT: {

                /*
                    duration: 3,
                    attack + 1
                    immed stack

                    duration: 2,
                    attack + 1
                    immed stack

                    duration: 0
                    attack - 1

                    if boost duration not zero
                        create new dispatched action (counter action)
                        set drain duration: 0 <- dont counter this later
                        age: boost duration

                */

                const boostAction = (roleAction as BoostAction);

                const drainStatAction = assign(
                    boostAction,
                    {
                        duration: 0,
                        requestedMutation: ActionMutation.DRAIN_STAT,
                        age: boostAction.statDuration
                    }
                );

                const counterStackAction: StackActionItem = {
                    id: uuidv4(),
                    requestor,
                    target,
                    delay: boostAction.delay,
                    action: boostAction
                };

                switch (boostAction.targetStat) {
                    case Stat.ATTACK: {
                        target.role.attack += boostAction.statAmount;
                        break;
                    }

                    case Stat.DEFENSE: {
                        target.role.defense += boostAction.statAmount;

                        this.stack.push(counterStackAction);

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
                const redirectAction = (roleAction as RedirectAction);

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
