export async function handler(event) {
    const {
        id = "Badge",
        username = "user",
        score = "0/0",
        user_id,
    } = event.queryStringParameters || {};

    const siteUrl = "https://dev-shashcode.netlify.app/";

    // Try to retrieve stored image from Supabase
    let imageUrl = null;
    
    if (user_id && id) {
        // Map badge name to key
        const badgeKey = id.toLowerCase().replace(/\s+/g, "_");
        
        try {
            const { createClient } = await import("@supabase/supabase-js");
            const supabase = createClient(
                process.env.VITE_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            );
            
            const { data } = await supabase
                .from("user_badges")
                .select("og_image_url")
                .eq("user_id", user_id)
                .eq("badge_key", badgeKey)
                .order("earned_at", { ascending: false })
                .limit(1)
                .single();
            
            if (data?.og_image_url) {
                imageUrl = data.og_image_url;
                console.log("✅ Retrieved stored badge image:", imageUrl);
            }
        } catch (error) {
            console.warn("⚠️ Failed to retrieve badge image:", error.message);
        }
    }
    
    // Fallback: Use dynamic generation endpoint if no stored image
    if (!imageUrl) {
        imageUrl = `${siteUrl}.netlify/functions/cache-og-badge?id=${encodeURIComponent(id)}&username=${encodeURIComponent(username)}&score=${encodeURIComponent(score)}`;
    }

    const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <!-- ✅ Open Graph Tags - Optimized for LinkedIn/Twitter -->
      <meta property="og:title" content="I just unlocked ${escapeMeta(id)} 🚀" />
      <meta property="og:description" content="Completed ${escapeMeta(score)} on ShashCode 💪" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:url" content="${siteUrl}share-badge?id=${encodeURIComponent(id)}" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ShashCode" />

      <!-- ✅ Twitter Card Tags -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="I just unlocked ${escapeMeta(id)} 🚀" />
      <meta name="twitter:description" content="Completed ${escapeMeta(score)} on ShashCode 💪" />
      <meta name="twitter:image" content="${imageUrl}" />
      <meta name="twitter:site" content="@ShashCode" />
      
      <!-- ✅ Performance & SEO -->
      <link rel="preload" as="image" href="${imageUrl}" />
      <title>ShashCode - ${escapeMeta(id)}</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: system-ui, sans-serif; background: #0f172a; color: white;">
      <h1>🎉 ShashCode Badge</h1>
      <p>You just unlocked: <strong>${escapeMeta(id)}</strong></p>
      <p>Score: ${escapeMeta(score)}</p>
      <p>Keep grinding DSA! 💪</p>
    </body>
  </html>
  `;

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            // Cache this page for 1 hour, but images are cached longer in Supabase
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "SAMEORIGIN",
            // Allow crawlers to access this without issues
            "Vary": "Accept-Encoding",
        },
        body: html,
    };
}

// Helper function to safely escape meta tag content
function escapeMeta(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}