import { RoleStore } from 'src/stores/role.store';
import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Role } from 'src/models/role.interface';
import { User } from 'src/models/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { each } from 'lodash';

@Injectable({ providedIn: 'root' })
export class UserStore {

    constructor(
        private roleStore: RoleStore,
    ) {
    }

    @observable private _aliveUsers: User[];

    @observable private _deadUsers: User[];

    @computed get aliveUsers(): User[] {

        return this._aliveUsers;
    }

    @computed get deadUsers(): User[] {

        return this._deadUsers;
    }

    @action resetState(): void {

        this._aliveUsers = this.getMockUsers();
        this._deadUsers = [];
    }

    @action markUserAsDead(deadUser: User): void {

        this._aliveUsers.splice(this._aliveUsers.findIndex(user => user.id === deadUser.id), 1);

        this._deadUsers.push(deadUser);
    }

    private getMockUsers(): User[] {

        const numberOfMockUsers: number = 10;

        const userNames: string[] = this.generateUserNames(numberOfMockUsers);

        const users: User[] = [
            this.generateMockUser(userNames[0], this.roleStore.roles[0]), // Me
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
            name: userName || this.generateUserNames(1)[0],
            role: role || this.roleStore.roles[1]
        };
    }

    public generateUserNames(numberOfNames: number): string[] {

        // TODO: All rarities to all levels
        let titles: string[] = ['THE', 'Dr.', 'Lord', 'Lady',
            'Master', 'President', 'Archduke', 'Archduchess', 'Count', 'Countess', 'Dean',
            'Earl', 'Baron', 'Baroness', 'His Grace', 'Her Grace', 'His Magesty', 'Her Magesty',
            'Viceroy', 'Vicereine', 'Tsar', 'Tsarina', 'Caesar', 'His Holiness', 'Her Holiness',
            'Princeps', 'Chief Justice', 'Elder', 'Major', 'Grand Admiral'];

        let attributes: string[] = ['Hairy', 'Smelly', 'Tall', 'Old', 'Young', 'Energetic',
            'Lazy', 'Helpful', 'Untrustworthy', 'Trustworthy', 'Patient', 'Perceptive', 'Modest',
            'Sincere', 'Ambitious', 'Cheerful', 'Curious', 'Arrogant', 'Cynical', 'Decietful',
            'Intolerable', 'Pessimistic', 'Optimistic', 'Cowardly', 'Inconsiderate', 'Mean',
            'Jealous', 'Boring', 'Short', 'Bossy', 'Selfish', 'Stupid', 'Smart', 'Rude', 'Agreeable',
            'Honorable', 'Attractive', 'Bald', 'Magnificant', 'Witty', 'Repulsive', 'Slow', 'Annoying', ''];

        let nouns: string[] = ['Person', 'Dog', 'Peacock', 'Pig', 'Lion', 'Llama', 'Skunk', 'Aardvark',
            'Penguin', 'Whale', 'Beaver', 'Cat', 'Fox', 'Owl', 'Wolf', 'Shark', 'Cow', 'Snail', 'Donkey',
            'Monkey', 'Tiger', 'Fish', 'Elephant', 'Caterpillar', 'Wasp', 'Bee', 'Spider', 'Parrot', 'Camel',
            'Eagle', 'Bear', 'Hummingbird', 'Ferret', 'Butterfly', 'Snake', 'Hyena', 'Frog'];

        let suffixes: string[] = ['Sr.', 'Jr.', 'III', 'IV', ', Esq.'];

        const names: string[] = [];
        let name: string = '';

        for (let i = 0; i < numberOfNames; i++) {

            const attribute: string = this.randomizeCollectionValue(attributes);
            attributes = attributes.filter(attr => attr !== attribute);

            const noun: string = this.randomizeCollectionValue(nouns);
            nouns = nouns.filter(nn => nn !== noun);

            name = `${attribute} ${noun}`;

            if ((Math.floor(Math.random() * 100) + 1) > 90) {

                const title: string = this.randomizeCollectionValue(titles);
                titles = titles.filter(tit => tit !== title);

                name = `${title} ${name}`;
            }
            else { name = `The ${name}`; }

            if ((Math.floor(Math.random() * 100) + 1) > 90) {

                const suffix: string = this.randomizeCollectionValue(suffixes);
                suffixes = suffixes.filter(suff => suff !== suffix);

                name = `${name} ${suffix}`;

                name = name.replace('The', '');
            }

            names.push(name);
        }

        return names;
    }

    private randomizeCollectionValue(collection: any[]): any {

        return collection[Math.floor(Math.random() * collection.length)];
    }
}
