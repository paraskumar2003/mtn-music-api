"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const s3_controller_1 = require("./s3.controller");
describe('S3Controller', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [s3_controller_1.S3Controller],
        }).compile();
        controller = module.get(s3_controller_1.S3Controller);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=s3.controller.spec.js.map