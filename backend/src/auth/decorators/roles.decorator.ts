// Create a NEW file, for example at `src/auth/roles.decorator.ts`

import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


// **How it works:** This simple file creates a decorator named `Roles`. When you use it like `@Roles(Role.Admin)`, it attaches the metadata `['admin']` to that specific route, which our guard will be able to read later.


// You have now created the foundational pieces. The next step is to build the actual `RolesGuard` that will use these pieces to perform the authorization check.

// Please let me know once you have created these two new files, and we will proceed to build the guard itse
