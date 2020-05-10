import { UserStore } from './../stores/user.store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PhaseStore } from 'src/stores/phase.store';
import { RoleStore } from 'src/stores/role.store';
import { StackStore } from 'src/stores/stack.store';
import { User } from 'src/models/user.interface';
import { PhaseActionMap } from 'src/models/role-action.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public me: User;

  constructor(
    public stackStore: StackStore,
    public phaseStore: PhaseStore,
    public roleStore: RoleStore,
    public userStore: UserStore,
    // public gameStateStore: GameStateStore
  ) {
  }

  ngOnInit(): void {

    this.stackStore.resetState();
    this.phaseStore.resetState();
    this.roleStore.resetState();
    this.userStore.resetState();

    const me = this.userStore.aliveUsers[0];

    this.me = me;
  }

  public hook(): void {
    // dispatch action from random user
    this.stackStore.addActionToStack(
      this.userStore.aliveUsers[1],
      this.userStore.aliveUsers[2],
      this.userStore.aliveUsers[1].role.actionMap[0].actions[0]
    );
  }

  public isActionEnabledDuringPhase(action: PhaseActionMap): boolean {
    return !!action.phases.find(phase => phase === this.phaseStore.currentPhase.category);
  }

}
