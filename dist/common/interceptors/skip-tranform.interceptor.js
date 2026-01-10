"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipInterceptor = exports.SKIP_INTERCEPTOR = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_INTERCEPTOR = 'SKIP_INTERCEPTOR';
const SkipInterceptor = () => (0, common_1.SetMetadata)(exports.SKIP_INTERCEPTOR, true);
exports.SkipInterceptor = SkipInterceptor;
//# sourceMappingURL=skip-tranform.interceptor.js.map