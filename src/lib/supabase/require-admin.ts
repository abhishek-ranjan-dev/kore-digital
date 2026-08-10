import { createAuthServerClient } from "./auth-server";

/*
  Server-side admin guard (defense in depth). The proxy gates page navigation,
  but Server Actions are POST endpoints reachable directly — so every mutating
  action re-verifies the caller here. Throws unless the signed-in user is the
  single admin (email === ADMIN_EMAIL).
*/
export async function requireAdmin() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
  return user;
}
