import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrectEntity1761511288897 implements MigrationInterface {
    name = 'CorrectEntity1761511288897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`countries\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`countries\` DROP COLUMN \`updated_at\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`countries\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`countries\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
