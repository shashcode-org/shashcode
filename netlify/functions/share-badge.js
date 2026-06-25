import { createClient } from "@supabase/supabase-js";

function escapeMeta(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSiteUrl(event) {
  const headers = event.headers || {};
  const host = headers["x-forwarded-host"] || headers.host || "dev-shashcode.netlify.app";
  const protocol = headers["x-forwarded-proto"] || "https";
  return `${protocol}://${host}`;
}

export async function handler(event) {
  const {
    user = "",
    badge = "",
    t = Date.now().toString(),
  } = event.queryStringParameters || {};

  const siteUrl = getSiteUrl(event);

  // Fallback: If someone visits the URL directly without parameters, redirect them to the app
  if (!user || !badge) {
    return {
      statusCode: 302, // 302 Redirect
      headers: { Location: siteUrl },
      body: "Missing user or badge parameters",
    };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Verify that user ACTUALLY owns this badge via secure backend lookup
  const { data: badgeData, error: badgeError } = await supabase
    .from("user_badges")
    .select("metadata, earned_at, og_image_url, badge_name")
    .eq("user_id", user)
    .eq("badge_key", badge) // Search by key instead of spoofable name
    .single();

  if (badgeError || !badgeData) {
    return {
      statusCode: 404,
      body: "Badge not found or not unlocked by this user.",
    };
  }

  const badgeName = badgeData.badge_name || badge;

  // Fetch canonical username securely
  const { data: userMetaRow } = await supabase
    .from("user_meta")
    .select("meta_json")
    .eq("user_id", user)
    .single();

  const { data: authUserData } = await supabase.auth.admin.getUserById(user);
  const authUser = authUserData?.user;
  const canonicalUsername =
    userMetaRow?.meta_json?.username ||
    authUser?.email?.split("@")[0] ||
    "user";

  console.log("[share-badge] Request verified", {
    badge,
    canonicalUsername,
    user,
    siteUrl,
    t,
  });

  // Resolve the Image URL
  // ✅ Use the pre-generated static OG image if it exists in the database record.
  // ✅ If not (due to the race condition), fallback to the on-the-fly generator.
  // This ensures the preview works correctly on the very first click.
  const imageUrl = badgeData.og_image_url || (
    `${siteUrl}/.netlify/functions/cache-og-badge` +
    `?id=${encodeURIComponent(badge)}` + // Use the badge key for consistency
    `&user_id=${encodeURIComponent(user)}`
  );

  const fullShareUrl = 
    `${siteUrl}/badge/${encodeURIComponent(user)}/${encodeURIComponent(badge)}`;

  // Return your original beautiful HTML landing page
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="I just unlocked ${escapeMeta(badgeName)} 🚀" />
      <meta property="og:description" content="Unlocked ${escapeMeta(badgeName)} on ShashCode" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:url" content="${fullShareUrl}" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ShashCode" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="I just unlocked ${escapeMeta(badgeName)} 🚀" />
      <meta name="twitter:description" content="Unlocked ${escapeMeta(badgeName)} on ShashCode" />
      <meta name="twitter:image" content="${imageUrl}" />
      <title>ShashCode - ${escapeMeta(badgeName)}</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: system-ui, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
      <div style="text-align: center; max-width: 800px; width: 100%;">
        <div style="margin-bottom: 30px;">
          <h1 style="margin: 0 0 10px 0; font-size: 2.5rem; font-weight: bold; background: linear-gradient(to right, #3b82f6, #8b5cf6); -webkit-background-clip: text; color: transparent;">Badge Unlocked!</h1>
          <p style="margin: 0; font-size: 1.2rem; color: #cbd5e1;">
            <strong>${escapeMeta(canonicalUsername)}</strong> earned the <strong>${escapeMeta(badgeName)}</strong> badge.
          </p>
        </div>
        
        <img src="${imageUrl}" alt="${escapeMeta(badgeName)} Badge" style="width: 100%; max-width: 600px; height: auto; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2); border: 1px solid #1e293b;" />
        
        <div style="margin-top: 40px;">
          <a href="${siteUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1.1rem; transition: background-color 0.2s;">Explore ShashCode</a>
        </div>
      </div>
    </body>
  </html>
  `;

  console.log("[share-badge] Response ready", {
    imageUrl,
    fullShareUrl,
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      Vary: "Accept-Encoding",
    },
    body: html,
  };
}
