import { CanActivate, ExecutionContext } from '@nestjs/common';
import { KeyLockService } from './key-lock.service';
export declare class KeyLockGuard implements CanActivate {
    private keyLockService;
    constructor(keyLockService: KeyLockService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
