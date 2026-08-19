#!/usr/bin/env python3
"""Build and verify the compact expert-pathway navigation icon set."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "cell-metabolism-assets" / "pathway-icons" / "source"
OUTPUT_DIR = ROOT / "cell-metabolism-assets" / "pathway-icons" / "optimized"
ICON_SIZE = 128
PATHWAY_IDS = (
    "all",
    "pdh",
    "tca",
    "malate_aspartate",
    "glycerol_phosphate",
    "etc",
    "oxphos",
    "glycolysis",
    "gluconeogenesis",
    "glycogenesis",
    "glycogenolysis",
    "ppp",
    "fa_synthesis",
    "carnitine",
    "beta_oxidation",
    "ketone",
    "transamination",
    "urea",
    "aa_carbon",
    "purine",
    "pyrimidine",
    "nucleotide_degradation",
)


def build() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for pathway_id in PATHWAY_IDS:
        source = SOURCE_DIR / f"{pathway_id}.png"
        if not source.is_file():
            raise SystemExit(f"Missing source icon: {source.relative_to(ROOT)}")
        with Image.open(source) as image:
            icon = ImageOps.fit(
                image.convert("RGB"),
                (ICON_SIZE, ICON_SIZE),
                method=Image.Resampling.LANCZOS,
            )
            icon.save(
                OUTPUT_DIR / f"{pathway_id}.webp",
                format="WEBP",
                quality=84,
                method=6,
            )


def verify() -> None:
    expected_sources = {f"{pathway_id}.png" for pathway_id in PATHWAY_IDS}
    expected_outputs = {f"{pathway_id}.webp" for pathway_id in PATHWAY_IDS}
    actual_sources = {path.name for path in SOURCE_DIR.glob("*.png")}
    actual_outputs = {path.name for path in OUTPUT_DIR.glob("*.webp")}

    missing_sources = sorted(expected_sources - actual_sources)
    missing_outputs = sorted(expected_outputs - actual_outputs)
    unexpected_sources = sorted(actual_sources - expected_sources)
    unexpected_outputs = sorted(actual_outputs - expected_outputs)
    problems: list[str] = []
    if missing_sources:
        problems.append(f"missing source PNGs: {', '.join(missing_sources)}")
    if missing_outputs:
        problems.append(f"missing optimized WebPs: {', '.join(missing_outputs)}")
    if unexpected_sources:
        problems.append(f"unexpected source PNGs: {', '.join(unexpected_sources)}")
    if unexpected_outputs:
        problems.append(f"unexpected optimized WebPs: {', '.join(unexpected_outputs)}")

    for pathway_id in PATHWAY_IDS:
        output = OUTPUT_DIR / f"{pathway_id}.webp"
        if not output.is_file():
            continue
        with Image.open(output) as image:
            if image.format != "WEBP":
                problems.append(f"{output.name}: expected WEBP, got {image.format}")
            if image.size != (ICON_SIZE, ICON_SIZE):
                problems.append(f"{output.name}: expected {ICON_SIZE}x{ICON_SIZE}, got {image.size[0]}x{image.size[1]}")

    if problems:
        raise SystemExit("Pathway icon check failed:\n- " + "\n- ".join(problems))
    total_bytes = sum((OUTPUT_DIR / name).stat().st_size for name in expected_outputs)
    print(f"Pathway icons OK: {len(PATHWAY_IDS)}/{len(PATHWAY_IDS)} WebPs, {ICON_SIZE}x{ICON_SIZE}, {total_bytes / 1024:.1f} KiB total")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true", help="build optimized icons before checking")
    args = parser.parse_args()
    if args.write:
        build()
    verify()


if __name__ == "__main__":
    main()
