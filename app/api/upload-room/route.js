import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    let { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // If image is a local path (e.g. "3d/washroom.webp", "/3d/washroom.webp", "http://localhost:3000/3d/washroom.webp")
    if (!image.startsWith("data:image")) {
      let relativePath = image;
      if (image.startsWith("http://") || image.startsWith("https://")) {
        try {
          const urlObj = new URL(image);
          if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") {
            relativePath = urlObj.pathname;
          }
        } catch (e) {}
      }

      if (!relativePath.startsWith("http://") && !relativePath.startsWith("https://")) {
        const cleanPath = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;
        const localFilePath = path.join(process.cwd(), "public", cleanPath);

        if (fs.existsSync(localFilePath)) {
          const fileBuffer = fs.readFileSync(localFilePath);
          const ext = path.extname(cleanPath).replace(".", "").toLowerCase() || "jpeg";
          const mimeType = ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg";
          image = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
        }
      }
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_API_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const apiKey =
      process.env.CLOUDINARY_API_KEY ||
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    const apiSecret =
      process.env.CLOUDINARY_API_SECRET ||
      process.env.CLOUDINARY_SECRET ||
      process.env.CLOUDINARY_SECRET_KEY;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary Env Vars Missing:", {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret,
      });
      return NextResponse.json(
        {
          error: "Cloudinary environment variables missing in .env",
          found: { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret },
        },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    // Cloudinary signature format: timestamp=<timestamp><api_secret>
    const strToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Cloudinary API Upload Error:", errText);
      return NextResponse.json(
        { error: "Cloudinary upload failed", details: errText },
        { status: 500 }
      );
    }

    const uploadData = await uploadRes.json();
    return NextResponse.json({ url: uploadData.secure_url });
  } catch (err) {
    console.error("Server upload-room error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
