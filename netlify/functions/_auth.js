import jwt from "jsonwebtoken";

export function getUserIdFromRequest(event) {
  const authHeader = event.headers.authorization;

  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }

  const token = authHeader.replace("Bearer ", "");

  const decoded = jwt.decode(token);

  if (!decoded || !decoded.sub) {
    throw new Error("Invalid token");
  }

  return decoded.sub; // ✅ REAL USER ID
}
