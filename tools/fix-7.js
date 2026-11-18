// Issue #7 — rastreio do WhatsApp e convivência com o WP Rocket (rodar uma vez).
const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('não achei: ' + a.slice(0, 70)); s = s.split(a).join(b); };

const NUM = '5547996161220';
const PADRAO = 'Vim pelo site e gostaria de agendar um exame.';
const link = msg => `https://wa.me/${NUM}?text=${encodeURIComponent('Olá! ' + (msg || PADRAO))}`;

// 1. CTAs de WhatsApp viram links reais (o PixelYourSite rastreia como OutboundClick)
let n = 0;
s = s.replace(/<a\b([^>]*?)\sonclick="wa\(event(?:,'([^']*)')?\)"([^>]*)>/g, (m, a, msg, b) => {
  n++;
  const attrs = (a + b).replace(/\shref="#"/, '');
  const href = msg && msg.includes('${') ? '${waHref(`' + msg + '`)}' : link(msg);
  return `<a href="${href}" target="_blank" rel="noopener"${attrs}>`;
});
console.log('CTAs convertidos:', n);
rep('function wa(e,msg){', `function waHref(msg){ return '${'https://wa.me/' + NUM}?text='+encodeURIComponent('Olá! '+(msg||'${PADRAO}')); }\nfunction wa(e,msg){`);

// 2. cards e menu de exames como links de verdade (rastreáveis e acessíveis)
rep(`g+=\`<div class="excard" onclick="go('modalidade','\${k}')" tabindex="0" onkeydown="if(event.key==='Enter')go('modalidade','\${k}')">`,
    'g+=`<a class="excard" href="#exame/${k}">');
rep('<span class="more">Ver exames <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>\n    </div>`;',
    '<span class="more">Ver exames <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>\n    </a>`;');
rep(`d+=\`<a href="#" onclick="return go('modalidade','\${k}')">`, 'd+=`<a href="#exame/${k}">');
rep(`f+=\`<li><a href="#" onclick="return go('modalidade','\${k}')">`, 'f+=`<li><a href="#exame/${k}">');
rep(`res.innerHTML=hits.map(h=>\`<span class="chip" onclick="go('modalidade','\${h.key}')">\${h.label}</span>\`)`,
    'res.innerHTML=hits.map(h=>`<a class="chip" href="#exame/${h.key}">${h.label}</a>`)');

// 3. WP Rocket / LiteSpeed: não atrasar o script do site nem a imagem principal
rep('<script>\n/* ============ DADOS DAS MODALIDADES', '<script nowprocket data-no-optimize="1" data-no-defer="1">\n/* ============ DADOS DAS MODALIDADES');
rep('class="logo-main"', 'class="logo-main skip-lazy" data-no-lazy="1"');
rep('class="hero-photo"', 'class="hero-photo skip-lazy" data-no-lazy="1"');

// 4. dados estruturados para o Google (clínica + 2 unidades)
const unidade = (nome, rua, bairro, cep) => ({
  '@type': 'MedicalClinic', name: `MCI — ${nome}`, telephone: '+55 47 99616-1220',
  address: { '@type': 'PostalAddress', streetAddress: rua, addressLocality: 'Itajaí', addressRegion: 'SC', postalCode: cep, addressCountry: 'BR', ...(bairro && {}) },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' }]
});
const ld = {
  '@context': 'https://schema.org', '@type': 'MedicalOrganization', name: 'MCI — Centro Médico de Itajaí',
  url: 'https://clinicamci.com.br/', telephone: '+55 47 99616-1220', medicalSpecialty: 'Radiography',
  description: 'Referência em diagnóstico por imagem em Itajaí: ressonância, tomografia, ultrassom, mamografia, raio-X, densitometria, ECG e biópsias.',
  subOrganization: [
    unidade('Unidade Centro', 'R. Samuel Heusi, 178 — Centro', 'Centro', '88301-040'),
    unidade('Unidade Dom Bosco (Ressonância Magnética)', 'R. José Testoni, 1 — Dom Bosco', 'Dom Bosco', '88307-098')
  ]
};
rep('<a href="https://wa.me/', '<a href="https://wa.me/'); // garante que houve conversão
s = s.replace('</footer>', '</footer>\n<script type="application/ld+json">' + JSON.stringify(ld) + '</script>');

fs.writeFileSync('index.html', s);
console.log('ok; restam onclick wa:', (s.match(/onclick="wa\(/g) || []).length, '| href="#" sobrando:', (s.match(/href="#"/g) || []).length);
