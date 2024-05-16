import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/api/webhook',
]);

export default clerkMiddleware((auth, req) => {
  if (auth().userId && isPublicRoute(req)) {
    let path = '/org-select';

    if (auth().orgId) {
      path = `/organization/${auth().orgId}`;
    }

    const orgSelect = new URL(path, req.url);
    return NextResponse.redirect(orgSelect);
  }

  if (!auth().userId && !isPublicRoute(req)) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  if(auth().userId && !auth().orgId && req.nextUrl.pathname !== '/org-select') {
    const orgSelect = new URL('/org-select', req.url);
    return NextResponse.redirect(orgSelect);
  }
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Don't run middleware on static files
    '/', // Run middleware on index page
    '/(api|trpc)(.*)'], // Run middleware on API routes
};