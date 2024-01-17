import { User } from "./user";

export class FriendRequest{
    constructor(
        public id: string,
        public from: User,
        public to: User,
        public createdAt: Date,

    ){}
}