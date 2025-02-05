import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738763339180 implements MigrationInterface {
    name = 'Migration1738763339180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_like\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`post_like\` CHANGE \`isLiked\` \`isLiked\` int NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_like\` CHANGE \`isLiked\` \`isLiked\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`post_like\` DROP COLUMN \`deletedAt\``);
    }

}
