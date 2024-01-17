export class User{
    constructor(
        public id: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public dateOfBirth: Date,
        public createdAt: Date,
        public friendIds: string[],
        public profilePicture?: any,
        public updatedAt?: Date
    ){}
}