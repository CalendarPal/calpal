import { DataSources } from "../data";
import { TaskService } from "../services/task-service";
import { PGTaskRepository } from "../repositories/pg-task-repository";
import { UserService } from "../services/user-service";
import { PGUserRepository } from "../repositories/pg-user-repository";

export interface Services {
  taskService: TaskService;
  userService: UserService;
}

class ServiceContainer {
  private _services?: Services;

  init(dataSources: DataSources) {
    console.log("Initializing services");
    const taskRepository = new PGTaskRepository(dataSources.db);
    const taskService = new TaskService(taskRepository);

    const userRepository = new PGUserRepository(dataSources.db);
    const userService = new UserService(userRepository);

    this._services = {
      taskService,
      userService,
    };
  }

  get services(): Services {
    if (!this._services) {
      throw new Error(
        "Cannot access services before instantiating with init method"
      );
    }

    return this._services;
  }
}

// makes this accessible at top level after initializing
export const serviceContainer = new ServiceContainer();
