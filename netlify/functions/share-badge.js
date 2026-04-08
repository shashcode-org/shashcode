export async function handler(event) {
    const {
        id = "Badge",
        username = "user",
        score = "0/0",
    } = event.queryStringParameters || {};

    const siteUrl = "https://shashcode.com"; // ⚠️ CHANGE if needed

    const imageUrl = `${siteUrl}/.netlify/functions/og-badge?id=${encodeURIComponent(
        id
    )}&username=${encodeURIComponent(
        username
    )}&score=${encodeURIComponent(score)}`;

    const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta property="og:title" content="I just unlocked ${id} 🚀" />
      <meta property="og:description" content="Completed ${score} on ShashCode 💪" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="I just unlocked ${id} 🚀" />
      <meta name="twitter:description" content="Completed ${score} on ShashCode 💪" />
      <meta name="twitter:image" content="${imageUrl}" />

      <meta http-equiv="refresh" content="0; url=${siteUrl}/badge/${encodeURIComponent(id)}" />
    </head>
    <body>
      Redirecting...
    </body>
  </html>
  `;

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
        },
        body: html,
    };
}