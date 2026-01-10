import { DataSource, EntityManager, QueryRunner } from 'typeorm';
export declare class DbService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    startTransactionWithQueryRunner(): Promise<{
        queryRunner: QueryRunner;
        manager: EntityManager;
    }>;
    commitAndRelease(queryRunner: QueryRunner): Promise<void>;
    rollbackAndRelease(queryRunner: QueryRunner): Promise<void>;
    createQueryRunner(): QueryRunner;
    connect(queryRunner: QueryRunner): Promise<void>;
    startTransaction(queryRunner: QueryRunner): Promise<void>;
}
