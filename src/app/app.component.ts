import { UserStore } from './../stores/user.store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PhaseStore } from 'src/stores/phase.store';
import { RoleStore } from 'src/stores/role.store';
import { StackStore } from 'src/stores/stack.store';
import { User } from 'src/models/user.interface';

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
    public userStore: UserStore
  ) {
  }

  ngOnInit(): void {

    this.stackStore.resetState();
    this.phaseStore.resetState();
    this.roleStore.resetState();
    this.userStore.resetState();

    this.me = this.userStore.users[0];
  }

}
