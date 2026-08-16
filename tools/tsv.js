// TSV 读取，全部工具共用这一份。
// 之前 validate.js 和 layout.js 各有一份拷贝，改了一份忘了另一份，英文名在其中一份里丢掉。
const fs = require('fs');

// 文件头可识别的键。值可以有多个制表符字段，例如「通路: 糖酵解<TAB>Glycolysis」。
const META_KEYS = ['通路', '默认区室', '来源', '说明', '物种', '组织'];
const TAB = String.fromCharCode(9);

function readTsv(file) {
  const raw = fs.readFileSync(file, 'utf8');
  // 剥掉 UTF-8 BOM：否则第一行（通常是 # 元数据行或表头）的 startsWith 判断全部失效
  const text = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
  const meta = {};        // 只存第一个字段
  const metaFields = {};  // 存完整字段数组
  const rows = [];
  let header = null;
  const lines = text.split(/\r?\n/);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    if (!line.trim()) continue;
    if (line.startsWith('#')) {
      const body = line.replace(/^#\s*/, '');
      const m = body.match(new RegExp('^(' + META_KEYS.join('|') + '):\s*(.*)$'));
      if (m) {
        const parts = m[2].split(TAB).map(x => x.trim());
        meta[m[1]] = parts[0];
        metaFields[m[1]] = parts;
      }
      continue;
    }
    const cells = line.split(TAB);
    if (!header) { header = cells.map(c => c.trim()); continue; }
    const row = {};
    header.forEach((h, i) => { row[h] = (cells[i] || '').trim(); });
    row.__line = line;
    row.__lineNumber = lineIndex + 1;
    row.__cells = cells.length;
    rows.push(row);
  }
  return { meta, metaFields, header, rows };
}

module.exports = { readTsv, META_KEYS };
