import { Knex } from 'knex';
import {
  LoggerService,
  LifecycleService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { DatabaseManager } from '@backstage/backend-defaults/database';

type Options = {
  database: Knex;
};

export class DatabaseHandler {
  static async create(
    config: RootConfigService,
    deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): Promise<DatabaseHandler> {
    const db = DatabaseManager.fromConfig(config).forPlugin('scaffolder', deps);
    const knex = await db.getClient();

    return new DatabaseHandler({ database: knex });
  }
  private readonly database: Knex;

  private constructor(options: Options) {
    this.database = options.database;
  }

  async getDataByTemplateName(templateName: string): Promise<any[]> {
    return this.database
      .select('id', 'status', 'created_at', 'last_heartbeat_at', 'created_by')
      .from('tasks')
      .whereRaw(
        `(spec::json -> 'templateInfo' -> 'entity' -> 'metadata' ->> 'name') = ?`,
        [templateName],
      );
  }
}
