/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const API_URL = "https://abibliadigital.api.br/api";

// URL do backend próprio (Express + MongoDB, hospedado no Render).
// Se você renomear/recriar o serviço no Render, atualize essa URL.
const BACKEND_URL = "https://site-devocional-teste-backend.onrender.com";

// Client ID do "Continuar com Google" (console.cloud.google.com).
// Precisa ser o MESMO valor configurado como GOOGLE_CLIENT_ID no backend.
const GOOGLE_CLIENT_ID = "1051085437418-i3465u5bid5gc4pslirs2tam5kfkvr30.apps.googleusercontent.com";

let currentVersion = "nvi";

let currentVerse = {
    book: "sl",
    chapter: 23,
    verse: 1
};


/* =========================================================
   ELEMENTOS
========================================================= */

const $ = (id) => document.getElementById(id);

/* HOME */
const today = $("today");
const streak = $("streak");
const statsStreak = $("statsStreak");
const verseText = $("verseText");
const verseReference = $("verseReference");
const loading = $("loading");
const verseContent = $("verseContent");
const verseError = $("verseError");
const favoriteButton = $("favoriteButton");
const shareVerseButton = $("shareVerseButton");
const randomVerseButton = $("randomVerseButton");

/* DEVOCIONAL DIÁRIO */
const devotionalLoading = $("devotionalLoading");
const devotionalContent = $("devotionalContent");
const devotionalError = $("devotionalError");
const devotionalQuote = $("devotionalQuote");
const devotionalVerseText = $("devotionalVerseText");
const devotionalVerseRef = $("devotionalVerseRef");
const devotionalTitle = $("devotionalTitle");
const devotionalParagraphs = $("devotionalParagraphs");
const devotionalCompleteButton = $("devotionalCompleteButton");
const shareDevotionalButton = $("shareDevotionalButton");

/* CALENDÁRIO DE SEQUÊNCIA */
const calendarStreakCount = $("calendarStreakCount");
const calendarMonthLabel = $("calendarMonthLabel");
const calendarGrid = $("calendarGrid");
const calendarPrevButton = $("calendarPrevButton");
const calendarNextButton = $("calendarNextButton");

/* PLANOS DE LEITURA */
const plansShortcutButton = $("plansShortcutButton");
const plansList = $("plansList");
const planReading = $("planReading");
const planBackButton = $("planBackButton");
const planReadingTitle = $("planReadingTitle");
const planReadingDayLabel = $("planReadingDayLabel");
const planPrevDayButton = $("planPrevDayButton");
const planNextDayButton = $("planNextDayButton");
const planProgressFill = $("planProgressFill");
const planReadingLoading = $("planReadingLoading");
const planReadingContent = $("planReadingContent");
const planReadingError = $("planReadingError");
const planVerseCard = $("planVerseCard");
const planVerseText = $("planVerseText");
const planVerseReference = $("planVerseReference");
const planChapterCard = $("planChapterCard");
const planChapterTitle = $("planChapterTitle");
const planChapterVerses = $("planChapterVerses");
const planDevotionalTitle = $("planDevotionalTitle");
const planDevotionalParagraphs = $("planDevotionalParagraphs");
const planCompleteButton = $("planCompleteButton");

/* BÍBLIA */
const versionSelect = $("versionSelect");
const bookSelect = $("bookSelect");
const chapterSelect = $("chapterSelect");
const readChapterButton = $("readChapterButton");
const chapterContent = $("chapterContent");
const referenceInput = $("referenceInput");
const referenceButton = $("referenceButton");
const referenceStatus = $("referenceStatus");
const referenceSuggestions = $("referenceSuggestions");

/* BUSCA */
const searchForm = $("searchForm");
const searchInput = $("searchInput");
const searchStatus = $("searchStatus");
const searchResults = $("searchResults");

/* FAVORITOS */
const favoritesList = $("favoritesList");

/* REFLEXÕES */
const reflectionsList = $("reflectionsList");

/* MODAIS */
const prayerModal = $("prayerModal");
const noteModal = $("noteModal");
const noteInput = $("noteInput");


/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {
    favorites: "devocional_favorites",
    streak: "devocional_streak",
    theme: "devocional_theme",
    reflections: "devocional_reflections",
    completedDays: "devocional_completed_days",
    planProgress: "devocional_plan_progress",
    reminderTime: "devocional_reminder_time",
    reminderEnabled: "devocional_reminder_enabled",
    reminderLastShown: "devocional_reminder_last_shown",
    authToken: "devocional_auth_token",
    highlights: "devocional_highlights"   // <-- NOVO
};


/* =========================================================
   PLANOS DE LEITURA — DADOS
   (substitui o array PLANS atual em script.js — versão final,
   com TODOS os planos: os 2 originais + os 24 criados depois)
========================================================= */

const PLANS = [

    // ---------------------------------------------------
    // JÁ EXISTENTES DESDE O INÍCIO
    // ---------------------------------------------------
    {
        id: "joao21",
        title: "Evangelho de João",
        subtitle: "21 dias com Jesus",
        icon: "✝️",
        duration: 21,
        description:
            "Percorra o Evangelho de João, um capítulo por dia, e conheça mais " +
            "profundamente quem é Jesus."
    },
    {
        id: "ansiedade30",
        title: "Paz em meio à ansiedade",
        subtitle: "30 dias de confiança",
        icon: "🕊️",
        duration: 30,
        description:
            "Um mês de versículos e reflexões para entregar suas preocupações " +
            "a Deus e encontrar descanso."
    },

    // ---------------------------------------------------
    // PRIMEIRO LOTE DE SUGESTÕES
    // ---------------------------------------------------
    {
        id: "proverbios31",
        title: "Provérbios",
        subtitle: "31 dias de sabedoria",
        icon: "📖",
        duration: 31,
        description:
            "Um capítulo de Provérbios por dia — sabedoria prática para suas " +
            "decisões, relacionamentos e caráter."
    },
    {
        id: "frutos9",
        title: "Frutos do Espírito",
        subtitle: "9 dias, um fruto por dia",
        icon: "🍇",
        duration: 9,
        description:
            "Uma jornada por Gálatas 5:22-23: amor, alegria, paz, paciência, " +
            "amabilidade, bondade, fidelidade, mansidão e domínio próprio."
    },
    {
        id: "louvor14",
        title: "Salmos de Louvor",
        subtitle: "14 dias de adoração",
        icon: "🎶",
        duration: 14,
        description:
            "Catorze salmos que convidam você a louvar a Deus com alegria, " +
            "gratidão e reverência."
    },

    // ---------------------------------------------------
    // CURTOS (5–7 DIAS)
    // ---------------------------------------------------
    {
        id: "dormir7",
        title: "Antes de dormir",
        subtitle: "7 noites de descanso",
        icon: "🌙",
        duration: 7,
        description:
            "Versículos curtos para acalmar o coração e entregar o dia a Deus " +
            "antes de fechar os olhos."
    },
    {
        id: "recomeco7",
        title: "Recomeço",
        subtitle: "7 dias de graça renovada",
        icon: "🌱",
        duration: 7,
        description:
            "Para quando você precisa virar a página: um plano curto sobre a " +
            "misericórdia de Deus que se renova a cada manhã."
    },
    {
        id: "decisao5",
        title: "Antes de uma decisão",
        subtitle: "5 dias de sabedoria",
        icon: "🧭",
        duration: 5,
        description:
            "Um plano rápido para buscar discernimento e paz antes de tomar " +
            "uma decisão importante."
    },

    // ---------------------------------------------------
    // EMOCIONAIS (10–14 DIAS)
    // ---------------------------------------------------
    {
        id: "luto10",
        title: "Quando o luto pesa",
        subtitle: "10 dias de conforto",
        icon: "🕯️",
        duration: 10,
        description:
            "Palavras de consolo para acompanhar você nos dias difíceis depois " +
            "de uma perda."
    },
    {
        id: "solidao10",
        title: "Solidão",
        subtitle: "10 dias de companhia",
        icon: "🤍",
        duration: 10,
        description:
            "Versículos que lembram: mesmo nos dias mais sozinhos, Deus nunca " +
            "te deixa."
    },
    {
        id: "raivaPerdao10",
        title: "Raiva e perdão",
        subtitle: "10 dias para soltar o peso",
        icon: "🕊️",
        duration: 10,
        description:
            "Como lidar com a raiva sem guardar mágoa, e dar os primeiros " +
            "passos rumo ao perdão."
    },
    {
        id: "autoestima14",
        title: "Identidade em Deus",
        subtitle: "14 dias de valor próprio",
        icon: "✨",
        duration: 14,
        description:
            "Uma jornada para lembrar quem você é aos olhos de Deus — além das " +
            "comparações e da autocrítica."
    },

    // ---------------------------------------------------
    // RELACIONAIS (10–14 DIAS)
    // ---------------------------------------------------
    {
        id: "casamento14",
        title: "Casamento",
        subtitle: "14 dias de amor e cuidado",
        icon: "💍",
        duration: 14,
        description:
            "Sabedoria bíblica sobre amor, paciência e comunicação para " +
            "fortalecer seu casamento."
    },
    {
        id: "paisFilhos14",
        title: "Pais e filhos",
        subtitle: "14 dias de herança espiritual",
        icon: "👨‍👩‍👧",
        duration: 14,
        description:
            "Reflexões sobre criação, paciência e o legado de fé que passamos " +
            "para os filhos."
    },
    {
        id: "perdoando10",
        title: "Perdoando quem me feriu",
        subtitle: "10 dias de libertação",
        icon: "🤝",
        duration: 10,
        description:
            "Um caminho, passo a passo, para perdoar alguém que te machucou — " +
            "sem minimizar a dor."
    },

    // ---------------------------------------------------
    // LIVROS BÍBLICOS
    // ---------------------------------------------------
    {
        id: "genesis50",
        title: "Gênesis",
        subtitle: "50 dias pelas origens",
        icon: "🌍",
        duration: 50,
        description:
            "Percorra o livro de Gênesis, um capítulo por dia, e conheça as " +
            "origens da fé, da humanidade e das promessas de Deus."
    },
    {
        id: "tiago5",
        title: "Tiago",
        subtitle: "5 dias de fé prática",
        icon: "🔥",
        duration: 5,
        description:
            "Uma carta curta e direta sobre viver a fé no dia a dia — ótima " +
            "porta de entrada para ler um livro bíblico inteiro."
    },
    {
        id: "salmosEssenciais30",
        title: "Salmos essenciais",
        subtitle: "30 dias de louvor e lamento",
        icon: "📯",
        duration: 30,
        description:
            "Uma curadoria dos salmos mais conhecidos e amados, para orar e " +
            "louvar com as palavras que a Bíblia já nos deu."
    },
    {
        id: "amor7",
        title: "O Amor",
        subtitle: "7 dias em 1 Coríntios 13",
        icon: "❤️",
        duration: 7,
        description:
            "Um mergulho no capítulo mais conhecido sobre o amor — o que ele " +
            "é, o que não é, e por que ele é o maior de todos."
    },

    // ---------------------------------------------------
    // CRESCIMENTO ESPIRITUAL (10–14 DIAS)
    // ---------------------------------------------------
    {
        id: "oracao14",
        title: "Oração",
        subtitle: "14 dias para orar melhor",
        icon: "🙏",
        duration: 14,
        description:
            "Aprenda com exemplos bíblicos de oração e desenvolva o hábito de " +
            "conversar com Deus todos os dias."
    },
    {
        id: "criseFinanceira14",
        title: "Fé em tempos de aperto",
        subtitle: "14 dias sobre provisão",
        icon: "🌾",
        duration: 14,
        description:
            "Versículos sobre confiança, generosidade e provisão para " +
            "atravessar momentos financeiros difíceis."
    },
    {
        id: "trabalhoProposito14",
        title: "Trabalho e propósito",
        subtitle: "14 dias de excelência",
        icon: "💼",
        duration: 14,
        description:
            "Reflexões sobre como viver o chamado de Deus também na rotina de " +
            "trabalho, com excelência e sentido."
    },
    {
        id: "ansiedadeFuturo10",
        title: "Ansiedade sobre o futuro",
        subtitle: "10 dias de confiança",
        icon: "🌤️",
        duration: 10,
        description:
            "Para os dias em que o amanhã parece incerto demais: versículos " +
            "sobre entregar o futuro a Deus."
    },

    // ---------------------------------------------------
    // SAZONAIS
    // ---------------------------------------------------
    {
        id: "advento24",
        title: "Advento",
        subtitle: "24 dias até o Natal",
        icon: "⭐",
        duration: 24,
        description:
            "Da promessa profética ao nascimento de Jesus — acompanhe a " +
            "contagem regressiva para o Natal com a Palavra."
    },
    {
        id: "pascoa7",
        title: "Semana Santa",
        subtitle: "7 dias até a Páscoa",
        icon: "✝️",
        duration: 7,
        description:
            "De Domingo de Ramos à Ressurreição: reviva os últimos dias de " +
            "Jesus antes da Páscoa."
    },
    {
        id: "anoNovo7",
        title: "Ano Novo",
        subtitle: "7 dias de propósito",
        icon: "🎉",
        duration: 7,
        description:
            "Comece o ano com intenção: recomeço, propósito e expectativa para " +
            "os próximos 365 dias."
    }

];



/* =========================================================
   FAVORITOS
========================================================= */

function getFavorites() {
    return JSON.parse(localStorage.getItem(STORAGE.favorites) || "[]");
}

function saveFavorites(favorites) {
    localStorage.setItem(STORAGE.favorites, JSON.stringify(favorites));
    scheduleCloudSync();
}


/* =========================================================
   REFLEXÕES
========================================================= */

function getReflections() {
    return JSON.parse(localStorage.getItem(STORAGE.reflections) || "[]");
}

function saveReflections(reflections) {
    localStorage.setItem(STORAGE.reflections, JSON.stringify(reflections));
    scheduleCloudSync();
}


/* =========================================================
   DATA
========================================================= */

