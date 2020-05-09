import { Role } from './role.interface';
import { GameState } from './enums/game-state.enum';

export interface User {
    id: string;
    name: string;
    role: Role;
}
