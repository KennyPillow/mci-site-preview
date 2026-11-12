// Issue #3 — aplica o conteúdo aprovado na conversa da Leticia (rodar uma vez).
const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('não achei: ' + a.slice(0, 70)); s = s.replace(a, b); };

// --- Humanização (assinatura e "Quem somos" enviados pela Ju em 17/09) ---
const ASSINATURA = 'Referência em diagnóstico por imagem em Itajaí. Tecnologia de ponta com o cuidado humanizado de quem se importa com cada resultado.';
rep('<p class="lead">Diagnóstico por imagem com tecnologia, agilidade e o acolhimento de quem atende você pelo nome.</p>',
    `<p class="lead">${ASSINATURA}</p>`);
rep('.hero p.lead{font-size:1.18rem;color:var(--cinza);max-width:50ch;', '.hero p.lead{font-size:1.18rem;color:var(--cinza);max-width:56ch;');
rep('<h1>Grandes na tecnologia, próximos no trato</h1>', '<h1>Diagnóstico moderno, com ética, agilidade e humanização</h1>');
s = s.replace(/<p class="d">A MCI é a clínica de exames de imagem de Itajaí que une[^<]*<\/p>/,
  '<p class="d">A MCI é um centro de exames e diagnóstico por imagem em Itajaí que une tecnologia de referência, equipe qualificada e um atendimento humanizado, pensado para o conforto, a segurança e o cuidado de cada paciente.</p>');
rep('<p>Centro Médico de Itajaí. Diagnóstico por imagem com tecnologia e acolhimento, há mais de 10 anos.</p>', `<p>${ASSINATURA}</p>`);
s = s.replace(/<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Referência em diagnóstico por imagem em Itajaí: ressonância, tomografia, ultrassom, mamografia, raio-X, densitometria, ECG e biópsias, com tecnologia de ponta e atendimento humanizado. Agende pelo WhatsApp.">');
// faixa de confiança: humanização na frente
const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';
rep('<section class="trust">\n    <div class="container row">\n', `<section class="trust">\n    <div class="container row">\n      <div class="it">${HEART} Atendimento humanizado</div>\n`);

// --- Card novo no hero (sobre o braço da senhora, sem cobrir rosto) ---
const b2 = s.indexOf('<div class="badge b2">');
const b2end = s.indexOf('</span></div>', b2) + '</span></div>'.length;
s = s.slice(0, b2end) + '\n        <div class="badge b3"><span class="dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg></span><span>Diagnóstico por imagem<small>Prevenção e qualidade de vida</small></span></div>' + s.slice(b2end);
rep('.hero-art .b2{bottom:8%;right:-3%}', '.hero-art .b2{bottom:8%;right:-3%}\n.hero-art .b3{bottom:22%;left:-3%}');
rep('  .hero-art .b2{bottom:4%;right:2%}', '  .hero-art .b2{bottom:4%;right:2%}\n  .hero-art .b3{bottom:20%;left:2%}');
rep('@media(max-width:400px){', '@media(max-width:480px){.hero-art .b3{display:none}}\n@media(max-width:400px){');

// --- Ícone de agulha + 8ª modalidade: Biópsias e Punções ---
rep("  ecg:'<svg", "  bio:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m18 2 4 4M17 7l3-3M19 9l-8.5 8.5a2 2 0 0 1-2.8 0l-1.2-1.2a2 2 0 0 1 0-2.8L15 5M9 11l4 4M5 19l-3 3M6.5 17.5 5 19\"/></svg>',\n  ecg:'<svg");
const BIO = `  biopsias:{
    icon:'bio', gen:'sua', nome:'Biópsias e Punções', cta:'Vamos agendar seu procedimento?',
    desc:'Procedimentos minimamente invasivos, guiados por ultrassom, que coletam uma pequena amostra de células ou tecido para análise. A amostra segue para o nosso laboratório parceiro.',
    aside:'Guiados por ultrassom, com precisão e cuidado em cada etapa. O preparo e a liberação do resultado são explicados no agendamento.',
    exames:[
      ['PAAF de tireoide','Punção aspirativa por agulha fina de nódulo da tireoide','PAAF de Tireoide'],
      ['PAAF de mama','Punção aspirativa por agulha fina de nódulo ou cisto mamário','PAAF de Mama'],
      ['Core biópsia de mama','Biópsia por agulha grossa guiada por ultrassom','Core Biópsia de Mama'],
      ['Biópsia de próstata','Biópsia guiada por ultrassom transretal','Biópsia de Próstata']
    ],
    prep:['Informe se usa anticoagulante, AAS ou outro medicamento que afine o sangue — a orientação sobre suspender é sempre do seu médico.','Traga o pedido médico e os exames de imagem anteriores (ultrassom, mamografia).','Se possível, venha com um acompanhante.','Alguns procedimentos pedem jejum leve ou preparo específico — confirmamos no agendamento.']
  },
`;
rep('  ecg:{', BIO + '  ecg:{');

// --- Nome do pedido médico (3º item) + sinônimos de busca (4º item) ---
// ATENÇÃO: nomenclatura padrão de pedido médico; conferir com a tabela da clínica.
const PEDIDO = {
  'Ressonância de crânio':'RM Crânio (Encéfalo)', 'Ressonância de coluna':'RM Coluna Cervical / Torácica / Lombar',
  'Ressonância de joelho':'RM Joelho', 'Ressonância de articulações':'RM Ombro / Quadril / Articulação',
  'Ressonância de abdome':'RM Abdome Superior / Total', 'Ressonância de próstata':'RM Próstata (Multiparamétrica)',
  'Tomografia de crânio':'TC Crânio', 'Tomografia de tórax':'TC Tórax', 'Tomografia de abdome':'TC Abdome Total',
  'Angiotomografia de coronárias':'Angiotomografia de Coronárias + Escore de Cálcio', 'Tomografia de seios da face':'TC Seios da Face',
  'US de abdome total':'US Abdome Total', 'US transvaginal / pélvico':'US Transvaginal / Pélvica', 'US de mamas':'US Mamas',
  'US de tireoide':'US Tireoide', 'US obstétrico':'US Obstétrica', 'Doppler de carótidas e vertebrais':'Doppler de Carótidas e Vertebrais',
  'Doppler vascular (pernas)':'Doppler Venoso / Arterial de Membros Inferiores', 'US de próstata':'US Próstata (via abdominal)',
  'US de bolsa escrotal com Doppler':'US Bolsa Escrotal com Doppler',
  'Mamografia digital de rastreamento':'Mamografia Digital Bilateral', 'Mamografia diagnóstica':'Mamografia Digital Bilateral',
  'Raio-X de tórax':'RX Tórax PA e Perfil', 'Raio-X de coluna':'RX Coluna Cervical / Torácica / Lombar',
  'Raio-X de ossos e articulações':'RX Ossos e Articulações', 'Raio-X de abdome':'RX Abdome Simples',
  'Densitometria de coluna e fêmur':'Densitometria Óssea (Coluna e Fêmur)', 'Eletrocardiograma de repouso':'ECG Convencional'
};
s = s.replace(/\['([^'\]]+)','([^'\]]+)'\]/g, (m, a, b) => PEDIDO[a] ? `['${a}','${b}','${PEDIDO[a]}']` : m);
// RM cardíaca — um item só, achável pelos sinônimos que a clínica passou
rep("      ['Ressonância de próstata',",
    "      ['Ressonância cardíaca','Dinâmica, com e sem estresse — avaliação do coração e do miocárdio','RM Cardíaca','rm coracao rm dinamica cardiaca rm miocardio rm morfologica cardiaca ressonancia do coracao estresse'],\n      ['Ressonância de próstata',");

