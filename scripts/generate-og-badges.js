import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📋 Badge IDs with their file keys (matching BadgesModal.jsx)
const BADGE_IDS = [
    { name: "Code Cadet", key: "code_cadet" },
    { name: "Algo Assassin", key: "algo_assassin" },
    { name: "Pattern Hunter", key: "pattern_hunter" },
    { name: "DSA Dhurandhar", key: "dsa_dhurandhar" },
    { name: "Java Pro", key: "java_pro" },
];

async function generateBadgeImage(badge, username = "user", score = "0/0") {
    try {
        // Load the badge image from /public/badges/{key}.png (use PNG for SVG compatibility)
        const badgePath = path.join(__dirname, `../public/badges/${badge.key}.png`);
        
        if (!fs.existsSync(badgePath)) {
            console.warn(`⚠️  Badge image not found: ${badgePath}`);
            return null;
        }
        
        // Read the badge image and convert to base64 for embedding in SVG
        const badgeImageBuffer = fs.readFileSync(badgePath);
        const badgeImageBase64 = badgeImageBuffer.toString('base64');
        const badgeDataUrl = `data:image/png;base64,${badgeImageBase64}`;
        
        // Load and convert the logo from /public/bl-logo.webp to PNG
        const logoPath = path.join(__dirname, `../public/bl-logo.webp`);
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
        
        // Create SVG with the badge image + text
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
                    @${username}
                </text>
                
                <!-- Keep grinding text -->
                <text x="600" y="560" font-size="36" font-family="Arial, sans-serif" fill="white" opacity="0.8" text-anchor="middle">
                    Keep grinding DSA 💪
                </text>
            </svg>
        `;

        const resvg = new Resvg(svg);
        const pngData = resvg.render();
        return pngData.asPng();
    } catch (error) {
        console.error(`Failed to generate image for badge "${badge.name}":`, error.message);
        return null;
    }
}

async function generateAllBadges() {
    console.log("🎨 Generating OG badge images...");

    // Create cache directory if it doesn't exist
    const cacheDir = path.join(__dirname, "../public/og-badge-cache");
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log(`✅ Created cache directory: ${cacheDir}`);
    }

    let generated = 0;
    let failed = 0;

    for (const badge of BADGE_IDS) {
        console.log(`⏳ Generating: ${badge.name}...`);

        const pngBuffer = await generateBadgeImage(badge);
        if (!pngBuffer) {
            failed++;
            console.log(`❌ Failed: ${badge.name}`);
            continue;
        }

        // Use the badge key to create filename
        const filename = `${badge.key}.png`;
        const filePath = path.join(cacheDir, filename);

        fs.writeFileSync(filePath, pngBuffer);
        console.log(`✅ Saved: ${filename}`);
        generated++;
    }

    console.log(`\n📊 Badge Generation Summary:`);
    console.log(`✅ Generated: ${generated}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📁 Location: ${cacheDir}`);
    console.log(`\n✨ All badges are now cached and will be served instantly!`);
}

// Run the generator
generateAllBadges().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
