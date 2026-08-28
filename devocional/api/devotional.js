// api/devotional.js
//
// Endpoint: GET /api/devotional
//
// Gera o devocional do dia combinando:
//  1) um versículo temático buscado na abibliadigital
//  2) uma citação reflexiva + texto devocional gerados pela API da Groq (gratuita)
//
// A chave da Groq fica só aqui no servidor (variável de ambiente
// GROQ_API_KEY), nunca no código do navegador.

const DAILY_THEMES = [
  { theme: "Fé", book: "hb", chapter: 11, verse: 1 },
  { theme: "Esperança", book: "rm", chapter: 15, verse: 13 },
  { theme: "Paz", book: "jo", chapter: 14, verse: 27 },
  { theme: "Amor", book: "1co", chapter: 13, verse: 4 },
  { theme: "Perseverança", book: "tg", chapter: 1, verse: 12 },
  { theme: "Gratidão", book: "1ts", chapter: 5, verse: 18 },
  { theme: "Confiança", book: "pv", chapter: 3, verse: 5 },
  { theme: "Coragem", book: "js", chapter: 1, verse: 9 },
  { theme: "Humildade", book: "mq", chapter: 6, verse: 8 },
  { theme: "Sabedoria", book: "tg", chapter: 1, verse: 5 },
  { theme: "Perdão", book: "ef", chapter: 4, verse: 32 },
  { theme: "Alegria", book: "ne", chapter: 8, verse: 10 },
  { theme: "Descanso", book: "mt", chapter: 11, verse: 28 },
  { theme: "Propósito", book: "jr", chapter: 29, verse: 11 },
  { theme: "Cura", book: "sl", chapter: 147, verse: 3 },
  { theme: "Provisão", book: "fp", chapter: 4, verse: 19 },
  { theme: "Proteção", book: "sl", chapter: 91, verse: 1 },
  { theme: "Renovação", book: "2co", chapter: 5, verse: 17 },
  { theme: "Serviço", book: "gl", chapter: 5, verse: 13 },
  { theme: "Gentileza", book: "cl", chapter: 3, verse: 12 },
  { theme: "Paciência", book: "rm", chapter: 12, verse: 12 },
  { theme: "Fidelidade", book: "lm", chapter: 3, verse: 22 },
  { theme: "Liberdade", book: "jo", chapter: 8, verse: 36 },
  { theme: "Consolo", book: "2co", chapter: 1, verse: 3 }
];

const BIBLE_API = "https://abibliadigital.api.br/api";
const BIBLE_VERSION = "nvi";

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

module.exports = async function handler(req, res) {
  try {
    const dateParam = req.query.date;
    const now = dateParam ? new Date(dateParam) : new Date();
    const index = dayOfYear(now) % DAILY_THEMES.length;
    const pick = DAILY_THEMES[index];

    // 1. Busca o versículo temático na abibliadigital
    const verseResponse = await fetch(
      `${BIBLE_API}/verses/${BIBLE_VERSION}/${pick.book}/${pick.chapter}/${pick.verse}`
    );

    if (!verseResponse.ok) {
      throw new Error(`Erro ao buscar versículo: ${verseResponse.status}`);
    }

    const verseData = await verseResponse.json();

    // 2. Gera a citação e a reflexão devocional com a API da Groq (gratuita)
    const GROQ_MODEL = "openai/gpt-oss-120b";

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.9,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "Você escreve conteúdo devocional cristão em português do Brasil, no " +
                "estilo do app Glorify: acolhedor, direto, linguagem simples, sem jargão " +
                "teológico pesado. Responda SOMENTE com um JSON válido, no formato exato: " +
                '{"quote":"uma frase reflexiva curta e original sobre o tema, sem atribuir ' +
                'a nenhuma pessoa real ou autor específico","devotionalTitle":"título curto ' +
                'para a reflexão","devotionalParagraphs":["parágrafo 1","parágrafo 2",' +
                '"parágrafo 3 com uma aplicação prática para o dia"]}'
            },
            {
              role: "user",
              content:
                `Tema de hoje: ${pick.theme}\n` +
                `Versículo: "${verseData.text}" (${verseData.book.name} ${verseData.chapter}:${verseData.number})\n\n` +
                "Escreva a citação e a reflexão devocional conectadas a esse tema e a esse versículo."
            }
          ]
        })
      }
    );

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      throw new Error(`Erro na API da Groq: ${groqResponse.status} - ${errorBody}`);
    }

    const groqData = await groqResponse.json();

    const rawText = groqData.choices[0].message.content;

    const parsed = JSON.parse(rawText);

    const devotional = {
      date: now.toISOString().slice(0, 10),
      theme: pick.theme,
      verse: {
        text: verseData.text,
        reference: `${verseData.book.name} ${verseData.chapter}:${verseData.number}`
      },
      quote: parsed.quote,
      devotionalTitle: parsed.devotionalTitle,
      devotionalParagraphs: parsed.devotionalParagraphs
    };

    // Cache de 1 hora no edge/CDN da Vercel (não é cache "global por dia",
    // mas já evita reprocessar a cada request dentro da mesma hora)
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json(devotional);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Não foi possível gerar o devocional de hoje.",
      debug: error.message
    });
  }
};
