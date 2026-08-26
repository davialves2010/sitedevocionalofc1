// api/plan-reading.js
//
// Endpoint: GET /api/plan-reading?plan=<id>&day=<n>
//
// Retorna a leitura de um dia específico de um plano de leitura sequencial:
//  1) a passagem bíblica daquele dia (versículo único ou capítulo completo),
//     buscada na abibliadigital
//  2) uma reflexão devocional gerada pela API da Groq (gratuita)
//
// Diferente do /api/devotional (que muda todo dia), aqui o conteúdo de um
// dia de um plano é sempre o mesmo — por isso o front-end guarda o
// resultado em cache para sempre (não por data).

const BIBLE_API = "https://abibliadigital.api.br/api";
const BIBLE_VERSION = "nvi";
const GROQ_MODEL = "openai/gpt-oss-120b";

// Evangelho de João tem 21 capítulos — um por dia.
const JOAO_21_DIAS = {
  duration: 21,
  type: "chapter",
  getReference: (day) => ({ book: "jo", chapter: day })
};

// 30 versículos curados sobre ansiedade, paz e confiança em Deus.
const ANSIEDADE_30_DIAS = {
  duration: 30,
  type: "verse",
  references: [
    { book: "sl", chapter: 23, verse: 1 },
    { book: "fp", chapter: 4, verse: 6 },
    { book: "mt", chapter: 6, verse: 34 },
    { book: "is", chapter: 41, verse: 10 },
    { book: "1pe", chapter: 5, verse: 7 },
    { book: "sl", chapter: 34, verse: 4 },
    { book: "jo", chapter: 14, verse: 27 },
    { book: "sl", chapter: 55, verse: 22 },
    { book: "pv", chapter: 3, verse: 5 },
    { book: "is", chapter: 26, verse: 3 },
    { book: "sl", chapter: 94, verse: 19 },
    { book: "fp", chapter: 4, verse: 7 },
    { book: "mt", chapter: 11, verse: 28 },
    { book: "sl", chapter: 121, verse: 1 },
    { book: "2tm", chapter: 1, verse: 7 },
    { book: "sl", chapter: 46, verse: 1 },
    { book: "na", chapter: 1, verse: 7 },
    { book: "sl", chapter: 27, verse: 1 },
    { book: "rm", chapter: 8, verse: 28 },
    { book: "sl", chapter: 62, verse: 1 },
    { book: "hb", chapter: 13, verse: 6 },
    { book: "sl", chapter: 16, verse: 8 },
    { book: "lm", chapter: 3, verse: 22 },
    { book: "sl", chapter: 4, verse: 8 },
    { book: "jo", chapter: 16, verse: 33 },
    { book: "sl", chapter: 121, verse: 7 },
    { book: "dt", chapter: 31, verse: 6 },
    { book: "sl", chapter: 143, verse: 8 },
    { book: "pv", chapter: 12, verse: 25 },
    { book: "nm", chapter: 6, verse: 24 }
  ]
};

const PLANS_DATA = {
  joao21: JOAO_21_DIAS,
  ansiedade30: ANSIEDADE_30_DIAS
};

module.exports = async function handler(req, res) {
  try {
    const planId = req.query.plan;
    const day = Number(req.query.day);

    const plan = PLANS_DATA[planId];

    if (!plan || !day || day < 1 || day > plan.duration) {
      res.status(400).json({ error: "Plano ou dia inválido." });
      return;
    }

    let reference;
    let passageData;
    let promptContext;
    const result = {
      planId,
      day,
      totalDays: plan.duration,
      type: plan.type
    };

    if (plan.type === "chapter") {

      const referenceInfo = plan.getReference(day);

      const response = await fetch(
        `${BIBLE_API}/verses/${BIBLE_VERSION}/${referenceInfo.book}/${referenceInfo.chapter}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar capítulo: ${response.status}`);
      }

      passageData = await response.json();
      reference = `${passageData.book.name} ${passageData.chapter.number}`;

      promptContext =
        `Hoje é o dia ${day} de um plano de leitura de ${plan.duration} dias pelo ` +
        `Evangelho de João, lendo um capítulo por dia. A leitura de hoje é ${reference}.`;

      result.verses = passageData.verses.map((verse) => ({
        number: verse.number,
        text: verse.text
      }));

    } else {

      const referenceInfo = plan.references[day - 1];

      const response = await fetch(
        `${BIBLE_API}/verses/${BIBLE_VERSION}/${referenceInfo.book}/${referenceInfo.chapter}/${referenceInfo.verse}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar versículo: ${response.status}`);
      }

      passageData = await response.json();
      reference = `${passageData.book.name} ${passageData.chapter}:${passageData.number}`;

      promptContext =
        `Hoje é o dia ${day} de um plano de ${plan.duration} dias sobre ansiedade e ` +
        `confiança em Deus. O versículo de hoje é "${passageData.text}" (${reference}).`;

      result.passageText = passageData.text;
    }

    // Gera a reflexão devocional com a API da Groq
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.85,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Você escreve conteúdo devocional cristão em português do Brasil, no " +
              "estilo do app Glorify: acolhedor, direto, linguagem simples, sem jargão " +
              "teológico pesado. Responda SOMENTE com um JSON válido, no formato exato: " +
              '{"devotionalTitle":"título curto para a reflexão de hoje",' +
              '"devotionalParagraphs":["parágrafo 1","parágrafo 2","parágrafo 3 com ' +
              'uma aplicação prática para o dia"]}'
          },
          {
            role: "user",
            content:
              `${promptContext}\n\n` +
              "Escreva uma reflexão devocional curta conectada a essa leitura, " +
              "considerando que a pessoa está seguindo um plano sequencial (não " +
              "repita explicações básicas de dias anteriores, vá direto ao ponto de hoje)."
          }
        ]
      })
    });

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      throw new Error(`Erro na API da Groq: ${groqResponse.status} - ${errorBody}`);
    }

    const groqData = await groqResponse.json();
    const parsed = JSON.parse(groqData.choices[0].message.content);

    result.reference = reference;
    result.devotionalTitle = parsed.devotionalTitle;
    result.devotionalParagraphs = parsed.devotionalParagraphs;

    // Conteúdo de um dia específico de um plano nunca muda, então pode
    // ficar em cache por bastante tempo no CDN.
    res.setHeader("Cache-Control", "public, s-maxage=604800, stale-while-revalidate=2592000");
    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Não foi possível carregar a leitura de hoje."
    });
  }
};
