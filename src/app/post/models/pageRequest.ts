import { Post } from "./post";

export class PageRequest{
    constructor(
        public content: Post[],
        public page: number,
        public size: number,
        public totalPages: number,
        public totalElements: number,
        public last: boolean        
    ){}
}