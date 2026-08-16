import json
from pathlib import Path
from rapidocr_onnxruntime import RapidOCR

image_path = Path(r"C:\Users\wangjunyi\.codex\visualizations\2026\08\04\019fcbe1-e75c-78c1-94f3-eaf61d51eefc\metabolism-map-pdf-page1.png")
output_path = image_path.with_name('metabolism-map-ocr.json')
engine = RapidOCR()
result, _ = engine(str(image_path))
rows = []
for box, text, score in result or []:
    xs = [point[0] for point in box]
    ys = [point[1] for point in box]
    rows.append({
        'x': round(min(xs), 1),
        'y': round(min(ys), 1),
        'w': round(max(xs) - min(xs), 1),
        'h': round(max(ys) - min(ys), 1),
        'text': text,
        'score': round(float(score), 4),
    })
output_path.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
headings = [row for row in rows if row['score'] >= 0.45 and row['h'] >= 18 and len(row['text'].strip()) >= 2]
headings.sort(key=lambda row: (row['y'], row['x']))
print(f'ocr_rows={len(rows)} heading_candidates={len(headings)}')
for row in headings:
    print(f"{row['x']:7.1f}\t{row['y']:7.1f}\t{row['w']:6.1f}x{row['h']:5.1f}\t{row['score']:.2f}\t{row['text']}")
