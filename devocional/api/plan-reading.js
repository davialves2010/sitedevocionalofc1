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
  bookLabel: "Evangelho de João",
  getReference: (day) => ({ book: "jo", chapter: day })
};

const PROVERBIOS_31_DIAS = {
  duration: 31,
  type: "chapter",
  bookLabel: "livro de Provérbios",
  getReference: (day) => ({ book: "pv", chapter: day })
};

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

const FRUTOS_9_DIAS = {
  duration: 9,
  type: "verse",
  references: [
    { book: "1co", chapter: 13, verse: 4 },   // Amor
    { book: "sl",  chapter: 16, verse: 11 },  // Alegria
    { book: "fp",  chapter: 4,  verse: 7 },   // Paz
    { book: "tg",  chapter: 1,  verse: 4 },   // Paciência
    { book: "ef",  chapter: 4,  verse: 32 },  // Amabilidade
    { book: "sl",  chapter: 23, verse: 6 },   // Bondade
    { book: "lm",  chapter: 3,  verse: 23 },  // Fidelidade
    { book: "mt",  chapter: 11, verse: 29 },  // Mansidão
    { book: "2tm", chapter: 1,  verse: 7 }    // Domínio próprio
  ]
};

const LOUVOR_14_DIAS = {
  duration: 14,
  type: "verse",
  topicLabel: "louvor e adoração através dos Salmos",
  references: [
    { book: "sl", chapter: 100, verse: 1 },
    { book: "sl", chapter: 150, verse: 6 },
    { book: "sl", chapter: 34,  verse: 1 },
    { book: "sl", chapter: 103, verse: 1 },
    { book: "sl", chapter: 95,  verse: 1 },
    { book: "sl", chapter: 145, verse: 3 },
    { book: "sl", chapter: 8,   verse: 1 },
    { book: "sl", chapter: 92,  verse: 1 },
    { book: "sl", chapter: 63,  verse: 3 },
    { book: "sl", chapter: 96,  verse: 1 },
    { book: "sl", chapter: 47,  verse: 1 },
    { book: "sl", chapter: 33,  verse: 1 },
    { book: "sl", chapter: 138, verse: 1 },
    { book: "sl", chapter: 149, verse: 1 }
  ]
};

/* =========================================================================
   PARTE 1 — BACKEND: PLANS_DATA
========================================================================= */
 
// -------------------------------------------------------------
// CURTOS (5–7 DIAS)
// -------------------------------------------------------------
 
const DORMIR_7_DIAS = {
  duration: 7,
  type: "verse",
  topicLabel: "descanso e paz antes de dormir",
  references: [
    { book: "sl", chapter: 4, verse: 8 },
    { book: "sl", chapter: 127, verse: 2 },
    { book: "pv", chapter: 3, verse: 24 },
    { book: "sl", chapter: 91, verse: 1 },
    { book: "sl", chapter: 3, verse: 5 },
    { book: "mt", chapter: 11, verse: 28 },
    { book: "sl", chapter: 121, verse: 4 }
  ]
};
 
const RECOMECO_7_DIAS = {
  duration: 7,
  type: "verse",
  topicLabel: "novos começos e a graça de recomeçar",
  references: [
    { book: "lm", chapter: 3, verse: 23 },
    { book: "2co", chapter: 5, verse: 17 },
    { book: "fp", chapter: 3, verse: 13 },
    { book: "is", chapter: 43, verse: 19 },
    { book: "jl", chapter: 2, verse: 25 },
    { book: "ap", chapter: 21, verse: 5 },
    { book: "sl", chapter: 40, verse: 3 }
  ]
};
 
const DECISAO_5_DIAS = {
  duration: 5,
  type: "verse",
  topicLabel: "sabedoria e discernimento antes de uma decisão importante",
  references: [
    { book: "pv", chapter: 3, verse: 5 },
    { book: "tg", chapter: 1, verse: 5 },
    { book: "sl", chapter: 32, verse: 8 },
    { book: "is", chapter: 30, verse: 21 },
    { book: "pv", chapter: 16, verse: 9 }
  ]
};
 
// -------------------------------------------------------------
// EMOCIONAIS (10–14 DIAS)
// -------------------------------------------------------------
 
