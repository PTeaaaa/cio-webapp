### Role Protection Route

## Files that working on it
- ProtectedRoute.tsx
- useRoleProtection.ts
- routeUtils.ts

## [File] routeUtils
This file is a file that we determine permission for the page.

- [Function] ROUTE_PERMISSIONS : Main place that we frequently change code to determine the permission of the page

- [Function] canAccessPath : check parent path, for dynamic route or many children url, e.g. /placeid/mainplace/subplace/asdf-123