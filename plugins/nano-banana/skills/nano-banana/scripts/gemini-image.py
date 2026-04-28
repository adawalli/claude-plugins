#!/usr/bin/env python3
"""Generate or edit images via the Gemini REST API. Uses only stdlib - no pip installs needed."""

import argparse
import base64
import json
import os
import sys
import urllib.request
import urllib.error

API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

MIME_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
}


def build_payload(prompt, input_path, aspect, size):
    parts = [{"text": prompt}]

    if input_path:
        with open(input_path, "rb") as f:
            image_b64 = base64.b64encode(f.read()).decode("utf-8")
        ext = os.path.splitext(input_path)[1].lower()
        mime = MIME_TYPES.get(ext, "image/png")
        parts.append({"inline_data": {"mime_type": mime, "data": image_b64}})

    return {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {
                "aspectRatio": aspect,
                "imageSize": size,
            },
        },
    }


def call_api(model, api_key, payload):
    url = f"{API_BASE}/{model}:generateContent"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"API error {e.code}: {body}", file=sys.stderr)
        sys.exit(1)


def extract_results(result, output_path):
    text_parts = []
    image_saved = False

    for candidate in result.get("candidates", []):
        for part in candidate.get("content", {}).get("parts", []):
            if "inlineData" in part:
                img_bytes = base64.b64decode(part["inlineData"]["data"])
                with open(output_path, "wb") as f:
                    f.write(img_bytes)
                image_saved = True
                size_kb = len(img_bytes) / 1024
                print(f"Saved {output_path} ({size_kb:.0f} KB)")
            elif "text" in part:
                text_parts.append(part["text"])

    if text_parts:
        print("\n".join(text_parts))

    if not image_saved:
        print("No image returned in response", file=sys.stderr)
        print(json.dumps(result, indent=2), file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Gemini Nano Banana image generation")
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--output", required=True, help="Output file path")
    parser.add_argument("--input", help="Source image path (for editing)")
    parser.add_argument("--aspect", default="1:1", help="Aspect ratio: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9")
    parser.add_argument("--size", default="2K", help="Image size: 512, 1K, 2K, 4K")
    parser.add_argument("--model", default="gemini-3-pro-image-preview")
    args = parser.parse_args()

    api_key = os.environ.get("NANO_BANANA_API_KEY")
    if not api_key:
        print("NANO_BANANA_API_KEY is not set", file=sys.stderr)
        sys.exit(1)

    payload = build_payload(args.prompt, args.input, args.aspect, args.size)
    result = call_api(args.model, api_key, payload)
    extract_results(result, args.output)


if __name__ == "__main__":
    main()
