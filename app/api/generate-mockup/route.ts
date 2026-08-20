import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const VALID_FILENAME = /^[a-zA-Z0-9_.-]+\.(png|jpg|jpeg)$/;

function dataUrlToBuffer(dataUrl: string): Buffer {
  const commaIndex = dataUrl.indexOf(",");
  const base64 = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
  return Buffer.from(base64, "base64");
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "The server isn't configured with an OpenAI API key yet." },
      { status: 500 }
    );
  }

  let body: {
    logoDataUrl?: string;
    productImage?: string;
    prompt?: string;
    baseImageDataUrl?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { logoDataUrl, productImage, prompt, baseImageDataUrl } = body;
  const client = new OpenAI();

  try {
    let images: File[];
    let finalPrompt: string;

    if (baseImageDataUrl) {
      // Follow-up refinement of a previously generated mockup.
      if (!prompt || !prompt.trim()) {
        return NextResponse.json({ error: "Describe the change you'd like." }, { status: 400 });
      }
      const buf = dataUrlToBuffer(baseImageDataUrl);
      images = [new File([new Uint8Array(buf)], "previous.png", { type: "image/png" })];
      finalPrompt =
        "Edit this product mockup photo as follows: " +
        prompt.trim() +
        ". Keep the logo's text and shape accurate and undistorted, and keep the product itself unchanged.";
    } else {
      if (!logoDataUrl || !productImage) {
        return NextResponse.json({ error: "Missing logo or product." }, { status: 400 });
      }
      if (!VALID_FILENAME.test(productImage)) {
        return NextResponse.json({ error: "Invalid product image." }, { status: 400 });
      }
      const productPath = path.join(process.cwd(), "public", productImage);
      let productBuf: Buffer;
      try {
        productBuf = await readFile(productPath);
      } catch {
        return NextResponse.json({ error: "Product image not found." }, { status: 400 });
      }
      const logoBuf = dataUrlToBuffer(logoDataUrl);

      images = [
        new File([new Uint8Array(productBuf)], "product.png", { type: "image/png" }),
        new File([new Uint8Array(logoBuf)], "logo.png", { type: "image/png" }),
      ];
      finalPrompt =
        "The first image is a product photo. The second image is a brand logo. " +
        "Create a professional, photorealistic product mockup: place the logo naturally onto the product " +
        "from the first image, sized and positioned the way a real branded product would look, in front of " +
        "a plain, clean studio background. Keep the logo's text and shape completely accurate — do not " +
        "distort, redraw, or reinterpret it." +
        (prompt && prompt.trim() ? ` Additional instructions: ${prompt.trim()}` : "");
    }

    const result = await client.images.edit({
      model: "gpt-image-1",
      image: images,
      prompt: finalPrompt,
      size: "1024x1024",
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json({ error: "No image came back from the model." }, { status: 502 });
    }

    return NextResponse.json({ image: `data:image/png;base64,${b64}` });
  } catch (err: unknown) {
    console.error("generate-mockup error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong generating the mockup.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
