"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const redis_controller_1 = require("./redis.controller");
describe('RedisController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [redis_controller_1.RedisController],
        }).compile();
        controller = module.get(redis_controller_1.RedisController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=redis.controller.spec.js.map