import { Component, OnInit } from '@angular/core';
import { UserStore } from 'src/stores/user.store';

@Component({
  selector: 'app-dead-users-list',
  templateUrl: './dead-users-list.component.html',
  styleUrls: ['./dead-users-list.component.scss']
})
export class DeadUsersListComponent {

  constructor(
    public userStore: UserStore
  ) {
  }
}
