import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddListParticipantsTable1765683686597
  implements MigrationInterface
{
  name = 'AddListParticipantsTable1765683686597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_list" ("listId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_user_list" PRIMARY KEY ("listId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_list_list" ON "user_list" ("listId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_list_user" ON "user_list" ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_list" ADD CONSTRAINT "FK_user_list_list" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_list" ADD CONSTRAINT "FK_user_list_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_list" DROP CONSTRAINT "FK_user_list_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_list" DROP CONSTRAINT "FK_user_list_list"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_user_list_user"`);
    await queryRunner.query(`DROP INDEX "IDX_user_list_list"`);
    await queryRunner.query(`DROP TABLE "user_list"`);
  }
}
