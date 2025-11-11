import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
    constructor(@InjectConnection() private readonly connection: Connection) {}

    onModuleInit() {
        if (this.connection.readyState)
            console.log('✅ MongoDB connected successfully');

        this.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
        });

        this.connection.on('error', err => {
            console.error('❌ MongoDB connection error:', err);
        });

        this.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });
    }
}
