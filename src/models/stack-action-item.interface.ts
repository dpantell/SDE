import { User } from './user.interface';
import { RoleAction } from './role-action.interface';

export interface StackActionItem {
    id: string;
    requestor: User;
    target: User;
    action: RoleAction;
}
