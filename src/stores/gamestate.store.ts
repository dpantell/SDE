import { PhaseStore } from 'src/stores/phase.store';
import { GameState } from 'src/models/game-state.interface';
import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class GameStateStore {

    @observable private _gameState: GameState;

    constructor(
        private phaseStore: PhaseStore,
        private userStore: UserStore
    ) { }

    @computed get gameState(): GameState {

        return this._gameState;
    }

    @action resetState(): void {

        this._gameState = this.getDefaultGameState();
    }

    private getDefaultGameState(): GameState {
        return {
            aliveUsers: this.userStore.aliveUsers,
            deadUsers: this.userStore.deadUsers,
            currentPhase: this.phaseStore.currentPhase
        };
    }

}
