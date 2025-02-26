import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740578851855 implements MigrationInterface {
    name = 'Migration1740578851855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`category\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`category\``);
    }

}
