#!/usr/bin/env python3
"""
Generate layered PNG placeholders for the avatar configurator.
The output goes under public/assets/ and mirrors each outfit category.
"""

from __future__ import annotations

import os
import zlib
from dataclasses import dataclass
from typing import Dict, Iterable, Tuple

WIDTH = 320
HEIGHT = 520
ASSET_ROOT = "public/assets"
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"

Color = Tuple[int, int, int, int]


def chunk(tag: bytes, data: bytes) -> bytes:
    return len(data).to_bytes(4, "big") + tag + data + zlib.crc32(tag + data).to_bytes(4, "big")


def write_png(path: str, pixels: bytearray) -> None:
    raw = bytearray()
    row_stride = WIDTH * 4
    for y in range(HEIGHT):
        raw.append(0)
        start = y * row_stride
        raw.extend(pixels[start : start + row_stride])
    ihdr = chunk(b"IHDR", WIDTH.to_bytes(4, "big") + HEIGHT.to_bytes(4, "big") + b"\x08\x06\x00\x00\x00")
    idat = chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    iend = chunk(b"IEND", b"")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as handle:
        handle.write(PNG_SIGNATURE + ihdr + idat + iend)


def blank() -> bytearray:
    return bytearray([0, 0, 0, 0] * WIDTH * HEIGHT)


def set_pixel(buf: bytearray, x: int, y: int, color: Color) -> None:
    if x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT:
        return
    idx = (y * WIDTH + x) * 4
    buf[idx : idx + 4] = bytes(color)


def fill_rect(buf: bytearray, x0: int, y0: int, x1: int, y1: int, color: Color) -> None:
    for y in range(max(0, y0), min(HEIGHT, y1)):
        for x in range(max(0, x0), min(WIDTH, x1)):
            set_pixel(buf, x, y, color)


def fill_circle(buf: bytearray, cx: int, cy: int, radius: int, color: Color) -> None:
    r2 = radius * radius
    for y in range(cy - radius, cy + radius + 1):
        for x in range(cx - radius, cx + radius + 1):
            if (x - cx) * (x - cx) + (y - cy) * (y - cy) <= r2:
                set_pixel(buf, x, y, color)


def draw_outline(buf: bytearray, rects: Iterable[Tuple[int, int, int, int]], color: Color) -> None:
    for x0, y0, x1, y1 in rects:
        for y in range(y0, y1):
            set_pixel(buf, x0, y, color)
            set_pixel(buf, x1 - 1, y, color)
        for x in range(x0, x1):
            set_pixel(buf, x, y0, color)
            set_pixel(buf, x, y1 - 1, color)


def make_base() -> None:
    base = blank()
    skin = (235, 201, 170, 255)
    shadow = (216, 181, 151, 255)
    outline = (60, 54, 68, 255)

    fill_circle(base, 160, 90, 48, skin)
    fill_rect(base, 150, 138, 170, 160, skin)
    fill_rect(base, 105, 160, 215, 300, shadow)
    fill_rect(base, 70, 185, 105, 310, shadow)
    fill_rect(base, 215, 185, 250, 310, shadow)
    fill_rect(base, 120, 300, 160, 470, skin)
    fill_rect(base, 170, 300, 210, 470, skin)
    fill_rect(base, 120, 470, 160, 500, (240, 240, 240, 255))
    fill_rect(base, 170, 470, 210, 500, (240, 240, 240, 255))
    fill_rect(base, 70, 310, 95, 345, skin)
    fill_rect(base, 225, 310, 250, 345, skin)
    fill_circle(base, 235, 490, 25, (245, 245, 245, 255))
    fill_rect(base, 230, 480, 240, 500, (35, 35, 35, 255))
    draw_outline(
        base,
        [
            (105, 160, 215, 300),
            (70, 185, 105, 345),
            (215, 185, 250, 345),
            (120, 300, 160, 500),
            (170, 300, 210, 500),
        ],
        outline,
    )
    write_png(os.path.join(ASSET_ROOT, "base", "player-base.png"), base)


def paint_hair(path: str, color: Color) -> None:
    layer = blank()
    fill_circle(layer, 160, 80, 60, color)
    fill_rect(layer, 120, 60, 200, 150, color)
    fill_rect(layer, 200, 70, 235, 200, color)
    fill_rect(layer, 85, 70, 120, 200, color)
    write_png(path, layer)


def paint_shirt(path: str, color: Color) -> None:
    layer = blank()
    fill_rect(layer, 105, 160, 215, 280, color)
    fill_rect(layer, 80, 185, 120, 310, color)
    fill_rect(layer, 200, 185, 240, 310, color)
    write_png(path, layer)


def paint_pants(path: str, color: Color) -> None:
    layer = blank()
    fill_rect(layer, 110, 280, 210, 360, color)
    fill_rect(layer, 120, 360, 160, 420, color)
    fill_rect(layer, 170, 360, 210, 420, color)
    write_png(path, layer)


def paint_shoes(path: str, color: Color) -> None:
    layer = blank()
    fill_rect(layer, 115, 480, 160, 515, color)
    fill_rect(layer, 170, 480, 215, 515, color)
    write_png(path, layer)


def paint_captain(path: str) -> None:
    layer = blank()
    fill_rect(layer, 75, 255, 115, 285, (255, 215, 0, 255))
    write_png(path, layer)


def run() -> None:
    make_base()

    hair_colors: Dict[str, Color] = {
        "sunset-brown": (140, 88, 60, 255),
        "midnight-black": (30, 30, 30, 255),
        "golden-blonde": (236, 195, 120, 255),
    }
    for name, color in hair_colors.items():
        paint_hair(os.path.join(ASSET_ROOT, "hair", f"hair-{name}.png"), color)

    shirt_colors: Dict[str, Color] = {
        "crimson": (215, 68, 68, 255),
        "ocean": (35, 126, 190, 255),
        "graphite": (80, 86, 105, 255),
    }
    for name, color in shirt_colors.items():
        paint_shirt(os.path.join(ASSET_ROOT, "shirts", f"shirt-{name}.png"), color)

    pant_colors: Dict[str, Color] = {
        "forest": (54, 112, 78, 255),
        "navy": (32, 62, 117, 255),
        "charcoal": (55, 59, 65, 255),
    }
    for name, color in pant_colors.items():
        paint_pants(os.path.join(ASSET_ROOT, "pants", f"pants-{name}.png"), color)

    shoe_colors: Dict[str, Color] = {
        "obsidian": (28, 28, 28, 255),
        "ice": (230, 230, 230, 255),
        "volt": (185, 236, 72, 255),
    }
    for name, color in shoe_colors.items():
        paint_shoes(os.path.join(ASSET_ROOT, "shoes", f"shoes-{name}.png"), color)

    paint_captain(os.path.join(ASSET_ROOT, "extras", "captain-band.png"))


if __name__ == "__main__":
    run()
