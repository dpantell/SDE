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
    @observable private _currentPhase: Phase;
    @observable private _phaseCycleCount: number;

    constructor(
        private phasesService: PhasesService,
        private transitionService: TransitionService
    ) {
    }

    @computed get cycleMessage(): string {

        return `Day: ${this.phaseCycleCount + 1}`;
    }

    @computed get phaseMessage(): string {

        return `${this.currentPhaseName} Phase`;
    }

    @computed get currentPhase(): Phase {

        return this._currentPhase;
    }

    @computed get currentPhaseName(): string {

        return this.currentPhase?.name;
    }

    @computed get style(): PhaseStyle {

        return this.currentPhase?.style;
    }

    @computed get phaseCycleCount(): number {

        return this._phaseCycleCount;
    }

    @computed get availableTransition(): Transition {

        return find(this.currentPhase.transitions, transition => this.isTransitionReady(transition));
    }

    @computed get firstPhase(): Phase {

        return first(this.phases);
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

        this._currentPhase = this.firstPhase;

        this._phaseCycleCount = 0;
    }

    @action next(): void {

        this._currentPhase = find(this.phases, phase => phase.name === this.availableTransition.target);

        if (this.currentPhase === this.firstPhase) {

            this._phaseCycleCount++;
        }
    }

    private isTransitionReady(transition: Transition): boolean {

        const areAllConditionsMet: boolean = every(transition.conditions, condition => this.transitionService.isConditionMet(condition));

        return areAllConditionsMet;
    }
}
