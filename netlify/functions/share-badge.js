export async function handler(event) {
    const {
        id = "Badge",
        username = "user",
        score = "0/0",
        user_id,
    } = event.queryStringParameters || {};

    console.log("🔍 [share-badge] Request received");
    console.log("📋 Query Parameters:", {
        id,
        username,
        score,
        user_id
    });

    const siteUrl = "https://dev-shashcode.netlify.app/";

    // Try to retrieve stored image from Supabase
    let imageUrl = null;
    
    if (user_id && id) {
        // Map badge name to key
        const badgeKey = id.toLowerCase().replace(/\s+/g, "_");
        
        console.log("🔑 Badge Key generated:", badgeKey);
        console.log("🗄️ Attempting to retrieve from Supabase...");
        
        try {
            const { createClient } = await import("@supabase/supabase-js");
            const supabase = createClient(
                process.env.VITE_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            );
            
            console.log("✅ Supabase client initialized");
            
            const { data, error } = await supabase
                .from("user_badges")
                .select("og_image_url")
                .eq("user_id", user_id)
                .eq("badge_key", badgeKey)
                .order("earned_at", { ascending: false })
                .limit(1)
                .single();
            
            if (error) {
                console.warn("⚠️ Supabase query error:", error.message);
            }
            
            if (data?.og_image_url) {
                imageUrl = data.og_image_url;
                console.log("✅ Retrieved stored badge image from Supabase");
                console.log("🖼️ Image URL:", imageUrl);
            } else {
                console.warn("⚠️ No stored image found in Supabase for this badge");
            }
        } catch (error) {
            console.warn("⚠️ Failed to retrieve badge image:", error.message);
            console.error("❌ Full error:", error);
        }
    } else {
        console.warn("⚠️ Missing user_id or id - skipping Supabase lookup");
    }
    
    // Fallback: Use dynamic generation endpoint if no stored image
    if (!imageUrl) {
        imageUrl = `${siteUrl}.netlify/functions/cache-og-badge?id=${encodeURIComponent(id)}&username=${encodeURIComponent(username)}&score=${encodeURIComponent(score)}`;
        console.log("🔄 Using fallback dynamic generation endpoint");
        console.log("📸 Fallback Image URL:", imageUrl);
    }

    console.log("\n========================================");
    console.log("🎯 FINAL IMAGE URL FOR OG META TAG:");
    console.log("📸 URL:", imageUrl);
    console.log("========================================\n");

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

    console.log("📄 HTML Generated with OG meta tags");
    console.log("🎯 OG Image Meta Tag will use:", imageUrl);

    // Log the exact meta tag that will be in the HTML
    console.log(`\n✅ [share-badge] Response ready:`);
    console.log(`   <meta property="og:image" content="${imageUrl}" />`);
    console.log(`   <meta property="og:title" content="I just unlocked ${id} 🚀" />`);
    console.log(`   <meta property="og:description" content="Completed ${score} on ShashCode 💪" />\n`);

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