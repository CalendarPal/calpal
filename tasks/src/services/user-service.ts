import { UserRepository } from "./interfaces";

interface CreateOrUpdateUserInput {
  id: string;
  email: string;
}
export class UserService {
  private tr: UserRepository;

  constructor(r: UserRepository) {
    this.tr = r;
  }

  async createOrUpdateUser(input: CreateOrUpdateUserInput) {
    const createdUser = this.tr.upsert({
      id: input.id,
      email: input.email,
    });

    return createdUser;
  }
}
