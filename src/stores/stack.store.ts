import { observable, action } from 'mobx-angular';
import { Injectable } from '@angular/core';
import { RoleAction } from 'src/models/role-action.interface';
import { Role } from 'src/models/role.interface';

@Injectable({ providedIn: 'root' })
export class StackStore {

    @observable public stack: any[];

    @action resetState(): void {

        this.stack = [];
    }
    @action addActionToStack(role: Role, roleAction: RoleAction): void {
        console.log(`Role: ${role.name} requested to perform action ${roleAction.name}`);
        this.stack.push(roleAction);
    }

    public getStack(): any[] {

        console.log(JSON.stringify(this.stack, null, 2));
        return this.stack;
    }

}