function showDate() {
    const date = new Date();
    today.textContent = date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

showDate();


/* =========================================================
   SEQUÊNCIA (STREAK) E CALENDÁRIO
========================================================= */

function pad(number) {
    return String(number).padStart(2, "0");
}

function dateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getCompletedDays() {
    return new Set(JSON.parse(localStorage.getItem(STORAGE.completedDays) || "[]"));
}

function saveCompletedDays(daysSet) {
    localStorage.setItem(STORAGE.completedDays, JSON.stringify([...daysSet]));
    scheduleCloudSync();
}

function calculateStreak(completedDays) {
    let count = 0;
    const cursor = new Date();

    // Se hoje ainda não foi concluído, a sequência conta a partir de
    // ontem (o dia de hoje ainda não "quebrou" a sequência).
    if (!completedDays.has(dateKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    while (completedDays.has(dateKey(cursor))) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
    }

    return count;
}

function calculateBestStreak(completedDays) {
    if (!completedDays.size) return 0;

    const sortedDates = [...completedDays]
        .map(key => new Date(`${key}T00:00:00`))
        .sort((a, b) => a - b);

    let best = 1;
    let current = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const diffDays = Math.round((sortedDates[i] - sortedDates[i - 1]) / 86400000);

        if (diffDays === 1) {
            current++;
        } else if (diffDays > 1) {
            current = 1;
        }

        best = Math.max(best, current);
    }

    return best;
}

function updateStreakDisplays() {
    const value = calculateStreak(getCompletedDays());

    streak.textContent = value;
    statsStreak.textContent = value;

    if (calendarStreakCount) {
        calendarStreakCount.textContent = value;
    }

    const isLit = value > 0;

    const homeFlameIcon = $("homeFlameIcon");
    const statsFlameIcon = document.querySelector(".stats-icon");
    const summaryFlameIcon = document.querySelector(".streak-summary-icon");

    [homeFlameIcon, statsFlameIcon, summaryFlameIcon].forEach(icon => {
        if (!icon) return;
        icon.classList.toggle("lit", isLit);
    });
}

function isTodayCompleted() {
    return getCompletedDays().has(dateKey(new Date()));
}

function updateCompleteButton() {
    if (!devotionalCompleteButton) return;

    if (isTodayCompleted()) {
        devotionalCompleteButton.textContent = "Concluído hoje ✓";
        devotionalCompleteButton.disabled = true;
    } else {
        devotionalCompleteButton.textContent = "Concluir devocional de hoje";
        devotionalCompleteButton.disabled = false;
    }
}

function markDevotionalComplete() {
    const completedDays = getCompletedDays();
    completedDays.add(dateKey(new Date()));

    saveCompletedDays(completedDays);

    updateStreakDisplays();
    updateCompleteButton();
    renderCalendar();
}

if (devotionalCompleteButton) {
    devotionalCompleteButton.addEventListener("click", markDevotionalComplete);
}


/* =========================================================
   CALENDÁRIO VISUAL
========================================================= */

let calendarViewDate = new Date();
calendarViewDate.setDate(1);

function renderCalendar() {
    if (!calendarGrid) return;

    const completedDays = getCompletedDays();
    const todayKeyValue = dateKey(new Date());

    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    calendarMonthLabel.textContent = calendarViewDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });

    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarGrid.innerHTML = "";

    for (let i = 0; i < firstWeekday; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-day empty";
        calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(year, month, day);
        const key = dateKey(cellDate);

        const cell = document.createElement("div");
        cell.className = "calendar-day";
        cell.textContent = day;

        if (completedDays.has(key)) {
            cell.classList.add("completed");
        }

        if (key === todayKeyValue) {
            cell.classList.add("today");
        }

        calendarGrid.appendChild(cell);
    }
}

if (calendarPrevButton) {
    calendarPrevButton.addEventListener("click", () => {
        calendarViewDate.setMonth(calendarViewDate.getMonth() - 1);
        renderCalendar();
    });
}

if (calendarNextButton) {
    calendarNextButton.addEventListener("click", () => {
        calendarViewDate.setMonth(calendarViewDate.getMonth() + 1);
        renderCalendar();
    });
}

updateStreakDisplays();


/* =========================================================
   API DA BÍBLIA
========================================================= */

async function apiGet(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
    }

    return response.json();
}


/* =========================================================
   VERSÍCULO
========================================================= */

async function loadVerse(
    book = currentVerse.book,
    chapter = currentVerse.chapter,
    verse = currentVerse.verse
) {
    loading.classList.remove("hidden");
    verseContent.classList.add("hidden");
    verseError.classList.add("hidden");

    try {
        const data = await apiGet(`/verses/${currentVersion}/${book}/${chapter}/${verse}`);

        currentVerse = { book, chapter, verse };

        verseText.textContent = `"${data.text}"`;
        verseReference.textContent = `${data.book.name} ${data.chapter}:${data.number}`;

        // GRIFOS: identifica esse trecho para permitir grifar/anotar
        verseText.dataset.sourceKey = `bible:${currentVersion}:${book}:${data.chapter}:${data.number}`;
        verseText.dataset.sourceType = "bible";
        verseText.dataset.sourceLabel = `${data.book.name} ${data.chapter}:${data.number}`;

        loading.classList.add("hidden");
        verseContent.classList.remove("hidden");

        updateFavoriteButton();
        applyStoredHighlights(verseContent);

    } catch (error) {
        console.error(error);

        loading.classList.add("hidden");

        verseError.textContent =
            "Não foi possível carregar o versículo. Verifique sua conexão ou tente novamente.";

        verseError.classList.remove("hidden");
    }
}


/* =========================================================
   VERSÍCULO ALEATÓRIO
========================================================= */

async function loadRandomVerse() {
    loading.classList.remove("hidden");
    verseContent.classList.add("hidden");
    verseError.classList.add("hidden");

    try {
        const data = await apiGet(`/verses/${currentVersion}/random`);

        currentVerse = {
            book: data.book.abbrev.pt,
            chapter: data.chapter,
            verse: data.number
        };

        verseText.textContent = `"${data.text}"`;
        verseReference.textContent = `${data.book.name} ${data.chapter}:${data.number}`;

        // GRIFOS
        verseText.dataset.sourceKey =
            `bible:${currentVersion}:${data.book.abbrev.pt}:${data.chapter}:${data.number}`;
        verseText.dataset.sourceType = "bible";
        verseText.dataset.sourceLabel = `${data.book.name} ${data.chapter}:${data.number}`;

        loading.classList.add("hidden");
        verseContent.classList.remove("hidden");

        updateFavoriteButton();
        applyStoredHighlights(verseContent);

    } catch (error) {
        console.error(error);

        loading.classList.add("hidden");

        verseError.textContent = "Não foi possível obter um versículo aleatório.";
        verseError.classList.remove("hidden");
    }
}

randomVerseButton.addEventListener("click", loadRandomVerse);


/* =========================================================
   ID DO VERSÍCULO
========================================================= */

function verseId(verse = currentVerse) {
    return [currentVersion, verse.book, verse.chapter, verse.verse].join("-");
}


/* =========================================================
   FAVORITO ATUAL
========================================================= */

function isFavorite() {
    const favorites = getFavorites();
    return favorites.some(item => item.id === verseId());
}

const HEART_OUTLINE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 ' +
    '5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';

const HEART_FILLED_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 ' +
    '5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';

function updateFavoriteButton() {
    if (isFavorite()) {
        favoriteButton.innerHTML = HEART_FILLED_SVG;
        favoriteButton.classList.add("saved");
    } else {
        favoriteButton.innerHTML = HEART_OUTLINE_SVG;
        favoriteButton.classList.remove("saved");
    }
}


/* =========================================================
   FAVORITAR VERSÍCULO
========================================================= */

favoriteButton.addEventListener("click", () => {
    const favorites = getFavorites();
    const id = verseId();

    if (favorites.some(item => item.id === id)) {

        const updated = favorites.filter(item => item.id !== id);
        saveFavorites(updated);

    } else {

        favorites.push({
            id,
            version: currentVersion,
            book: currentVerse.book,
            chapter: currentVerse.chapter,
            verse: currentVerse.verse,
            reference: verseReference.textContent,
            text: verseText.textContent,
            savedAt: new Date().toISOString()
        });

        saveFavorites(favorites);
    }

    updateFavoriteButton();
    renderFavorites();
});


/* =========================================================
   DEVOCIONAL DIÁRIO (gerado por IA)
========================================================= */

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

function renderDevotional(data) {
    devotionalQuote.textContent = data.quote;

    devotionalVerseText.textContent = `"${data.verse.text}"`;
    devotionalVerseRef.textContent = data.verse.reference;

    devotionalTitle.textContent = data.devotionalTitle;

    devotionalParagraphs.innerHTML = "";

    // GRIFOS: identifica quote, versículo e cada parágrafo
    const dayKey = data.date || todayKey();

    devotionalQuote.dataset.sourceKey = `devotional:${dayKey}:quote`;
    devotionalQuote.dataset.sourceType = "devotional";
    devotionalQuote.dataset.sourceLabel = `Devocional · ${data.verse.reference}`;

    devotionalVerseText.dataset.sourceKey = `devotional:${dayKey}:verse`;
    devotionalVerseText.dataset.sourceType = "devotional";
    devotionalVerseText.dataset.sourceLabel = `Devocional · ${data.verse.reference}`;

    data.devotionalParagraphs.forEach((paragraph, index) => {
        const p = document.createElement("p");
        p.textContent = paragraph;

        p.dataset.sourceKey = `devotional:${dayKey}:paragraph:${index}`;
        p.dataset.sourceType = "devotional";
        p.dataset.sourceLabel = `Devocional · ${data.devotionalTitle}`;

        devotionalParagraphs.appendChild(p);
    });

    devotionalLoading.classList.add("hidden");
    devotionalError.classList.add("hidden");
    devotionalContent.classList.remove("hidden");

    updateCompleteButton();
    applyStoredHighlights(devotionalContent);
}

