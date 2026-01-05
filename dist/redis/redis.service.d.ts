import { OnModuleDestroy } from '@nestjs/common';
import { IRedisClient } from './interfaces/client.interface';
export declare class RedisService implements OnModuleDestroy {
    private readonly client;
    constructor(client: IRedisClient);
    onModuleDestroy(): Promise<void>;
    get(key: string): Promise<string>;
    set(key: string, value: string, options?: 'EX' | 'PX', ttl?: number): Promise<string>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
}
