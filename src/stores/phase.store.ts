import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Phase, PhaseAction } from 'src/models/phase.interface';
import { get, filter, find, every, first } from 'lodash';
import { GetPhasesService } from 'src/services/get-phases.service';
import { PhaseStyle } from 'src/models/phase-style.enum';
import { Transition } from 'src/models/transition.interface';
import { TransitionService } from 'src/services/transition.service';
import { ActionService } from 'src/services/action.service';

@Injectable({ providedIn: 'root' })
export class PhaseStore {

    @observable private phases: Phase[];
    @observable private currentPhase: Phase;

    constructor(
        private getPhasesService: GetPhasesService,
        private transitionService: TransitionService,
        private actionService: ActionService
    ) {
    }

    @computed get name(): string {

        return this.currentPhase?.name;
    }

    @computed get style(): PhaseStyle {

        return this.currentPhase?.style;
    }

    @computed get styleClass(): string {

        switch (this.style) {

            case PhaseStyle.Daylight:
                return 'day';

            case PhaseStyle.StarryNight:
                return 'night';

            default:
                return '';
        }
    }

    @action resetState(): void {

        this.phases = this.getPhasesService.getPhases();

        this.currentPhase = first(this.phases);
    }

    @action next(): void {

        const transition = this.getAvailableTransition(this.currentPhase);

        if (transition) {

            this.actionService.executePhaseActions(this.currentPhase.endActions);

            this.currentPhase = find(this.phases, phase => phase.name === transition.target);

            this.actionService.executePhaseActions(this.currentPhase.beginActions);
        }
    }

    private getAvailableTransition(phase: Phase): Transition {

        const availableTransition = find(phase.transitions, transition => this.isTransitionReady(transition));

        return availableTransition;
    }

    private isTransitionReady(transition: Transition): boolean {

        const areAllConditionsMet: boolean = every(transition.conditions, condition => this.transitionService.isConditionMet(condition));

        return areAllConditionsMet;
    }
}
