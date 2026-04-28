---
name: nano-banana
description: "Generate images from text prompts or edit existing images using Google Gemini's Nano Banana Pro model. Use this skill whenever the user wants to create an image, generate a picture, make a visual, create artwork, design graphics, edit a photo, modify an image, update a picture, or add/remove/change elements in an image. Also trigger when the user says 'nano banana', 'generate an image', 'create a picture', 'make me an image', 'edit this image', 'modify this photo', mentions wanting a logo, icon, illustration, diagram rendered as an image, or references image generation or manipulation in any way - even casually like 'can you make a picture of...' or 'what would X look like'."
---

# Nano Banana - Image Generation & Editing

Generate images from text or edit existing images using Google Gemini's Nano Banana models via REST API. No SDKs or pip installs required - just Python 3.6+ and a `GEMINI_API_KEY` in the environment.

## Workflow

### 1. Clarify intent

Figure out whether the user wants to:
- **Generate** a new image from a text description
- **Edit** an existing image (they'll reference a file path or describe an image in the project)

### 2. Ask about quality

Before generating, confirm their preferences. Present these options conversationally - not as a form:

| Setting | Options | Default |
|---------|---------|---------|
| Aspect ratio | 1:1 (square), 16:9 (landscape), 9:16 (portrait), 4:3, 3:4, 21:9 (ultrawide) | 1:1 |
| Image size | 512 (draft/fast), 1K (standard), 2K (high quality), 4K (maximum detail) | 2K |
| Model | Pro (default, best quality) or Flash (faster, lighter) | Pro |

If the context makes the right choice obvious (e.g. a phone wallpaper is clearly 9:16), just confirm rather than asking. Skip the question entirely for quick/casual requests and use sensible defaults.

### 3. Generate

Run the helper script. It lives in `scripts/gemini-image.py` relative to this skill's directory.

**Text-to-image:**
```bash
python3 <this-skill-dir>/scripts/gemini-image.py \
  --prompt "detailed description of the image" \
  --output "descriptive-filename.png" \
  --aspect "1:1" \
  --size "2K"
```

**Edit an existing image:**
```bash
python3 <this-skill-dir>/scripts/gemini-image.py \
  --prompt "what to change about the image" \
  --input "path/to/source.png" \
  --output "edited-version.png" \
  --aspect "1:1" \
  --size "2K"
```

Output files go in the user's current working directory (or wherever they specify).

### 4. Show the result

After the script runs, read the output image file and show it to the user. If they want changes, run another edit pass using the generated image as `--input`.

## Models

| Model | Flag | Best for |
|-------|------|----------|
| **Nano Banana Pro** | `--model gemini-3-pro-image-preview` (default) | Professional quality, complex scenes, text in images |
| **Nano Banana 2** | `--model gemini-3.1-flash-image-preview` | Speed, high-volume, quick iterations |

## Prompt tips

- Be specific: mention style, lighting, composition, colors, mood
- For edits, describe what should change and what should stay the same
- The model handles text rendering well - include exact text you want in the image
- Reference art styles, time periods, or visual aesthetics for more control
- For iterative refinement, use the previous output as `--input` with a refinement prompt

## Requirements

- `NANO_BANANA_API_KEY` environment variable
- Python 3.6+ (stdlib only, no dependencies)