async function loadDevotional() {
    const cacheKey = `devocional_diario_${todayKey()}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        renderDevotional(JSON.parse(cached));
        return;
    }

    devotionalLoading.classList.remove("hidden");
    devotionalContent.classList.add("hidden");
    devotionalError.classList.add("hidden");

    try {
        const response = await fetch(`${BACKEND_URL}/api/devotional`);

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        const data = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(data));

        renderDevotional(data);

    } catch (error) {
        console.error(error);

        devotionalLoading.classList.add("hidden");

        devotionalError.textContent = "Não foi possível carregar o devocional de hoje.";
        devotionalError.classList.remove("hidden");
    }
}


/* =========================================================
   LIVROS
========================================================= */

let bibleBooks = [];

async function loadBooks() {
    bookSelect.innerHTML = `<option>Carregando...</option>`;

    try {
        const books = await apiGet("/books");

        bookSelect.innerHTML = "";

        bibleBooks = books.map(book => ({
            abbrev: book.abbrev.pt,
            name: book.name,
            chapters: book.chapters
        }));

        bibleBooks.forEach(book => {
            const option = document.createElement("option");
            option.value = book.abbrev;
            option.textContent = book.name;
            option.dataset.chapters = book.chapters;
            bookSelect.appendChild(option);
        });

        bookSelect.value = "sl";

        loadChapters();

    } catch (error) {
        console.error(error);

        bookSelect.innerHTML = `<option>Não foi possível carregar os livros</option>`;
    }
}


/* =========================================================
   CAPÍTULOS
========================================================= */

function loadChapters() {
    const selected = bookSelect.options[bookSelect.selectedIndex];

    if (!selected) return;

    const chapters = Number(selected.dataset.chapters);

    chapterSelect.innerHTML = "";

    for (let i = 1; i <= chapters; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `Capítulo ${i}`;
        chapterSelect.appendChild(option);
    }
}

bookSelect.addEventListener("change", loadChapters);


/* =========================================================
   LER CAPÍTULO
========================================================= */

async function loadChapter() {
    const book = bookSelect.value;
    const chapter = chapterSelect.value;

    chapterContent.innerHTML = `
        <div class="skeleton skeleton-line w-35" style="height: 22px; margin-bottom: 22px;"></div>
        <div class="skeleton-verse">
            <div class="skeleton"></div>
            <div class="skeleton skeleton-line w-90" style="margin-bottom: 0;"></div>
        </div>
        <div class="skeleton-verse">
            <div class="skeleton"></div>
            <div class="skeleton skeleton-line w-70" style="margin-bottom: 0;"></div>
        </div>
        <div class="skeleton-verse">
            <div class="skeleton"></div>
            <div class="skeleton skeleton-line w-100" style="margin-bottom: 0;"></div>
        </div>
        <div class="skeleton-verse">
            <div class="skeleton"></div>
            <div class="skeleton skeleton-line w-50" style="margin-bottom: 0;"></div>
        </div>
    `;

    try {
        const data = await apiGet(`/verses/${currentVersion}/${book}/${chapter}`);

        chapterContent.innerHTML = "";

        const title = document.createElement("h2");
        title.className = "chapter-title";
        title.textContent = `${data.book.name} ${data.chapter.number}`;
        chapterContent.appendChild(title);

        data.verses.forEach(verse => {
            const wrapper = document.createElement("div");
            wrapper.className = "bible-verse";

            const number = document.createElement("span");
            number.className = "verse-number";
            number.textContent = verse.number;

            const content = document.createElement("div");
            content.className = "verse-reading";

            const text = document.createElement("div");
            text.textContent = verse.text;

            // GRIFOS: cada versículo vira uma "unidade" grifável
            text.dataset.sourceKey =
                `bible:${currentVersion}:${book}:${data.chapter.number}:${verse.number}`;
            text.dataset.sourceType = "bible";
            text.dataset.sourceLabel = `${data.book.name} ${data.chapter.number}:${verse.number}`;

            const actions = document.createElement("div");
            actions.className = "verse-actions";

            const saveButton = document.createElement("button");
            saveButton.className = "small-action";
            saveButton.innerHTML = `${HEART_OUTLINE_SVG} Salvar`;

            saveButton.addEventListener("click", () => {
                saveVerseFromChapter(data, verse);
                saveButton.innerHTML = `${HEART_FILLED_SVG} Salvo`;
            });

            actions.appendChild(saveButton);

            content.appendChild(text);
            content.appendChild(actions);

            wrapper.appendChild(number);
            wrapper.appendChild(content);

            chapterContent.appendChild(wrapper);
        });

        applyStoredHighlights(chapterContent);

    } catch (error) {
        console.error(error);

        chapterContent.innerHTML = `
            <div class="empty-state">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                <h2>Não foi possível carregar</h2>
                <p>Tente novamente em alguns instantes.</p>
            </div>
        `;
    }
}

readChapterButton.addEventListener("click", loadChapter);


/* =========================================================
   BUSCA AO VIVO POR REFERÊNCIA (livro, capítulo, versículo)
========================================================= */

function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Separa "João 3:16" em { bookNamePart: "João", chapter: 3, verse: 16 }
function parseReferenceInput(rawValue) {
    const value = rawValue.trim();

    const match = value.match(/^(.*?)\s*(\d+)?\s*(?::\s*(\d+))?$/);

    if (!match) {
        return { bookNamePart: value, chapter: null, verse: null };
    }

    const [, bookNamePart, chapter, verse] = match;

    return {
        bookNamePart: bookNamePart.trim(),
        chapter: chapter ? Number(chapter) : null,
        verse: verse ? Number(verse) : null
    };
}

function findBookMatches(bookNamePart) {
    if (!bookNamePart) return [];

    const normalizedQuery = normalizeText(bookNamePart);

    const startsWith = [];
    const includes = [];

    bibleBooks.forEach(book => {
        const normalizedName = normalizeText(book.name);

        if (normalizedName.startsWith(normalizedQuery)) {
            startsWith.push(book);
        } else if (normalizedName.includes(normalizedQuery)) {
            includes.push(book);
        }
    });

    return [...startsWith, ...includes];
}

function findExactBook(bookNamePart) {
    const normalizedQuery = normalizeText(bookNamePart);
    return bibleBooks.find(book => normalizeText(book.name) === normalizedQuery);
}

let highlightedSuggestionIndex = -1;
let currentSuggestions = [];

function renderSuggestions(matches) {
    currentSuggestions = matches;
    highlightedSuggestionIndex = -1;

    if (!matches.length) {
        referenceSuggestions.classList.add("hidden");
        referenceSuggestions.innerHTML = "";
        return;
    }

    referenceSuggestions.innerHTML = "";

    matches.slice(0, 8).forEach(book => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "reference-suggestion";

        const name = document.createElement("span");
        name.textContent = book.name;

        const chapters = document.createElement("small");
        chapters.textContent = `${book.chapters} cap.`;

        item.appendChild(name);
        item.appendChild(chapters);

        item.addEventListener("click", () => {
            referenceInput.value = `${book.name} `;
            referenceSuggestions.classList.add("hidden");
            referenceInput.focus();
        });

        referenceSuggestions.appendChild(item);
    });

    referenceSuggestions.classList.remove("hidden");
}

function updateHighlightedSuggestion() {
    const items = referenceSuggestions.querySelectorAll(".reference-suggestion");

    items.forEach((item, index) => {
        item.classList.toggle("highlighted", index === highlightedSuggestionIndex);
    });

    if (highlightedSuggestionIndex >= 0 && items[highlightedSuggestionIndex]) {
        items[highlightedSuggestionIndex].scrollIntoView({ block: "nearest" });
    }
}

if (referenceInput) {
    referenceInput.addEventListener("input", () => {
        if (!bibleBooks.length) return;

        const { bookNamePart, chapter } = parseReferenceInput(referenceInput.value);

        // Só mostra sugestões enquanto ainda faz sentido escolher o livro
        // (nenhum capítulo digitado ainda, ou o nome digitado não bate
        // exatamente com nenhum livro).
        const exactMatch = findExactBook(bookNamePart);

        if (!bookNamePart || (exactMatch && chapter)) {
            renderSuggestions([]);
            return;
        }

        renderSuggestions(findBookMatches(bookNamePart));
    });

    referenceInput.addEventListener("keydown", event => {
        if (referenceSuggestions.classList.contains("hidden")) {
            if (event.key === "Enter") {
                event.preventDefault();
                goToReference();
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            highlightedSuggestionIndex =
                Math.min(highlightedSuggestionIndex + 1, currentSuggestions.length - 1);
            updateHighlightedSuggestion();

        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            highlightedSuggestionIndex = Math.max(highlightedSuggestionIndex - 1, 0);
            updateHighlightedSuggestion();

        } else if (event.key === "Enter") {
            event.preventDefault();

            if (highlightedSuggestionIndex >= 0 && currentSuggestions[highlightedSuggestionIndex]) {
                const book = currentSuggestions[highlightedSuggestionIndex];
                referenceInput.value = `${book.name} `;
                renderSuggestions([]);
                referenceInput.focus();
            } else {
                renderSuggestions([]);
                goToReference();
            }

        } else if (event.key === "Escape") {
            renderSuggestions([]);
        }
    });

    document.addEventListener("click", event => {
        if (
            event.target !== referenceInput &&
            !referenceSuggestions.contains(event.target)
        ) {
            renderSuggestions([]);
        }
    });
}

async function goToReference() {
    if (!bibleBooks.length) {
        referenceStatus.textContent = "Aguarde os livros carregarem e tente de novo.";
        return;
    }

    const { bookNamePart, chapter, verse } = parseReferenceInput(referenceInput.value);

    if (!bookNamePart) {
        referenceStatus.textContent = "Digite um livro, ex: João 3:16.";
        return;
    }

    const matches = findBookMatches(bookNamePart);
    const book = findExactBook(bookNamePart) || matches[0];

    if (!book) {
        referenceStatus.textContent = `Livro "${bookNamePart}" não encontrado.`;
        return;
    }

    if (!chapter) {
        referenceStatus.textContent = `Informe o capítulo. Ex: ${book.name} 3.`;
        return;
    }

    if (chapter > book.chapters) {
        referenceStatus.textContent = `${book.name} só tem ${book.chapters} capítulos.`;
        return;
    }

    referenceStatus.textContent = `Carregando ${book.name} ${chapter}${verse ? ":" + verse : ""}...`;

    bookSelect.value = book.abbrev;
    loadChapters();
    chapterSelect.value = String(chapter);

    await loadChapter();

    referenceStatus.textContent = "";

    chapterContent.scrollIntoView({ behavior: "smooth", block: "start" });

    if (verse) {
        const verseElements = chapterContent.querySelectorAll(".bible-verse");

        const targetVerse = Array.from(verseElements).find(element => {
            const number = element.querySelector(".verse-number");
            return number && Number(number.textContent) === verse;
        });

        if (targetVerse) {
            setTimeout(() => {
                targetVerse.scrollIntoView({ behavior: "smooth", block: "center" });
                targetVerse.classList.add("verse-jump-highlight");

                setTimeout(() => {
                    targetVerse.classList.remove("verse-jump-highlight");
                }, 2400);
            }, 300);
        }
    }
}

if (referenceButton) {
    referenceButton.addEventListener("click", () => {
        renderSuggestions([]);
        goToReference();
    });
}


/* =========================================================
   SALVAR VERSÍCULO DO CAPÍTULO
========================================================= */

function saveVerseFromChapter(data, verse) {
    const favorites = getFavorites();

    const book = data.book.abbrev.pt;

    const id = [currentVersion, book, data.chapter.number, verse.number].join("-");

    if (favorites.some(item => item.id === id)) return;

    favorites.push({
        id,
        version: currentVersion,
        book,
        chapter: data.chapter.number,
        verse: verse.number,
        reference: `${data.book.name} ${data.chapter.number}:${verse.number}`,
        text: `"${verse.text}"`,
        savedAt: new Date().toISOString()
    });

    saveFavorites(favorites);
    renderFavorites();
}


/* =========================================================
   VERSÃO
========================================================= */

versionSelect.addEventListener("change", () => {
    currentVersion = versionSelect.value;
    loadVerse();
});


/* =========================================================
   BUSCA
========================================================= */

searchForm.addEventListener("submit", async event => {
    event.preventDefault();

    const term = searchInput.value.trim();

    if (!term) {
        searchStatus.textContent = "Digite uma palavra para pesquisar.";
        return;
    }

    searchStatus.textContent = "Pesquisando...";
    searchResults.innerHTML = "";

    try {
        const response = await fetch(`${API_URL}/verses/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                version: currentVersion,
                search: term
            })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        const data = await response.json();

        searchStatus.textContent =
            `${data.occurrence || data.verses.length} resultado(s) encontrado(s).`;

        if (!data.verses || !data.verses.length) {
            searchResults.innerHTML = `
                <div class="empty-state">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                    <h2>Nada encontrado</h2>
                    <p>Tente outra palavra.</p>
                </div>
            `;
            return;
        }

        data.verses.slice(0, 50).forEach(verse => {
            const item = document.createElement("article");
            item.className = "search-result";

            const strong = document.createElement("strong");
            strong.textContent = `${verse.book.name} ${verse.chapter}:${verse.number}`;

            const p = document.createElement("p");
            p.textContent = verse.text;

            item.appendChild(strong);
            item.appendChild(p);

            searchResults.appendChild(item);
        });

    } catch (error) {
        console.error(error);
        searchStatus.textContent = "Não foi possível realizar a busca.";
    }
});


/* =========================================================
   RENDERIZAR FAVORITOS
========================================================= */

function renderFavorites() {
    const favorites = getFavorites();

    favoritesList.innerHTML = "";

    if (!favorites.length) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg></span>
                <h2>Nenhum versículo salvo</h2>
                <p>Toque no coração de um versículo para salvá-lo.</p>
            </div>
        `;
        return;
    }

    favorites.slice().reverse().forEach(favorite => {
        const item = document.createElement("article");
        item.className = "favorite-item";

        const reference = document.createElement("span");
        reference.className = "reference";
        reference.textContent = favorite.reference;

        const text = document.createElement("p");
        text.textContent = favorite.text;

        const remove = document.createElement("button");
        remove.className = "remove-favorite";
        remove.textContent = "Remover";

        remove.addEventListener("click", () => {
            removeFavorite(favorite.id);
        });

        item.appendChild(reference);
        item.appendChild(text);
        item.appendChild(remove);

        favoritesList.appendChild(item);
    });
}


/* =========================================================
   REMOVER FAVORITO
========================================================= */

function removeFavorite(id) {
    const favorites = getFavorites();

    saveFavorites(favorites.filter(item => item.id !== id));

    renderFavorites();
    updateFavoriteButton();
}



/* =========================================================
   GRIFOS (HIGHLIGHTS)
========================================================= */

const HIGHLIGHT_COLORS = [
    { id: "yellow", hex: "#ffe08a" },
    { id: "green", hex: "#b7e4c7" },
    { id: "blue", hex: "#a9d6f5" },
    { id: "pink", hex: "#f6c1d9" }
];

function getHighlights() {
    return JSON.parse(localStorage.getItem(STORAGE.highlights) || "[]");
}

function saveHighlights(highlights) {
    localStorage.setItem(STORAGE.highlights, JSON.stringify(highlights));
    scheduleCloudSync();
}

function findHighlightsBySourceKey(sourceKey) {
    return getHighlights().filter(item => item.sourceKey === sourceKey);
}

// Aplica (desenha) os grifos já salvos em todos os elementos com
// data-source-key dentro de um container recém-renderizado.
function applyStoredHighlights(container) {
    if (!container) return;

    const units = container.querySelectorAll("[data-source-key]");

    units.forEach(unit => {
        const sourceKey = unit.dataset.sourceKey;
        const matches = findHighlightsBySourceKey(sourceKey);

        matches.forEach(highlight => {
            wrapTextInElement(unit, highlight.text, highlight.id, highlight.color);
        });
    });
}

// Procura "searchText" dentro dos nós de texto de "element" e envolve
// a primeira ocorrência com um <mark>. Funciona bem porque cada
// versículo/parágrafo do app é sempre um único nó de texto.
function wrapTextInElement(element, searchText, highlightId, color) {
    if (!element || !searchText) return false;

    if (element.querySelector(`mark[data-highlight-id="${highlightId}"]`)) {
        return true; // já desenhado
    }

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
        const index = node.nodeValue.indexOf(searchText);

        if (index !== -1) {
            const range = document.createRange();
            range.setStart(node, index);
            range.setEnd(node, index + searchText.length);

            const mark = document.createElement("mark");
            mark.className = "highlight-mark";
            mark.dataset.highlightId = highlightId;
            mark.style.backgroundColor = color;

            try {
                range.surroundContents(mark);
                mark.addEventListener("click", () => openHighlightModal("edit", highlightId));
                return true;
            } catch (error) {
                return false; // seleção cruzando mais de um nó — ignora
            }
        }
    }

    return false;
}

const HIGHLIGHTABLE_SELECTOR = "[data-source-key]";
const highlightToolbarButton = $("highlightToolbarButton");

let pendingSelection = null;

function getHighlightableAncestor(node) {
    let element = node.nodeType === 3 ? node.parentElement : node;

    while (element && element !== document.body) {
        if (element.matches && element.matches(HIGHLIGHTABLE_SELECTOR)) {
            return element;
        }
        element = element.parentElement;
    }

    return null;
}

function handleSelectionChange() {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        hideHighlightToolbar();
        return;
    }

    const text = selection.toString().trim();

    if (!text) {
        hideHighlightToolbar();
        return;
    }

    const range = selection.getRangeAt(0);
    const ancestor = getHighlightableAncestor(range.commonAncestorContainer);

    if (!ancestor) {
        hideHighlightToolbar();
        return;
    }

    pendingSelection = {
        range: range.cloneRange(),
        sourceKey: ancestor.dataset.sourceKey,
        sourceType: ancestor.dataset.sourceType || "bible",
        sourceLabel: ancestor.dataset.sourceLabel || "",
        text
    };

    const rect = range.getBoundingClientRect();

    highlightToolbarButton.style.left = `${rect.left + rect.width / 2}px`;
    highlightToolbarButton.style.top = `${rect.top}px`;
    highlightToolbarButton.classList.remove("hidden");
}

function hideHighlightToolbar() {
    if (highlightToolbarButton) {
        highlightToolbarButton.classList.add("hidden");
    }
    pendingSelection = null;
}

document.addEventListener("mouseup", handleSelectionChange);
document.addEventListener("touchend", handleSelectionChange);

if (highlightToolbarButton) {
    // Evita que o navegador perca a seleção de texto ao tocar no botão
    highlightToolbarButton.addEventListener("mousedown", event => event.preventDefault());
    highlightToolbarButton.addEventListener("touchstart", event => event.preventDefault());

    highlightToolbarButton.addEventListener("click", () => {
        if (!pendingSelection) return;
        openHighlightModal("create");
    });
}


/* =========================================================
   GRIFOS — MODAL
========================================================= */

const highlightModal = $("highlightModal");
const highlightQuotedText = $("highlightQuotedText");
const highlightColorPicker = $("highlightColorPicker");
const highlightNoteInput = $("highlightNoteInput");
const saveHighlightButton = $("saveHighlightButton");
const deleteHighlightButton = $("deleteHighlightButton");
const closeHighlightModalButton = $("closeHighlightModal");

let highlightModalMode = "create";
let editingHighlightId = null;
let selectedHighlightColor = HIGHLIGHT_COLORS[0].hex;

function renderHighlightColorPicker() {
    highlightColorPicker.innerHTML = "";

    HIGHLIGHT_COLORS.forEach(color => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "color-dot";
        dot.style.background = color.hex;
        dot.classList.toggle("selected", color.hex === selectedHighlightColor);

        dot.addEventListener("click", () => {
            selectedHighlightColor = color.hex;
            renderHighlightColorPicker();
        });

        highlightColorPicker.appendChild(dot);
    });
}

function openHighlightModal(mode, highlightId = null) {
    highlightModalMode = mode;

    if (mode === "create" && pendingSelection) {
        editingHighlightId = null;
        highlightQuotedText.textContent = `"${pendingSelection.text}"`;
        highlightNoteInput.value = "";
        selectedHighlightColor = HIGHLIGHT_COLORS[0].hex;
        deleteHighlightButton.classList.add("hidden");

    } else if (mode === "edit" && highlightId) {
        const highlight = getHighlights().find(item => item.id === highlightId);
        if (!highlight) return;

        editingHighlightId = highlightId;
        highlightQuotedText.textContent = `"${highlight.text}"`;
        highlightNoteInput.value = highlight.note || "";
        selectedHighlightColor = highlight.color;
        deleteHighlightButton.classList.remove("hidden");
    }

    renderHighlightColorPicker();
    hideHighlightToolbar();
    highlightModal.classList.remove("hidden");
}

function closeHighlightModalFn() {
    highlightModal.classList.add("hidden");
    editingHighlightId = null;
}

function removeHighlightMarkFromDom(highlightId) {
    const markElement = document.querySelector(`mark[data-highlight-id="${highlightId}"]`);
    if (!markElement) return;

    const parent = markElement.parentNode;
    while (markElement.firstChild) {
        parent.insertBefore(markElement.firstChild, markElement);
    }
    parent.removeChild(markElement);
    parent.normalize();
}

if (closeHighlightModalButton) {
    closeHighlightModalButton.addEventListener("click", closeHighlightModalFn);
}

if (highlightModal) {
    highlightModal.addEventListener("click", event => {
        if (event.target === highlightModal) closeHighlightModalFn();
    });
}

if (saveHighlightButton) {
    saveHighlightButton.addEventListener("click", () => {
        const note = highlightNoteInput.value.trim();

        if (highlightModalMode === "create" && pendingSelection) {
            const highlight = {
                id: `hl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                sourceType: pendingSelection.sourceType,
                sourceKey: pendingSelection.sourceKey,
                sourceLabel: pendingSelection.sourceLabel,
                text: pendingSelection.text,
                note,
                color: selectedHighlightColor,
                createdAt: new Date().toISOString()
            };

            const highlights = getHighlights();
            highlights.push(highlight);
            saveHighlights(highlights);

            const ancestor = getHighlightableAncestor(pendingSelection.range.commonAncestorContainer);
            wrapTextInElement(ancestor, highlight.text, highlight.id, highlight.color);

            window.getSelection().removeAllRanges();

        } else if (highlightModalMode === "edit" && editingHighlightId) {
            const highlights = getHighlights();
            const highlight = highlights.find(item => item.id === editingHighlightId);

            if (highlight) {
                highlight.note = note;
                highlight.color = selectedHighlightColor;
                saveHighlights(highlights);

                const markElement = document.querySelector(
                    `mark[data-highlight-id="${editingHighlightId}"]`
                );
                if (markElement) {
                    markElement.style.backgroundColor = selectedHighlightColor;
                }
            }
        }

        renderHighlightsList();
        closeHighlightModalFn();
    });
}

