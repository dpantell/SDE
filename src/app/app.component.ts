import { ActionService } from 'src/services/action.service';
import { UserStore } from './../stores/user.store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PhaseStore } from 'src/stores/phase.store';
import { RoleStore } from 'src/stores/role.store';
import { StackStore } from 'src/stores/stack.store';
import { User } from 'src/models/user.interface';
import { GameState } from 'src/models/game-state.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public me: User;
  public gameState: GameState;

  constructor(
    public stackStore: StackStore,
    public phaseStore: PhaseStore,
    public roleStore: RoleStore,
    public userStore: UserStore,
    public actionService: ActionService
  ) {
    this.gameState = {
      users: [],
      currentPhase: null
    };
  }

  ngOnInit(): void {

    this.stackStore.resetState();
    this.phaseStore.resetState();
    this.roleStore.resetState();
    this.userStore.resetState();

    this.me = this.userStore.users[0];
    this.gameState.users = this.userStore.users;
    this.gameState.currentPhase = this.phaseStore.getCurrentPhase;
  }

}
