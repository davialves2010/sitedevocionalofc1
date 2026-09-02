/* =========================================================
   HIGHLIGHTS.JS — Grifos e anotações dentro do capítulo
   =========================================================

   Recurso independente que se pluga no app existente. Permite grifar
   TRECHOS de um versículo (não só o versículo inteiro), com uma cor/
   tema por grifo, nota opcional, e duas formas de interação:

     1) Seleção nativa de texto (arrastar com o dedo ou o mouse) —
        aparece uma barrinha flutuante com as cores.
     2) Botão "Grifar" em cada versículo — abre um diálogo acessível
        por teclado/leitor de tela, com as palavras como "chips"
        clicáveis para escolher o início e o fim do trecho.

   Nada aqui depende do script.js — só expõe `window.Highlights`
   com os métodos que o script.js chama para integrar. Ver o arquivo
   highlights-integration.md para os pontos exatos de integração.
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       ARMAZENAMENTO
    ===================================================== */

    const STORAGE_KEY = "devocional_highlights";

    function getAllHighlights() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch (error) {
            console.error("Grifos corrompidos no armazenamento local, resetando.", error);
            return [];
        }
    }

    function saveAllHighlights(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

        // Reaproveita o mesmo mecanismo de sincronização em nuvem que o
        // resto do app já usa, se ele existir nesta página.
        if (typeof window.scheduleCloudSync === "function") {
            window.scheduleCloudSync();
        }
    }

    function verseKey(book, chapter, verse) {
        return `${book}-${chapter}-${verse}`;
    }

    function getHighlightsForVerse(book, chapter, verse) {
        const key = verseKey(book, chapter, verse);
        return getAllHighlights().filter(
            h => verseKey(h.book, h.chapter, h.verse) === key
        );
    }

    function getHighlightsForChapter(book, chapter) {
        return getAllHighlights()
            .filter(h => h.book === book && Number(h.chapter) === Number(chapter))
            .sort((a, b) => a.verse - b.verse || a.wordStart - b.wordStart);
    }

    // Salva um grifo novo, removendo/encurtando grifos existentes que
    // colidam com o mesmo trecho (evita marcações sobrepostas confusas).
    function upsertHighlight(newHighlight) {
        const all = getAllHighlights();
        const key = verseKey(newHighlight.book, newHighlight.chapter, newHighlight.verse);

        const filtered = all.filter(h => {
            if (h.id === newHighlight.id) return false; // é uma edição do próprio
            if (verseKey(h.book, h.chapter, h.verse) !== key) return true;
            const overlaps = h.wordStart <= newHighlight.wordEnd && h.wordEnd >= newHighlight.wordStart;
            return !overlaps;
        });

        filtered.push(newHighlight);
        saveAllHighlights(filtered);
    }

    function removeHighlight(id) {
        saveAllHighlights(getAllHighlights().filter(h => h.id !== id));
    }

    function makeId() {
        return `hl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }


    /* =====================================================
       TEMAS (cor + ícone + padrão — nunca só cor)
    ===================================================== */

    const HIGHLIGHT_THEMES = [
        { id: "promessa", label: "Promessa", icon: "⭐" },
        { id: "oracao", label: "Oração", icon: "🙏" },
        { id: "sabedoria", label: "Sabedoria", icon: "💡" },
        { id: "atencao", label: "Atenção", icon: "❗" },
        { id: "gratidao", label: "Gratidão", icon: "💚" }
    ];

    function themeById(id) {
        return HIGHLIGHT_THEMES.find(t => t.id === id) || HIGHLIGHT_THEMES[0];
    }


    /* =====================================================
       TOKENIZAÇÃO DE PALAVRAS
       (mesma lógica usada pra renderizar E pra reconstruir o texto,
       então os índices de início/fim sempre batem)
    ===================================================== */

    function tokenizeVerse(text) {
        const parts = text.split(/(\s+)/);
        const tokens = [];

        for (let i = 0; i < parts.length; i += 2) {
            const word = parts[i];
            const space = parts[i + 1] || "";
            if (word.length) {
                tokens.push({ word, space });
            }
        }

        return tokens;
    }

    function tokensToText(tokens, start, end) {
        return tokens
            .slice(start, end + 1)
            .map(t => t.word + t.space)
            .join("")
            .trim();
    }


    /* =====================================================
       ANÚNCIOS PARA LEITOR DE TELA (aria-live)
    ===================================================== */

    let liveRegion = null;

    function announce(message) {
        if (!liveRegion) return;
        liveRegion.textContent = "";
        // pequeno atraso garante que leitores de tela percebam a mudança
        // mesmo quando o texto anunciado é igual ao anterior
        window.setTimeout(() => {
            liveRegion.textContent = message;
        }, 30);
    }


    /* =====================================================
       RENDERIZAÇÃO DE UM VERSÍCULO (com grifos aplicados)
    ===================================================== */

    // container: o elemento onde o texto do versículo deve entrar
    // (normalmente a div.verse-reading já usada no app)
    function renderVerse(container, book, chapter, verse, text) {
        container.innerHTML = "";
        container.dataset.hlBook = book;
        container.dataset.hlChapter = chapter;
        container.dataset.hlVerse = verse;
        container.classList.add("hl-verse-text");

        const tokens = tokenizeVerse(text);
        const highlights = getHighlightsForVerse(book, chapter, verse)
            .slice()
            .sort((a, b) => a.wordStart - b.wordStart);

        const frag = document.createDocumentFragment();
        let i = 0;

        while (i < tokens.length) {
            const hl = highlights.find(h => h.wordStart <= i && i <= h.wordEnd);

            if (hl) {
                const theme = themeById(hl.theme);
                const mark = document.createElement("mark");
                mark.className = `hl hl-${hl.theme}`;
                mark.tabIndex = 0;
                mark.dataset.highlightId = hl.id;

                const wordsText = tokensToText(tokens, hl.wordStart, hl.wordEnd);
                mark.textContent = wordsText;

                mark.setAttribute(
                    "aria-label",
                    `Trecho grifado: "${wordsText}". Cor: ${theme.label}.` +
                    (hl.note ? ` Nota: ${hl.note}.` : "") +
                    " Pressione Enter para editar ou remover."
                );

                mark.addEventListener("click", () => openEditDialog(hl));
                mark.addEventListener("keydown", event => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openEditDialog(hl);
                    }
                });

                frag.appendChild(mark);

                const lastSpace = tokens[hl.wordEnd] ? tokens[hl.wordEnd].space : "";
                if (lastSpace) frag.appendChild(document.createTextNode(lastSpace));

                i = hl.wordEnd + 1;

            } else {
                const span = document.createElement("span");
                span.className = "hl-word";
                span.dataset.wordIndex = String(i);
                span.textContent = tokens[i].word;
                frag.appendChild(span);

                if (tokens[i].space) frag.appendChild(document.createTextNode(tokens[i].space));
                i++;
            }
        }

        container.appendChild(frag);

        // Botão "Grifar" — caminho 100% acessível por teclado, alternativo
        // à seleção de texto com o dedo/mouse.
        const grifarButton = document.createElement("button");
        grifarButton.type = "button";
        grifarButton.className = "small-action hl-grifar-button";
        grifarButton.innerHTML = `${PENCIL_SVG} Grifar`;
        grifarButton.setAttribute(
            "aria-label",
            `Grifar um trecho do versículo ${verse}`
        );
        grifarButton.addEventListener("click", () => {
            openCreateDialog(book, chapter, verse, text);
        });

        // Se já existir uma linha de ações (ex: botão "Salvar" do app),
        // anexa ali; senão cria uma.
        let actionsRow = container.parentElement?.querySelector(".verse-actions");
        if (!actionsRow) {
            actionsRow = document.createElement("div");
            actionsRow.className = "verse-actions";
            container.parentElement?.appendChild(actionsRow);
        }
        actionsRow.appendChild(grifarButton);
    }

    const PENCIL_SVG =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" width="13" height="13">' +
        '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>';


    /* =====================================================
       BARRA FLUTUANTE (após seleção nativa de texto)
    ===================================================== */

    let toolbarEl = null;
    let pendingSelection = null; // { book, chapter, verse, wordStart, wordEnd, text }

    function buildToolbar() {
        toolbarEl = document.createElement("div");
        toolbarEl.className = "hl-toolbar hidden";
        toolbarEl.setAttribute("role", "toolbar");
        toolbarEl.setAttribute("aria-label", "Escolha uma cor para o grifo");

        HIGHLIGHT_THEMES.forEach(theme => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `hl-toolbar-swatch hl-swatch-${theme.id}`;
            button.innerHTML = `<span aria-hidden="true">${theme.icon}</span>`;
            button.setAttribute("aria-label", `Grifar em ${theme.label}`);

            button.addEventListener("click", () => {
                if (!pendingSelection) return;

                const highlight = {
                    id: makeId(),
                    book: pendingSelection.book,
                    chapter: pendingSelection.chapter,
                    verse: pendingSelection.verse,
                    wordStart: pendingSelection.wordStart,
                    wordEnd: pendingSelection.wordEnd,
                    theme: theme.id,
                    note: "",
                    text: pendingSelection.text,
                    createdAt: new Date().toISOString()
                };

                upsertHighlight(highlight);
                hideToolbar();
                rerenderAffectedVerse(highlight);
                announce(`Trecho grifado em ${theme.label}.`);

                // Abre o editor logo em seguida, já focado na nota — assim
                // quem quiser só escrever uma observação não precisa clicar
                // de novo no grifo recém-criado.
                openEditDialog(highlight, { focusNote: true });
            });

            toolbarEl.appendChild(button);
        });

        document.body.appendChild(toolbarEl);
    }

    function showToolbar(rect) {
        const top = rect.top + window.scrollY - toolbarEl.offsetHeight - 10;
        const left = rect.left + window.scrollX + rect.width / 2;

        toolbarEl.style.top = `${Math.max(8, top)}px`;
        toolbarEl.style.left = `${left}px`;
        toolbarEl.classList.remove("hidden");
    }

    function hideToolbar() {
        pendingSelection = null;
        if (toolbarEl) toolbarEl.classList.add("hidden");
    }

    function handleNativeSelection() {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed || !selection.rangeCount) {
            hideToolbar();
            return;
        }

        const range = selection.getRangeAt(0);
        const anchorNode = range.commonAncestorContainer;
        const verseEl = (anchorNode.nodeType === 1 ? anchorNode : anchorNode.parentElement)
            ?.closest(".hl-verse-text");

        if (!verseEl) {
            hideToolbar();
            return;
        }

        const wordSpans = verseEl.querySelectorAll(".hl-word");
        let minIndex = null;
        let maxIndex = null;

        wordSpans.forEach(span => {
            if (selection.containsNode(span, true)) {
                const idx = Number(span.dataset.wordIndex);
                if (minIndex === null || idx < minIndex) minIndex = idx;
                if (maxIndex === null || idx > maxIndex) maxIndex = idx;
            }
        });

        if (minIndex === null) {
            hideToolbar();
            return;
        }

        const book = verseEl.dataset.hlBook;
        const chapter = Number(verseEl.dataset.hlChapter);
        const verse = Number(verseEl.dataset.hlVerse);

        // Reconstrói o texto original do versículo a partir dos spans já
        // renderizados (não temos o texto "cru" aqui, então lemos do DOM).
        const fullText = Array.from(verseEl.childNodes)
            .map(node => node.textContent)
            .join("");
        const tokens = tokenizeVerse(fullText);

        pendingSelection = {
            book,
            chapter,
            verse,
            wordStart: minIndex,
            wordEnd: maxIndex,
            text: tokensToText(tokens, minIndex, maxIndex)
        };

        showToolbar(range.getBoundingClientRect());
    }

    document.addEventListener("mouseup", handleNativeSelection);
    document.addEventListener("touchend", handleNativeSelection);
    document.addEventListener("mousedown", event => {
        if (toolbarEl && !toolbarEl.contains(event.target)) hideToolbar();
    });


    /* =====================================================
       GRUPO DE RÁDIO ACESSÍVEL (escolha de tema/cor)
       — usado nos dois diálogos abaixo
    ===================================================== */

    function buildThemeRadiogroup(selectedId) {
        const group = document.createElement("div");
        group.className = "hl-theme-group";
        group.setAttribute("role", "radiogroup");
        group.setAttribute("aria-label", "Cor do grifo");

        HIGHLIGHT_THEMES.forEach((theme, index) => {
            const isSelected = theme.id === (selectedId || HIGHLIGHT_THEMES[0].id);

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `hl-theme-option hl-swatch-${theme.id}`;
            btn.setAttribute("role", "radio");
            btn.setAttribute("aria-checked", String(isSelected));
            btn.tabIndex = isSelected || (index === 0 && !selectedId) ? 0 : -1;
            btn.dataset.themeId = theme.id;
            btn.innerHTML =
                `<span class="hl-theme-icon" aria-hidden="true">${theme.icon}</span>` +
                `<span>${theme.label}</span>`;

            if (isSelected) btn.classList.add("is-selected");

            btn.addEventListener("click", () => {
                group.querySelectorAll('[role="radio"]').forEach(el => {
                    el.setAttribute("aria-checked", "false");
                    el.tabIndex = -1;
                    el.classList.remove("is-selected");
                });
                btn.setAttribute("aria-checked", "true");
                btn.tabIndex = 0;
                btn.classList.add("is-selected");
            });

            group.appendChild(btn);
        });

        // Navegação por setas (padrão de acessibilidade para radiogroups)
        group.addEventListener("keydown", event => {
            const options = Array.from(group.querySelectorAll('[role="radio"]'));
            const currentIndex = options.findIndex(el => el === document.activeElement);
            if (currentIndex === -1) return;

            let nextIndex = null;
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                nextIndex = (currentIndex + 1) % options.length;
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                nextIndex = (currentIndex - 1 + options.length) % options.length;
            }

            if (nextIndex !== null) {
                event.preventDefault();
                options[nextIndex].click();
                options[nextIndex].focus();
            }
        });

        return group;
    }

    function getSelectedTheme(group) {
        const checked = group.querySelector('[role="radio"][aria-checked="true"]');
        return checked ? checked.dataset.themeId : HIGHLIGHT_THEMES[0].id;
    }


    /* =====================================================
       DIÁLOGO 1 — CRIAR GRIFO (picker de palavras, acessível)
    ===================================================== */

    let createDialogEl = null;

    function buildCreateDialog() {
        createDialogEl = document.createElement("dialog");
        createDialogEl.className = "hl-dialog";
        createDialogEl.setAttribute("aria-label", "Grifar trecho do versículo");

        createDialogEl.innerHTML = `
            <form method="dialog" class="hl-dialog-form">
                <h2 class="hl-dialog-title">Grifar trecho</h2>
                <p class="hl-dialog-hint" id="hlPickerHint">
                    Toque ou navegue com Tab até a primeira palavra do trecho e
                    pressione Enter. Depois faça o mesmo na última palavra.
                </p>

                <div class="hl-chip-list" id="hlChipList" role="group" aria-describedby="hlPickerHint"></div>

                <p class="hl-preview" id="hlPreview" aria-live="polite">Nenhum trecho selecionado ainda.</p>

                <button type="button" class="secondary-button hl-select-all" id="hlSelectAll">
                    Selecionar o versículo inteiro
                </button>

                <div class="hl-theme-field">
                    <span class="hl-field-label">Cor</span>
                    <div id="hlCreateThemeSlot"></div>
                </div>

                <label class="hl-field-label" for="hlCreateNote">Nota (opcional)</label>
                <textarea id="hlCreateNote" rows="3" placeholder="Ex: Deus cumpriu isso na minha vida quando..."></textarea>

                <div class="hl-dialog-actions">
                    <button type="button" class="secondary-button" id="hlCreateCancel">Cancelar</button>
                    <button type="button" class="primary-button" id="hlCreateSave" disabled>Salvar grifo</button>
                </div>
            </form>
        `;

        document.body.appendChild(createDialogEl);

        createDialogEl.querySelector("#hlCreateCancel").addEventListener("click", () => {
            createDialogEl.close();
        });
    }

    let createState = { start: null, end: null, tokens: [], book: null, chapter: null, verse: null };

    function openCreateDialog(book, chapter, verse, text) {
        createState = { start: null, end: null, tokens: tokenizeVerse(text), book, chapter, verse };

        const chipList = createDialogEl.querySelector("#hlChipList");
        chipList.innerHTML = "";

        createState.tokens.forEach((token, index) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "hl-chip";
            chip.textContent = token.word;
            chip.setAttribute("aria-pressed", "false");
            chip.dataset.index = String(index);

            chip.addEventListener("click", () => {
                if (createState.start === null || createState.end !== null) {
                    createState.start = index;
                    createState.end = null;
                } else {
                    createState.end = index;
                    if (createState.end < createState.start) {
                        [createState.start, createState.end] = [createState.end, createState.start];
                    }
                }
                updateChipVisuals();
            });

            chipList.appendChild(chip);
        });

        createDialogEl.querySelector("#hlSelectAll").onclick = () => {
            createState.start = 0;
            createState.end = createState.tokens.length - 1;
            updateChipVisuals();
        };

        const themeSlot = createDialogEl.querySelector("#hlCreateThemeSlot");
        themeSlot.innerHTML = "";
        themeSlot.appendChild(buildThemeRadiogroup(HIGHLIGHT_THEMES[0].id));

        createDialogEl.querySelector("#hlCreateNote").value = "";
        updateChipVisuals();

        createDialogEl.querySelector("#hlCreateSave").onclick = () => {
            if (createState.start === null || createState.end === null) return;

            const theme = getSelectedTheme(themeSlot.querySelector('[role="radiogroup"]'));
            const note = createDialogEl.querySelector("#hlCreateNote").value.trim();

            const highlight = {
                id: makeId(),
                book: createState.book,
                chapter: createState.chapter,
                verse: createState.verse,
                wordStart: createState.start,
                wordEnd: createState.end,
                theme,
                note,
                text: tokensToText(createState.tokens, createState.start, createState.end),
                createdAt: new Date().toISOString()
            };

            upsertHighlight(highlight);
            rerenderAffectedVerse(highlight);
            announce(`Grifo salvo: "${highlight.text}".`);
            createDialogEl.close();
        };

        createDialogEl.showModal();
    }

    function updateChipVisuals() {
        const chipList = createDialogEl.querySelector("#hlChipList");
        const preview = createDialogEl.querySelector("#hlPreview");
        const saveButton = createDialogEl.querySelector("#hlCreateSave");

        chipList.querySelectorAll(".hl-chip").forEach(chip => {
            const index = Number(chip.dataset.index);
            const inRange =
                createState.start !== null &&
                index >= createState.start &&
                index <= (createState.end === null ? createState.start : createState.end);

            chip.classList.toggle("is-selected", inRange);
            chip.setAttribute("aria-pressed", String(inRange));
        });

        if (createState.start === null) {
            preview.textContent = "Nenhum trecho selecionado ainda.";
            saveButton.disabled = true;
        } else if (createState.end === null) {
            preview.textContent = `Início marcado em "${createState.tokens[createState.start].word}". Escolha a última palavra do trecho.`;
            saveButton.disabled = true;
        } else {
            const text = tokensToText(createState.tokens, createState.start, createState.end);
            preview.textContent = `Trecho selecionado: "${text}"`;
            saveButton.disabled = false;
        }
    }


    /* =====================================================
       DIÁLOGO 2 — EDITAR / REMOVER GRIFO EXISTENTE
    ===================================================== */

    let editDialogEl = null;

    function buildEditDialog() {
        editDialogEl = document.createElement("dialog");
        editDialogEl.className = "hl-dialog";
        editDialogEl.setAttribute("aria-label", "Editar grifo");

        editDialogEl.innerHTML = `
            <form method="dialog" class="hl-dialog-form">
                <h2 class="hl-dialog-title">Editar grifo</h2>
                <p class="hl-preview" id="hlEditQuote"></p>

                <div class="hl-theme-field">
                    <span class="hl-field-label">Cor</span>
                    <div id="hlEditThemeSlot"></div>
                </div>

                <label class="hl-field-label" for="hlEditNote">Nota (opcional)</label>
                <textarea id="hlEditNote" rows="3"></textarea>

                <div class="hl-dialog-actions hl-dialog-actions-edit">
                    <button type="button" class="menu-button danger hl-remove-button" id="hlEditRemove">
                        Remover grifo
                    </button>
                    <div class="hl-dialog-actions">
                        <button type="button" class="secondary-button" id="hlEditCancel">Fechar</button>
                        <button type="button" class="primary-button" id="hlEditSave">Salvar</button>
                    </div>
                </div>
            </form>
        `;

        document.body.appendChild(editDialogEl);

        editDialogEl.querySelector("#hlEditCancel").addEventListener("click", () => {
            editDialogEl.close();
        });
    }

    function openEditDialog(highlight, options = {}) {
        editDialogEl.querySelector("#hlEditQuote").textContent = `"${highlight.text}"`;

        const themeSlot = editDialogEl.querySelector("#hlEditThemeSlot");
        themeSlot.innerHTML = "";
        themeSlot.appendChild(buildThemeRadiogroup(highlight.theme));

        const noteField = editDialogEl.querySelector("#hlEditNote");
        noteField.value = highlight.note || "";

        editDialogEl.querySelector("#hlEditRemove").onclick = () => {
            const confirmed = confirm("Remover este grifo?");
            if (!confirmed) return;

            removeHighlight(highlight.id);
            rerenderAffectedVerse(highlight);
            announce("Grifo removido.");
            editDialogEl.close();
        };

        editDialogEl.querySelector("#hlEditSave").onclick = () => {
            const theme = getSelectedTheme(themeSlot.querySelector('[role="radiogroup"]'));
            const updated = {
                ...highlight,
                theme,
                note: noteField.value.trim()
            };

            upsertHighlight(updated);
            rerenderAffectedVerse(updated);
            announce("Grifo atualizado.");
            editDialogEl.close();
        };

        editDialogEl.showModal();

        if (options.focusNote) {
            window.setTimeout(() => noteField.focus(), 50);
        }
    }


    /* =====================================================
       RE-RENDERIZAÇÃO DO VERSÍCULO AFETADO (após criar/editar/remover)
    ===================================================== */

    const rerenderCallbacks = [];

    // script.js registra aqui uma função "como recarregar a leitura atual"
    // (ex: recarregar o capítulo aberto no momento).
    function onNeedsRerender(callback) {
        rerenderCallbacks.push(callback);
    }

    function rerenderAffectedVerse(highlight) {
        rerenderCallbacks.forEach(cb => {
            try {
                cb(highlight);
            } catch (error) {
                console.error("Erro ao re-renderizar após grifo:", error);
            }
        });
    }


    /* =====================================================
       LEGENDA + RESUMO "MINHAS ANOTAÇÕES NESTE CAPÍTULO"
    ===================================================== */

    function buildLegend() {
        const details = document.createElement("details");
        details.className = "hl-legend";

        const summary = document.createElement("summary");
        summary.textContent = "Legenda dos grifos";
        details.appendChild(summary);

        const list = document.createElement("ul");
        list.className = "hl-legend-list";

        HIGHLIGHT_THEMES.forEach(theme => {
            const item = document.createElement("li");
            item.innerHTML =
                `<span class="hl-legend-swatch hl-swatch-${theme.id}" aria-hidden="true">${theme.icon}</span>` +
                `<span>${theme.label}</span>`;
            list.appendChild(item);
        });

        details.appendChild(list);
        return details;
    }

    function buildAnnotationsSummary(book, chapter, onJump) {
        const highlights = getHighlightsForChapter(book, chapter);

        const wrapper = document.createElement("section");
        wrapper.className = "hl-summary";

        if (!highlights.length) return wrapper; // vazio: nada a mostrar

        const title = document.createElement("h3");
        title.className = "hl-summary-title";
        title.textContent = `Minhas anotações neste capítulo (${highlights.length})`;
        wrapper.appendChild(title);

        const list = document.createElement("ul");
        list.className = "hl-summary-list";

        highlights.forEach(hl => {
            const theme = themeById(hl.theme);

            const item = document.createElement("li");
            item.className = "hl-summary-item";

            const jumpButton = document.createElement("button");
            jumpButton.type = "button";
            jumpButton.className = "hl-summary-jump";
            jumpButton.innerHTML =
                `<span class="hl-legend-swatch hl-swatch-${hl.theme}" aria-hidden="true">${theme.icon}</span>` +
                `<span class="hl-summary-verse">v${hl.verse}</span>` +
                `<span class="hl-summary-text">"${hl.text}"</span>`;
            jumpButton.setAttribute(
                "aria-label",
                `Ir para o versículo ${hl.verse}, grifo ${theme.label}: ${hl.text}`
            );

            jumpButton.addEventListener("click", () => {
                if (typeof onJump === "function") onJump(hl.verse);
            });

            item.appendChild(jumpButton);

            if (hl.note) {
                const note = document.createElement("p");
                note.className = "hl-summary-note";
                note.textContent = hl.note;
                item.appendChild(note);
            }

            list.appendChild(item);
        });

        wrapper.appendChild(list);
        return wrapper;
    }

    // Injeta a legenda + resumo antes do elemento de conteúdo do capítulo
    // (ex: antes de #chapterContent ou #planChapterVerses). Chame de novo
    // a cada carregamento de capítulo — a função substitui o que já existia.
    function mountChapterTools(hostEl, book, chapter, onJumpToVerse) {
        hostEl.querySelectorAll(".hl-legend, .hl-summary").forEach(el => el.remove());
        hostEl.appendChild(buildLegend());
        hostEl.appendChild(buildAnnotationsSummary(book, chapter, onJumpToVerse));
    }


    /* =====================================================
       SINCRONIZAÇÃO EM NUVEM / LIMPEZA DE DADOS
       (para o script.js plugar no fluxo de conta já existente)
    ===================================================== */

    function getSnapshot() {
        return getAllHighlights();
    }

    function applySnapshot(list) {
        if (Array.isArray(list)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }
    }

    function clearAll() {
        localStorage.removeItem(STORAGE_KEY);
    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    function init() {
        liveRegion = document.createElement("div");
        liveRegion.className = "sr-only";
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("role", "status");
        document.body.appendChild(liveRegion);

        buildToolbar();
        buildCreateDialog();
        buildEditDialog();
    }


    /* =====================================================
       API PÚBLICA
    ===================================================== */

    window.Highlights = {
        init,
        renderVerse,
        mountChapterTools,
        onNeedsRerender,
        getSnapshot,
        applySnapshot,
        clearAll,
        THEMES: HIGHLIGHT_THEMES
    };

})();
