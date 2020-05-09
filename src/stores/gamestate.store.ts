import { PhaseStore } from 'src/stores/phase.store';
import { PhaseCategory } from 'src/models/phase.interface';
import { GameState } from 'src/models/game-state.interface';
import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class GameStateStore {

    @observable public gameState: GameState;

    constructor(private phaseStore: PhaseStore, private userStore: UserStore) { }

    @action resetState(): void {

        this.gameState = this.getDefaultGameState();
    }

    private getDefaultGameState(): GameState {
        return {
            users: this.userStore.users,
            currentPhase: this.phaseStore.currentPhase
        };
    }

}
