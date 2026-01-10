import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
export declare class CustomAuthGuard extends JwtAuthGuard {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
