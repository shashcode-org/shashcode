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
    id = "Badge",
    username = "user",
    score = "0/0",
    user_id = "",
    t = Date.now().toString(),
  } = event.queryStringParameters || {};

  const siteUrl = getSiteUrl(event);

  console.log("[share-badge] Request received", {
    id,
    username,
    score,
    user_id,
    siteUrl,
    t,
  });

  const imageUrl =
    `${siteUrl}/.netlify/functions/cache-og-badge` +
    `?id=${encodeURIComponent(id)}` +
    `&username=${encodeURIComponent(username)}` +
    `&score=${encodeURIComponent(score)}` +
    `&t=${encodeURIComponent(t)}`;

  const fullShareUrl =
    `${siteUrl}/.netlify/functions/share-badge` +
    `?id=${encodeURIComponent(id)}` +
    `&username=${encodeURIComponent(username)}` +
    `&score=${encodeURIComponent(score)}` +
    `&user_id=${encodeURIComponent(user_id)}` +
    `&t=${encodeURIComponent(t)}`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="I just unlocked ${escapeMeta(id)}" />
      <meta property="og:description" content="Completed ${escapeMeta(score)} on ShashCode" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:url" content="${fullShareUrl}" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ShashCode" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="I just unlocked ${escapeMeta(id)}" />
      <meta name="twitter:description" content="Completed ${escapeMeta(score)} on ShashCode" />
      <meta name="twitter:image" content="${imageUrl}" />
      <title>ShashCode - ${escapeMeta(id)}</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: system-ui, sans-serif; background: #0f172a; color: white;">
      <h1>ShashCode Badge</h1>
      <p>You just unlocked: <strong>${escapeMeta(id)}</strong></p>
      <p>Score: ${escapeMeta(score)}</p>
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
