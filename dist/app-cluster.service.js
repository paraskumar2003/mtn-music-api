"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppClusterService = void 0;
const cluster = require("cluster");
const os = require("os");
const common_1 = require("@nestjs/common");
const numCPUs = os.cpus().length;
let AppClusterService = class AppClusterService {
    static clusterize(callback) {
        const clusterTyped = cluster;
        if (clusterTyped.isPrimary) {
            console.log(`Master server started on ${process.pid}`);
            for (let i = 0; i < numCPUs; i++) {
                clusterTyped.fork();
            }
            clusterTyped.on('exit', (worker, code, signal) => {
                console.log(`Worker ${worker.process.pid} died. Restarting`);
                clusterTyped.fork();
            });
        }
        else {
            console.log(`Cluster server started on ${process.pid}`);
            callback();
        }
    }
};
exports.AppClusterService = AppClusterService;
exports.AppClusterService = AppClusterService = __decorate([
    (0, common_1.Injectable)()
], AppClusterService);
//# sourceMappingURL=app-cluster.service.js.map