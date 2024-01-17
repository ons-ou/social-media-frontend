import { User } from "../../user/models/user";

export class Comment{
    constructor(
        public id: string,
        public content: string,
        public user: User,
        public createdAt: Date,
    ){}
}