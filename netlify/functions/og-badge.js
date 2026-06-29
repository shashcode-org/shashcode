import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export async function handler(event) {
    const {
        id = "Badge",
        username = "user",
        score = "0/0",
    } = event.queryStringParameters || {};

    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    width: "1200px",
                    height: "630px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "linear-gradient(135deg, #0f172a, #1e293b)",
                    color: "white",
                    fontFamily: "sans-serif",
                },
                children: [
                    {
                        type: "div",
                        props: {
                            children: "🚀 ShashCode",
                            style: {
                                position: "absolute",
                                top: "40px",
                                left: "60px",
                                fontSize: "24px",
                                opacity: 0.8,
                            },
                        },
                    },
                    {
                        type: "div",
                        props: {
                            children: `🏆 ${id}`,
                            style: {
                                fontSize: "64px",
                                fontWeight: "bold",
                                marginBottom: "20px",
                                textAlign: "center",
                            },
                        },
                    },
                    {
                        type: "div",
                        props: {
                            children: `Completed ${score}`,
                            style: {
                                fontSize: "32px",
                                opacity: 0.9,
                                marginBottom: "10px",
                            },
                        },
                    },
                    {
                        type: "div",
                        props: {
                            children: `@${username}`,
                            style: {
                                fontSize: "26px",
                                opacity: 0.7,
                            },
                        },
                    },
                    {
                        type: "div",
                        props: {
                            children: "Keep grinding DSA 💪",
                            style: {
                                position: "absolute",
                                bottom: "40px",
                                fontSize: "20px",
                                opacity: 0.6,
                            },
                        },
                    },
                ],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [], // optional: can add custom fonts later
        }
    );

    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=86400", // caching for speed
        },
        body: pngBuffer.toString("base64"),
        isBase64Encoded: true,
    };
}