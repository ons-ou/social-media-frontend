export class UpdateUserDTO {
    constructor(
      public firstName: string,
      public lastName: string,
      public username: string,
      public oldPassword: string,
      public newPassword: string | null = null
    ) {}
  }