if (deleteHighlightButton) {
    deleteHighlightButton.addEventListener("click", () => {
        if (!editingHighlightId) return;

        const confirmed = confirm("Deseja remover este grifo?");
        if (!confirmed) return;

        saveHighlights(getHighlights().filter(item => item.id !== editingHighlightId));
        removeHighlightMarkFromDom(editingHighlightId);

        renderHighlightsList();
        closeHighlightModalFn();
    });
}


/* =========================================================
   GRIFOS — LISTA (aba Caminho)
========================================================= */

const highlightsList = $("highlightsList");

function renderHighlightsList() {
    if (!highlightsList) return;

    const highlights = getHighlights();

    highlightsList.innerHTML = "";

    if (!highlights.length) {
        highlightsList.innerHTML = `
            <div class="empty-state">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg></span>
                <h2>Nenhum grifo ainda</h2>
                <p>Selecione um trecho da Bíblia ou do devocional e toque em "Grifar".</p>
            </div>
        `;
        return;
    }

    highlights.slice().reverse().forEach(highlight => {
        const item = document.createElement("article");
        item.className = "highlight-item";

        const reference = document.createElement("div");
        reference.className = "reference";

        const dot = document.createElement("span");
        dot.className = "dot";
        dot.style.background = highlight.color;

        reference.appendChild(dot);
        reference.append(highlight.sourceLabel || "Grifo");

        const quote = document.createElement("blockquote");
        quote.textContent = `"${highlight.text}"`;
        quote.style.background = `${highlight.color}33`;

        item.appendChild(reference);
        item.appendChild(quote);

        if (highlight.note) {
            const note = document.createElement("p");
            note.className = "highlight-note";
            note.textContent = highlight.note;
            item.appendChild(note);
        }

        const actions = document.createElement("div");
        actions.className = "highlight-item-actions";

        const editButton = document.createElement("button");
        editButton.className = "secondary-button";
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () => openHighlightModal("edit", highlight.id));

        const removeButton = document.createElement("button");
        removeButton.className = "remove-favorite";
        removeButton.textContent = "Remover";
        removeButton.addEventListener("click", () => {
            const confirmed = confirm("Deseja remover este grifo?");
            if (!confirmed) return;

            saveHighlights(getHighlights().filter(h => h.id !== highlight.id));
            removeHighlightMarkFromDom(highlight.id);

            renderHighlightsList();
        });

        actions.appendChild(editButton);
        actions.appendChild(removeButton);
        item.appendChild(actions);

        highlightsList.appendChild(item);
    });
}



/* =========================================================
   NAVEGAÇÃO PRINCIPAL
========================================================= */

const navItems = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove("active-screen");
    });

    $(screenId).classList.add("active-screen");
}

navItems.forEach(button => {
    button.addEventListener("click", () => {
        const screenId = button.dataset.screen;

        navItems.forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        showScreen(screenId);

        if (screenId === "favoritesScreen") {
            renderFavorites();
        }

        if (screenId === "moreScreen") {
            renderFavorites();
            renderReflections();
        }
    });
});

const moreStatsButton = $("moreStatsButton");
const statsBackButton = $("statsBackButton");

if (moreStatsButton) {
    moreStatsButton.addEventListener("click", () => {
        showScreen("statsScreen");
        renderStatsScreen();
        renderJourneyCharts();
    });
}

if (statsBackButton) {
    statsBackButton.addEventListener("click", () => {
        showScreen("moreScreen");
    });
}


/* =========================================================
   NAVEGAÇÃO DENTRO DE CAMINHOS
========================================================= */

const pathTabs = document.querySelectorAll(".paths-tab");
const pathContents = document.querySelectorAll(".path-content");

pathTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.path;

        pathTabs.forEach(item => item.classList.remove("active"));
        pathContents.forEach(content => content.classList.remove("active-path"));

        tab.classList.add("active");

        const targetElement = document.getElementById(target);

        if (targetElement) {
            targetElement.classList.add("active-path");
        }

        if (target === "readingPlans") {
            planReading.classList.add("hidden");
            plansList.classList.remove("hidden");
            renderPlansList();
        }

        if (target === "savedVerses") {
            renderFavorites();
        }

        if (target === "reflections") {
            renderReflections();
        }

        if (target === "personalDevotionalsHistory") {
            renderPersonalDevotionalsHistory();
        }

        if (target === "streakCalendar") {
            renderCalendar();
            updateStreakDisplays();
        }

       if (target === "highlights") {
    renderHighlightsList();
}
       
       if (target === "groups") {
    groupDetail.classList.add("hidden");
    groupsList.classList.remove("hidden");
    loadMyGroups();
}
    });
});


/* =========================================================
   ORAÇÃO
========================================================= */

function openPrayer() {
    prayerModal.classList.remove("hidden");
}

function closePrayer() {
    prayerModal.classList.add("hidden");
}

$("prayerButton").addEventListener("click", openPrayer);
$("closePrayerModal").addEventListener("click", closePrayer);

prayerModal.addEventListener("click", event => {
    if (event.target === prayerModal) {
        closePrayer();
    }
});


/* =========================================================
   DIÁRIO
========================================================= */

function openNote() {
    noteInput.value = "";
    noteModal.classList.remove("hidden");
}

function closeNote() {
    noteModal.classList.add("hidden");
}

$("noteButton").addEventListener("click", openNote);
$("closeNoteModal").addEventListener("click", closeNote);


/* =========================================================
   SALVAR REFLEXÃO
========================================================= */

$("saveNoteButton").addEventListener("click", () => {
    const text = noteInput.value.trim();

    if (!text) {
        alert("Escreva alguma coisa antes de salvar sua reflexão.");
        return;
    }

    const reflections = getReflections();
    const now = new Date();

    const reflection = {
        id: Date.now(),
        text,
        createdAt: now.toISOString()
    };

    reflections.push(reflection);
    saveReflections(reflections);

    closeNote();
    renderReflections();

    alert("Sua reflexão foi salva. 🤍");
});

noteModal.addEventListener("click", event => {
    if (event.target === noteModal) {
        closeNote();
    }
});


/* =========================================================
   RENDERIZAR REFLEXÕES
========================================================= */

function renderReflections() {
    if (!reflectionsList) return;

    const reflections = getReflections();

    reflectionsList.innerHTML = "";

    if (!reflections.length) {
        reflectionsList.innerHTML = `
            <div class="reflections-empty">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></span>
                <h2>Nenhuma reflexão ainda</h2>
                <p>Escreva sobre o que Deus falou com você hoje.</p>
            </div>
        `;
        return;
    }

    reflections.slice().reverse().forEach(reflection => {
        const item = document.createElement("article");
        item.className = "reflection-item";

        const date = document.createElement("span");
        date.className = "reflection-date";

        const dateObject = new Date(reflection.createdAt);

        date.textContent = dateObject.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const text = document.createElement("p");
        text.textContent = reflection.text;

        const actions = document.createElement("div");
        actions.className = "reflection-actions";

        const remove = document.createElement("button");
        remove.className = "remove-reflection";
        remove.textContent = "Excluir";

        remove.addEventListener("click", () => {
            removeReflection(reflection.id);
        });

        actions.appendChild(remove);

        item.appendChild(date);
        item.appendChild(text);
        item.appendChild(actions);

        reflectionsList.appendChild(item);
    });
}


/* =========================================================
   REMOVER REFLEXÃO
========================================================= */

function removeReflection(id) {
    const confirmed = confirm("Deseja excluir esta reflexão?");

    if (!confirmed) return;

    const reflections = getReflections();

    saveReflections(reflections.filter(reflection => reflection.id !== id));

    renderReflections();
}


/* =========================================================
   TEMA
========================================================= */

const themeButton = $("themeButton");

const MOON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

const SUN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/>' +
    '<line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>' +
    '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
    '<line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>' +
    '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

function loadTheme() {
    const theme = localStorage.getItem(STORAGE.theme);

    if (theme === "dark") {
        document.body.classList.add("dark");
        themeButton.innerHTML = SUN_SVG;
    } else {
        themeButton.innerHTML = MOON_SVG;
    }
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    localStorage.setItem(STORAGE.theme, dark ? "dark" : "light");

    themeButton.innerHTML = dark ? SUN_SVG : MOON_SVG;

    scheduleCloudSync();
});

loadTheme();


/* =========================================================
   PLANOS DE LEITURA — PROGRESSO
========================================================= */

function getPlanProgress() {
    return JSON.parse(localStorage.getItem(STORAGE.planProgress) || "{}");
}

function savePlanProgress(progress) {
    localStorage.setItem(STORAGE.planProgress, JSON.stringify(progress));
    scheduleCloudSync();
}

function getPlanState(planId) {
    const progress = getPlanProgress();
    return progress[planId] || { completedDays: [] };
}


/* =========================================================
   PLANOS DE LEITURA — LISTA
========================================================= */

function renderPlansList() {
    if (!plansList) return;

    plansList.innerHTML = "";

    PLANS.forEach(plan => {
        const state = getPlanState(plan.id);
        const completedCount = state.completedDays.length;
        const isFinished = completedCount >= plan.duration;
        const hasStarted = completedCount > 0;

        const card = document.createElement("article");
        card.className = "plan-card";

        const icon = document.createElement("span");
        icon.className = "plan-icon";
        icon.textContent = plan.icon;

        const info = document.createElement("div");
        info.className = "plan-card-info";

        const title = document.createElement("strong");
        title.textContent = plan.title;

        const subtitle = document.createElement("small");
        subtitle.textContent = plan.subtitle;

        const description = document.createElement("p");
        description.textContent = plan.description;

        const progressBar = document.createElement("div");
        progressBar.className = "plan-progress-bar";

        const progressFill = document.createElement("div");
        progressFill.className = "plan-progress-fill";
        progressFill.style.width = `${Math.min(100, (completedCount / plan.duration) * 100)}%`;

        progressBar.appendChild(progressFill);

        const progressLabel = document.createElement("small");
        progressLabel.className = "plan-progress-label";
        progressLabel.textContent = isFinished
            ? `Plano concluído · ${plan.duration}/${plan.duration} dias`
            : `${completedCount}/${plan.duration} dias`;

        info.appendChild(title);
        info.appendChild(subtitle);
        info.appendChild(description);
        info.appendChild(progressBar);
        info.appendChild(progressLabel);

        const actionButton = document.createElement("button");
        actionButton.className = "plan-action-button";
        actionButton.textContent = isFinished
            ? "Ver de novo"
            : hasStarted
                ? "Continuar"
                : "Começar";

        actionButton.addEventListener("click", () => {
            openPlanReading(plan.id);
        });

        card.appendChild(icon);
        card.appendChild(info);
        card.appendChild(actionButton);

        plansList.appendChild(card);
    });
}

let featuredPlanId = null;

function getFeaturedPlan() {
    const progress = getPlanProgress();

    let candidate = null;

    PLANS.forEach(plan => {
        const state = progress[plan.id];
        if (!state || !state.completedDays || !state.completedDays.length) return;

        const isFinished = state.completedDays.length >= plan.duration;
        if (isFinished) return;

        const lastActivity = state.lastActivityAt ? new Date(state.lastActivityAt).getTime() : 0;

        if (!candidate || lastActivity > candidate.lastActivity) {
            candidate = { plan, state, lastActivity };
        }
    });

    return candidate;
}

const planShortcutIcon = $("planShortcutIcon");
const planShortcutLabel = $("planShortcutLabel");
const planShortcutTitle = $("planShortcutTitle");
const planShortcutDescription = $("planShortcutDescription");
const planShortcutProgressBar = $("planShortcutProgressBar");
const planShortcutProgressFill = $("planShortcutProgressFill");

function renderHomePlanShortcut() {
    if (!plansShortcutButton) return;

    const featured = getFeaturedPlan();

    if (featured) {
        const { plan, state } = featured;
        const nextDay = Math.min(state.completedDays.length + 1, plan.duration);

        featuredPlanId = plan.id;

        planShortcutIcon.textContent = plan.icon;
        planShortcutLabel.textContent = plan.title.toUpperCase();
        planShortcutTitle.textContent = `Dia ${nextDay} de ${plan.duration}`;
        planShortcutDescription.textContent = "Continue de onde você parou.";

        planShortcutProgressFill.style.width =
            `${Math.min(100, (state.completedDays.length / plan.duration) * 100)}%`;

        planShortcutProgressBar.classList.remove("hidden");
        plansShortcutButton.textContent = "Continuar";

    } else {
        featuredPlanId = null;

        planShortcutIcon.textContent = "📅";
        planShortcutLabel.textContent = "PLANOS DE LEITURA";
        planShortcutTitle.textContent = "Siga uma trilha";
        planShortcutDescription.textContent =
            "Percorra a Bíblia em trilhas guiadas, no seu ritmo, dia após dia.";

        planShortcutProgressBar.classList.add("hidden");
        plansShortcutButton.textContent = "Ver planos";
    }
}

