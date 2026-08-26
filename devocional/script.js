/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const API_URL = "https://abibliadigital.api.br/api";

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
    planProgress: "devocional_plan_progress"
};


/* =========================================================
   PLANOS DE LEITURA — DADOS
========================================================= */

const PLANS = [
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
}


/* =========================================================
   REFLEXÕES
========================================================= */

function getReflections() {
    return JSON.parse(localStorage.getItem(STORAGE.reflections) || "[]");
}

function saveReflections(reflections) {
    localStorage.setItem(STORAGE.reflections, JSON.stringify(reflections));
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

function updateStreakDisplays() {
    const value = calculateStreak(getCompletedDays());

    streak.textContent = value;
    statsStreak.textContent = value;

    if (calendarStreakCount) {
        calendarStreakCount.textContent = value;
    }
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

        loading.classList.add("hidden");
        verseContent.classList.remove("hidden");

        updateFavoriteButton();

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

        loading.classList.add("hidden");
        verseContent.classList.remove("hidden");

        updateFavoriteButton();

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

function updateFavoriteButton() {
    if (isFavorite()) {
        favoriteButton.textContent = "♥";
        favoriteButton.classList.add("saved");
    } else {
        favoriteButton.textContent = "♡";
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

    data.devotionalParagraphs.forEach(paragraph => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        devotionalParagraphs.appendChild(p);
    });

    devotionalLoading.classList.add("hidden");
    devotionalError.classList.add("hidden");
    devotionalContent.classList.remove("hidden");

    updateCompleteButton();
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
        const response = await fetch("/api/devotional");

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

async function loadBooks() {
    bookSelect.innerHTML = `<option>Carregando...</option>`;

    try {
        const books = await apiGet("/books");

        bookSelect.innerHTML = "";

        books.forEach(book => {
            const option = document.createElement("option");
            option.value = book.abbrev.pt;
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

    chapterContent.innerHTML = `<div class="loading">Carregando capítulo...</div>`;

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

            const actions = document.createElement("div");
            actions.className = "verse-actions";

            const saveButton = document.createElement("button");
            saveButton.className = "small-action";
            saveButton.textContent = "♡ Salvar";

            saveButton.addEventListener("click", () => {
                saveVerseFromChapter(data, verse);
                saveButton.textContent = "♥ Salvo";
            });

            actions.appendChild(saveButton);

            content.appendChild(text);
            content.appendChild(actions);

            wrapper.appendChild(number);
            wrapper.appendChild(content);

            chapterContent.appendChild(wrapper);
        });

    } catch (error) {
        console.error(error);

        chapterContent.innerHTML = `
            <div class="empty-state">
                <span>⚠️</span>
                <h2>Não foi possível carregar</h2>
                <p>Tente novamente em alguns instantes.</p>
            </div>
        `;
    }
}

readChapterButton.addEventListener("click", loadChapter);


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
                    <span>🔎</span>
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
                <span>♡</span>
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
   NAVEGAÇÃO PRINCIPAL
========================================================= */

const navItems = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");

navItems.forEach(button => {
    button.addEventListener("click", () => {
        const screenId = button.dataset.screen;

        navItems.forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        screens.forEach(screen => {
            screen.classList.remove("active-screen");
        });

        $(screenId).classList.add("active-screen");

        if (screenId === "favoritesScreen") {
            renderFavorites();
        }

        if (screenId === "moreScreen") {
            renderFavorites();
            renderReflections();
        }

        if (screenId === "plansScreen") {
            planReading.classList.add("hidden");
            plansList.classList.remove("hidden");
            renderPlansList();
        }
    });
});


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

        if (target === "savedVerses") {
            renderFavorites();
        }

        if (target === "reflections") {
            renderReflections();
        }

        if (target === "streakCalendar") {
            renderCalendar();
            updateStreakDisplays();
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
$("morePrayerButton").addEventListener("click", openPrayer);
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
$("moreNoteButton").addEventListener("click", openNote);
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
                <span>📝</span>
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

function loadTheme() {
    const theme = localStorage.getItem(STORAGE.theme);

    if (theme === "dark") {
        document.body.classList.add("dark");
        themeButton.textContent = "☀";
    }
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    localStorage.setItem(STORAGE.theme, dark ? "dark" : "light");

    themeButton.textContent = dark ? "☀" : "☾";
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

if (plansShortcutButton) {
    plansShortcutButton.addEventListener("click", () => {
        document.querySelector('.nav-item[data-screen="plansScreen"]').click();
    });
}


/* =========================================================
   PLANOS DE LEITURA — LEITURA DO DIA
========================================================= */

function openPlanReading(planId) {
    const plan = PLANS.find(item => item.id === planId);
    if (!plan) return;

    const state = getPlanState(planId);

    const nextDay = Math.min(state.completedDays.length + 1, plan.duration);

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

async function loadPlanDay(plan, day) {
    planReadingTitle.textContent = plan.title.toUpperCase();
    planReadingDayLabel.textContent = `Dia ${day} de ${plan.duration}`;

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
            const response = await fetch(`/api/plan-reading?plan=${plan.id}&day=${day}`);

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

            wrapper.appendChild(number);
            wrapper.appendChild(content);

            planChapterVerses.appendChild(wrapper);
        });

        planChapterCard.classList.remove("hidden");
    }

    planDevotionalTitle.textContent = data.devotionalTitle;
    planDevotionalParagraphs.innerHTML = "";

    data.devotionalParagraphs.forEach(paragraph => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        planDevotionalParagraphs.appendChild(p);
    });

    planReadingLoading.classList.add("hidden");
    planReadingContent.classList.remove("hidden");

    const state = getPlanState(plan.id);
    const isCompleted = state.completedDays.includes(day);

    planCompleteButton.textContent = isCompleted ? "Dia concluído ✓" : "Concluir dia";
    planCompleteButton.disabled = isCompleted;

    planCompleteButton.onclick = () => completePlanDay(plan, day);
}

function completePlanDay(plan, day) {
    const progress = getPlanProgress();
    const state = progress[plan.id] || { completedDays: [] };

    if (!state.completedDays.includes(day)) {
        state.completedDays.push(day);
    }

    progress[plan.id] = state;
    savePlanProgress(progress);

    // Concluir uma leitura do plano também conta como o devocional do dia
    markDevotionalComplete();

    planProgressFill.style.width =
        `${Math.min(100, (state.completedDays.length / plan.duration) * 100)}%`;

    if (day < plan.duration) {
        loadPlanDay(plan, day + 1);
    } else {
        planCompleteButton.textContent = "Plano concluído! 🎉";
        planCompleteButton.disabled = true;
    }
}


/* =========================================================
   LIMPAR DADOS
========================================================= */

$("clearDataButton").addEventListener("click", () => {
    const confirmed = confirm(
        "Deseja realmente apagar seus favoritos, sequência, reflexões e o " +
        "progresso dos seus planos de leitura?"
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE.favorites);
    localStorage.removeItem(STORAGE.streak);
    localStorage.removeItem(STORAGE.reflections);
    localStorage.removeItem(STORAGE.completedDays);
    localStorage.removeItem(STORAGE.planProgress);

    Object.keys(localStorage)
        .filter(key => key.startsWith("plano_leitura_"))
        .forEach(key => localStorage.removeItem(key));

    updateStreakDisplays();
    updateCompleteButton();
    renderCalendar();
    renderFavorites();
    renderReflections();
    renderPlansList();

    alert("Dados apagados.");
});


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

renderFavorites();
renderReflections();
renderCalendar();
renderPlansList();
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
