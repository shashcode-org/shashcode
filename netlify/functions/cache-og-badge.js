import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const BADGE_MAP = {
  code_cadet: { key: "code_cadet", name: "Code Cadet" },
  algo_assassin: { key: "algo_assassin", name: "Algo Assassin" },
  pattern_hunter: { key: "pattern_hunter", name: "Pattern Hunter" },
  dsa_dhurandhar: { key: "dsa_dhurandhar", name: "DSA Dhurandhar" },
  java_pro: { key: "java_pro", name: "Java Pro" },
};

function getResvgOptions() {
  return {
    font: {
      loadSystemFonts: false,
      defaultFontFamily: "Arial",
      fontFiles: [
        path.join(process.cwd(), "netlify/functions/assets/fonts/arial.ttf"),
        path.join(process.cwd(), "netlify/functions/assets/fonts/arialbd.ttf"),
      ],
    },
  };
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildBadgeVisual(badgeInfo, badgeDataUrl) {
  if (badgeDataUrl) {
    return `<image x="425" y="80" width="350" height="350" href="${badgeDataUrl}" />`;
  }

  return `
    <circle cx="600" cy="255" r="150" fill="#1d4ed8" opacity="0.18" />
    <circle cx="600" cy="255" r="130" fill="none" stroke="#60a5fa" stroke-width="6" />
    <text x="600" y="235" font-size="44" font-family="Arial, sans-serif" fill="white" text-anchor="middle" font-weight="bold">
      ${escapeXml(badgeInfo.name)}
    </text>
    <text x="600" y="290" font-size="26" font-family="Arial, sans-serif" fill="#bfdbfe" text-anchor="middle">
      Special Badge
    </text>
  `;
}

export async function handler(event) {
  const { id = "Badge", username = "user" } = event.queryStringParameters || {};

  try {
    const badgeInfo =
      BADGE_MAP[id] || { key: id.toLowerCase().replace(/\s+/g, "_"), name: id };

    const badgePath = path.join(
      process.cwd(),
      `netlify/functions/assets/badges/${badgeInfo.key}.png`
    );

    let badgeDataUrl = null;
    if (fs.existsSync(badgePath)) {
      const badgeImageBuffer = fs.readFileSync(badgePath);
      badgeDataUrl = `data:image/png;base64,${badgeImageBuffer.toString("base64")}`;
    } else {
      console.warn(`Badge image not found: ${badgePath}. Using text fallback.`);
    }

    const logoPath = path.join(
      process.cwd(),
      "netlify/functions/assets/logos/bl-logo.webp"
    );
    let logoDataUrl = null;

    if (fs.existsSync(logoPath)) {
      try {
        const logoPngBuffer = await sharp(logoPath).png().toBuffer();
        logoDataUrl = `data:image/png;base64,${logoPngBuffer.toString("base64")}`;
      } catch (error) {
        console.warn(`Failed to convert logo: ${error.message}`);
      }
    }

    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bgGradient)"/>
        <g>
          ${logoDataUrl ? `<image x="40" y="35" width="70" height="70" href="${logoDataUrl}" />` : ""}
          <text x="${logoDataUrl ? 125 : 60}" y="80" font-size="32" font-family="Arial, sans-serif" fill="white" opacity="0.9" font-weight="bold">
            ShashCode
          </text>
        </g>
        ${buildBadgeVisual(badgeInfo, badgeDataUrl)}
        <text x="600" y="480" font-size="48" font-family="Arial, sans-serif" fill="white" text-anchor="middle" font-weight="bold">
          @${escapeXml(username)}
        </text>
        <text x="600" y="560" font-size="36" font-family="Arial, sans-serif" fill="white" opacity="0.8" text-anchor="middle">
          Keep grinding DSA
        </text>
      </svg>
    `;

    const pngBuffer = new Resvg(svg, getResvgOptions()).render().asPng();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=2592000, immutable",
        "X-Badge-ID": id,
        "X-Username": username,
      },
      body: pngBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Error generating badge:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate badge" }),
    };
  }
}
