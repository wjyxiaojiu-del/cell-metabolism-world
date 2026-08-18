from pathlib import Path
from PIL import Image

source = Path(r"C:\Users\wangjunyi\.codex\visualizations\2026\08\04\019fcbe1-e75c-78c1-94f3-eaf61d51eefc\metabolism-map-pdf-page1.png")
output = source.parent
image = Image.open(source)
cols, rows = 3, 2
overlap = 90
cell_w = image.width / cols
cell_h = image.height / rows
for row in range(rows):
    for col in range(cols):
        left = max(0, round(col * cell_w - overlap))
        top = max(0, round(row * cell_h - overlap))
        right = min(image.width, round((col + 1) * cell_w + overlap))
        bottom = min(image.height, round((row + 1) * cell_h + overlap))
        crop = image.crop((left, top, right, bottom))
        crop.save(output / f'metabolism-map-zone-r{row + 1}c{col + 1}.png')
        print(f'r{row + 1}c{col + 1}: {left},{top},{right},{bottom}')
