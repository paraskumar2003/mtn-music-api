import { Body, Controller, Post } from '@nestjs/common';
import { MongoUsersService } from '../services/mongo-user.service';
import { RegisterUserDto } from '../dto/create-mongo-user.dto';

@Controller('mongo-users')
export class MongoUsersController {
    constructor(private readonly mongoUsersService: MongoUsersService) {}

    @Post('register')
    async register(
        @Body()
        body: RegisterUserDto,
    ) {
        const user = await this.mongoUsersService.registerUser(body);
        return { access_token: user.access_token };
    }
}
