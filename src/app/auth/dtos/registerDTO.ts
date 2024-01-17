export class RegisterDTO {
    constructor(
        private password: string,
        private username: string,
        private firstName: string,
        private email: string,
        private lastName: string,
      ) {}
  }
  