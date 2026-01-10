"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoConfig = void 0;
const getMongoConfig = async (configService) => {
    return {
        uri: configService.get('MONGODB_URI', 'mongodb://localhost:27017/mtn-music'),
    };
};
exports.getMongoConfig = getMongoConfig;
//# sourceMappingURL=mongoose.config.js.map