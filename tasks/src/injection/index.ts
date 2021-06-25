import { DataSources } from "../data";
import { TaskService } from "../services/task-service";
import { PGTaskRepository } from "../repositories/pg-task-repository";

export interface Services {
  taskService: TaskService;
}

class ServiceContainer {
  private _services?: Services;

  init(dataSources: DataSources) {
    console.log("Initializing services");
    const taskRepository = new PGTaskRepository(dataSources.db);
    const taskService = new TaskService(taskRepository);

    this._services = {
      taskService,
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
