import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintUserEmail1765684282839
  implements MigrationInterface
{
  name = 'AddUniqueConstraintUserEmail1765684282839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_user_email" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_user_email"`,
    );
  }
}
