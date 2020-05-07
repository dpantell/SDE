import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Phase, PhaseAction } from 'src/models/phase.interface';
import { get } from 'lodash';
import { GetPhasesService } from 'src/services/get-phases.service';
import { PhaseStyle } from 'src/models/phase-style.enum';

@Injectable({ providedIn: 'root' })
export class PhaseStore {

    @observable private phaseIndex: number;
    @observable private phases: Phase[];

    constructor(
        private getPhasesService: GetPhasesService
    ) {
    }

    @computed get currentPhase(): Phase {

        return this.phases[this.phaseIndex];
    }

    @computed get name(): string {

        return this.currentPhase.name;
    }

    @computed get style(): PhaseStyle {

        return this.currentPhase.style;
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

        this.phaseIndex = 0;
        this.phases = this.getPhasesService.getPhases();
    }

    @action next(): void {

        this.runActions(this.currentPhase.endActions);

        this.phaseIndex = (this.phaseIndex + 1) % this.phases.length;

        this.runActions(this.currentPhase.beginActions);
    }

    private runActions(actions: PhaseAction[]): void {

        //
    }
}
