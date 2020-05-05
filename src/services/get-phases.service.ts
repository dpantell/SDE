import { Injectable } from '@angular/core';
import { Phase } from 'src/models/phase.interface';
import { PhaseStyle } from 'src/models/phase-style.enum';

@Injectable({ providedIn: 'root' })
export class GetPhasesService {

    public getPhases(): Phase[] {

        const day: Phase = {
            name: 'Day',
            style: PhaseStyle.Daylight,
            onBegin: () => { console.log(`${day.name} onBegin`); },
            onEnd: () => { console.log(`${day.name} onEnd`); }
        };

        const night: Phase = {
            name: 'Night',
            style: PhaseStyle.StarryNight,
            onBegin: () => { console.log(`${night.name} onBegin`); },
            onEnd: () => { console.log(`${night.name} onEnd`); }
        };

        return [
            day,
            night
        ];
    }
}