const LUTO_10_DIAS = {
  duration: 10,
  type: "verse",
  topicLabel: "conforto e esperança em meio ao luto",
  references: [
    { book: "sl", chapter: 34, verse: 18 },
    { book: "mt", chapter: 5, verse: 4 },
    { book: "ap", chapter: 21, verse: 4 },
    { book: "jo", chapter: 11, verse: 25 },
    { book: "sl", chapter: 147, verse: 3 },
    { book: "2co", chapter: 1, verse: 4 },
    { book: "is", chapter: 61, verse: 3 },
    { book: "1ts", chapter: 4, verse: 14 },
    { book: "sl", chapter: 23, verse: 4 },
    { book: "jo", chapter: 14, verse: 1 }
  ]
};
 
const SOLIDAO_10_DIAS = {
  duration: 10,
  type: "verse",
  topicLabel: "a presença de Deus em momentos de solidão",
  references: [
    { book: "dt", chapter: 31, verse: 6 },
    { book: "hb", chapter: 13, verse: 5 },
    { book: "sl", chapter: 68, verse: 6 },
    { book: "is", chapter: 41, verse: 10 },
    { book: "mt", chapter: 28, verse: 20 },
    { book: "sl", chapter: 25, verse: 16 },
    { book: "jo", chapter: 14, verse: 18 },
    { book: "sl", chapter: 27, verse: 10 },
    { book: "gn", chapter: 28, verse: 15 },
    { book: "rm", chapter: 8, verse: 39 }
  ]
};
 
const RAIVA_PERDAO_10_DIAS = {
  duration: 10,
  type: "verse",
  topicLabel: "lidar com a raiva e aprender a perdoar",
  references: [
    { book: "ef", chapter: 4, verse: 26 },
    { book: "cl", chapter: 3, verse: 13 },
    { book: "ef", chapter: 4, verse: 32 },
    { book: "mt", chapter: 6, verse: 14 },
    { book: "pv", chapter: 15, verse: 1 },
    { book: "tg", chapter: 1, verse: 19 },
    { book: "rm", chapter: 12, verse: 19 },
    { book: "mt", chapter: 18, verse: 22 },
    { book: "sl", chapter: 37, verse: 8 },
    { book: "lc", chapter: 6, verse: 37 }
  ]
};
 
const AUTOESTIMA_14_DIAS = {
  duration: 14,
  type: "verse",
  topicLabel: "identidade e valor próprio à luz de quem Deus diz que você é",
  references: [
    { book: "gn", chapter: 1, verse: 27 },
    { book: "sl", chapter: 139, verse: 14 },
    { book: "jr", chapter: 29, verse: 11 },
    { book: "ef", chapter: 2, verse: 10 },
    { book: "sl", chapter: 139, verse: 13 },
    { book: "is", chapter: 43, verse: 4 },
    { book: "1pe", chapter: 2, verse: 9 },
    { book: "rm", chapter: 8, verse: 1 },
    { book: "2co", chapter: 5, verse: 17 },
    { book: "sf", chapter: 3, verse: 17 },
    { book: "sl", chapter: 34, verse: 5 },
    { book: "jo", chapter: 1, verse: 12 },
    { book: "gl", chapter: 2, verse: 20 },
    { book: "1jo", chapter: 3, verse: 1 }
  ]
};
 
// -------------------------------------------------------------
// RELACIONAIS (10–14 DIAS)
// -------------------------------------------------------------
 
const CASAMENTO_14_DIAS = {
  duration: 14,
  type: "verse",
  topicLabel: "amor, companheirismo e construção de um casamento saudável",
  references: [
    { book: "gn", chapter: 2, verse: 24 },
    { book: "ec", chapter: 4, verse: 9 },
    { book: "1co", chapter: 13, verse: 4 },
    { book: "ef", chapter: 5, verse: 25 },
    { book: "ef", chapter: 5, verse: 33 },
    { book: "pv", chapter: 31, verse: 10 },
    { book: "ct", chapter: 8, verse: 7 },
    { book: "cl", chapter: 3, verse: 14 },
    { book: "1pe", chapter: 3, verse: 7 },
    { book: "rm", chapter: 12, verse: 10 },
    { book: "pv", chapter: 18, verse: 22 },
    { book: "fp", chapter: 2, verse: 3 },
    { book: "ec", chapter: 4, verse: 12 },
    { book: "1co", chapter: 7, verse: 3 }
  ]
};
 
