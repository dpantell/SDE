import { PhaseVerb, PhaseNoun } from './../models/phase.interface';
import { Injectable } from '@angular/core';
import { Phase, PhaseCategory, PhaseAction } from 'src/models/phase.interface';
import { PhaseStyle } from 'src/models/phase-style.enum';

@Injectable({ providedIn: 'root' })
export class GetPhasesService {

    public getPhases(): Phase[] {

        const chat: Phase = {
            name: 'Chat',
            style: PhaseStyle.Daylight,
            category: PhaseCategory.DAY,
            beginActions: [],
            endActions: [],
            transitions: []
        };

        const nomination: Phase = {
            name: 'Nomination',
            style: PhaseStyle.Daylight,
            category: PhaseCategory.DAY,
            beginActions: [],
            endActions: [],
            transitions: []
        };

        const stand: Phase = {
            name: 'Stand',
            style: PhaseStyle.Daylight,
            category: PhaseCategory.DAY,
            beginActions: [],
            endActions: [],
            transitions: []
        };

        const vote: Phase = {
            name: 'Vote',
            style: PhaseStyle.Daylight,
            category: PhaseCategory.DAY,
            beginActions: [],
            endActions: [],
            transitions: []
        };

        const night = {
            name: 'Night',
            style: PhaseStyle.StarryNight,
            category: PhaseCategory.NIGHT,
            beginActions: [
                {
                    verb: PhaseVerb.RESOLVE_QUEUED_ACTIONS,
                    noun: PhaseNoun.ALL
                }
            ],
            endActions: [
                {
                    verb: PhaseVerb.RESOLVE_QUEUED_ACTIONS,
                    noun: PhaseNoun.ALL
                }
            ],
            transitions: []
        };

        return [
            chat,
            nomination,
            stand,
            vote,
            night
        ];
    }
}
