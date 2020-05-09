import { RoleStore } from 'src/stores/role.store';
import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Role } from 'src/models/role.interface';
import { User } from 'src/models/user.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class UserStore {

    constructor(
        private roleStore: RoleStore,
    ) {
    }

    @observable public users: User[];

    @action resetState(): void {

        this.users = this.getMockUsers();
    }

    private getMockUsers(): User[] {

        const users: User[] = [
            this.generateMockUser(this.roleStore.roles[1]),
            this.generateMockUser(),
            this.generateMockUser(),
            this.generateMockUser(),
            this.generateMockUser(this.roleStore.roles[0]),
            this.generateMockUser(),
            this.generateMockUser(),
            this.generateMockUser(),
            this.generateMockUser(this.roleStore.roles[0]),
            this.generateMockUser(),
        ];

        return users;
    }

    private generateMockUser(role?: Role): User {
        return {
            id: uuidv4(),
            name: this.generateUserName(),
            role: role || this.roleStore.roles[1]
        };
    }

    public generateUserName(): string {

        const titles: string[] = ['THE', 'Mr.', 'Mrs.', 'Duke', 'Dr.', 'Lord', 'Lady',
            'Master', 'President', 'Archduke', 'Archduchess', 'Count', 'Countess', 'Dean',
            'Earl', 'Baron', 'Baroness', 'His Grace', 'Her Grace', 'His Magesty', 'Her Magesty',
            'Viceroy', 'Vicereine', 'Tsar', 'Tsarina', 'Caesar', 'His Holiness', 'Her Holiness',
            'Princeps', 'Chief Justice', 'Elder', 'Major', 'Grand Admiral'];

        const attributes: string[] = ['Hairy', 'Smelly', 'Tall', 'Old', 'Young', 'Energetic',
            'Lazy', 'Helpful', 'Untrustworthy', 'Trustworthy', 'Patient', 'Perceptive', 'Modest',
            'Sincere', 'Ambitious', 'Cheerful', 'Curious', 'Arrogant', 'Cynical', 'Decietful',
            'Intolerant', 'Pessimistic', 'Optimistic', 'Cowardly', 'Inconsiderate', 'Mean',
            'Jealous', 'Boring', 'Short', 'Bossy', 'Selfish', 'Stupid', 'Smart', 'Rude', 'Agreeable',
            'Honorable', 'Attractive', 'Bald', 'Magnificant', 'Witty', 'Repulsive', 'Slow', 'Annoying'];

        const nouns: string[] = ['Person', 'Dog', 'Peacock', 'Pig', 'Lion', 'Llama', 'Skunk', 'Aardvark',
            'Penguin', 'Whale', 'Beaver', 'Cat', 'Fox', 'Owl', 'Wolf', 'Shark', 'Cow', 'Snail', 'Donkey',
            'Monkey', 'Tiger', 'Fish', 'Elephant', 'Caterpillar', 'Wasp', 'Bee', 'Spider', 'Parrot', 'Camel',
            'Eagle', 'Bear', 'Hummingbird', 'Ferret', 'Butterfly', 'Snake', 'Hyena', 'Frog'];

        const suffix: string[] = ['Sr.', 'Jr.', 'III', 'IV', 'V', ', Esq.'];

        let name: string = `${this.randomizeCollectionValue(attributes)} ${this.randomizeCollectionValue(nouns)}`;

        if ((Math.floor(Math.random() * 100) + 1) > 90) { name = `${this.randomizeCollectionValue(titles)} ${name}`; } else { name = `The ${name}`; }

        if ((Math.floor(Math.random() * 100) + 1) > 90) { name = `${name} ${this.randomizeCollectionValue(suffix)}`; }

        return name;
    }

    private randomizeCollectionValue(collection: any[]): any {

        return collection[Math.floor(Math.random() * collection.length)];
    }
}
