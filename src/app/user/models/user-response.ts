import { UserRole } from "./stateEnum";

export class UserResponse{
    constructor(
        public id: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public createdAt: Date,
        public friendIds: string[],
        public dateOfBirth: Date,
        public state = UserRole.NONE,
        public friendRequestId?: string | null,
        public profilePicture?: any,
        public updatedAt?: Date
    ){}
}