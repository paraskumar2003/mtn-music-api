import { Connection } from 'mongoose';
import { OnModuleInit } from '@nestjs/common';
export declare class AppService implements OnModuleInit {
    private readonly connection;
    constructor(connection: Connection);
    onModuleInit(): void;
}
