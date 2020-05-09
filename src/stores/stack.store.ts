import { v4 as uuidv4 } from 'uuid';
import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { RoleAction, PriorityLevel } from 'src/models/role-action.interface';
import { each, partition } from 'lodash';
import { User } from 'src/models/user.interface';
import { PhaseAction, PhaseVerb } from 'src/models/phase.interface';
import { StackService } from 'src/services/stack.service';
import { StackActionItem } from 'src/models/stack-action-item.interface';

@Injectable({ providedIn: 'root' })
export class StackStore {

    constructor(private stackService: StackService) { }

    @observable public stack: StackActionItem[];

    @action resetState(): void {

        this.stack = [];
    }

    @action addActionToStack(requestor: User, target: User, roleAction: RoleAction): void {
        console.log(`User: "${requestor.name}" with Role: "${requestor.role.name}" requested to perform action: "${roleAction.name}"`);

        const stackAction: StackActionItem = {
            id: uuidv4(),
            requestor,
            target,
            action: roleAction
        };

        this.stack.push(stackAction);

        this.reprioritizeStack();
    }

    @action popStackItem(resolvedItem: StackActionItem): void {

        this.stack = this.stack.filter(item => item.id !== resolvedItem.id);
    }

    @action resolveStack(): void {

        const [queries, mutations] = partition(this.stack, stackItem =>
            stackItem.action.requestedQuery && !stackItem.action.requestedMutation
        );

        each(queries, query => { this.popStackItem(query); this.stackService.executeActionQuery(query); });

        each(mutations, mutation => { this.popStackItem(mutation); this.stackService.executeActionMutation(mutation); });
    }

    public executePhaseActions(actions: PhaseAction[]) {

        each(actions, phaseAction => this.executePhaseAction(phaseAction));
    }

    public executePhaseAction(phaseAction: PhaseAction) {

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

    private reprioritizeStack(): void {
        const lowPriorityActions: StackActionItem[] = [];
        const medPriorityActions: StackActionItem[] = [];
        const highPriorityActions: StackActionItem[] = [];

        each(this.stack, stackActionItem => {
            switch (stackActionItem.action.priorty) {
                case PriorityLevel.LOW: {
                    lowPriorityActions.push(stackActionItem);
                    break;
                }
                case PriorityLevel.MEDIUM: {
                    medPriorityActions.push(stackActionItem);
                    break;
                }
                case PriorityLevel.HIGH: {
                    highPriorityActions.push(stackActionItem);
                    break;
                }
                default: {
                    lowPriorityActions.push(stackActionItem);
                }
            }
        });

        const reprioritizedStack: StackActionItem[] = [...highPriorityActions, ...medPriorityActions, ...lowPriorityActions];

        this.stack = reprioritizedStack;
    }

}

