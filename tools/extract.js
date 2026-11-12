// Extrai as imagens base64 do index.html para img/ (WebP otimizado) e troca os src.
const fs = require('fs');
const sharp = require('C:/Projetos/conexoes-mci/node_modules/sharp');
const names = ['favicon','logo','hero-familia','unidade-centro-tomografia','unidade-dombosco-ressonancia','mci-tomografia','unidade-centro-tomografia','unidade-dombosco-ressonancia','icone-mci'];
(async () => {
  let html = fs.readFileSync('index.html', 'utf8');
  const re = /data:image\/([a-z]+);base64,([A-Za-z0-9+/=]+)/g;
  const found = [...html.matchAll(re)];
  const seen = new Map();
  for (let i = 0; i < found.length; i++) {
    const [full, type, b64] = found[i];
    const buf = Buffer.from(b64, 'base64');
    const meta = await sharp(buf).metadata();
    let name = names[i], out;
    if (seen.has(b64)) { out = seen.get(b64); }
    else if (name === 'favicon') {
      out = 'img/favicon.png';
      await sharp(buf).resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(out);
    } else {
      out = `img/${name}.webp`;
      const w = { logo: 480, 'icone-mci': 160, 'hero-familia': 1200 }[name] || 1100;
      await sharp(buf).resize({ width: Math.min(w, meta.width) }).webp({ quality: 80 }).toFile(out);
    }
    seen.set(b64, out);
    const m2 = await sharp(out).metadata();
    console.log(i, name, type, meta.width + 'x' + meta.height, (buf.length / 1024 | 0) + 'KB ->', out, m2.width + 'x' + m2.height, (fs.statSync(out).size / 1024 | 0) + 'KB');
    html = html.replace(full, out);
  }
  fs.writeFileSync('index.html', html);
  console.log('index.html', fs.statSync('index.html').size / 1024 | 0, 'KB');
})();