// exibição: linha "No pedido médico:"
rep('<div><b>${e[0]}</b><small>${e[1]}</small></div></div>`',
    '<div><b>${e[0]}</b><small>${e[1]}</small>${e[2]?`<span class="pedido">No pedido médico: ${e[2]}</span>`:\'\'}</div></div>`');
rep('.exam-item small{color:var(--cinza);font-size:.85rem}',
    '.exam-item small{color:var(--cinza);font-size:.85rem;display:block}\n.exam-item .pedido{display:block;margin-top:5px;font-size:.8rem;font-weight:700;color:var(--terra)}');
// CTA com texto próprio quando o nome não cabe na frase
rep("<h2>Vamos agendar ${m.gen} ${m.nome.split(' com ')[0].split(' (')[0].toLowerCase()}?</h2>",
    "<h2>${m.cta || `Vamos agendar ${m.gen} ${m.nome.split(' com ')[0].split(' (')[0].toLowerCase()}?`}</h2>");

// busca: nome comum, nome do pedido, sinônimos e descrição
s = s.replace(/const ALL = \[\];\nfor\(const k in MODALIDADES\)\{[^\n]*\n/,
  "const ALL = [];\nfor(const k in MODALIDADES){ MODALIDADES[k].exames.forEach(e=>ALL.push({label:e[0],key:k,busca:e.join(' ')})); ALL.push({label:MODALIDADES[k].nome,key:k,busca:MODALIDADES[k].nome}); }\n");
rep('ALL.filter(x=>norm(x.label).includes(norm(q)))', 'ALL.filter(x=>norm(x.busca).includes(norm(q)))');

fs.writeFileSync('index.html', s);
console.log('ok');
