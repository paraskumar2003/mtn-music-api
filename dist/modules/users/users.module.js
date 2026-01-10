"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const otp_entity_1 = require("./entities/otp.entity");
const idempotency_module_1 = require("../../idempotency/key-guard/idempotency.module");
const mongo_user_controller_1 = require("./controllers/mongo-user.controller");
const mongo_user_service_1 = require("./services/mongo-user.service");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schema/user.schema");
const otp_schema_1 = require("./schema/otp.schema");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            idempotency_module_1.IdempotencyModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.MongoUser.name, schema: user_schema_1.MongoUserSchema },
                { name: otp_entity_1.Otp.name, schema: otp_schema_1.OtpSchema },
            ]),
        ],
        controllers: [mongo_user_controller_1.MongoUsersController],
        providers: [mongo_user_service_1.MongoUsersService],
        exports: [mongo_user_service_1.MongoUsersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map