import { Repository, FindManyOptions, FindOneOptions, FindOptionsWhere, DeepPartial, QueryRunner } from 'typeorm';
import { BaseEntity } from './base.entity';
export declare class BaseService<T extends BaseEntity> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    find(options?: Omit<FindManyOptions<T>, 'where'> & {
        where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    }): Promise<T[]>;
    findOne(options?: Omit<FindOneOptions<T>, 'where'> & {
        where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    }, q?: QueryRunner): Promise<T | null>;
    findAll(options?: Omit<FindManyOptions<T>, 'where'> & {
        where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    }): Promise<T[] | null>;
    findOneBy(conditions: Partial<T>): Promise<T | null>;
    findOneById(id: number | string): Promise<T | null>;
    createInstance(data: DeepPartial<T>, q?: QueryRunner): T;
    saveInstance(entity: T, q?: QueryRunner): Promise<T>;
    private mergeWithActive;
    getRepository(): Repository<T>;
    createQueryBuilder(alias: string): import("typeorm").SelectQueryBuilder<T>;
}
