import { RoleStore } from 'src/stores/role.store';
import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Role } from 'src/models/role.interface';
import { User } from 'src/models/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { each, includes, first, filter, flatMap, map } from 'lodash';
import { NameService } from 'src/services/name.service';
import { AllowedAction, RoleAction } from 'src/models/role-action.interface';
import { TargetCriteria } from 'src/models/target-criteria.interface';
import { ITransformer, createTransformer } from 'mobx-utils';

@Injectable({ providedIn: 'root' })
export class UserStore {

    @observable private users: User[];
    @observable private deadUserIds: string[];

    @observable me: User;

    constructor(
        private roleStore: RoleStore,
        private nameService: NameService
    ) {
    }

    @computed get aliveUsers(): User[] {

        return this.users.filter(user => !this.isUserDead(user));
    }

    @computed get deadUsers(): User[] {

        return this.users.filter(user => this.isUserDead(user));
    }

    @action resetState(): void {

        this.users = this.getMockUsers();
        this.deadUserIds = [];
        this.me = first(this.users);
    }

    @action markUserAsDead(deadUser: User): void {

        this.deadUserIds.push(deadUser.id);
    }

    private isUserDead(user: User): boolean {

        return includes(this.deadUserIds, user.id);
    }

    private getMockUsers(): User[] {

        const numberOfMockUsers: number = 10;

        const userNames: string[] = this.nameService.generateUserNames(numberOfMockUsers);

        const users: User[] = [
            // 0 = Mafioso
            // 1 = Sheriff
            // 2 = Investigator
            // 3 = Escort
            this.generateMockUser(userNames[0], this.roleStore.roles[1]), // Me
            this.generateMockUser(userNames[1]),
            this.generateMockUser(userNames[2]),
            this.generateMockUser(userNames[3]),
            this.generateMockUser(userNames[4], this.roleStore.roles[0]),
            this.generateMockUser(userNames[5]),
            this.generateMockUser(userNames[6]),
            this.generateMockUser(userNames[7]),
            this.generateMockUser(userNames[8], this.roleStore.roles[0]),
            this.generateMockUser(userNames[9]),
        ];

        each(users, (user, index) => { user.listPosition = index; });

        return users;
    }

    private generateMockUser(userName?: string, role?: Role): User {

        return {
            id: uuidv4(),
            name: userName || this.nameService.generateUserNames(1)[0],
            role: role || this.roleStore.roles[1]
        };
    }

}
