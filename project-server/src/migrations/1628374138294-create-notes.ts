import {MigrationInterface, QueryRunner} from "typeorm";

export class createNotes1628374138294 implements MigrationInterface {
    name = 'createNotes1628374138294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "body" character varying NOT NULL, "taskId" uuid NOT NULL, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_829532ff766505ad7c71592c6a" ON "notes" ("userId") `);
        await queryRunner.query(`ALTER TABLE "public"."tasks" ALTER COLUMN "goalDate" SET DEFAULT NOW() + INTERVAL '24 HOURS'`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_829532ff766505ad7c71592c6a5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_63ce9e2673b974d66f5dcd72211" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_63ce9e2673b974d66f5dcd72211"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_829532ff766505ad7c71592c6a5"`);
        await queryRunner.query(`ALTER TABLE "public"."tasks" ALTER COLUMN "goalDate" SET DEFAULT (now() + '24:00:00')`);
        await queryRunner.query(`DROP INDEX "IDX_829532ff766505ad7c71592c6a"`);
        await queryRunner.query(`DROP TABLE "notes"`);
    }

}
