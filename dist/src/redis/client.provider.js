"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClientProvider = exports.REDIS_CLIENT_TOKEN = void 0;
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
exports.REDIS_CLIENT_TOKEN = 'REDIS_CLIENT_TOKEN';
exports.redisClientProvider = {
    provide: exports.REDIS_CLIENT_TOKEN,
    useFactory: (configService) => {
        const client = new ioredis_1.default({
            host: configService.get('REDIS_HOST', 'localhost'),
            port: +configService.get('REDIS_PORT', 6379),
        });
        client.on('error', err => {
            console.error('Redis Client Connection Error:', err);
        });
        client.on('ready', () => {
            console.log('Redis client connection ready', configService.get('REDIS_HOST'));
        });
        return client;
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=client.provider.js.map