const PAIS_FILHOS_14_DIAS = {
  duration: 14,
  type: "verse",
  topicLabel: "criação, paciência e herança espiritual entre pais e filhos",
  references: [
    { book: "dt", chapter: 6, verse: 6 },
    { book: "pv", chapter: 22, verse: 6 },
    { book: "ef", chapter: 6, verse: 4 },
    { book: "sl", chapter: 127, verse: 3 },
    { book: "pv", chapter: 29, verse: 17 },
    { book: "cl", chapter: 3, verse: 21 },
    { book: "pv", chapter: 3, verse: 12 },
    { book: "3jo", chapter: 1, verse: 4 },
    { book: "sl", chapter: 78, verse: 4 },
    { book: "pv", chapter: 17, verse: 6 },
    { book: "is", chapter: 54, verse: 13 },
    { book: "mt", chapter: 19, verse: 14 },
    { book: "pv", chapter: 1, verse: 8 },
    { book: "ef", chapter: 6, verse: 1 }
  ]
};
 
const PERDOANDO_10_DIAS = {
  duration: 10,
  type: "verse",
  topicLabel: "o processo de perdoar quem te feriu",
  references: [
    { book: "mt", chapter: 6, verse: 12 },
    { book: "lc", chapter: 23, verse: 34 },
    { book: "ef", chapter: 4, verse: 32 },
    { book: "cl", chapter: 3, verse: 13 },
    { book: "mt", chapter: 18, verse: 21 },
    { book: "rm", chapter: 12, verse: 18 },
    { book: "gn", chapter: 50, verse: 20 },
    { book: "mt", chapter: 5, verse: 44 },
    { book: "1pe", chapter: 3, verse: 9 },
    { book: "hb", chapter: 12, verse: 15 }
  ]
};
 
// -------------------------------------------------------------
// LIVROS BÍBLICOS (5–50 DIAS)
// -------------------------------------------------------------
 
const GENESIS_50_DIAS = {
  duration: 50,
  type: "chapter",
  bookLabel: "livro de Gênesis",
  getReference: (day) => ({ book: "gn", chapter: day })
};
 
const TIAGO_5_DIAS = {
  duration: 5,
  type: "chapter",
  bookLabel: "carta de Tiago",
  getReference: (day) => ({ book: "tg", chapter: day })
};
 
const SALMOS_ESSENCIAIS_30_DIAS = {
  duration: 30,
  type: "verse",
  topicLabel: "os Salmos mais essenciais da Bíblia",
  references: [
    { book: "sl", chapter: 23, verse: 1 },
    { book: "sl", chapter: 1, verse: 2 },
    { book: "sl", chapter: 27, verse: 1 },
    { book: "sl", chapter: 46, verse: 1 },
    { book: "sl", chapter: 91, verse: 1 },
    { book: "sl", chapter: 100, verse: 2 },
    { book: "sl", chapter: 103, verse: 2 },
    { book: "sl", chapter: 121, verse: 2 },
    { book: "sl", chapter: 139, verse: 1 },
    { book: "sl", chapter: 150, verse: 6 },
    { book: "sl", chapter: 8, verse: 1 },
    { book: "sl", chapter: 19, verse: 1 },
    { book: "sl", chapter: 34, verse: 1 },
    { book: "sl", chapter: 37, verse: 4 },
    { book: "sl", chapter: 42, verse: 1 },
    { book: "sl", chapter: 51, verse: 10 },
    { book: "sl", chapter: 62, verse: 1 },
    { book: "sl", chapter: 63, verse: 1 },
    { book: "sl", chapter: 84, verse: 1 },
    { book: "sl", chapter: 90, verse: 12 },
    { book: "sl", chapter: 96, verse: 1 },
    { book: "sl", chapter: 103, verse: 8 },
    { book: "sl", chapter: 118, verse: 24 },
    { book: "sl", chapter: 119, verse: 105 },
    { book: "sl", chapter: 126, verse: 5 },
    { book: "sl", chapter: 130, verse: 5 },
    { book: "sl", chapter: 133, verse: 1 },
    { book: "sl", chapter: 143, verse: 8 },
    { book: "sl", chapter: 145, verse: 18 },
    { book: "sl", chapter: 148, verse: 1 }
  ]
};
 
const AMOR_7_DIAS = {
  duration: 7,
  type: "verse",
  topicLabel: "o amor segundo 1 Coríntios 13 e outras passagens",
  references: [
    { book: "1co", chapter: 13, verse: 4 },
    { book: "1co", chapter: 13, verse: 5 },
    { book: "1co", chapter: 13, verse: 7 },
    { book: "1co", chapter: 13, verse: 13 },
    { book: "jo", chapter: 13, verse: 34 },
    { book: "1jo", chapter: 4, verse: 8 },
    { book: "jo", chapter: 15, verse: 13 }
  ]
};
 
