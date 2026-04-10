import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

// Badge mapping for URL parameters to file keys
const BADGE_MAP = {
    "code_cadet": { key: "code_cadet", name: "Code Cadet" },
    "algo_assassin": { key: "algo_assassin", name: "Algo Assassin" },
    "pattern_hunter": { key: "pattern_hunter", name: "Pattern Hunter" },
    "dsa_dhurandhar": { key: "dsa_dhurandhar", name: "DSA Dhurandhar" },
};

// ✅ This function generates OG badges on-demand with actual username
// Called when a user shares a badge via share-badge endpoint
// Generates and caches with real username in the image

export async function handler(event) {
    const {
        id = "Badge",
        username = "user",
        score = "0/0",
    } = event.queryStringParameters || {};

    console.log("🖼️ [cache-og-badge] Generating dynamic badge image");
    console.log("📋 Parameters:", { id, username, score });

    try {
        // Map the badge ID to our badge key
        const badgeInfo = BADGE_MAP[id] || { key: id.toLowerCase().replace(/\s+/g, "_"), name: id };
        
        console.log("🔑 Badge Info:", { badgeKey: badgeInfo.key, badgeName: badgeInfo.name });
        
        // Load the badge image from /public/badges/{key}.png
        const badgePath = path.join(process.cwd(), `netlify/functions/assets/badges/${badgeInfo.key}.png`);
        console.log("📂 Looking for badge at:", badgePath);
        
        if (!fs.existsSync(badgePath)) {
            console.warn(`⚠️  Badge image not found: ${badgePath}`);
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Badge not found" }),
            };
        }
        
        console.log("✅ Badge image found");
        
        // Read the badge image and convert to base64 for embedding in SVG
        const badgeImageBuffer = fs.readFileSync(badgePath);
        const badgeImageBase64 = badgeImageBuffer.toString('base64');
        const badgeDataUrl = `data:image/png;base64,${badgeImageBase64}`;
        
        console.log("🔄 Badge converted to base64 data URL");
        
        // Load and convert the logo from /public/bl-logo.webp to PNG
        const logoPath = path.join(process.cwd(), `netlify/functions/assets/logo/bl-logo.webp`);
        let logoDataUrl = null;
        
        if (fs.existsSync(logoPath)) {
            try {
                console.log("📂 Logo found at:", logoPath);
                // Use sharp to convert WebP to PNG
                const logoPngBuffer = await sharp(logoPath).png().toBuffer();
                const logoImageBase64 = logoPngBuffer.toString('base64');
                logoDataUrl = `data:image/png;base64,${logoImageBase64}`;
                console.log("✅ Logo converted successfully");
            } catch (error) {
                console.warn(`⚠️  Failed to convert logo: ${error.message}`);
            }
        } else {
            console.warn("⚠️  Logo not found at:", logoPath);
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

        const resvg = new Resvg(svg);
        console.log("🎨 SVG rendered with Resvg");
        
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();

        console.log("✅ PNG buffer generated successfully");
        console.log("📏 Image size:", pngBuffer.length, "bytes");

        console.log("\n========================================");
        console.log("✅ [cache-og-badge] SUCCESS - Badge image generated");
        console.log("🎯 Badge ID:", id);
        console.log("👤 Username:", username);
        console.log("📏 Final image size:", pngBuffer.length, "bytes");
        console.log("========================================\n");

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=2592000, immutable",
                // 30-day cache for browser + CDN
                "X-Badge-ID": id,
                "X-Username": username,
            },
            body: pngBuffer.toString("base64"),
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error("❌ Error generating badge:", error);
        console.error("📌 Error stack:", error.stack);

        console.log("\n========================================");
        console.log("❌ [cache-og-badge] FAILED - Error during badge generation");
        console.log("🎯 Badge ID:", id);
        console.log("👤 Username:", username);
        console.log("❌ Error:", error.message);
        console.log("========================================\n");

        // Fallback: Return 500 if generation fails
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate badge" }),
        };
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
