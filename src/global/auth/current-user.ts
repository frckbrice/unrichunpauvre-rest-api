import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        // ensure @CurrentUser() safely handles cases where req.user is missing.
        return request.user ?? null; // Return `null` if no user is found
    },
);