// -------------------------------------------------------------
// CRESCIMENTO ESPIRITUAL (10–14 DIAS)
// -------------------------------------------------------------
 
const ORACAO_14_DIAS = {
  duration: 14,
  type: "verse",
  topicLabel: "aprender a orar e conversar com Deus",
  references: [
    { book: "mt", chapter: 6, verse: 9 },
    { book: "1ts", chapter: 5, verse: 17 },
    { book: "fp", chapter: 4, verse: 6 },
    { book: "tg", chapter: 5, verse: 16 },
    { book: "mc", chapter: 11, verse: 24 },
    { book: "1jo", chapter: 5, verse: 14 },
    { book: "sl", chapter: 145, verse: 18 },
    { book: "jr", chapter: 33, verse: 3 },
    { book: "mt", chapter: 7, verse: 7 },
    { book: "rm", chapter: 8, verse: 26 },
    { book: "ef", chapter: 6, verse: 18 },
    { book: "sl", chapter: 5, verse: 3 },
    { book: "lc", chapter: 18, verse: 1 },
    { book: "hb", chapter: 4, verse: 16 }
  ]
};
 
const CRISE_FINANCEIRA_14_DIAS = {
  duration: 14,
  type: "verse",
  topicLabel: "fé, provisão e sabedoria em tempos de aperto financeiro",
  references: [
    { book: "fp", chapter: 4, verse: 19 },
    { book: "ml", chapter: 3, verse: 10 },
    { book: "mt", chapter: 6, verse: 33 },
    { book: "pv", chapter: 3, verse: 9 },
    { book: "2co", chapter: 9, verse: 7 },
    { book: "lc", chapter: 6, verse: 38 },
    { book: "sl", chapter: 37, verse: 25 },
    { book: "hb", chapter: 13, verse: 5 },
    { book: "1tm", chapter: 6, verse: 6 },
    { book: "pv", chapter: 22, verse: 7 },
    { book: "dt", chapter: 8, verse: 18 },
    { book: "sl", chapter: 23, verse: 1 },
    { book: "mt", chapter: 6, verse: 20 },
    { book: "fp", chapter: 4, verse: 13 }
  ]
};
 
const TRABALHO_PROPOSITO_14_DIAS = {
  duration: 14,
  type: "verse",
  topicLabel: "trabalho, excelência e propósito no dia a dia",
  references: [
    { book: "cl", chapter: 3, verse: 23 },
    { book: "pv", chapter: 16, verse: 3 },
    { book: "ec", chapter: 3, verse: 22 },
    { book: "ef", chapter: 2, verse: 10 },
    { book: "pv", chapter: 14, verse: 23 },
    { book: "gn", chapter: 2, verse: 15 },
    { book: "cl", chapter: 3, verse: 17 },
    { book: "1co", chapter: 10, verse: 31 },
    { book: "pv", chapter: 12, verse: 24 },
    { book: "ec", chapter: 2, verse: 24 },
    { book: "sl", chapter: 90, verse: 17 },
    { book: "pv", chapter: 16, verse: 9 },
    { book: "rm", chapter: 12, verse: 11 },
    { book: "gl", chapter: 6, verse: 9 }
  ]
};
 
const ANSIEDADE_FUTURO_10_DIAS = {
  duration: 10,
  type: "verse",
  topicLabel: "confiar em Deus diante da incerteza do futuro",
  references: [
    { book: "mt", chapter: 6, verse: 34 },
    { book: "jr", chapter: 29, verse: 11 },
    { book: "pv", chapter: 16, verse: 9 },
    { book: "tg", chapter: 4, verse: 14 },
    { book: "is", chapter: 41, verse: 10 },
    { book: "sl", chapter: 37, verse: 5 },
    { book: "fp", chapter: 4, verse: 6 },
    { book: "hb", chapter: 13, verse: 8 },
    { book: "sl", chapter: 32, verse: 8 },
    { book: "rm", chapter: 8, verse: 28 }
  ]
};
 
// -------------------------------------------------------------
// SAZONAIS
// -------------------------------------------------------------
 
