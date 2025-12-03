import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnHumanizeApi = req.nextUrl.pathname.startsWith("/api/humanize")

    // Protect /api/humanize endpoint
    if (isOnHumanizeApi && !isLoggedIn) {
        return NextResponse.json(
            { error: "Unauthorized. Please sign in to use the humanize feature." },
            { status: 401 }
        )
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
