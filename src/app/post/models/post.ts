import { User } from "../../user/models/user";
import { Comment } from "./comment";
import { Tag } from "./tag";

export class Post{
    constructor(
        public id: string = "",
        public content: string = "",
        public user: User | null = null,
        public sharedBy: string[] = [],
        public likedBy: string[] = [],
        public viewedByAll: boolean = false,
        public images: any[] =[],
        public comments: Comment[] = [],
        public tags: Tag[] = [],
        public createdAt: Date = new Date(),
        public updatedAt?: Date,
    ){}
}