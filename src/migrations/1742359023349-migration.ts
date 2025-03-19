import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742359023349 implements MigrationInterface {
  name = 'Migration1742359023349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`comment_like\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`comment_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment_like\` ADD CONSTRAINT \`FK_4a0c128374ff87d4641cab920f0\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment_like\` ADD CONSTRAINT \`FK_fd7207639a77fa0f1fea8943b78\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment_like\` DROP FOREIGN KEY \`FK_fd7207639a77fa0f1fea8943b78\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment_like\` DROP FOREIGN KEY \`FK_4a0c128374ff87d4641cab920f0\``,
    );
    await queryRunner.query(`DROP TABLE \`comment_like\``);
  }
}
