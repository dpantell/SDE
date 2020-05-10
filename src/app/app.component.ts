import { GameStateStore } from './../stores/gamestate.store';
import { UserStore } from './../stores/user.store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PhaseStore } from 'src/stores/phase.store';
import { RoleStore } from 'src/stores/role.store';
import { StackStore } from 'src/stores/stack.store';
import { User } from 'src/models/user.interface';
import { StackService } from 'src/services/stack.service';
import { PhaseActionMap } from 'src/models/role-action.interface';
import { CountdownEvent, CountdownStatus, CountdownConfig } from 'ngx-countdown';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public me: User;
  public config: CountdownConfig;

  constructor(
    public stackStore: StackStore,
    public phaseStore: PhaseStore,
    public roleStore: RoleStore,
    public userStore: UserStore,
    public stackService: StackService,
    public gameStateStore: GameStateStore
  ) {
  }

  ngOnInit(): void {

    this.stackStore.resetState();
    this.phaseStore.resetState();
    this.roleStore.resetState();
    this.userStore.resetState();
    this.gameStateStore.resetState();

    const me = this.userStore.aliveUsers[0];

    this.me = me;
  }


  public triggerNextPhase(event: CountdownEvent): void {
    console.log(event);

    if (event.status === CountdownStatus.done) {
      setTimeout(() => { this.phaseStore.next(); }, 1000);
    }
  }

  public isActionEnabledDuringPhase(action: PhaseActionMap): boolean {
    return !!action.phases.find(phase => phase === this.phaseStore.currentPhase.category);
  }

}
