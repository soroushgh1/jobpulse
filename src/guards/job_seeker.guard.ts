import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthRepository } from "src/repositories/auth.repository";
import { UserRole } from "src/enums/enums";

@Injectable()
export class JobSeekerGuard implements CanActivate {
    constructor(
        private readonly userRepo: AuthRepository
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
            const request = context.switchToHttp().getRequest();

            const userId = request.user.id;
    
            const user: User | null = await this.userRepo.findOnId(userId);
    
            if(!user) throw new HttpException('there was a problem in authorization', 400);
    
            if (user.role !== UserRole.jobSeeker && request.user.isAdmin !== true) throw new UnauthorizedException('you do not have job seeker role');
            
            return true
    }
}