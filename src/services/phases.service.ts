import { Quantifier } from '../models/enums/quantifier.enum';
import { PhaseVerb } from '../models/phase.interface';
import { Injectable } from '@angular/core';
import { Phase, PhaseCategory } from 'src/models/phase.interface';
import { PhaseStyle } from 'src/models/enums/phase-style.enum';

@Injectable({ providedIn: 'root' })
export class PhasesService {

    public getPhases(): Phase[] {

        const chat: Phase = {
            name: 'Chat',
            style: PhaseStyle.Daylight,
            category: PhaseCategory.DAY,
            countdownConfig: { leftTime: 30, format: 'm:ss' },
            beginActions: [{
                verb: PhaseVerb.REMOVE_ALL_BOOSTS,
                quantifier: Quantifier.ALL
            }],
            endActions: [],
            transitions: []
        };

        const nomination: Phase = {
            name: 'Nomination',
            style: PhaseStyle.Daylight,
            category: PhaseCategory.DAY,
            countdownConfig: { leftTime: 15, format: 'm:ss' },
            beginActions: [{
                verb: PhaseVerb.REMOVE_ALL_BOOSTS,
                quantifier: Quantifier.ALL
            }],
            endActions: [],
            transitions: []
        };

        const stand: Phase = {
            name: 'Stand',
            style: PhaseStyle.Daylight,
            category: PhaseCategory.DAY,
            countdownConfig: { leftTime: 15, format: 'm:ss' },
            beginActions: [{
                verb: PhaseVerb.REMOVE_ALL_BOOSTS,
                quantifier: Quantifier.ALL
            }],
            endActions: [],
            transitions: []
        };

        const vote: Phase = {
            name: 'Vote',
            style: PhaseStyle.Daylight,
            category: PhaseCategory.DAY,
            countdownConfig: { leftTime: 15, format: 'm:ss' },
            beginActions: [{
                verb: PhaseVerb.REMOVE_ALL_BOOSTS,
                quantifier: Quantifier.ALL
            }],
            endActions: [],
            transitions: []
        };

        const night: Phase = {
            name: 'Night',
            style: PhaseStyle.StarryNight,
            category: PhaseCategory.NIGHT,
            countdownConfig: { leftTime: 30, format: 'm:ss' },
            beginActions: [
                {
                    verb: PhaseVerb.RESOLVE_QUEUED_ACTIONS,
                    quantifier: Quantifier.ALL
                },
                {
                    verb: PhaseVerb.REMOVE_ALL_BOOSTS,
                    quantifier: Quantifier.ALL
                }
            ],
            endActions: [
                {
                    verb: PhaseVerb.RESOLVE_QUEUED_ACTIONS,
                    quantifier: Quantifier.ALL
                }
            ],
            transitions: []
        };

        night.transitions = [
            {
                conditions: [],
                target: 'Chat'
            }
        ];

        chat.transitions = [
            {
                conditions: [],
                target: 'Nomination'
            }
        ];

        nomination.transitions = [
            {
                conditions: [],
                target: 'Stand'
            }
        ];

        stand.transitions = [
            {
                conditions: [],
                target: 'Vote'
            }
        ];

        vote.transitions = [
            {
                conditions: [],
                target: 'Night'
            }
        ];

        return [
            chat,
            nomination,
            stand,
            vote,
            night
        ];
    }
}
