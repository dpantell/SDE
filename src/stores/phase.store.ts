import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Phase } from 'src/models/phase.interface';

@Injectable({ providedIn: 'root' })
export class PhaseStore {

    @observable private phaseIndex: number;
    @observable private phases: Phase[];

    @computed get currentPhase(): Phase {

        return this.phases[this.phaseIndex];
    }

    @computed get name(): string {

        return this.currentPhase.name;
    }

    @action resetState(): void {

        this.phaseIndex = 0;
        this.phases = this.getPhases();
    }

    @action next(): void {

        this.currentPhase.onEnd();

        this.phaseIndex = (this.phaseIndex + 1) % this.phases.length;

        this.currentPhase.onBegin();
    }

    private getPhases(): Phase[] {

        const day: Phase = {
            name: 'Day',
            onBegin: () => { console.log(`${day.name} onBegin`); },
            onEnd: () => { console.log(`${day.name} onEnd`); }
        };

        const night: Phase = {
            name: 'Night',
            onBegin: () => { console.log(`${night.name} onBegin`); },
            onEnd: () => { console.log(`${night.name} onEnd`); }
        };

        return [
            day,
            night
        ];
    }
}
