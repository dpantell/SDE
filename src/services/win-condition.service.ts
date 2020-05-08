import { Injectable } from '@angular/core';
import { WinCondition } from 'src/models/win-condition.interface';

@Injectable({ providedIn: 'root' })
export class WinConditionService {

    /*
        name: '',
        description: '',
        target: {
            quantifier: Quantifier.ALL,
            alignment: Alignment.NEUTRAL,
            role: RoleType.Killing
        },
        state: WinState.ALIVE,
        equality: {
            comparator: Comparator.EQ,
            amount: 0
        }
    */

    public isWinConditionMet(gameState: any, winCondition: WinCondition): boolean {
        return true;
    }
}
