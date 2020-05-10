import { Phase } from 'src/models/phase.interface';
import { User } from './user.interface';

export interface GameState {
    aliveUsers: User[];
    deadUsers: User[];
    currentPhase: Phase;
    currentDay: number;
}
