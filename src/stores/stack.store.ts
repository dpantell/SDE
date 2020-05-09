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
        this.stack.push(roleAction);
    }

    public getStack(): any[] {

        return this.stack;
    }

}
