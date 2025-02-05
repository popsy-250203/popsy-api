import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738762296603 implements MigrationInterface {
  name = 'Migration1738762296603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`post_like\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`isLiked\` int NOT NULL DEFAULT '0', \`postId\` int NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_754a5e1d4e513c739e9c39a8d7\` (\`postId\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_like\` ADD CONSTRAINT \`FK_789b3f929eb3d8760419f87c8a9\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_like\` ADD CONSTRAINT \`FK_909fc474ef645901d01f0cc0662\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post_like\` DROP FOREIGN KEY \`FK_909fc474ef645901d01f0cc0662\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_like\` DROP FOREIGN KEY \`FK_789b3f929eb3d8760419f87c8a9\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_754a5e1d4e513c739e9c39a8d7\` ON \`post_like\``,
    );
    await queryRunner.query(`DROP TABLE \`post_like\``);
  }
}