if (plansShortcutButton) {
    plansShortcutButton.addEventListener("click", () => {
        document.querySelector('.nav-item[data-screen="pathScreen"]').click();
        document.querySelector('.paths-tab[data-path="readingPlans"]').click();

        if (featuredPlanId) {
            openPlanReading(featuredPlanId);
        }
    });
}


/* =========================================================
   PLANOS DE LEITURA — LEITURA DO DIA
========================================================= */

let currentPlan = null;
let currentPlanViewDay = 1;

function openPlanReading(planId) {
    const plan = PLANS.find(item => item.id === planId);
    if (!plan) return;

    const state = getPlanState(planId);

    const nextDay = Math.min(state.completedDays.length + 1, plan.duration);

    currentPlan = plan;
    currentPlanViewDay = nextDay;

    plansList.classList.add("hidden");
    planReading.classList.remove("hidden");

    loadPlanDay(plan, nextDay);
}

if (planBackButton) {
    planBackButton.addEventListener("click", () => {
        planReading.classList.add("hidden");
        plansList.classList.remove("hidden");
        renderPlansList();
    });
}

function updatePlanNavButtons() {
    if (!planPrevDayButton || !planNextDayButton || !currentPlan) return;

    planPrevDayButton.disabled = currentPlanViewDay <= 1;
    planNextDayButton.disabled = currentPlanViewDay >= currentPlan.duration;
}

if (planPrevDayButton) {
    planPrevDayButton.addEventListener("click", () => {
        if (!currentPlan || currentPlanViewDay <= 1) return;

        currentPlanViewDay -= 1;
        loadPlanDay(currentPlan, currentPlanViewDay);
    });
}

if (planNextDayButton) {
    planNextDayButton.addEventListener("click", () => {
        if (!currentPlan || currentPlanViewDay >= currentPlan.duration) return;

        currentPlanViewDay += 1;
        loadPlanDay(currentPlan, currentPlanViewDay);
    });
}

