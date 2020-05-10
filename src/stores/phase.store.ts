import { StackStore } from 'src/stores/stack.store';
import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Phase } from 'src/models/phase.interface';
import { find, every, first } from 'lodash';
import { PhasesService } from 'src/services/phases.service';
import { PhaseStyle } from 'src/models/enums/phase-style.enum';
import { Transition } from 'src/models/transition.interface';
import { TransitionService } from 'src/services/transition.service';

@Injectable({ providedIn: 'root' })
export class PhaseStore {

    @observable private phases: Phase[];
    @observable private _iterations: number;
    @observable private _currentPhase: Phase;

    constructor(
        private phasesService: PhasesService,
        private transitionService: TransitionService,
        private stackStore: StackStore
    ) {
    }

    @computed get currentPhase(): Phase {

        return this._currentPhase;
    }

    @computed get currentPhaseName(): string {

        return this._currentPhase?.name;
    }

    @computed get style(): PhaseStyle {

        return this._currentPhase?.style;
    }

    @computed get iterations(): number {
        return this._iterations;
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

        this.phases = this.phasesService.getPhases();

        this._currentPhase = first(this.phases);

        this._iterations = 1;
    }

    @action next(): void {

        const transition = this.getAvailableTransition(this._currentPhase);

        if (!transition) { return; }

        this.stackStore.executePhaseActions(this._currentPhase.endActions);

        this._currentPhase = find(this.phases, phase => phase.name === transition.target);

        if (this._currentPhase === first(this.phases)) {
            this._iterations++;
        }

        this.stackStore.executePhaseActions(this._currentPhase.beginActions);

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
