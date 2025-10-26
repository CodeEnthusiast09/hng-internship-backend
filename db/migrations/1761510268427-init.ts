import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1761510268427 implements MigrationInterface {
    name = 'Init1761510268427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`countries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`capital\` varchar(255) NULL, \`region\` varchar(255) NULL, \`population\` bigint NOT NULL, \`currency_code\` varchar(255) NULL, \`exchange_rate\` decimal(10,2) NULL, \`estimated_gdp\` decimal(20,2) NULL, \`flag_url\` varchar(255) NULL, \`last_refreshed_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fa1376321185575cf2226b1491\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_fa1376321185575cf2226b1491\` ON \`countries\``);
        await queryRunner.query(`DROP TABLE \`countries\``);
    }

}
