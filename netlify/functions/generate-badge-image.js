import { Resvg } from "@resvg/resvg-js";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Badge mapping
const BADGE_MAP = {
    "code_cadet": { key: "code_cadet", name: "Code Cadet" },
    "algo_assassin": { key: "algo_assassin", name: "Algo Assassin" },
    "pattern_hunter": { key: "pattern_hunter", name: "Pattern Hunter" },
    "dsa_dhurandhar": { key: "dsa_dhurandhar", name: "DSA Dhurandhar" },
};

export async function generateAndUploadBadgeImage({
    user_id,
    badge_key,
    username = "user",
    earned_count = 0,
    total_badges = 4,
}) {
    try {
        console.log(`🎨 Generating badge image for ${username} - ${badge_key}`);

        const badgeInfo = BADGE_MAP[badge_key] || { key: badge_key, name: badge_key };

        // Get __dirname from import.meta.url
        const __dirname = path.dirname(fileURLToPath(import.meta.url));

        // Load the badge image from /public/badges/{key}.png
        const badgePath = path.join(__dirname, `./assets/badges/${badgeInfo.key}.webp`);
        console.log("📂 __dirname:", __dirname);
        console.log("📂 badgePath:", badgePath);
        console.log("📂 exists:", fs.existsSync(badgePath));
        if (!fs.existsSync(badgePath)) {
            console.warn(`⚠️  Badge image not found: ${badgePath}`);
            return null;
        }

        // Read the badge image and convert to base64 for embedding in SVG
        const badgeImageBuffer = fs.readFileSync(badgePath);
        const badgeImageBase64 = badgeImageBuffer.toString('base64');
        const badgeDataUrl = `data:image/png;base64,${badgeImageBase64}`;

        // Load and convert the logo from /public/bl-logo.webp to PNG
        const logoPath = path.join(__dirname, `./assets/logo/bl-logo.webp`);
        let logoDataUrl = null;

        if (fs.existsSync(logoPath)) {
            try {
                // Use sharp to convert WebP to PNG
                const logoPngBuffer = await sharp(logoPath).png().toBuffer();
                const logoImageBase64 = logoPngBuffer.toString('base64');
                logoDataUrl = `data:image/png;base64,${logoImageBase64}`;
            } catch (error) {
                console.warn(`⚠️  Failed to convert logo: ${error.message}`);
            }
        }

        // Create SVG with the badge image + dynamic username
        const svg = `
            <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
                <!-- Background gradient -->
                <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="1200" height="630" fill="url(#bgGradient)"/>
                
                <!-- Logo/Title in top left -->
                <g>
                    ${logoDataUrl ? `<image x="40" y="35" width="70" height="70" href="${logoDataUrl}" />` : ''}
                    <text x="${logoDataUrl ? 125 : 60}" y="80" font-size="32" font-family="Arial, sans-serif" fill="white" opacity="0.9" font-weight="bold">
                        ShashCode
                    </text>
                </g>
                
                <!-- Badge Image (centered) -->
                <image x="425" y="80" width="350" height="350" href="${badgeDataUrl}" />
                
                <!-- Username below badge -->
                <text x="600" y="480" font-size="48" font-family="Arial, sans-serif" fill="white" text-anchor="middle" font-weight="bold">
                    @${escapeXml(username)}
                </text>
                
                <!-- Keep grinding text -->
                <text x="600" y="560" font-size="36" font-family="Arial, sans-serif" fill="white" opacity="0.8" text-anchor="middle">
                    Keep grinding DSA 💪
                </text>
            </svg>
        `;

        // Render SVG to PNG
        const resvg = new Resvg(svg);
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();

        // Generate filename: (user_id)-(badge_key)-timestamp.png
        const timestamp = Date.now();
        const filename = `${user_id}/${badge_key}-${timestamp}.png`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("badge-images")
            .upload(filename, pngBuffer, {
                contentType: "image/png",
                upsert: false,
            });

        if (error) {
            console.error("❌ Upload failed:", error);
            return null;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from("badge-images")
            .getPublicUrl(filename);

        const publicUrl = publicUrlData?.publicUrl;

        if (!publicUrl) {
            console.error("❌ Failed to get public URL");
            return null;
        }

        console.log(`✅ Badge image uploaded: ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error(`❌ Error generating badge image:`, error);
        return null;
    }
}

// Helper to safely escape XML special characters in SVG text
function escapeXml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

// Export as Netlify function for on-demand generation
export async function handler(event) {
    const { user_id, badge_key, username = "user", earned_count = 0, total_badges = 4 } = event.queryStringParameters || {};

    if (!user_id || !badge_key) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "user_id and badge_key required" }),
        };
    }

    const imageUrl = await generateAndUploadBadgeImage({
        user_id,
        badge_key,
        username,
        earned_count: parseInt(earned_count),
        total_badges: parseInt(total_badges),
    });

    if (!imageUrl) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate badge image" }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ url: imageUrl }),
    };
}
