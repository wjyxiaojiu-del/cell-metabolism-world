#!/usr/bin/env python3
"""Create runtime WebP derivatives without changing the source artwork."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def optimize(source: Path, destination: Path, max_dimension: int, quality: int) -> tuple[int, int, tuple[int, int]]:
    with Image.open(source) as image:
        image.load()
        original_size = source.stat().st_size
        scale = min(1.0, max_dimension / max(image.width, image.height))
        if scale < 1.0:
            size = (round(image.width * scale), round(image.height * scale))
            image = image.resize(size, Image.Resampling.LANCZOS)
        else:
            size = image.size
        if image.mode not in {'RGB', 'RGBA'}:
            image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, 'WEBP', quality=quality, method=6)
    return original_size, destination.stat().st_size, size


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path, default=Path('cell-metabolism-assets'))
    parser.add_argument('--output', type=Path, default=Path('cell-metabolism-assets/optimized'))
    parser.add_argument('--max-dimension', type=int, default=2400)
    parser.add_argument('--quality', type=int, default=84)
    parser.add_argument('--write', action='store_true', help='write generated derivatives')
    args = parser.parse_args()

    if args.source.resolve() == args.output.resolve():
        parser.error('--output must be separate from --source')
    sources = sorted(
        path for path in args.source.iterdir()
        if path.is_file() and path.suffix.lower() in {'.png', '.jpg', '.jpeg'}
        and path.parent.resolve() != args.output.resolve()
        and 'optimized' not in path.stem.lower()
    )
    if not sources:
        print(f'No source images found in {args.source}')
        return 1
    if not args.write:
        print(f'Plan: {len(sources)} images -> {args.output} (WebP, max {args.max_dimension}px, quality {args.quality})')
        print('Re-run with --write to create derivatives; source files are never overwritten.')
        return 0

    original_total = 0
    output_total = 0
    for source in sources:
        destination = args.output / f'{source.stem}.webp'
        original, output, size = optimize(source, destination, args.max_dimension, args.quality)
        original_total += original
        output_total += output
        print(f'{source.name}: {size[0]}x{size[1]} {original / 1024 / 1024:.2f}MB -> {output / 1024 / 1024:.2f}MB')
    print(f'Total: {original_total / 1024 / 1024:.2f}MB -> {output_total / 1024 / 1024:.2f}MB')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
