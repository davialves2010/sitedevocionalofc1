// =========================================================
//   INICIALIZAÇÃO E CONFIGURAÇÃO
// =========================================================

const API_BASE = "https://abibliadigital.api.br/api";
const API_VERSION = "nvi";

let currentBook = null;
let currentChapter = null;

// Elementos DOM
const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-button");
const themeToggle = document.getElementById("themeToggle");
const moreButton = document.getElementById("moreButton");
const todayScreen = document.getElementById("todayScreen");
const prayerModal = document.getElementById("prayerModal");
const noteModal = document.getElementById("noteModal");
const closePrayerModal = document.getElementById("closePrayerModal");
const closeNoteModal = document.getElementById("closeNoteModal");
const openPrayerButton = document.getElementById("openPrayerButton");
const openNoteButton = document.getElementById("openNoteButton");
const savePrayerButton = document.getElementById("savePrayerButton");
const saveNoteButton = document.getElementById("saveNoteButton");
const prayerInput = document.getElementById("prayerInput");
const noteInput = document.getElementById("noteInput");
const devotionalContent = document.getElementById("devotionalContent");
const devotionalError = document.getElementById("devotionalError");
const devotionalLoading = document.getElementById("devotionalLoading");
const devotionalQuote = document.getElementById("devotionalQuote");
const devotionalVerseText = document.getElementById("devotionalVerseText");
const devotionalVerseRef = document.getElementById("devotionalVerseRef");
const devotionalTitle = document.getElementById("devotionalTitle");
const devotionalParagraphs = document.getElementById("devotionalParagraphs");

// =========================================================
//   TEMA (LIGHT/DARK)
// =========================================================

function initializeTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("theme", theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.body.classList.contains("dark-theme");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    applyTheme(isDark ? "light" : "dark");
});

// =========================================================
//   NAVEGAÇÃO
// =========================================================

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        const screenId = button.dataset.screen;
        switchScreen(screenId);
        updateActiveNavButton(button);
    });
});

function switchScreen(screenId) {
    screens.forEach(screen => screen.classList.remove("active"));
    const newScreen = document.getElementById(screenId);
    if (newScreen) {
        newScreen.classList.add("active");
    }
}

function updateActiveNavButton(button) {
    navButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}

// "Mais" button abre a tela "Mais"
moreButton.addEventListener("click", () => {
    switchScreen("moreScreen");
    const moreButton = Array.from(navButtons).find(b => b.dataset.screen === "moreScreen");
    if (moreButton) updateActiveNavButton(moreButton);
});

// =========================================================
//   DEVOCIONAL DIÁRIO
// =========================================================

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

const bookMapping = {
    "gn": "Gênesis",
    "ex": "Êxodo",
    "lv": "Levítico",
    "nm": "Números",
    "dt": "Deuteronômio",
    "js": "Josué",
    "jz": "Juízes",
    "rt": "Rute",
    "1sm": "1 Samuel",
    "2sm": "2 Samuel",
    "1rs": "1 Reis",
    "2rs": "2 Reis",
    "1cr": "1 Crônicas",
    "2cr": "2 Crônicas",
    "ed": "Esdras",
    "ne": "Neemias",
    "et": "Ester",
    "jó": "Jó",
    "sl": "Salmos",
    "pv": "Provérbios",
    "ec": "Eclesiastes",
    "ct": "Cânticos",
    "is": "Isaías",
    "jr": "Jeremias",
    "lm": "Lamentações",
    "ez": "Ezequiel",
    "dn": "Daniel",
    "os": "Oséias",
    "jl": "Joel",
    "am": "Amós",
    "ob": "Obadias",
    "jn": "Jonas",
    "mq": "Miquéias",
    "na": "Naum",
    "hc": "Habacuque",
    "sf": "Sofonias",
    "ag": "Ageu",
    "zc": "Zacarias",
    "ml": "Malaquias",
    "mt": "Mateus",
    "mc": "Marcos",
    "lc": "Lucas",
    "jo": "João",
    "at": "Atos",
    "rm": "Romanos",
    "1co": "1 Coríntios",
    "2co": "2 Coríntios",
    "gl": "Gálatas",
    "ef": "Efésios",
    "fp": "Filipenses",
    "cl": "Colossenses",
    "1ts": "1 Tessalonicenses",
    "2ts": "2 Tessalonicenses",
    "1tm": "1 Timóteo",
    "2tm": "2 Timóteo",
    "tt": "Tito",
    "fm": "Filemom",
    "hb": "Hebreus",
    "tg": "Tiago",
    "1pd": "1 Pedro",
    "2pd": "2 Pedro",
    "1jo": "1 João",
    "2jo": "2 João",
    "3jo": "3 João",
    "jd": "Judas",
    "ap": "Apocalipse"
};

