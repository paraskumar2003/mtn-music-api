import { RedisService } from 'src/redis/redis.service';
export declare class IdempotencyService {
    private readonly redisService;
    constructor(redisService: RedisService);
    private readonly EXPIRY_TIME;
    isProcessed(key: string): Promise<boolean>;
    markAsProcessed(key: string, data: any): Promise<void>;
    getProcessedData(key: string): Promise<any>;
}
