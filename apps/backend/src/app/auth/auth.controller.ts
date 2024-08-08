import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../../user/user.interface';

/**
 * Controller responsible for handling authentication related requests.
 */
@Controller('auth')

/**
 * AuthController class handles authentication related operations.
 */
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    /**
         * Handles the login request.
         * @param user The user object containing login credentials.
         * @returns The result of the login operation.
         */
    @Get('login')
    login(user: User) {

        return this.authService.login(user);
    }

    /**
     * Handles the register request.
     *
     * @returns A string indicating the register response.
     */
    @Get('create')
    register(user: User) {
        return this.authService.create(user);
    }
}