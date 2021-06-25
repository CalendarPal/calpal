import { UserRepository } from "./interfaces";

export class UserService {
  private tr: UserRepository;

  constructor(r: UserRepository) {
    this.tr = r;
  }
}
