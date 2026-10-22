/**
 * - `loading`: the stored session hasn't been read yet (the splash is still up).
 * - `signed-out`: no session, or one whose access check is still running or
 *   came back denied. The sign-in screen stays up through the check.
 * - `signed-in`: the root layout's `Stack.Protected` opens the app.
 */
export type AuthStatus = "loading" | "signed-out" | "signed-in";
