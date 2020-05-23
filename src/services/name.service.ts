import { RoleStore } from 'src/stores/role.store';
import { observable, action, computed } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { Role } from 'src/models/role.interface';
import { User } from 'src/models/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { each, includes } from 'lodash';

@Injectable({ providedIn: 'root' })
export class NameService {

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
            // else { name = `The ${name}`; }

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
