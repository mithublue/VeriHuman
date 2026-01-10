'use server'

import { signIn } from "@/auth"

export async function signInWithGoogle() {
    await signIn("google", { redirectTo: "/" })
}

export async function signInWithFacebook() {
    await signIn("facebook", { redirectTo: "/" })
}
