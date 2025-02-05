import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738760387401 implements MigrationInterface {
    name = 'Migration1738760387401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`imageUrl\` varchar(255) NOT NULL, \`viewCount\` int NOT NULL DEFAULT '0', \`likeCount\` int NOT NULL DEFAULT '0', \`unlikeCount\` int NOT NULL DEFAULT '0', \`isAnonymous\` tinyint NOT NULL DEFAULT 0, \`creatorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_9e91e6a24261b66f53971d3f96b\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_9e91e6a24261b66f53971d3f96b\``);
        await queryRunner.query(`DROP TABLE \`post\``);
    }

}
