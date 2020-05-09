import { PhaseStore } from 'src/stores/phase.store';
import { GameState } from 'src/models/game-state.interface';
import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { UserStore } from './user.store';
import { User } from 'src/models/user.interface';

@Injectable({ providedIn: 'root' })
export class GameStateStore {

    @observable public gameState: GameState;

    constructor(
        private phaseStore: PhaseStore,
        private userStore: UserStore
    ) { }

    @action resetState(): void {

        this.gameState = this.getDefaultGameState();
    }

    @action markUserAsDead(deadUser: User): void {

        this.gameState.aliveUsers.filter(user => user.id !== deadUser.id);

        this.gameState.deadUsers.push(deadUser);
    }

    private getDefaultGameState(): GameState {
        return {
            aliveUsers: this.userStore.users,
            deadUsers: [],
            currentPhase: this.phaseStore.currentPhase
        };
    }

}
