"""Build demo GIF from screenshots in docs/."""
import pathlib
from PIL import Image

docs = pathlib.Path(__file__).parent.parent / "docs"

# Find frame PNGs in order
frame_names = ["frame1_hero", "frame2_demo", "frame3_ai"]
frames = []
for name in frame_names:
    p = docs / f"{name}.png"
    if p.exists():
        img = Image.open(str(p)).convert("P", palette=Image.Palette.ADAPTIVE, colors=192)
        frames.append(img)
        print(f"Loaded {p.name} ({img.size})")
    else:
        print(f"WARNING: {p.name} not found, skipping")

if not frames:
    print("No frames found. Run docs/capture.js first.")
    exit(1)

# Durations in centiseconds (100 = 1s)
durations = [250, 350, 300]
out = docs / "demo.gif"
frames[0].save(
    str(out),
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    optimize=True,
    disposal=2,
)
size = out.stat().st_size
print(f"\nCreated {out.name} ({size / 1024:.0f} KB, {len(frames)} frames)")
