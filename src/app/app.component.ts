import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PhaseStore } from 'src/stores/phase.store';
import { RoleStore } from 'src/stores/role.store';
import { StackStore } from 'src/stores/stack.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    public stackStore: StackStore,
    public phaseStore: PhaseStore,
    public roleStore: RoleStore
  ) {
  }

  ngOnInit(): void {

    this.stackStore.resetState();
    this.phaseStore.resetState();
    this.roleStore.resetState();
  }

}
