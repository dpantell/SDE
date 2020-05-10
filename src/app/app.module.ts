// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MobxAngularModule } from 'mobx-angular';
import { AppRoutingModule } from './app-routing.module';
import { CountdownModule } from 'ngx-countdown';

// Configurations
import { configure } from 'mobx';

// Components
import { AppComponent } from './app.component';
import { UsersListComponent } from './users-list/users-list.component';
import { PhaseComponent } from './phase/phase.component';
import { DeadUsersListComponent } from './dead-users-list/dead-users-list.component';
import { StackComponent } from './stack/stack.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    PhaseComponent,
    DeadUsersListComponent,
    StackComponent
  ],
  imports: [
    BrowserModule,
    CountdownModule,
    AppRoutingModule,
    MobxAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    configure({ enforceActions: 'always' });
  }
}
