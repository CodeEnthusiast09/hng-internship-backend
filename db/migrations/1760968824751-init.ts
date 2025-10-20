import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1760968824751 implements MigrationInterface {
    name = 'Init1760968824751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "strings" ("id" character varying NOT NULL, "value" text NOT NULL, "length" integer NOT NULL, "is_palindrome" boolean NOT NULL, "unique_characters" integer NOT NULL, "word_count" integer NOT NULL, "sha256_hash" character varying NOT NULL, "character_frequency_map" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f5fca1397b8b986634d0de4ec22" UNIQUE ("value"), CONSTRAINT "PK_900739df083fe162525c4efd8b5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "strings"`);
    }

}
