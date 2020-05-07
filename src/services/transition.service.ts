import { Injectable } from '@angular/core';
import { TransitionCondition } from 'src/models/transition.interface';

@Injectable({ providedIn: 'root' })
export class TransitionService {

    public isConditionMet(condition: TransitionCondition): boolean {

        return true;
    }
}
