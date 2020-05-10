import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StackStore } from 'src/stores/stack.store';
import { PhaseStore } from 'src/stores/phase.store';
import { CountdownEvent, CountdownStatus } from 'ngx-countdown';

@Component({
    selector: 'app-phase',
    templateUrl: './phase.component.html',
    styleUrls: ['./phase.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhaseComponent {

    constructor(
        public stackStore: StackStore,
        public phaseStore: PhaseStore
    ) {
    }

    public triggerNextPhase(event: CountdownEvent): void {

        if (event.status === CountdownStatus.done) {

            setTimeout(() => { this.stackStore.performTransition(); }, 1000);
        }
    }
}