async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE}/books/${API_VERSION}`);
        const books = await response.json();

        const bookSelect = document.getElementById("bookSelect");
        bookSelect.innerHTML = "";

        books.forEach(book => {
            const option = document.createElement("option");
            option.value = book.abbrev.pt;
            option.textContent = book.name;
            bookSelect.appendChild(option);
        });

        // Load first book's chapters by default
        if (books.length > 0) {
            currentBook = books[0].abbrev.pt;
            loadChapters(currentBook);
        }

        bookSelect.addEventListener("change", (e) => {
            currentBook = e.target.value;
            loadChapters(currentBook);
        });

    } catch (error) {
        console.error("Erro ao carregar livros:", error);
    }
}

async function loadChapters(bookAbbrev) {
    try {
        const response = await fetch(`${API_BASE}/books/${API_VERSION}/${bookAbbrev}`);
        const book = await response.json();

        const chapterSelect = document.getElementById("chapterSelect");
        chapterSelect.innerHTML = "";

        for (let i = 1; i <= book.chapters; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Capítulo ${i}`;
            chapterSelect.appendChild(option);
        }

        // Load first chapter by default
        currentChapter = 1;
        loadChapter(currentBook, 1);

        chapterSelect.addEventListener("change", (e) => {
            currentChapter = parseInt(e.target.value);
            loadChapter(currentBook, currentChapter);
        });

    } catch (error) {
        console.error("Erro ao carregar capítulos:", error);
    }
}

async function loadChapter(bookAbbrev, chapterNum) {
    try {
        const response = await fetch(`${API_BASE}/verses/${API_VERSION}/${bookAbbrev}/${chapterNum}`);
        const verses = await response.json();

        const chapterContent = document.getElementById("chapterContent");
        chapterContent.innerHTML = "";

        verses.forEach(verse => {
            const verseDiv = document.createElement("div");
            verseDiv.className = "verse-item";

            const verseText = document.createElement("p");
            verseText.innerHTML = `<strong class="verse-number">${verse.number}</strong><span class="verse-text">${verse.text}</span>`;

            const verseActions = document.createElement("div");
            verseActions.className = "verse-actions";

            const favoriteButton = document.createElement("button");
            favoriteButton.className = "verse-action-button";
            favoriteButton.textContent = "⭐ Favoritar";
            favoriteButton.addEventListener("click", () => {
                addFavorite(verses[0].book.abbrev, verses[0].book.name, verses[0].chapter, verse.number, verse.text);
            });

            verseActions.appendChild(favoriteButton);
            verseDiv.appendChild(verseText);
            verseDiv.appendChild(verseActions);
            chapterContent.appendChild(verseDiv);
        });

    } catch (error) {
        console.error("Erro ao carregar capítulo:", error);
    }
}

// Random verse
document.getElementById("randomVerseButton").addEventListener("click", async () => {
    try {
        const bookAbbrev = currentBook;
        const response = await fetch(`${API_BASE}/books/${API_VERSION}/${bookAbbrev}`);
        const book = await response.json();

        const randomChapter = Math.floor(Math.random() * book.chapters) + 1;

        const chapterSelect = document.getElementById("chapterSelect");
        chapterSelect.value = randomChapter;
        currentChapter = randomChapter;
        loadChapter(bookAbbrev, randomChapter);

    } catch (error) {
        console.error("Erro ao carregar versículo aleatório:", error);
    }
});

// =========================================================
//   BUSCA
// =========================================================

document.getElementById("searchButton").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        alert("Por favor, digite algo para buscar.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                version: API_VERSION
            })
        });

        const results = await response.json();

        const searchResults = document.getElementById("searchResults");
        searchResults.innerHTML = "";

        if (results.length === 0) {
            searchResults.innerHTML = "<p>Nenhum resultado encontrado.</p>";
            return;
        }

        results.forEach(result => {
            const resultDiv = document.createElement("div");
            resultDiv.className = "search-result-item";
            resultDiv.innerHTML = `
                <p class="search-result-reference">${result.book.name} ${result.chapter}:${result.number}</p>
                <p class="search-result-text">${result.text}</p>
            `;
            searchResults.appendChild(resultDiv);
        });

    } catch (error) {
        console.error("Erro na busca:", error);
    }
});

// =========================================================
//   FAVORITOS
// =========================================================

function addFavorite(bookAbbrev, bookName, chapter, verse, text) {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavorite = {
        bookAbbrev,
        bookName,
        chapter,
        verse,
        text,
        addedAt: new Date().toISOString()
    };

    const exists = favorites.some(
        fav => fav.bookAbbrev === bookAbbrev && fav.chapter === chapter && fav.verse === verse
    );

    if (!exists) {
        favorites.push(newFavorite);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
        alert("Versículo adicionado aos favoritos!");
    } else {
        alert("Este versículo já está nos favoritos.");
    }
}

