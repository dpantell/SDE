import { Phase } from 'src/models/phase.interface';
import { User } from './user.interface';

// TODO: Make a store
export interface GameState {
    users: User[];
    currentPhase: Phase;
}
