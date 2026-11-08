"""Refined, beautifully animated 4-frame walk cycle for Minh An.
Correct layer order, organic waist curvature, proper proportions,
and seamless blending between torso and trousers.
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PORTRAIT_PATH = ROOT / 'assets' / 'portrait' / 'minh_an_normal.png'
SPRITE_DIR = ROOT / 'assets' / 'sprites'
SPRITE_DIR.mkdir(parents=True, exist_ok=True)
DOCS_DIR = ROOT / 'docs'

bust_img = Image.open(PORTRAIT_PATH)
a = np.array(bust_img.getchannel('A'))
yy, xx = np.where(a > 20)
pad = 2
bx1, by1 = max(0, int(xx.min()) - pad), max(0, int(yy.min()) - pad)
bx2, by2 = min(bust_img.width, int(xx.max()) + pad + 1), min(bust_img.height, int(yy.max()) + pad + 1)
bust_crop = bust_img.crop((bx1, by1, bx2, by2))

SPRITE_W, SPRITE_H = 158, 215

# Upper body target height: 132 px
scale = 132 / bust_crop.height
sw = int(bust_crop.width * scale)
sh = int(bust_crop.height * scale)
scaled_bust = bust_crop.resize((sw, sh), Image.Resampling.LANCZOS)
scaled_bust = scaled_bust.filter(ImageFilter.UnsharpMask(radius=0.9, percent=115, threshold=2))

# Feather bottom 10px of bust so it blends seamlessly into trousers
bust_rgba = np.array(scaled_bust)
for row in range(1, 11):
    alpha_mult = (10 - row) / 10.0
    bust_rgba[-row, :, 3] = (bust_rgba[-row, :, 3] * alpha_mult).astype(np.uint8)
scaled_bust_feathered = Image.fromarray(bust_rgba, 'RGBA')

# Color palette
C_OUTLINE = (24, 34, 44, 255)
C_PANTS = (38, 64, 82, 255)
C_PANTS_SHADOW = (24, 42, 56, 255)
C_PANTS_HIGH = (52, 86, 110, 255)
C_BELT = (82, 50, 28, 255)
C_BUCKLE = (216, 180, 80, 255)
C_BOOT_UPPER = (86, 50, 30, 255)
C_BOOT_SOLE = (238, 234, 222, 255)
C_SHIRT = (248, 246, 250, 255)
C_SHIRT_SHAD = (215, 212, 224, 255)

def draw_contoured_leg(draw, hip, knee, ankle, is_front=True):
    fill = C_PANTS if is_front else C_PANTS_SHADOW
    high = C_PANTS_HIGH if is_front else C_PANTS

    hx, hy = hip
    kx, ky = knee
    ax, ay = ankle

    outer_poly = [
        (hx - 9, hy),
        (kx - 7, ky),
        (ax - 6, ay),
        (ax + 6, ay),
        (kx + 7, ky),
        (hx + 9, hy)
    ]
    draw.polygon(outer_poly, fill=fill, outline=C_OUTLINE)

    # Trouser cuff
    cuff_poly = [
        (ax - 7, ay - 4),
        (ax + 7, ay - 4),
        (ax + 7, ay),
        (ax - 7, ay)
    ]
    draw.polygon(cuff_poly, fill=high, outline=C_OUTLINE)
    draw.line([(kx - 3, ky), (kx + 3, ky)], fill=C_OUTLINE, width=1)

def draw_boot(draw, ankle, tip, heel):
    ax, ay = ankle
    tx, ty = tip
    hx, hy = heel

    # Sole
    draw.line([(hx - 2, hy + 3), (tx + 3, ty + 3)], fill=C_OUTLINE, width=6)
    draw.line([(hx - 2, hy + 3), (tx + 3, ty + 3)], fill=C_BOOT_SOLE, width=4)

    # Shoe upper
    upper = [
        (ax - 6, ay - 2),
        (hx - 1, hy),
        (hx - 2, hy + 2),
        (tx + 2, ty + 2),
        (tx + 1, ty - 1),
        (ax + 6, ay - 2)
    ]
    draw.polygon(upper, fill=C_BOOT_UPPER, outline=C_OUTLINE)

    # Rubber toe
    toe = [
        (tx - 4, ty - 2),
        (tx + 2, ty),
        (tx + 2, ty + 2),
        (tx - 4, ty + 2)
    ]
    draw.polygon(toe, fill=C_BOOT_SOLE, outline=C_OUTLINE)

def render_walk_frame(idx):
    img = Image.new('RGBA', (SPRITE_W, SPRITE_H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    cx = SPRITE_W // 2 - 2
    bounce = -2 if idx in (1, 3) else 0
    bust_y = 10 + bounce
    bust_x = cx - (sw // 2)

    waist_y = bust_y + sh - 14

    # Legs layer
    if idx == 0:
        # Right leg forward, Left leg back
        r_hip = (cx - 8, waist_y + 4)
        r_knee = (cx - 16, waist_y + 36)
        r_ankle = (cx - 24, waist_y + 66)

        l_hip = (cx + 8, waist_y + 4)
        l_knee = (cx + 17, waist_y + 36)
        l_ankle = (cx + 25, waist_y + 64)

        draw_contoured_leg(d, l_hip, l_knee, l_ankle, is_front=False)
        draw_boot(d, l_ankle, (l_ankle[0] + 11, l_ankle[1] + 3), (l_ankle[0] - 4, l_ankle[1] + 3))

        draw_contoured_leg(d, r_hip, r_knee, r_ankle, is_front=True)
        draw_boot(d, r_ankle, (r_ankle[0] + 11, r_ankle[1] + 3), (r_ankle[0] - 5, r_ankle[1] + 3))

    elif idx == 1:
        # Mid-stride passing: right leg planted, left leg passing
        r_hip = (cx - 7, waist_y + 4)
        r_knee = (cx - 6, waist_y + 36)
        r_ankle = (cx - 5, waist_y + 68)

        l_hip = (cx + 7, waist_y + 4)
        l_knee = (cx + 12, waist_y + 34)
        l_ankle = (cx + 10, waist_y + 63)

        draw_contoured_leg(d, l_hip, l_knee, l_ankle, is_front=False)
        draw_boot(d, l_ankle, (l_ankle[0] + 9, l_ankle[1] + 2), (l_ankle[0] - 4, l_ankle[1] + 2))

        draw_contoured_leg(d, r_hip, r_knee, r_ankle, is_front=True)
        draw_boot(d, r_ankle, (r_ankle[0] + 11, r_ankle[1] + 3), (r_ankle[0] - 5, r_ankle[1] + 3))

    elif idx == 2:
        # Left leg forward, Right leg back
        l_hip = (cx + 8, waist_y + 4)
        l_knee = (cx + 16, waist_y + 36)
        l_ankle = (cx + 24, waist_y + 66)

        r_hip = (cx - 8, waist_y + 4)
        r_knee = (cx - 17, waist_y + 36)
        r_ankle = (cx - 25, waist_y + 64)

        draw_contoured_leg(d, r_hip, r_knee, r_ankle, is_front=False)
        draw_boot(d, r_ankle, (r_ankle[0] + 10, r_ankle[1] + 3), (r_ankle[0] - 5, r_ankle[1] + 3))

        draw_contoured_leg(d, l_hip, l_knee, l_ankle, is_front=True)
        draw_boot(d, l_ankle, (l_ankle[0] + 11, l_ankle[1] + 3), (l_ankle[0] - 5, l_ankle[1] + 3))

    elif idx == 3:
        # Mid-stride passing: left leg planted, right leg passing
        l_hip = (cx + 7, waist_y + 4)
        l_knee = (cx + 6, waist_y + 36)
        l_ankle = (cx + 5, waist_y + 68)

        r_hip = (cx - 7, waist_y + 4)
        r_knee = (cx - 12, waist_y + 34)
        r_ankle = (cx - 10, waist_y + 63)

        draw_contoured_leg(d, r_hip, r_knee, r_ankle, is_front=False)
        draw_boot(d, r_ankle, (r_ankle[0] + 9, r_ankle[1] + 2), (r_ankle[0] - 4, r_ankle[1] + 2))

        draw_contoured_leg(d, l_hip, l_knee, l_ankle, is_front=True)
        draw_boot(d, l_ankle, (l_ankle[0] + 11, l_ankle[1] + 3), (l_ankle[0] - 5, l_ankle[1] + 3))

    # Pelvis contour
    pelvis = [
        (cx - 24, waist_y),
        (cx + 24, waist_y),
        (cx + 21, waist_y + 18),
        (cx - 21, waist_y + 18)
    ]
    d.polygon(pelvis, fill=C_PANTS, outline=C_OUTLINE)

    # Composite feathered upper body over legs/pelvis
    img.alpha_composite(scaled_bust_feathered, (bust_x, bust_y))

    # Draw shirt folds & belt OVER the seam
    d_over = ImageDraw.Draw(img)

    # Natural drapery of shirt at waist
    shirt_overlap = [
        (cx - 26, waist_y - 8),
        (cx + 26, waist_y - 8),
        (cx + 25, waist_y + 2),
        (cx + 12, waist_y + 5),
        (cx, waist_y + 6),
        (cx - 12, waist_y + 5),
        (cx - 25, waist_y + 2)
    ]
    d_over.polygon(shirt_overlap, fill=C_SHIRT, outline=C_OUTLINE)
    # Fold shadow
    d_over.line([(cx - 22, waist_y + 1), (cx, waist_y + 4), (cx + 22, waist_y + 1)], fill=C_SHIRT_SHAD, width=2)

    # Leather belt visible below shirt hem in center/sides
    belt = [
        (cx - 22, waist_y + 6),
        (cx + 22, waist_y + 6),
        (cx + 21, waist_y + 13),
        (cx - 21, waist_y + 13)
    ]
    d_over.polygon(belt, fill=C_BELT, outline=C_OUTLINE)
    # Brass buckle
    d_over.rectangle([cx - 5, waist_y + 5, cx + 5, waist_y + 14], fill=C_BUCKLE, outline=C_OUTLINE, width=2)

    return img

# Generate all 4 frames
frames = []
for i in range(4):
    frame = render_walk_frame(i)
    out_file = SPRITE_DIR / f'minh_an_walk_{i}.png'
    frame.save(out_file, optimize=True)
    frames.append(frame)
    print(f'[OK] Generated {out_file.name}')

# Build preview strip
preview_strip = Image.new('RGBA', (SPRITE_W * 4 + 30, SPRITE_H + 20), (220, 240, 225, 255))
d_prev = ImageDraw.Draw(preview_strip)
for i, f in enumerate(frames):
    x = 10 + i * (SPRITE_W + 5)
    d_prev.ellipse([x + 35, SPRITE_H - 8, x + SPRITE_W - 35, SPRITE_H + 4], fill=(160, 190, 170, 180))
    preview_strip.alpha_composite(f, (x, 10))

preview_path = DOCS_DIR / 'minh_an_walk_cycle_preview.png'
preview_strip.save(preview_path, optimize=True)
print(f'Walk preview updated to {preview_path}')
