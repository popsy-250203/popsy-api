import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1744220575063 implements MigrationInterface {
  name = 'Migration1744220575063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment_like\` ADD \`deletedAt\` datetime(6) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment_like\` DROP COLUMN \`deletedAt\``,
    );
  }
}