const ADVENTO_24_DIAS = {
  duration: 24,
  type: "verse",
  topicLabel: "o Advento — da promessa messiânica ao nascimento de Jesus",
  references: [
    { book: "is", chapter: 7, verse: 14 },
    { book: "is", chapter: 9, verse: 6 },
    { book: "mq", chapter: 5, verse: 2 },
    { book: "is", chapter: 11, verse: 1 },
    { book: "nm", chapter: 24, verse: 17 },
    { book: "gn", chapter: 3, verse: 15 },
    { book: "jr", chapter: 23, verse: 5 },
    { book: "is", chapter: 40, verse: 3 },
    { book: "ml", chapter: 3, verse: 1 },
    { book: "lc", chapter: 1, verse: 26 },
    { book: "lc", chapter: 1, verse: 31 },
    { book: "lc", chapter: 1, verse: 46 },
    { book: "mt", chapter: 1, verse: 20 },
    { book: "lc", chapter: 1, verse: 35 },
    { book: "lc", chapter: 2, verse: 1 },
    { book: "lc", chapter: 2, verse: 4 },
    { book: "lc", chapter: 2, verse: 6 },
    { book: "lc", chapter: 2, verse: 9 },
    { book: "lc", chapter: 2, verse: 10 },
    { book: "lc", chapter: 2, verse: 14 },
    { book: "lc", chapter: 2, verse: 15 },
    { book: "lc", chapter: 2, verse: 19 },
    { book: "mt", chapter: 2, verse: 1 },
    { book: "jo", chapter: 1, verse: 14 }
  ]
};
 
const PASCOA_7_DIAS = {
  duration: 7,
  type: "verse",
  topicLabel: "a Semana Santa — de Ramos à Ressurreição",
  references: [
    { book: "mt", chapter: 21, verse: 9 },
    { book: "mt", chapter: 26, verse: 26 },
    { book: "lc", chapter: 22, verse: 42 },
    { book: "jo", chapter: 19, verse: 30 },
    { book: "mt", chapter: 27, verse: 60 },
    { book: "mt", chapter: 28, verse: 6 },
    { book: "mt", chapter: 28, verse: 19 }
  ]
};
 
const ANO_NOVO_7_DIAS = {
  duration: 7,
  type: "verse",
  topicLabel: "recomeço, propósito e expectativa para um novo ano",
  references: [
    { book: "is", chapter: 43, verse: 19 },
    { book: "fp", chapter: 3, verse: 13 },
    { book: "2co", chapter: 5, verse: 17 },
    { book: "lm", chapter: 3, verse: 22 },
    { book: "pv", chapter: 16, verse: 3 },
    { book: "sl", chapter: 90, verse: 12 },
    { book: "ec", chapter: 3, verse: 1 }
  ]
};
 
// -------------------------------------------------------------
// Registro final — adicione tudo isso ao PLANS_DATA existente
// -------------------------------------------------------------
 
const NOVOS_PLANS_DATA = {
  
  joao21: JOAO_21_DIAS,
  ansiedade30: ANSIEDADE_30_DIAS,
  proverbios31: PROVERBIOS_31_DIAS,
  frutos9: FRUTOS_9_DIAS,
  louvor14: LOUVOR_14_DIAS,
    
  dormir7: DORMIR_7_DIAS,
  recomeco7: RECOMECO_7_DIAS,
  decisao5: DECISAO_5_DIAS,
 
  luto10: LUTO_10_DIAS,
  solidao10: SOLIDAO_10_DIAS,
  raivaPerdao10: RAIVA_PERDAO_10_DIAS,
  autoestima14: AUTOESTIMA_14_DIAS,
 
  casamento14: CASAMENTO_14_DIAS,
  paisFilhos14: PAIS_FILHOS_14_DIAS,
  perdoando10: PERDOANDO_10_DIAS,
 
  genesis50: GENESIS_50_DIAS,
  tiago5: TIAGO_5_DIAS,
  salmosEssenciais30: SALMOS_ESSENCIAIS_30_DIAS,
  amor7: AMOR_7_DIAS,
 
  oracao14: ORACAO_14_DIAS,
  criseFinanceira14: CRISE_FINANCEIRA_14_DIAS,
  trabalhoProposito14: TRABALHO_PROPOSITO_14_DIAS,
  ansiedadeFuturo10: ANSIEDADE_FUTURO_10_DIAS,
 
  advento24: ADVENTO_24_DIAS,
  pascoa7: PASCOA_7_DIAS,
  anoNovo7: ANO_NOVO_7_DIAS
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
  `Hoje é o dia ${day} de um plano de ${plan.duration} dias sobre ${plan.topicLabel}. ` +
  `O versículo de hoje é "${passageData.text}" (${reference}).`;

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
