from pathlib import Path
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont, ImageOps

downloads = Path(r"C:\Users\wangjunyi\Downloads")
output = Path(r"C:\Users\wangjunyi\.codex\visualizations\2026\08\04\019fcbe1-e75c-78c1-94f3-eaf61d51eefc")
start = datetime(2026, 8, 3)
end = datetime(2026, 8, 5)
extensions = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tif', '.tiff'}
files = sorted(
    [p for p in downloads.iterdir() if p.is_file() and p.suffix.lower() in extensions and start <= datetime.fromtimestamp(p.stat().st_mtime) < end],
    key=lambda p: p.stat().st_mtime,
)

font = ImageFont.load_default()
thumb_w, thumb_h = 340, 220
cell_w, cell_h = 360, 270
cols = 4

for day in (3, 4):
    day_files = [p for p in files if datetime.fromtimestamp(p.stat().st_mtime).day == day]
    rows = (len(day_files) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * cell_w, rows * cell_h), '#eaf3f4')
    draw = ImageDraw.Draw(sheet)
    for index, path in enumerate(day_files, start=1):
        image = Image.open(path).convert('RGB')
        fitted = ImageOps.contain(image, (thumb_w, thumb_h), Image.Resampling.LANCZOS)
        x = ((index - 1) % cols) * cell_w + (cell_w - fitted.width) // 2
        y = ((index - 1) // cols) * cell_h + 8 + (thumb_h - fitted.height) // 2
        sheet.paste(fitted, (x, y))
        stamp = datetime.fromtimestamp(path.stat().st_mtime).strftime('%H:%M:%S')
        label = f'{day:02d}-{index:02d}  {stamp}  {image.width}x{image.height}'
        draw.rounded_rectangle((x - 2, y + fitted.height + 6, x + thumb_w, y + fitted.height + 30), radius=6, fill='#ffffff')
        draw.text((x + 5, y + fitted.height + 12), label, fill='#173f4d', font=font)
        print(f'{day:02d}-{index:02d}\t{stamp}\t{image.width}x{image.height}\t{path}')
    sheet.save(output / f'downloads-2026-08-{day:02d}-contact-sheet.jpg', quality=90)
