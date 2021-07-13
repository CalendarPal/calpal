import { Migration } from '@mikro-orm/migrations';

export class Migration20210713030140 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "task" ("id" serial primary key, "title" text not null, "start_date" timestamptz(0) not null, "goal_date" timestamptz(0) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
  }

}
