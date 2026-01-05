import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals
    '/((?!_next|.*\\..*).*)',

    // Protect API routes except uploadthing
    '/api((?!/uploadthing).*)',
  ],
};