async function loadPlanDay(plan, day) {
    currentPlan = plan;
    currentPlanViewDay = day;

    planReadingTitle.textContent = plan.title.toUpperCase();
    planReadingDayLabel.textContent = `Dia ${day} de ${plan.duration}`;

    updatePlanNavButtons();

    const state = getPlanState(plan.id);
    planProgressFill.style.width =
        `${Math.min(100, (state.completedDays.length / plan.duration) * 100)}%`;

    planReadingLoading.classList.remove("hidden");
    planReadingContent.classList.add("hidden");
    planReadingError.classList.add("hidden");

    planVerseCard.classList.add("hidden");
    planChapterCard.classList.add("hidden");

    const cacheKey = `plano_leitura_${plan.id}_dia_${day}`;
    const cached = localStorage.getItem(cacheKey);

    try {
        let data;

        if (cached) {
            data = JSON.parse(cached);
        } else {
            const response = await fetch(`${BACKEND_URL}/api/plan-reading?plan=${plan.id}&day=${day}`);

            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status}`);
            }

            data = await response.json();

            localStorage.setItem(cacheKey, JSON.stringify(data));
        }

        renderPlanDay(plan, day, data);

    } catch (error) {
        console.error(error);

        planReadingLoading.classList.add("hidden");

        planReadingError.textContent = "Não foi possível carregar a leitura de hoje.";
        planReadingError.classList.remove("hidden");
    }
}

function renderPlanDay(plan, day, data) {
    if (data.type === "verse") {
        planVerseText.textContent = `"${data.passageText}"`;
        planVerseReference.textContent = data.reference;
        planVerseCard.classList.remove("hidden");

        // GRIFOS
        planVerseText.dataset.sourceKey = `plan:${plan.id}:${day}:passage`;
        planVerseText.dataset.sourceType = "bible";
        planVerseText.dataset.sourceLabel = `${plan.title} · Dia ${day} (${data.reference})`;

    } else {
        planChapterTitle.textContent = data.reference;
        planChapterVerses.innerHTML = "";

        data.verses.forEach(verse => {
            const wrapper = document.createElement("div");
            wrapper.className = "bible-verse";

            const number = document.createElement("span");
            number.className = "verse-number";
            number.textContent = verse.number;

            const content = document.createElement("div");
            content.className = "verse-reading";
            content.textContent = verse.text;

            // GRIFOS
            content.dataset.sourceKey = `plan:${plan.id}:${day}:verse:${verse.number}`;
            content.dataset.sourceType = "bible";
            content.dataset.sourceLabel = `${plan.title} · Dia ${day} (${data.reference}:${verse.number})`;

            wrapper.appendChild(number);
            wrapper.appendChild(content);

            planChapterVerses.appendChild(wrapper);
        });

        planChapterCard.classList.remove("hidden");
    }

    planDevotionalTitle.textContent = data.devotionalTitle;
    planDevotionalParagraphs.innerHTML = "";

    data.devotionalParagraphs.forEach((paragraph, index) => {
        const p = document.createElement("p");
        p.textContent = paragraph;

        // GRIFOS
        p.dataset.sourceKey = `plan:${plan.id}:${day}:paragraph:${index}`;
        p.dataset.sourceType = "devotional";
        p.dataset.sourceLabel = `${plan.title} · Dia ${day}`;

        planDevotionalParagraphs.appendChild(p);
    });

    planReadingLoading.classList.add("hidden");
    planReadingContent.classList.remove("hidden");

    const state = getPlanState(plan.id);
    const isCompleted = state.completedDays.includes(day);

    planCompleteButton.textContent = isCompleted ? "Dia concluído ✓" : "Concluir dia";
    planCompleteButton.disabled = isCompleted;

    planCompleteButton.onclick = () => completePlanDay(plan, day);

    applyStoredHighlights(planReadingContent);
}
function completePlanDay(plan, day) {
    const progress = getPlanProgress();
    const state = progress[plan.id] || { completedDays: [] };

    if (!state.completedDays.includes(day)) {
        state.completedDays.push(day);
    }

    state.lastActivityAt = new Date().toISOString();

    progress[plan.id] = state;
    savePlanProgress(progress);

    // Concluir uma leitura do plano também conta como o devocional do dia
    markDevotionalComplete();

    planProgressFill.style.width =
        `${Math.min(100, (state.completedDays.length / plan.duration) * 100)}%`;

    renderHomePlanShortcut();

    if (day < plan.duration) {
        loadPlanDay(plan, day + 1);
    } else {
        planCompleteButton.textContent = "Plano concluído! 🎉";
        planCompleteButton.disabled = true;
    }
}





/* =========================================================
   GRUPOS DE LEITURA
========================================================= */

const groupsList = $("groupsList");
const groupDetail = $("groupDetail");
const myGroupsList = $("myGroupsList");
const joinGroupCodeInput = $("joinGroupCodeInput");
const joinGroupButton = $("joinGroupButton");
const joinGroupStatus = $("joinGroupStatus");
const createGroupButton = $("createGroupButton");
const createGroupModal = $("createGroupModal");
const closeCreateGroupModalButton = $("closeCreateGroupModal");
const newGroupNameInput = $("newGroupNameInput");
const newGroupPlanSelect = $("newGroupPlanSelect");
const createGroupError = $("createGroupError");
const submitCreateGroupButton = $("submitCreateGroupButton");
const groupBackButton = $("groupBackButton");
const groupDetailPlanLabel = $("groupDetailPlanLabel");
const groupDetailName = $("groupDetailName");
const groupInviteCodeDisplay = $("groupInviteCodeDisplay");
const copyInviteCodeButton = $("copyInviteCodeButton");
const groupMembersList = $("groupMembersList");
const groupPostInput = $("groupPostInput");
const shareGroupPostButton = $("shareGroupPostButton");
const groupPostsList = $("groupPostsList");
const leaveGroupButton = $("leaveGroupButton");

let currentGroupId = null;
let currentGroupData = null;

function planTitleById(planId) {
    const plan = PLANS.find(item => item.id === planId);
    return plan ? plan.title : planId;
}

function populateGroupPlanSelect() {
    if (!newGroupPlanSelect) return;

    newGroupPlanSelect.innerHTML = "";

    PLANS.forEach(plan => {
        const option = document.createElement("option");
        option.value = plan.id;
        option.textContent = `${plan.icon} ${plan.title}`;
        newGroupPlanSelect.appendChild(option);
    });
}

/* --- Lista de grupos --- */

async function loadMyGroups() {
    if (!myGroupsList) return;

    if (!isLoggedIn()) {
        myGroupsList.innerHTML = `
            <div class="empty-state">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></span>
                <h2>Entre na sua conta</h2>
                <p>Crie uma conta ou entre para participar de grupos com amigos.</p>
            </div>
        `;
        return;
    }

    myGroupsList.innerHTML = `<div class="skeleton skeleton-block" style="height: 90px;"></div>`;

    try {
        const { groups } = await apiRequest("/api/groups", { method: "GET" });

        if (!groups.length) {
            myGroupsList.innerHTML = `
                <div class="empty-state">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></span>
                    <h2>Nenhum grupo ainda</h2>
                    <p>Crie um grupo ou entre com um código de convite.</p>
                </div>
            `;
            return;
        }

        myGroupsList.innerHTML = "";

        groups.forEach(group => {
            const card = document.createElement("article");
            card.className = "plan-card";

            const icon = document.createElement("span");
            icon.className = "plan-icon";
            icon.textContent = "👥";

            const info = document.createElement("div");
            info.className = "plan-card-info";

            const title = document.createElement("strong");
            title.textContent = group.name;

            const subtitle = document.createElement("small");
            subtitle.textContent = `${planTitleById(group.planId)} · ${group.memberCount}/10 pessoas`;

            info.appendChild(title);
            info.appendChild(subtitle);

            const actionButton = document.createElement("button");
            actionButton.className = "plan-action-button";
            actionButton.textContent = "Ver grupo";
            actionButton.addEventListener("click", () => openGroupDetail(group.id));

            card.appendChild(icon);
            card.appendChild(info);
            card.appendChild(actionButton);

            myGroupsList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        myGroupsList.innerHTML = `
            <div class="empty-state">
                <h2>Não foi possível carregar</h2>
                <p>Tente novamente em alguns instantes.</p>
            </div>
        `;
    }
}

/* --- Criar grupo --- */

if (createGroupButton) {
    createGroupButton.addEventListener("click", () => {
        if (!isLoggedIn()) {
            alert("Entre na sua conta pra criar um grupo.");
            return;
        }

        populateGroupPlanSelect();
        newGroupNameInput.value = "";
        createGroupError.classList.add("hidden");
        createGroupModal.classList.remove("hidden");
    });
}

if (closeCreateGroupModalButton) {
    closeCreateGroupModalButton.addEventListener("click", () => {
        createGroupModal.classList.add("hidden");
    });
}

if (createGroupModal) {
    createGroupModal.addEventListener("click", event => {
        if (event.target === createGroupModal) {
            createGroupModal.classList.add("hidden");
        }
    });
}

if (submitCreateGroupButton) {
    submitCreateGroupButton.addEventListener("click", async () => {
        const name = newGroupNameInput.value.trim();

        if (!name) {
            createGroupError.textContent = "Dê um nome para o grupo.";
            createGroupError.classList.remove("hidden");
            return;
        }

        submitCreateGroupButton.disabled = true;

        try {
            const { group } = await apiRequest("/api/groups", {
                method: "POST",
                body: JSON.stringify({ name, planId: newGroupPlanSelect.value })
            });

            createGroupModal.classList.add("hidden");

            await loadMyGroups();
            openGroupDetail(group.id);

        } catch (error) {
            createGroupError.textContent = error.message || "Não foi possível criar o grupo.";
            createGroupError.classList.remove("hidden");
        } finally {
            submitCreateGroupButton.disabled = false;
        }
    });
}

/* --- Entrar com código --- */

if (joinGroupButton) {
    joinGroupButton.addEventListener("click", async () => {
        if (!isLoggedIn()) {
            alert("Entre na sua conta pra participar de um grupo.");
            return;
        }

        const code = joinGroupCodeInput.value.trim();

        if (!code) {
            joinGroupStatus.textContent = "Digite um código de convite.";
            return;
        }

        joinGroupButton.disabled = true;
        joinGroupStatus.textContent = "Entrando...";

        try {
            const { group } = await apiRequest("/api/groups/join", {
                method: "POST",
                body: JSON.stringify({ inviteCode: code })
            });

            joinGroupCodeInput.value = "";
joinGroupStatus.textContent = "";

await loadMyGroups();
renderHomeGroupShortcut();   // <-- adicionar
openGroupDetail(group.id);

        } catch (error) {
            joinGroupStatus.textContent = error.message || "Não foi possível entrar no grupo.";
        } finally {
            joinGroupButton.disabled = false;
        }
    });
}

/* --- Detalhe do grupo --- */

async function openGroupDetail(groupId) {
    currentGroupId = groupId;

    groupsList.classList.add("hidden");
    groupDetail.classList.remove("hidden");

    groupMembersList.innerHTML = `<div class="skeleton skeleton-block" style="height: 60px;"></div>`;
    groupPostsList.innerHTML = "";

    try {
        const data = await apiRequest(`/api/groups/${groupId}`, { method: "GET" });
        currentGroupData = data;
        renderGroupDetail(data);
        loadGroupPosts(groupId);

    } catch (error) {
        console.error(error);
        groupMembersList.innerHTML = `
            <div class="empty-state">
                <h2>Não foi possível carregar</h2>
                <p>Tente novamente em alguns instantes.</p>
            </div>
        `;
    }
}

function renderGroupDetail(data) {
    const { group, members, planDuration } = data;

    groupDetailName.textContent = group.name;
    groupDetailPlanLabel.textContent = planTitleById(group.planId).toUpperCase();
    groupInviteCodeDisplay.value = group.inviteCode;

    groupMembersList.innerHTML = "";

    members.forEach(member => {
        const item = document.createElement("div");
        item.className = "group-member-item";

        const info = document.createElement("div");
        info.className = "group-member-info";

        const name = document.createElement("strong");
        name.textContent = member.name;

        const status = document.createElement("small");
        status.textContent = member.isFinished
            ? `Plano concluído · ${planDuration}/${planDuration} dias`
            : `Dia ${member.currentDay} de ${planDuration}`;

        info.appendChild(name);
        info.appendChild(status);

        const progressBar = document.createElement("div");
        progressBar.className = "plan-progress-bar group-member-progress";

        const progressFill = document.createElement("div");
        progressFill.className = "plan-progress-fill";
        progressFill.style.width = `${Math.min(100, (member.completedDays / planDuration) * 100)}%`;

        progressBar.appendChild(progressFill);

        item.appendChild(info);
        item.appendChild(progressBar);

        groupMembersList.appendChild(item);
    });
}

if (groupBackButton) {
    groupBackButton.addEventListener("click", () => {
        groupDetail.classList.add("hidden");
        groupsList.classList.remove("hidden");
        currentGroupId = null;
        currentGroupData = null;
        loadMyGroups();
    });
}

if (copyInviteCodeButton) {
    copyInviteCodeButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(groupInviteCodeDisplay.value);
            copyInviteCodeButton.textContent = "Copiado!";
            setTimeout(() => { copyInviteCodeButton.textContent = "Copiar"; }, 1800);
        } catch (error) {
            groupInviteCodeDisplay.select();
        }
    });
}

if (leaveGroupButton) {
    leaveGroupButton.addEventListener("click", async () => {
        if (!currentGroupId) return;

        const confirmed = confirm("Tem certeza que deseja sair deste grupo?");
        if (!confirmed) return;

        try {
            await apiRequest(`/api/groups/${currentGroupId}/leave`, { method: "POST" });

            groupDetail.classList.add("hidden");
            groupsList.classList.remove("hidden");
            currentGroupId = null;
            currentGroupData = null;

            loadMyGroups();
renderHomeGroupShortcut();   // <-- adicionar

        } catch (error) {
            alert(error.message || "Não foi possível sair do grupo.");
        }
    });
}

/* --- Reflexões do grupo --- */

async function loadGroupPosts(groupId) {
    groupPostsList.innerHTML = `<div class="skeleton skeleton-block" style="height: 70px;"></div>`;

    try {
        const { posts } = await apiRequest(`/api/groups/${groupId}/posts`, { method: "GET" });
        renderGroupPosts(posts);

    } catch (error) {
        console.error(error);
        groupPostsList.innerHTML = `<p style="color:var(--muted);font-size:13px;">Não foi possível carregar as reflexões.</p>`;
    }
}

function renderGroupPosts(posts) {
    groupPostsList.innerHTML = "";

    if (!posts.length) {
        groupPostsList.innerHTML = `
            <p style="color:var(--muted);font-size:13px;padding:10px 0;">
                Nenhuma reflexão compartilhada ainda. Seja o primeiro!
            </p>
        `;
        return;
    }

    posts.forEach(post => {
        const item = document.createElement("article");
        item.className = "group-post-item";

        const header = document.createElement("div");
        header.className = "group-post-header";

        const author = document.createElement("strong");
        author.textContent = post.authorName;

        const day = document.createElement("small");
        day.textContent = `Dia ${post.day}`;

        header.appendChild(author);
        header.appendChild(day);

        const text = document.createElement("p");
        text.textContent = post.text;

        const prayButton = document.createElement("button");
        prayButton.className = `group-pray-button${post.prayedByMe ? " prayed" : ""}`;
        prayButton.type = "button";
        prayButton.innerHTML = `🙏 <span>${post.prayedByCount}</span>`;

        prayButton.addEventListener("click", async () => {
            prayButton.disabled = true;
            try {
                const result = await apiRequest(`/api/groups/${currentGroupId}/posts/${post.id}/pray`, {
                    method: "POST"
                });
                prayButton.classList.toggle("prayed", result.prayedByMe);
                prayButton.innerHTML = `🙏 <span>${result.prayedByCount}</span>`;
            } catch (error) {
                console.error(error);
            } finally {
                prayButton.disabled = false;
            }
        });

        item.appendChild(header);
        item.appendChild(text);
        item.appendChild(prayButton);

        groupPostsList.appendChild(item);
    });
}

if (shareGroupPostButton) {
    shareGroupPostButton.addEventListener("click", async () => {
        if (!currentGroupId || !currentGroupData) return;

        const text = groupPostInput.value.trim();

        if (!text) {
            alert("Escreva algo antes de compartilhar.");
            return;
        }

        // Usa o dia atual do usuário logado dentro do plano do grupo
        const myMember = currentGroupData.members.find(
            m => String(m.userId) === String(currentUserId)
        );
        const day = myMember ? myMember.currentDay : 1;

        shareGroupPostButton.disabled = true;

        try {
            await apiRequest(`/api/groups/${currentGroupId}/posts`, {
                method: "POST",
                body: JSON.stringify({ day, text })
            });

            groupPostInput.value = "";
            loadGroupPosts(currentGroupId);

        } catch (error) {
            alert(error.message || "Não foi possível compartilhar sua reflexão.");
        } finally {
            shareGroupPostButton.disabled = false;
        }
    });
}

/* --- Atalho na Home --- */

const groupShortcutCard = $("groupShortcutCard");
const groupShortcutTitle = $("groupShortcutTitle");
const groupShortcutDescription = $("groupShortcutDescription");
const groupShortcutButton = $("groupShortcutButton");

let featuredGroupId = null;

async function renderHomeGroupShortcut() {
    if (!groupShortcutCard) return;

    if (!isLoggedIn()) {
        groupShortcutCard.classList.add("hidden");
        featuredGroupId = null;
        return;
    }

    try {
        const { groups } = await apiRequest("/api/groups", { method: "GET" });

        if (!groups.length) {
            groupShortcutCard.classList.add("hidden");
            featuredGroupId = null;
            return;
        }

        const featured = groups[0];
        featuredGroupId = featured.id;

        const detail = await apiRequest(`/api/groups/${featured.id}`, { method: "GET" });
        const myMember = detail.members.find(m => String(m.userId) === String(currentUserId));

        groupShortcutTitle.textContent = featured.name;

        if (myMember) {
            groupShortcutDescription.textContent = myMember.isFinished
                ? `Plano concluído · ${detail.planDuration}/${detail.planDuration} dias · ${featured.memberCount} pessoas`
                : `Você está no dia ${myMember.currentDay} de ${detail.planDuration} · ${featured.memberCount} pessoas`;
        } else {
            groupShortcutDescription.textContent = `${featured.memberCount} pessoas nesse grupo`;
        }

        groupShortcutCard.classList.remove("hidden");

    } catch (error) {
        console.error("Erro ao carregar atalho de grupo:", error);
        groupShortcutCard.classList.add("hidden");
        featuredGroupId = null;
    }
}

if (groupShortcutButton) {
    groupShortcutButton.addEventListener("click", () => {
        document.querySelector('.nav-item[data-screen="pathScreen"]').click();
        document.querySelector('.paths-tab[data-path="groups"]').click();

        if (featuredGroupId) {
            openGroupDetail(featuredGroupId);
        }
    });
}



/* =========================================================
   LIMPAR DADOS
========================================================= */

function clearAllLocalData() {
    localStorage.removeItem(STORAGE.favorites);
    localStorage.removeItem(STORAGE.streak);
    localStorage.removeItem(STORAGE.reflections);
    localStorage.removeItem(STORAGE.completedDays);
    localStorage.removeItem(STORAGE.planProgress);
    localStorage.removeItem(STORAGE.highlights); // <-- NOVO

    Object.keys(localStorage)
        .filter(key => key.startsWith("plano_leitura_"))
        .forEach(key => localStorage.removeItem(key));

    updateStreakDisplays();
    updateCompleteButton();
    renderCalendar();
    renderFavorites();
    renderReflections();
    renderPlansList();
    renderHomePlanShortcut();
    renderHighlightsList(); // <-- NOVO
}

$("clearDataButton").addEventListener("click", () => {
    const confirmed = confirm(
        "Deseja realmente apagar seus favoritos, sequência, reflexões e o " +
        "progresso dos seus planos de leitura?"
    );

    if (!confirmed) return;

    clearAllLocalData();

    alert("Dados apagados.");
});


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

renderFavorites();
renderReflections();
renderCalendar();
renderPlansList();
renderHomePlanShortcut();
renderHomeGroupShortcut();   // <-- adicionar
renderHighlightsList();
updateCompleteButton();
loadVerse();
loadBooks();
loadDevotional();


/* =========================================================
   PWA — SERVICE WORKER
========================================================= */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .catch(error => {
                console.error("Falha ao registrar o service worker:", error);
            });
    });
}


/* =========================================================
   PWA — INSTALAR APP
========================================================= */

const installAppButton = $("installAppButton");
const iosInstallTip = $("iosInstallTip");

let deferredInstallPrompt = null;

function isRunningStandalone() {
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
    );
}

window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;

    if (installAppButton) {
        installAppButton.classList.remove("hidden");
    }
});

if (installAppButton) {
    installAppButton.addEventListener("click", async () => {
        if (!deferredInstallPrompt) return;

        deferredInstallPrompt.prompt();

        await deferredInstallPrompt.userChoice;

        deferredInstallPrompt = null;
        installAppButton.classList.add("hidden");
    });
}

window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;

    if (installAppButton) {
        installAppButton.classList.add("hidden");
    }
});

// iOS Safari não dá suporte a beforeinstallprompt — mostramos uma dica
// com o passo a passo manual (Compartilhar → Adicionar à Tela de Início).
const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

if (isIos && !isRunningStandalone() && iosInstallTip) {
    iosInstallTip.classList.remove("hidden");
}


/* =========================================================

/* =========================================================
   PUSH — HELPER
========================================================= */

// O navegador espera a chave pública VAPID como Uint8Array, mas o
// backend manda ela em base64url — essa função faz a conversão.
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}


/* =========================================================
   LEMBRETE DIÁRIO (WEB PUSH REAL)
========================================================= */

const reminderTimeInput = $("reminderTimeInput");
const reminderToggleButton = $("reminderToggleButton");
const reminderStatus = $("reminderStatus");

function updateReminderUI(enabled) {
    if (!reminderToggleButton || !reminderStatus) return;

    if (enabled) {
        reminderToggleButton.textContent = "Desativar";
        reminderToggleButton.classList.add("active");

        reminderStatus.textContent =
            `Lembrete ativado para ${reminderTimeInput.value}. Agora funciona mesmo ` +
            "com o app fechado. No iPhone, precisa estar instalado na Tela de Início " +
            "(iOS 16.4 ou mais recente).";

    } else {
        reminderToggleButton.textContent = "Ativar";
        reminderToggleButton.classList.remove("active");
        reminderStatus.textContent = "";
    }
}

/* --- Inscrição push (registra este aparelho pra receber notificações) --- */

async function subscribeToPush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        alert("Seu navegador não é compatível com notificações push.");
        return false;
    }

    if (!isLoggedIn()) {
        alert("Entre na sua conta pra ativar o lembrete — o push precisa saber pra quem enviar.");
        return false;
    }

    try {
        const { publicKey } = await apiRequest("/api/push/vapid-public-key", { method: "GET" });

        const registration = await navigator.serviceWorker.ready;

        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            });
        }

        await apiRequest("/api/push/subscribe", {
            method: "POST",
            body: JSON.stringify({ subscription })
        });

        return true;

    } catch (error) {
        console.error("Erro ao inscrever para push:", error);
        return false;
    }
}

async function unsubscribeFromPush() {
    if (!("serviceWorker" in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();
        }

        if (isLoggedIn()) {
            await apiRequest("/api/push/unsubscribe", { method: "POST" }).catch(() => {});
        }
    } catch (error) {
        console.error("Erro ao desinscrever do push:", error);
    }
}

/* --- Botão ativar/desativar --- */

if (reminderToggleButton) {
    reminderToggleButton.addEventListener("click", async () => {
        const currentlyEnabled = localStorage.getItem(STORAGE.reminderEnabled) === "true";

        if (currentlyEnabled) {
            localStorage.setItem(STORAGE.reminderEnabled, "false");
            await unsubscribeFromPush();
            updateReminderUI(false);
            scheduleCloudSync();
            return;
        }

        if (!("Notification" in window)) {
            alert("Seu navegador não é compatível com notificações.");
            return;
        }

        let permission = Notification.permission;

        if (permission === "default") {
            permission = await Notification.requestPermission();
        }

        if (permission !== "granted") {
            alert("Pra ativar o lembrete, você precisa permitir notificações.");
            return;
        }

        const subscribed = await subscribeToPush();
        if (!subscribed) return;

        localStorage.setItem(STORAGE.reminderTime, reminderTimeInput.value);
        localStorage.setItem(STORAGE.reminderEnabled, "true");

        updateReminderUI(true);
        scheduleCloudSync();
    });
}

/* --- Trocar o horário --- */

if (reminderTimeInput) {
    reminderTimeInput.addEventListener("change", () => {
        localStorage.setItem(STORAGE.reminderTime, reminderTimeInput.value);

        const enabled = localStorage.getItem(STORAGE.reminderEnabled) === "true";

        if (enabled) {
            updateReminderUI(true);
        }

        scheduleCloudSync();
    });
}

/* --- Inicialização --- */

function loadReminderSettings() {
    if (!reminderTimeInput || !reminderToggleButton) return;

    const savedTime = localStorage.getItem(STORAGE.reminderTime) || "07:00";
    const enabled = localStorage.getItem(STORAGE.reminderEnabled) === "true";

    reminderTimeInput.value = savedTime;
    updateReminderUI(enabled);

    // Se o lembrete estava ativado mas a inscrição push deste aparelho
    // se perdeu (ex: trocou de navegador, limpou dados), tenta
    // reinscrever silenciosamente — sem incomodar quem já concedeu a
    // permissão antes.
    if (enabled && isLoggedIn() && Notification.permission === "granted") {
        subscribeToPush();
    }
}

loadReminderSettings();

/* =========================================================
   COMPARTILHAR COMO IMAGEM
========================================================= */

function wrapCanvasText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

function drawShareBackground(ctx, width, height) {
    // Fundo em degradê, igual ao tema verde do app
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#304637");
    gradient.addColorStop(1, "#566c59");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Círculo decorativo (mesmo efeito do card do versículo no site)
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.beginPath();
    ctx.arc(width - 120, height - 200, 280, 0, Math.PI * 2);
    ctx.fill();
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

async function generateShareCanvas({ label, mainText, reference }) {
    const width = 1080;
    const height = 1920;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // Garante que as fontes do site já estão carregadas antes de desenhar
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    drawShareBackground(ctx, width, height);

    ctx.textAlign = "center";

    // Label pequeno no topo
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "700 30px 'DM Sans', sans-serif";
    ctx.fillText(label.toUpperCase(), width / 2, 260);

    // Texto principal (citação/versículo)
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 66px 'Playfair Display', serif";

    const maxTextWidth = width - 160;
    const lines = wrapCanvasText(ctx, `"${mainText}"`, maxTextWidth);

    const lineHeight = 88;
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

    // Referência bíblica
    if (reference) {
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "600 36px 'DM Sans', sans-serif";
        ctx.fillText(reference, width / 2, startY + lines.length * lineHeight + 55);
    }

    // Marca do app no rodapé
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "600 30px 'DM Sans', sans-serif";
    ctx.fillText("🙏 Meu Devocional", width / 2, height - 100);

    return canvas;
}

async function generateStatsShareCanvas(stats) {
    const width = 1080;
    const height = 1920;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    drawShareBackground(ctx, width, height);

    ctx.textAlign = "center";

    // Cabeçalho
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "700 30px 'DM Sans', sans-serif";
    ctx.fillText("MINHA JORNADA", width / 2, 190);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 58px 'Playfair Display', serif";
    ctx.fillText("Meu Devocional", width / 2, 265);

    // Grade de estatísticas: 2 colunas x 3 linhas
    const items = [
        { value: stats.currentStreak, label: "sequência atual" },
        { value: stats.bestStreak, label: "melhor sequência" },
        { value: stats.totalDays, label: "dias concluídos" },
        { value: stats.savedVerses, label: "versículos salvos" },
        { value: stats.reflectionsCount, label: "reflexões escritas" },
        { value: stats.plansCompleted, label: "planos concluídos" }
    ];

    const gridTop = 380;
    const gridBottom = 1540;
    const gap = 24;
    const colWidth = (width - 160) / 2;
    const rowHeight = (gridBottom - gridTop) / 3;

    items.forEach((item, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);

        const cardX = 80 + col * colWidth + gap / 2;
        const cardY = gridTop + row * rowHeight;
        const cardW = colWidth - gap;
        const cardH = rowHeight - gap;

        ctx.fillStyle = "rgba(255,255,255,0.10)";
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 28);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "700 66px 'Playfair Display', serif";
        ctx.fillText(String(item.value), cardX + cardW / 2, cardY + cardH / 2 - 4);

        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.font = "600 23px 'DM Sans', sans-serif";
        ctx.fillText(item.label, cardX + cardW / 2, cardY + cardH / 2 + 44);
    });

    // Rodapé
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "600 28px 'DM Sans', sans-serif";
    ctx.fillText(stats.startDateLabel, width / 2, 1650);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "600 30px 'DM Sans', sans-serif";
    ctx.fillText("🙏 Meu Devocional", width / 2, height - 100);

    return canvas;
}

function shareCanvasAsImage(canvas, filename, shareTitle, shareText) {
    canvas.toBlob(async blob => {
        if (!blob) return;

        const file = new File([blob], filename, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: shareTitle,
                    text: shareText
                });
                return;
            } catch (error) {
                // Pessoa cancelou o compartilhamento ou o navegador recusou —
                // nesse caso, cai no fallback de baixar a imagem abaixo.
                if (error.name === "AbortError") return;
                console.error(error);
            }
        }

        // Fallback: baixa a imagem pra pessoa compartilhar manualmente
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    }, "image/png");
}

if (shareVerseButton) {
    shareVerseButton.addEventListener("click", async () => {
        const text = verseText.textContent.replace(/^"|"$/g, "");
        const reference = verseReference.textContent;

        if (!text) return;

        shareVerseButton.disabled = true;

        try {
            const canvas = await generateShareCanvas({
                label: "Palavra de hoje",
                mainText: text,
                reference
            });

            shareCanvasAsImage(
                canvas,
                "versiculo-do-dia.png",
                "Versículo do dia",
                `${reference} — Meu Devocional`
            );
        } finally {
            shareVerseButton.disabled = false;
        }
    });
}

if (shareDevotionalButton) {
    shareDevotionalButton.addEventListener("click", async () => {
        const quote = devotionalQuote.textContent;

        if (!quote) return;

        shareDevotionalButton.disabled = true;

        try {
            const canvas = await generateShareCanvas({
                label: "Devocional de hoje",
                mainText: quote,
                reference: devotionalVerseRef.textContent
            });

            shareCanvasAsImage(
                canvas,
                "devocional-do-dia.png",
                "Devocional de hoje",
                "Meu Devocional"
            );
        } finally {
            shareDevotionalButton.disabled = false;
        }
    });
}


/* =========================================================
   ESTATÍSTICAS PESSOAIS
========================================================= */

function getJourneyStartDate() {
    const completedDaysList = [...getCompletedDays()].sort();

    if (completedDaysList.length) {
        return completedDaysList[0];
    }

    const favoriteDates = getFavorites().map(item => item.savedAt).filter(Boolean);
    const reflectionDates = getReflections().map(item => item.createdAt).filter(Boolean);

    const allDates = [...favoriteDates, ...reflectionDates].sort();

    if (allDates.length) {
        return allDates[0].slice(0, 10);
    }

    return dateKey(new Date());
}

function countCompletedPlans() {
    return PLANS.filter(plan => {
        const state = getPlanState(plan.id);
        return state.completedDays.length >= plan.duration;
    }).length;
}

function collectStats() {
    const completedDays = getCompletedDays();

    const startDateKeyValue = getJourneyStartDate();
    const startDateFormatted = new Date(`${startDateKeyValue}T00:00:00`).toLocaleDateString(
        "pt-BR",
        { day: "numeric", month: "long", year: "numeric" }
    );

    return {
        currentStreak: calculateStreak(completedDays),
        bestStreak: calculateBestStreak(completedDays),
        totalDays: completedDays.size,
        savedVerses: getFavorites().length,
        reflectionsCount: getReflections().length,
        plansCompleted: countCompletedPlans(),
        startDateLabel: `Desde ${startDateFormatted}`
    };
}

function renderStatsScreen() {
    const stats = collectStats();

    $("statCurrentStreak").textContent = stats.currentStreak;
    $("statBestStreak").textContent = stats.bestStreak;
    $("statTotalDays").textContent = stats.totalDays;
    $("statSavedVerses").textContent = stats.savedVerses;
    $("statReflections").textContent = stats.reflectionsCount;
    $("statPlansCompleted").textContent = stats.plansCompleted;

    $("statsStartDate").textContent = stats.startDateLabel;
}

const shareStatsButton = $("shareStatsButton");

if (shareStatsButton) {
    shareStatsButton.addEventListener("click", async () => {
        shareStatsButton.disabled = true;

        try {
            const stats = collectStats();
            const canvas = await generateStatsShareCanvas(stats);

            shareCanvasAsImage(
                canvas,
                "minhas-estatisticas.png",
                "Minhas estatísticas",
                "Confira minha jornada no Meu Devocional 🙏"
            );
        } finally {
            shareStatsButton.disabled = false;
        }
    });
}


/* =========================================================
   CONTA — TOKEN E CHAMADAS AO BACKEND
========================================================= */

function getAuthToken() {
    return localStorage.getItem(STORAGE.authToken);
}

function setAuthToken(token) {
    localStorage.setItem(STORAGE.authToken, token);
}

function clearAuthToken() {
    localStorage.removeItem(STORAGE.authToken);
}

function isLoggedIn() {
    return Boolean(getAuthToken());
}

async function apiRequest(path, options = {}) {
    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `Erro HTTP ${response.status}`);
    }

    return data;
}


/* =========================================================
   CONTA — REGISTRO, LOGIN, LOGOUT
========================================================= */

async function registerAccount(name, email, password) {
    const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
    });

    setAuthToken(data.token);
    return data.user;
}

async function loginAccount(email, password) {
    const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    setAuthToken(data.token);
    return data.user;
}

function logoutAccount() {
    if (cloudSyncTimeoutId) {
        clearTimeout(cloudSyncTimeoutId);
        cloudSyncTimeoutId = null;
    }

    clearAuthToken();
    clearAllLocalData();
    updateAccountUI(null);
}


/* =========================================================
   CONTA — SINCRONIZAÇÃO COM A NUVEM
========================================================= */

function collectLocalDataSnapshot() {
    return {
        favorites: getFavorites(),
        reflections: getReflections(),
        completedDays: [...getCompletedDays()],
        planProgress: getPlanProgress(),
        highlights: getHighlights(), // <-- NOVO
        reminderTime: localStorage.getItem(STORAGE.reminderTime) || "07:00",
        reminderEnabled: localStorage.getItem(STORAGE.reminderEnabled) === "true",
        theme: document.body.classList.contains("dark") ? "dark" : "light"
    };
}

function applyCloudDataSnapshot(data) {
    if (data.favorites) saveFavorites(data.favorites);
    if (data.reflections) saveReflections(data.reflections);
    if (data.completedDays) saveCompletedDays(new Set(data.completedDays));
    if (data.planProgress) savePlanProgress(data.planProgress);
    if (data.highlights) saveHighlights(data.highlights); // <-- NOVO

    if (data.reminderTime) {
        localStorage.setItem(STORAGE.reminderTime, data.reminderTime);
    }

    if (typeof data.reminderEnabled === "boolean") {
        localStorage.setItem(STORAGE.reminderEnabled, String(data.reminderEnabled));
    }

    if (data.theme === "dark") {
        document.body.classList.add("dark");
        localStorage.setItem(STORAGE.theme, "dark");
    } else if (data.theme === "light") {
        document.body.classList.remove("dark");
        localStorage.setItem(STORAGE.theme, "light");
    }

    renderFavorites();
    renderReflections();
    renderCalendar();
    renderPlansList();
    renderHomePlanShortcut();
    renderHighlightsList(); // <-- NOVO
    updateStreakDisplays();
    updateCompleteButton();
    loadTheme();

    if (reminderTimeInput) {
    reminderTimeInput.value = localStorage.getItem(STORAGE.reminderTime) || "07:00";
    const enabled = localStorage.getItem(STORAGE.reminderEnabled) === "true";
    updateReminderUI(enabled);

    // Este aparelho ainda não tem inscrição push própria — se o
    // lembrete veio ligado da nuvem e já temos permissão concedida
    // aqui, inscreve este aparelho também.
    if (enabled && Notification.permission === "granted") {
        subscribeToPush();
    }
}
}

function isCloudDataEmpty(data) {
    return (
        (!data.favorites || !data.favorites.length) &&
        (!data.reflections || !data.reflections.length) &&
        (!data.completedDays || !data.completedDays.length) &&
        (!data.planProgress || !Object.keys(data.planProgress).length) &&
        (!data.highlights || !data.highlights.length) // <-- NOVO
    );
}

async function syncAfterLogin() {
    try {
        const { data } = await apiRequest("/api/data", { method: "GET" });

        if (isCloudDataEmpty(data)) {
            await apiRequest("/api/data", {
                method: "PUT",
                body: JSON.stringify(collectLocalDataSnapshot())
            });
        } else {
            applyCloudDataSnapshot(data);
        }
    } catch (error) {
        console.error("Erro ao sincronizar após login:", error);
    }

    renderHomeGroupShortcut();   // <-- adicionar
}

let cloudSyncTimeoutId = null;

function scheduleCloudSync() {
    if (!isLoggedIn()) return;

    if (cloudSyncTimeoutId) {
        clearTimeout(cloudSyncTimeoutId);
    }

    cloudSyncTimeoutId = setTimeout(async () => {
        try {
            await apiRequest("/api/data", {
                method: "PUT",
                body: JSON.stringify(collectLocalDataSnapshot())
            });
        } catch (error) {
            console.error("Erro ao sincronizar com a nuvem:", error);
        }
    }, 1500);
}


/* =========================================================
   CONTA — INTERFACE (MODAL E CARD EM "MAIS")
========================================================= */

const openAuthModalButton = $("openAuthModalButton");
const authModal = $("authModal");
const closeAuthModalButton = $("closeAuthModal");
const authTabLogin = $("authTabLogin");
const authTabRegister = $("authTabRegister");
const authNameField = $("authNameField");
const authNameInput = $("authNameInput");
const authEmailInput = $("authEmailInput");
const authPasswordInput = $("authPasswordInput");
const togglePasswordButton = $("togglePasswordButton");
const authForm = $("authForm");
const authError = $("authError");
const authSubmitButton = $("authSubmitButton");
const authModalTitle = $("authModalTitle");
const accountLoggedOut = $("accountLoggedOut");
const accountLoggedIn = $("accountLoggedIn");
const accountUserName = $("accountUserName");
const logoutButton = $("logoutButton");

let authMode = "login";

let currentUserId = null;

function updateAccountUI(user) {
    if (!accountLoggedOut || !accountLoggedIn) return;

    currentUserId = user ? user.id : null;

    if (user) {
        accountLoggedOut.classList.add("hidden");
        accountLoggedIn.classList.remove("hidden");
        accountUserName.textContent = user.name;
    } else {
        accountLoggedOut.classList.remove("hidden");
        accountLoggedIn.classList.add("hidden");
    }
}

function setAuthMode(mode) {
    authMode = mode;

    if (mode === "login") {
        authTabLogin.classList.add("active");
        authTabRegister.classList.remove("active");
        authNameField.classList.add("hidden");
        authModalTitle.textContent = "Entrar";
        authSubmitButton.textContent = "Entrar";
    } else {
        authTabRegister.classList.add("active");
        authTabLogin.classList.remove("active");
        authNameField.classList.remove("hidden");
        authModalTitle.textContent = "Criar conta";
        authSubmitButton.textContent = "Criar conta";
    }

    authError.classList.add("hidden");
}

const EYE_OPEN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
    '<circle cx="12" cy="12" r="3"/></svg>';

const EYE_CLOSED_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 ' +
    '18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 ' +
    '1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

if (togglePasswordButton && authPasswordInput) {
    togglePasswordButton.addEventListener("click", () => {
        const isPassword = authPasswordInput.type === "password";

        authPasswordInput.type = isPassword ? "text" : "password";
        togglePasswordButton.innerHTML = isPassword ? EYE_CLOSED_SVG : EYE_OPEN_SVG;
        togglePasswordButton.setAttribute(
            "aria-label",
            isPassword ? "Esconder senha" : "Mostrar senha"
        );
    });
}

function openAuthModal() {
    setAuthMode("login");

    authPasswordInput.type = "password";

    if (togglePasswordButton) {
        togglePasswordButton.innerHTML = EYE_OPEN_SVG;
        togglePasswordButton.setAttribute("aria-label", "Mostrar senha");
    }

    authModal.classList.remove("hidden");

    initGoogleSignIn();
}

function closeAuthModal() {
    authModal.classList.add("hidden");
}


/* =========================================================
   CONTA — LOGIN COM GOOGLE
========================================================= */

async function handleGoogleCredential(response) {
    authError.classList.add("hidden");

    try {
        const data = await apiRequest("/api/auth/google", {
            method: "POST",
            body: JSON.stringify({ credential: response.credential })
        });

        setAuthToken(data.token);

        closeAuthModal();
        updateAccountUI(data.user);
        await syncAfterLogin();

    } catch (error) {
        authError.textContent = error.message || "Não foi possível entrar com o Google.";
        authError.classList.remove("hidden");
    }
}

function initGoogleSignIn(attempts = 0) {
    const container = $("googleSignInButton");
    if (!container) return;

    // O script do Google carrega de forma assíncrona — se ainda não
    // chegou, tenta de novo por alguns segundos.
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        if (attempts < 20) {
            setTimeout(() => initGoogleSignIn(attempts + 1), 250);
        }
        return;
    }

    if (container.dataset.rendered === "true") return;

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential
    });

    google.accounts.id.renderButton(container, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        locale: "pt-BR",
        width: 280
    });

    container.dataset.rendered = "true";
}

if (openAuthModalButton) {
    openAuthModalButton.addEventListener("click", openAuthModal);
}

if (closeAuthModalButton) {
    closeAuthModalButton.addEventListener("click", closeAuthModal);
}

if (authTabLogin) {
    authTabLogin.addEventListener("click", () => setAuthMode("login"));
}

if (authTabRegister) {
    authTabRegister.addEventListener("click", () => setAuthMode("register"));
}

if (authModal) {
    authModal.addEventListener("click", event => {
        if (event.target === authModal) closeAuthModal();
    });
}

if (authForm) {
    authForm.addEventListener("submit", async event => {
        event.preventDefault();

        authError.classList.add("hidden");
        authSubmitButton.disabled = true;

        try {
            const email = authEmailInput.value.trim();
            const password = authPasswordInput.value;

            let user;

            if (authMode === "register") {
                const name = authNameInput.value.trim();

                if (!name) {
                    throw new Error("Digite seu nome.");
                }

                user = await registerAccount(name, email, password);
            } else {
                user = await loginAccount(email, password);
            }

            authForm.reset();
            closeAuthModal();

            updateAccountUI(user);
            await syncAfterLogin();

        } catch (error) {
            authError.textContent = error.message || "Não foi possível continuar.";
            authError.classList.remove("hidden");
        } finally {
            authSubmitButton.disabled = false;
        }
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        const confirmed = confirm(
            "Tem certeza que deseja sair da sua conta? Os dados salvos " +
            "neste aparelho serão apagados (mas continuam seguros na nuvem)."
        );

        if (!confirmed) return;

        logoutAccount();
    });
}

async function checkExistingSession() {
    if (!isLoggedIn()) {
        updateAccountUI(null);
        return;
    }

    try {
        const { user } = await apiRequest("/api/auth/me", { method: "GET" });
        updateAccountUI(user);
        await syncAfterLogin();

    } catch (error) {
        console.error("Sessão expirada ou inválida:", error);
        clearAuthToken();
        updateAccountUI(null);
    }
}

checkExistingSession();


/* =========================================================
   DEVOCIONAL CONVERSACIONAL / PESSOAL
========================================================= */

const personalFeelingInput = $("personalFeelingInput");
const personalDevotionalButton = $("personalDevotionalButton");
const personalDevotionalLoading = $("personalDevotionalLoading");
const personalDevotionalResult = $("personalDevotionalResult");
const personalDevotionalError = $("personalDevotionalError");
const personalDevotionalReference = $("personalDevotionalReference");
const personalDevotionalVerses = $("personalDevotionalVerses");
const personalDevotionalTitle = $("personalDevotionalTitle");
const personalDevotionalReflection = $("personalDevotionalReflection");
const personalDevotionalPrayer = $("personalDevotionalPrayer");
const personalDevotionalSupportNote = $("personalDevotionalSupportNote");
const personalDevotionalNewButton = $("personalDevotionalNewButton");

async function generatePersonalDevotional(feeling) {
    const token = getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/personal-devotional`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ feeling })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || "Não foi possível gerar seu devocional agora.");
    }

    return data;
}

