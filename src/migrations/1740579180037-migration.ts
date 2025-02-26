import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740579180037 implements MigrationInterface {
    name = 'Migration1740579180037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NOT NULL`);
    }

}
