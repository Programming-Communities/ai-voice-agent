import { NextResponse } from "next/server";
import { stackServerApp } from "./stack";

export async function middleware(request) { // Remove ": NextRequest"
    const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.redirect(new URL('/handler/sign-in', request.url));
    }
    return NextResponse.next();
}

export const config = {
    // Route protection logic
    matcher: '/dashboard/:path*',
};