function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const favoritesList = document.getElementById("favoritesList");

    favoritesList.innerHTML = "";

    if (favorites.length === 0) {
        favoritesList.innerHTML = "<p>Você ainda não tem favoritos.</p>";
        return;
    }

    favorites.forEach((fav, index) => {
        const verseDiv = document.createElement("div");
        verseDiv.className = "verse-item";

        const verseText = document.createElement("p");
        verseText.innerHTML = `<strong class="verse-number">${fav.bookName} ${fav.chapter}:${fav.verse}</strong><span class="verse-text">${fav.text}</span>`;

        const removeButton = document.createElement("button");
        removeButton.className = "verse-action-button";
        removeButton.textContent = "🗑️ Remover";
        removeButton.addEventListener("click", () => {
            favorites.splice(index, 1);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            renderFavorites();
        });

        const verseActions = document.createElement("div");
        verseActions.className = "verse-actions";
        verseActions.appendChild(removeButton);

        verseDiv.appendChild(verseText);
        verseDiv.appendChild(verseActions);
        favoritesList.appendChild(verseDiv);
    });
}

// =========================================================
//   REFLEXÕES / DIÁRIO
// =========================================================

function renderReflections() {
    const reflections = JSON.parse(localStorage.getItem("reflections") || "[]");
    const reflectionsList = document.getElementById("reflectionsList");

    reflectionsList.innerHTML = "";

    if (reflections.length === 0) {
        reflectionsList.innerHTML = "<p>Você ainda não tem reflexões salvas.</p>";
        return;
    }

    reflections.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((reflection, index) => {
        const reflectionDiv = document.createElement("div");
        reflectionDiv.className = "reflection-item";

        const dateDiv = document.createElement("p");
        dateDiv.className = "reflection-date";
        const date = new Date(reflection.date);
        dateDiv.textContent = date.toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const textDiv = document.createElement("p");
        textDiv.className = "reflection-text";
        textDiv.textContent = reflection.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "verse-action-button";
        deleteButton.textContent = "🗑️ Deletar";
        deleteButton.addEventListener("click", () => {
            const reflections = JSON.parse(localStorage.getItem("reflections") || "[]");
            reflections.splice(index, 1);
            localStorage.setItem("reflections", JSON.stringify(reflections));
            renderReflections();
        });

        const actions = document.createElement("div");
        actions.className = "verse-actions";
        actions.appendChild(deleteButton);

        reflectionDiv.appendChild(dateDiv);
        reflectionDiv.appendChild(textDiv);
        reflectionDiv.appendChild(actions);
        reflectionsList.appendChild(reflectionDiv);
    });
}

// =========================================================
//   MODALS
// =========================================================

openPrayerButton.addEventListener("click", () => {
    prayerModal.classList.remove("hidden");
});

closePrayerModal.addEventListener("click", () => {
    prayerModal.classList.add("hidden");
});

prayerModal.addEventListener("click", (e) => {
    if (e.target === prayerModal) {
        prayerModal.classList.add("hidden");
    }
});

savePrayerButton.addEventListener("click", () => {
    const prayer = prayerInput.value.trim();

    if (!prayer) {
        alert("Por favor, escreva sua oração.");
        return;
    }

    // Save prayer to localStorage
    const prayers = JSON.parse(localStorage.getItem("prayers") || "[]");
    prayers.push({
        date: new Date().toISOString(),
        text: prayer
    });
    localStorage.setItem("prayers", JSON.stringify(prayers));

    prayerInput.value = "";
    prayerModal.classList.add("hidden");
    alert("Oração salva! Que Deus abençoe.");
});

openNoteButton.addEventListener("click", () => {
    noteModal.classList.remove("hidden");
});

closeNoteModal.addEventListener("click", () => {
    noteModal.classList.add("hidden");
});

noteModal.addEventListener("click", (e) => {
    if (e.target === noteModal) {
        noteModal.classList.add("hidden");
    }
});

saveNoteButton.addEventListener("click", () => {
    const note = noteInput.value.trim();

    if (!note) {
        alert("Por favor, escreva sua reflexão.");
        return;
    }

    const reflections = JSON.parse(localStorage.getItem("reflections") || "[]");
    reflections.push({
        date: new Date().toISOString(),
        text: note
    });
    localStorage.setItem("reflections", JSON.stringify(reflections));

    noteInput.value = "";
    noteModal.classList.add("hidden");
    alert("Reflexão salva!");
    renderReflections();
});

// =========================================================
//   ABAS (CAMINHO)
// =========================================================

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        const tabName = button.dataset.tab;

        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(`${tabName}Tab`).classList.add("active");
    });
});

// =========================================================
//   TELA "MAIS" - LIMPAR DADOS
// =========================================================

document.getElementById("clearDataButton").addEventListener("click", () => {
    const confirmed = confirm(
        "Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita."
    );

    if (confirmed) {
        localStorage.clear();
        alert("Dados limpos com sucesso!");
        location.reload();
    }
});

// =========================================================
//   INICIALIZAÇÃO
// =========================================================

window.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    renderFavorites();
    renderReflections();
    loadDevotional();
    loadBooks();
});