function renderPersonalDevotional(data) {
    personalDevotionalReference.textContent = data.reference;
    personalDevotionalVerses.textContent = `"${data.verses}"`;
    personalDevotionalTitle.textContent = data.devotionalTitle;
    personalDevotionalReflection.textContent = data.reflection;
    personalDevotionalPrayer.textContent = data.prayer;
    personalDevotionalSupportNote.textContent = data.supportNote;

    personalDevotionalLoading.classList.add("hidden");
    personalDevotionalError.classList.add("hidden");
    personalDevotionalResult.classList.remove("hidden");

    $("personalDevotional").scrollIntoView({ behavior: "smooth", block: "start" });
}

if (personalDevotionalButton) {
    personalDevotionalButton.addEventListener("click", async () => {
        const feeling = personalFeelingInput.value.trim();

        if (!feeling) {
            alert("Escreva como você está se sentindo antes de continuar.");
            return;
        }

        personalDevotionalButton.disabled = true;
        personalDevotionalLoading.classList.remove("hidden");
        personalDevotionalResult.classList.add("hidden");
        personalDevotionalError.classList.add("hidden");

        try {
            const data = await generatePersonalDevotional(feeling);
            renderPersonalDevotional(data);

        } catch (error) {
            console.error(error);

            personalDevotionalLoading.classList.add("hidden");
            personalDevotionalError.textContent =
                "Não foi possível gerar seu devocional agora. Tente novamente em instantes.";
            personalDevotionalError.classList.remove("hidden");

        } finally {
            personalDevotionalButton.disabled = false;
        }
    });
}

