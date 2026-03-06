import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/profile(.*)',          // public handyman profiles
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jinja2|ico|webp|avif|jpg|jpeg|gif|png|svg|ttf|woff2?|mp4|mp3|wav|pdf|xml|zip|gz)).*)',
    '/(api|trpc)(.*)',
  ],
};
