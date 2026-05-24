import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getUserFromCookie() {
  const cookieStore = await cookies(); //  FIX (important in Next 15+)

  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  return verifyToken(token);
}