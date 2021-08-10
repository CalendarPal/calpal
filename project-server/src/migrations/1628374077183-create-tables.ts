import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1628374077183 implements MigrationInterface {
    name = 'createTables1628374077183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "goalDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '24 HOURS', "projectId" uuid NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_166bd96559cb38595d392f75a3" ON "tasks" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2b688af66b04f73a6c5426af9" ON "tasks" ("startDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_087604918e914c51fe439c9460" ON "tasks" ("goalDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_e08fca67ca8966e6b9914bf295" ON "tasks" ("projectId") `);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "title" character varying NOT NULL, "description" text, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_361a53ae58ef7034adc3c06f09" ON "projects" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2117ba29bd245f2b53c42f429c" ON "projects" ("title") `);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_361a53ae58ef7034adc3c06f09f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_361a53ae58ef7034adc3c06f09f"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`DROP INDEX "IDX_2117ba29bd245f2b53c42f429c"`);
        await queryRunner.query(`DROP INDEX "IDX_361a53ae58ef7034adc3c06f09"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP INDEX "IDX_e08fca67ca8966e6b9914bf295"`);
        await queryRunner.query(`DROP INDEX "IDX_087604918e914c51fe439c9460"`);
        await queryRunner.query(`DROP INDEX "IDX_f2b688af66b04f73a6c5426af9"`);
        await queryRunner.query(`DROP INDEX "IDX_166bd96559cb38595d392f75a3"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
