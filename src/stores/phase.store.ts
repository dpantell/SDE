import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Phase } from 'src/models/phase.interface';
import { DAY_PHASE } from 'src/models/day.phase';

@Injectable({ providedIn: 'root' })
export class PhaseStore {

    @observable current: Phase = DAY_PHASE;

    @computed get name(): string {

        return this.current.name;
    }

    @action next(): void {

        this.current.name = 'banana pee';
        //
    }
}