if (personalDevotionalNewButton) {
    personalDevotionalNewButton.addEventListener("click", () => {
        personalFeelingInput.value = "";
        personalDevotionalResult.classList.add("hidden");
        personalFeelingInput.focus();
    });
}



/* =========================================================
   TELA CHEIA: DEVOCIONAL DE HOJE E DEVOCIONAL PESSOAL
========================================================= */

const openDailyDevotionalButton = $("openDailyDevotionalButton");
const dailyDevotionalOverlay = $("dailyDevotionalOverlay");
const dailyDevotionalBackButton = $("dailyDevotionalBackButton");

const openPersonalDevotionalButton = $("openPersonalDevotionalButton");
const personalDevotionalOverlay = $("personalDevotionalOverlay");
const personalDevotionalBackButton = $("personalDevotionalBackButton");

function openOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.remove("hidden");
    overlay.scrollTop = 0;
    document.body.style.overflow = "hidden";
}

function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
}

/* --- Devocional de hoje --- */

if (openDailyDevotionalButton) {
    openDailyDevotionalButton.addEventListener("click", () => {
        openOverlay(dailyDevotionalOverlay);
    });
}

if (dailyDevotionalBackButton) {
    dailyDevotionalBackButton.addEventListener("click", () => {
        closeOverlay(dailyDevotionalOverlay);
    });
}

/* --- Devocional pessoal --- */

if (openPersonalDevotionalButton) {
    openPersonalDevotionalButton.addEventListener("click", () => {
        openOverlay(personalDevotionalOverlay);
        if (personalFeelingInput) personalFeelingInput.focus();
    });
}

if (personalDevotionalBackButton) {
    personalDevotionalBackButton.addEventListener("click", () => {
        closeOverlay(personalDevotionalOverlay);
    });
}


/* =========================================================
   HISTÓRICO DE DEVOCIONAIS PESSOAIS
========================================================= */

const personalDevotionalsHistoryList = $("personalDevotionalsHistoryList");

const personalDevotionalDetailOverlay = $("personalDevotionalDetailOverlay");
const personalDevotionalDetailBackButton = $("personalDevotionalDetailBackButton");
const personalDevotionalDetailDate = $("personalDevotionalDetailDate");
const personalDevotionalDetailFeeling = $("personalDevotionalDetailFeeling");
const personalDevotionalDetailReference = $("personalDevotionalDetailReference");
const personalDevotionalDetailVerses = $("personalDevotionalDetailVerses");
const personalDevotionalDetailTitle = $("personalDevotionalDetailTitle");
const personalDevotionalDetailReflection = $("personalDevotionalDetailReflection");
const personalDevotionalDetailPrayer = $("personalDevotionalDetailPrayer");

function formatHistoryDate(isoString) {
    const dateObject = new Date(isoString);

    return dateObject.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}…`;
}

async function renderPersonalDevotionalsHistory() {
    if (!personalDevotionalsHistoryList) return;

    if (!isLoggedIn()) {
        personalDevotionalsHistoryList.innerHTML = `
            <div class="empty-state">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg></span>
                <h2>Entre na sua conta</h2>
                <p>Crie uma conta ou entre para guardar o histórico dos seus devocionais pessoais.</p>
            </div>
        `;
        return;
    }

    personalDevotionalsHistoryList.innerHTML = `
        <div class="skeleton skeleton-block" style="height: 90px;"></div>
        <div class="skeleton skeleton-block" style="height: 90px;"></div>
    `;

    try {
        const { data } = await apiRequest("/api/data", { method: "GET" });
        const history = data.personalDevotionals || [];

        if (!history.length) {
            personalDevotionalsHistoryList.innerHTML = `
                <div class="empty-state">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg></span>
                    <h2>Nenhum devocional ainda</h2>
                    <p>Toque em "Como você está se sentindo?" na tela inicial para começar.</p>
                </div>
            `;
            return;
        }

        personalDevotionalsHistoryList.innerHTML = "";

        history.forEach(entry => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "personal-devotional-history-button";

            const date = document.createElement("span");
            date.className = "personal-devotional-history-button-date";
            date.textContent = formatHistoryDate(entry.createdAt);

            const feeling = document.createElement("span");
            feeling.className = "personal-devotional-history-button-feeling";
            feeling.textContent = `"${truncateText(entry.feeling, 80)}"`;

            const title = document.createElement("span");
            title.className = "personal-devotional-history-button-title";
            title.textContent = entry.devotionalTitle;

            button.appendChild(date);
            button.appendChild(feeling);
            button.appendChild(title);

            button.addEventListener("click", () => {
                openPersonalDevotionalDetail(entry);
            });

            personalDevotionalsHistoryList.appendChild(button);
        });

    } catch (error) {
        console.error(error);

        personalDevotionalsHistoryList.innerHTML = `
            <div class="empty-state">
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                <h2>Não foi possível carregar</h2>
                <p>Tente novamente em alguns instantes.</p>
            </div>
        `;
    }
}

function openPersonalDevotionalDetail(entry) {
    personalDevotionalDetailDate.textContent = formatHistoryDate(entry.createdAt);
    personalDevotionalDetailFeeling.textContent = `"${entry.feeling}"`;
    personalDevotionalDetailReference.textContent = entry.reference;
    personalDevotionalDetailVerses.textContent = `"${entry.verses}"`;
    personalDevotionalDetailTitle.textContent = entry.devotionalTitle;
    personalDevotionalDetailReflection.textContent = entry.reflection;
    personalDevotionalDetailPrayer.textContent = entry.prayer;

    openOverlay(personalDevotionalDetailOverlay);
}

if (personalDevotionalDetailBackButton) {
    personalDevotionalDetailBackButton.addEventListener("click", () => {
        closeOverlay(personalDevotionalDetailOverlay);
    });
}

/* =========================================================
   JORNADA EMOCIONAL (GRÁFICOS)
========================================================= */

let emotionCategoryChartInstance = null;
let journeyTimelineChartInstance = null;

const EMOTION_CATEGORY_COLORS = {
    "Ansiedade": "#c98a4b",
    "Tristeza": "#6b7c93",
    "Gratidão": "#61a37a",
    "Paz": "#7fae8a",
    "Esperança": "#e0a95c",
    "Medo": "#a55b5b",
    "Alegria": "#e0c95c",
    "Cansaço": "#8f8f8f",
    "Dúvida": "#9c8bc9",
    "Confiança": "#4c7a6b",
    "Outro": "#b7bfb8"
};

function buildCategoryCounts(history) {
    const counts = {};

    history.forEach(entry => {
        const category = entry.emotionCategory || "Outro";
        counts[category] = (counts[category] || 0) + 1;
    });

    return counts;
}

function buildMonthlyCounts(history) {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
        const cursor = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}`,
            label: cursor.toLocaleDateString("pt-BR", { month: "short" })
        });
    }

    const counts = Object.fromEntries(months.map(m => [m.key, 0]));

    history.forEach(entry => {
        const entryDate = new Date(entry.createdAt);
        const key = `${entryDate.getFullYear()}-${pad(entryDate.getMonth() + 1)}`;

        if (counts[key] !== undefined) {
            counts[key]++;
        }
    });

    return {
        labels: months.map(m => m.label),
        values: months.map(m => counts[m.key])
    };
}

function getCssVariable(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function setJourneyChartsVisible(visible) {
    const categoryCanvas = $("emotionCategoryChart");
    const timelineCanvas = $("journeyTimelineChart");

    if (categoryCanvas) categoryCanvas.classList.toggle("hidden", !visible);
    if (timelineCanvas) timelineCanvas.classList.toggle("hidden", !visible);
}

function showJourneyChartMessage(message) {
    const emptyMessage = $("journeyChartEmpty");

    if (!emptyMessage) return;

    emptyMessage.textContent = message;
    emptyMessage.classList.remove("hidden");
    setJourneyChartsVisible(false);
}

async function renderJourneyCharts() {
    const categoryCanvas = $("emotionCategoryChart");
    const timelineCanvas = $("journeyTimelineChart");
    const emptyMessage = $("journeyChartEmpty");

    if (!categoryCanvas || !timelineCanvas || typeof Chart === "undefined") return;

    if (!isLoggedIn()) {
        showJourneyChartMessage("Entre na sua conta para ver sua jornada emocional.");
        return;
    }

    try {
        const { data } = await apiRequest("/api/data", { method: "GET" });
        const history = data.personalDevotionals || [];

        if (!history.length) {
            showJourneyChartMessage(
                "Ainda não há devocionais pessoais suficientes para gerar seu gráfico."
            );
            return;
        }

        if (emptyMessage) emptyMessage.classList.add("hidden");
        setJourneyChartsVisible(true);

        /* ---------- Gráfico 1: distribuição por sentimento ---------- */

        const counts = buildCategoryCounts(history);
        const categories = Object.keys(counts);
        const values = Object.values(counts);
        const colors = categories.map(
            category => EMOTION_CATEGORY_COLORS[category] || EMOTION_CATEGORY_COLORS.Outro
        );

        if (emotionCategoryChartInstance) {
            emotionCategoryChartInstance.destroy();
        }

        emotionCategoryChartInstance = new Chart(categoryCanvas, {
            type: "doughnut",
            data: {
                labels: categories,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { color: getCssVariable("--text") }
                    }
                }
            }
        });

        /* ---------- Gráfico 2: frequência ao longo do tempo ---------- */

        const timeline = buildMonthlyCounts(history);

        if (journeyTimelineChartInstance) {
            journeyTimelineChartInstance.destroy();
        }

        journeyTimelineChartInstance = new Chart(timelineCanvas, {
            type: "bar",
            data: {
                labels: timeline.labels,
                datasets: [{
                    label: "Devocionais gerados",
                    data: timeline.values,
                    backgroundColor: getCssVariable("--green"),
                    borderRadius: 8
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: getCssVariable("--muted") } },
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0, color: getCssVariable("--muted") }
                    }
                }
            }
        });

    } catch (error) {
        console.error(error);
        showJourneyChartMessage("Não foi possível carregar sua jornada agora.");
    }
}
