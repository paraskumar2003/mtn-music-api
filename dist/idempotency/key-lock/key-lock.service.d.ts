import { KeyLockServiceInterface } from './interfaces';
import { RedisService } from 'src/redis/redis.service';
export declare class KeyLockService implements KeyLockServiceInterface {
    private readonly redisService;
    constructor(redisService: RedisService);
    lock(key: string, ttl?: number): Promise<void>;
    release(key: string): Promise<void>;
    wait(key: string): Promise<void>;
}
