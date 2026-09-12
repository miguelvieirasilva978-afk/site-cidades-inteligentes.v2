/* =========================================================
   SMART CITY SINGAPURA
   SCRIPT.JS — PARTE 1/5
   BASE • NAVEGAÇÃO • MENU • BUSCA
========================================================= */

"use strict";


/* =========================================================
   01. ESTADO GLOBAL
========================================================= */

const App = {

    currentTab: "inicio",

    currentTechnology: null,

    currentSingaporeDetail: null,

    searchOpen: false,

    mobileMenuOpen: false,

    quiz: {
        currentQuestion: 0,
        score: 0,
        answered: false
    },

    cityTest: {
        active: false,
        cityName: "",
        currentQuestion: 0,
        answers: [],
        dimensions: {}
    }

};


/* =========================================================
   02. FUNÇÕES AUXILIARES
========================================================= */

function $(selector, parent = document) {
    return parent.querySelector(selector);
}


function $$(selector, parent = document) {
    return Array.from(
        parent.querySelectorAll(selector)
    );
}


function byId(id) {
    return document.getElementById(id);
}


function safeText(value) {
    return String(value ?? "")
        .replace(/[<>&"'`]/g, character => {
            const entities = {
                "<": "&lt;",
                ">": "&gt;",
                "&": "&amp;",
                '"': "&quot;",
                "'": "&#039;",
                "`": "&#096;"
            };

            return entities[character];
        });
}


function normalizeText(value) {

    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

}


function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}


function scrollToElement(element, offset = 80) {

    if (!element) return;

    const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        offset;

    window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth"
    });

}


function showElement(element) {

    if (!element) return;

    element.classList.remove("hidden");
    element.removeAttribute("hidden");

}


function hideElement(element) {

    if (!element) return;

    element.classList.add("hidden");
    element.setAttribute("hidden", "hidden");

}


/* =========================================================
   03. NAVEGAÇÃO PRINCIPAL
========================================================= */

function openTab(tabId, options = {}) {

    if (!tabId) return;

    const sections = $$(
        ".tab-section"
    );

    const target =
        byId(tabId);

    if (!target) {

        console.warn(
            `Seção "${tabId}" não encontrada.`
        );

        return;

    }


    sections.forEach(section => {

        const active =
            section.id === tabId;

        section.classList.toggle(
            "active",
            active
        );

        section.classList.toggle(
            "is-active",
            active
        );

        section.setAttribute(
            "aria-hidden",
            active ? "false" : "true"
        );

    });


    $$("[data-tab]").forEach(button => {

        const buttonTarget =
            button.dataset.tab;

        const active =
            buttonTarget === tabId;

        button.classList.toggle(
            "active",
            active
        );

        button.classList.toggle(
            "is-active",
            active
        );

        if (
            button.hasAttribute("aria-current") ||
            active
        ) {

            button.setAttribute(
                "aria-current",
                active ? "page" : "false"
            );

        }

    });


    App.currentTab =
        tabId;


    closeMobileMenu();


    if (
        options.scroll !== false
    ) {

        requestAnimationFrame(() => {

            scrollToElement(
                target,
                options.offset ?? 82
            );

        });

    }


    document.dispatchEvent(
        new CustomEvent(
            "smartcity:tabchange",
            {
                detail: {
                    tab: tabId
                }
            }
        )
    );

}


/*
 * Disponibiliza a função globalmente.
 *
 * Isso é importante porque os botões do HTML
 * podem utilizar:
 *
 * onclick="openTab('inicio')"
 */

window.openTab =
    openTab;


/* =========================================================
   04. NAVEGAÇÃO POR DATA-TAB
========================================================= */

function handleTabClick(event) {

    const button =
        event.target.closest(
            "[data-tab]"
        );

    if (!button) return;

    event.preventDefault();

    const target =
        button.dataset.tab;

    if (!target) return;

    openTab(target);

}


/* =========================================================
   05. MENU MOBILE
========================================================= */

function getMenuElements() {

    return {

        toggle:
            $(".menu-toggle"),

        nav:
            $(".main-nav"),

        header:
            $(".site-header")

    };

}


function openMobileMenu() {

    const {
        toggle,
        nav,
        header
    } =
        getMenuElements();

    if (!nav) return;

    App.mobileMenuOpen =
        true;

    nav.classList.add(
        "mobile-open"
    );

    nav.classList.add(
        "open"
    );

    if (header) {

        header.classList.add(
            "menu-open"
        );

    }

    if (toggle) {

        toggle.classList.add(
            "active"
        );

        toggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }

}


function closeMobileMenu() {

    const {
        toggle,
        nav,
        header
    } =
        getMenuElements();

    App.mobileMenuOpen =
        false;

    if (nav) {

        nav.classList.remove(
            "mobile-open"
        );

        nav.classList.remove(
            "open"
        );

    }

    if (header) {

        header.classList.remove(
            "menu-open"
        );

    }

    if (toggle) {

        toggle.classList.remove(
            "active"
        );

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


function toggleMobileMenu() {

    if (
        App.mobileMenuOpen
    ) {

        closeMobileMenu();

    } else {

        openMobileMenu();

    }

}


/* =========================================================
   06. PESQUISA DO SITE
========================================================= */

const siteSearchItems = [

    {
        title:
            "Início",

        description:
            "Visão geral das cidades inteligentes e de Singapura.",

        tab:
            "inicio",

        keywords:
            "inicio começo home cidade inteligente smart city singapura"
    },

    {
        title:
            "Singapura",

        description:
            "Como Singapura se tornou referência internacional.",

        tab:
            "singapura",

        keywords:
            "singapura singapore cidade pais smart nation"
    },

    {
        title:
            "Tecnologias",

        description:
            "Tecnologias utilizadas em cidades inteligentes.",

        tab:
            "tecnologias",

        keywords:
            "tecnologia tecnologias iot inteligencia artificial ia dados 5g agua energia transporte"
    },

    {
        title:
            "Quiz",

        description:
            "Teste seus conhecimentos sobre cidades inteligentes.",

        tab:
            "quiz",

        keywords:
            "quiz perguntas teste conhecimento singapura"
    },

    {
        title:
            "Teste sua cidade",

        description:
            "Faça um diagnóstico de maturidade da sua cidade.",

        tab:
            "teste-cidade",

        keywords:
            "teste cidade diagnostico diagnóstico cidade municipio município avaliação"
    },

    {
        title:
            "Fontes",

        description:
            "Estudos, documentos e referências utilizadas no projeto.",

        tab:
            "fontes",

        keywords:
            "fontes estudos brasil governo smart nation pesquisa referencias"
    }

];


function getSearchContainer() {

    return (
        $(".search-results") ||
        $(".header-search-results") ||
        byId("searchResults")
    );

}


function getSearchInput() {

    return (
        $(".header-search input") ||
        $(".header-search-input") ||
        $("input[type='search']")
    );

}


function renderSearchResults(query) {

    const container = getSearchContainer();

    if (!container) return;

    const normalized = normalizeText(query);

    if (!normalized) {
        container.innerHTML = "";
        container.classList.remove("visible", "open");
        App.searchOpen = false;
        return;
    }

    const terms = normalized.split(/\s+/).filter(Boolean);
    const results = [];

    /* Seções principais. */
    siteSearchItems.forEach(item => {
        const content = normalizeText(
            [item.title, item.description, item.keywords].join(" ")
        );

        if (terms.every(term => content.includes(term))) {
            results.push({
                title: item.title,
                description: item.description,
                tab: item.tab,
                kind: "tab"
            });
        }
    });

    /* Cards de conteúdo de Singapura. */
    $$(".info-card").forEach(card => {
        const title = card.querySelector("h3")?.textContent || "";
        const description = card.querySelector("p")?.textContent || "";
        const category = card.querySelector(".info-category")?.textContent || "";
        const content = normalizeText(
            [title, description, category].join(" ")
        );

        if (terms.every(term => content.includes(term))) {
            results.push({
                title: title.trim(),
                description: `${category.trim()} • conteúdo de Singapura`,
                tab: "singapura",
                detail: card.dataset.detail || "",
                kind: "singapore"
            });
        }
    });

    /* Tecnologias cadastradas no módulo JavaScript. */
    if (typeof technologyData !== "undefined") {
        Object.entries(technologyData).forEach(([id, data]) => {
            const content = normalizeText(
                [data.title, data.category, data.description, ...(data.examples || [])].join(" ")
            );

            if (terms.every(term => content.includes(term))) {
                results.push({
                    title: data.title,
                    description: `${data.category} • tecnologia urbana`,
                    tab: "tecnologias",
                    technology: id,
                    kind: "technology"
                });
            }
        });
    }

    /* Evita resultados repetidos. */
    const unique = [];
    const seen = new Set();

    results.forEach(item => {
        const key = `${item.kind}|${item.tab}|${item.detail || ""}|${item.technology || ""}|${item.title}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(item);
        }
    });

    const limited = unique.slice(0, 10);

    if (!limited.length) {
        container.innerHTML = `
            <div class="search-empty">
                <strong>Nenhum resultado encontrado</strong>
                <span>Tente buscar por agricultura, tecnologia, Singapura, transporte ou quiz.</span>
            </div>
        `;
    } else {
        container.innerHTML = limited.map((item, index) => `
            <button
                type="button"
                class="search-result-item"
                data-search-tab="${safeText(item.tab)}"
                ${item.detail ? `data-search-detail="${safeText(item.detail)}"` : ""}
                ${item.technology ? `data-search-technology="${safeText(item.technology)}"` : ""}
            >
                <span class="search-result-number">${String(index + 1).padStart(2, "0")}</span>
                <span class="search-result-content">
                    <strong>${safeText(item.title)}</strong>
                    <small>${safeText(item.description)}</small>
                </span>
                <span class="search-result-arrow" aria-hidden="true">→</span>
            </button>
        `).join("");
    }

    container.classList.add("visible", "open");
    App.searchOpen = true;
}


function closeSearch() {

    const container =
        getSearchContainer();

    if (!container) return;

    container.classList.remove(
        "visible",
        "open"
    );

    App.searchOpen =
        false;

}


function handleSearchResultClick(event) {

    const result = event.target.closest("[data-search-tab]");
    if (!result) return;

    const tab = result.dataset.searchTab;
    const detail = result.dataset.searchDetail;
    const technology = result.dataset.searchTechnology;

    closeSearch();

    const input = getSearchInput();
    if (input) input.value = "";

    if (technology) {
        openTechnologyFromSearch(technology);
        return;
    }

    openTab(tab);

    if (detail) {
        setTimeout(() => {
            const card = document.querySelector(
                `.info-card[data-detail="${CSS.escape(detail)}"]`
            );

            if (card) {
                card.click();
            }
        }, 300);
    }
}


/* =========================================================
   07. PESQUISA TAMBÉM ENCONTRA TECNOLOGIAS
========================================================= */

function searchTechnology(query) {

    const normalized =
        normalizeText(query);

    if (!normalized) return null;


    const technologies = [

        {
            id: "mobilidade",
            terms: [
                "mobilidade",
                "transporte",
                "metro",
                "ônibus",
                "onibus",
                "trânsito",
                "transito"
            ]
        },

        {
            id: "iot",
            terms: [
                "iot",
                "sensor",
                "sensores",
                "internet das coisas"
            ]
        },

        {
            id: "ia",
            terms: [
                "ia",
                "inteligencia artificial",
                "inteligência artificial",
                "dados",
                "analytics"
            ]
        },

        {
            id: "smart-grid",
            terms: [
                "smart grid",
                "energia",
                "rede eletrica",
                "rede elétrica"
            ]
        },

        {
            id: "agua",
            terms: [
                "agua",
                "água",
                "ne water",
                "newater"
            ]
        },

        {
            id: "residuos",
            terms: [
                "residuo",
                "resíduos",
                "residuos",
                "lixo"
            ]
        },

        {
            id: "5g",
            terms: [
                "5g",
                "conectividade",
                "rede"
            ]
        },

        {
            id: "digital-twin",
            terms: [
                "digital twin",
                "gêmeo digital",
                "gemeo digital",
                "virtual singapore"
            ]
        },

        {
            id: "governo-digital",
            terms: [
                "governo digital",
                "governanca",
                "governança",
                "servicos digitais",
                "serviços digitais"
            ]
        }

    ];


    for (
        const technology
        of technologies
    ) {

        if (
            technology.terms.some(
                term =>
                    normalizeText(term) === normalized ||
                    normalized.includes(
                        normalizeText(term)
                    )
            )
        ) {

            return technology.id;

        }

    }

    return null;

}


function openTechnologyFromSearch(
    technologyId
) {

    if (!technologyId) return;

    openTab("tecnologias");

    setTimeout(() => {

        const tab =
            $(
                `[data-technology="${technologyId}"]`
            ) ||
            $(
                `[data-tech="${technologyId}"]`
            );

        if (tab) {

            tab.click();

            scrollToElement(
                tab,
                105
            );

        }

    }, 250);

}


/* =========================================================
   08. EVENTOS DE PESQUISA
========================================================= */

function setupSearch() {

    const input =
        getSearchInput();

    if (!input) return;

    const clearButton = byId("clearSearch");

    if (clearButton) {
        clearButton.addEventListener("click", event => {
            event.preventDefault();
            input.value = "";
            closeSearch();
            input.focus();
        });
    }


    input.addEventListener(
        "input",
        () => {

            const query =
                input.value;

            renderSearchResults(
                query
            );

        }
    );


    input.addEventListener(
        "focus",
        () => {

            if (
                input.value.trim()
            ) {

                renderSearchResults(
                    input.value
                );

            }

        }
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeSearch();

                input.blur();

            }


            if (
                event.key === "Enter"
            ) {

                const technology =
                    searchTechnology(
                        input.value
                    );

                if (technology) {

                    closeSearch();

                    openTechnologyFromSearch(
                        technology
                    );

                    return;

                }


                const first =
                    $(".search-result-item");

                if (first) {

                    first.click();

                }

            }

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    ".header-search"
                )
            ) {

                closeSearch();

            }

        }
    );

}


/* =========================================================
   09. SCROLL DA PÁGINA
========================================================= */

function setupScrollEffects() {

    let ticking =
        false;


    function update() {

        const header =
            $(".site-header");

        if (header) {

            header.classList.toggle(
                "scrolled",
                window.scrollY > 30
            );

        }


        const backToTop =
            $(".back-to-top");

        if (backToTop) {

            backToTop.classList.toggle(
                "visible",
                window.scrollY > 500
            );

        }


        ticking =
            false;

    }


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    update
                );

                ticking =
                    true;

            }

        },
        {
            passive: true
        }
    );


    update();

}


/* =========================================================
   10. BOTÃO VOLTAR AO TOPO
========================================================= */

function setupBackToTop() {

    const button =
        $(".back-to-top");

    if (!button) return;

    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   11. IMAGENS
========================================================= */

function setupImageFallbacks() {

    $$("img").forEach(
        image => {

            image.addEventListener(
                "error",
                () => {

                    image.parentElement
                        ?.classList.add(
                            "image-error"
                        );

                }
            );

        }
    );

}


/* =========================================================
   12. FECHAR MENU AO REDIMENSIONAR
========================================================= */

function setupResize() {

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 850 &&
                App.mobileMenuOpen
            ) {

                closeMobileMenu();

            }

        }
    );

}


/* =========================================================
   13. ATALHOS DE TECLADO
========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            const target =
                event.target;

            const typing =
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target instanceof HTMLSelectElement ||
                target.isContentEditable;


            if (
                event.key === "Escape"
            ) {

                closeMobileMenu();
                closeSearch();

            }


            if (
                typing
            ) return;


            if (
                event.key === "/"
            ) {

                event.preventDefault();

                const input =
                    getSearchInput();

                if (input) {

                    input.focus();

                }

            }


            if (
                event.key.toLowerCase() === "h"
            ) {

                openTab(
                    "inicio"
                );

            }

        }
    );

}


/* =========================================================
   14. INICIALIZAÇÃO DA NAVEGAÇÃO
========================================================= */

function setupNavigation() {

    document.addEventListener(
        "click",
        handleTabClick
    );


    const menuToggle =
        $(".menu-toggle");

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            event => {

                event.preventDefault();

                toggleMobileMenu();

            }
        );

    }


    document.addEventListener(
        "click",
        handleSearchResultClick
    );

    /* Botões que navegam diretamente para outra aba. */
    document.addEventListener("click", event => {
        const trigger = event.target.closest("[data-scroll-tab]");
        if (!trigger) return;

        const target = trigger.dataset.scrollTab;
        if (!target) return;

        event.preventDefault();
        openTab(target);
    });


    const initialSection =
        $(".tab-section.active") ||
        byId("inicio");


    if (initialSection) {

        openTab(
            initialSection.id,
            {
                scroll: false
            }
        );

    }

}


/* =========================================================
   15. EVENTO PRINCIPAL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        setupSearch();

        setupScrollEffects();

        setupBackToTop();

        setupImageFallbacks();

        setupResize();

        setupKeyboardShortcuts();


        document.body.classList.add(
            "smartcity-ready"
        );


        console.log(
            "Smart City Singapura carregado."
        );

    }
);


/* =========================================================
   16. EVENTOS PERSONALIZADOS
========================================================= */

document.addEventListener(
    "smartcity:tabchange",
    event => {

        const tab =
            event.detail?.tab;

        if (!tab) return;


        /*
         * Pequena animação ao entrar
         * em uma nova seção.
         */

        const section =
            byId(tab);

        if (!section) return;

        section.classList.remove(
            "fade-in"
        );

        void section.offsetWidth;

        section.classList.add(
            "fade-in"
        );

    }
);


/* =========================================================
   17. API GLOBAL
========================================================= */

window.SmartCity = {

    App,

    openTab,

    closeMobileMenu,

    openMobileMenu,

    toggleMobileMenu,

    closeSearch,

    normalizeText,

    scrollToElement

};


/* =========================================================
   FIM DA PARTE 1/5
========================================================= */

/* =========================================================
   SCRIPT.JS — PARTE 2/5
   SINGAPURA — CARDS, DETALHES E CONTEÚDO DINÂMICO
   ========================================================= */

const singaporeTopics = {

    "mosaico-cultural": {
        title: "Mosaico cultural",
        tag: "Cultura e sociedade",
        image:
            "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1800&q=85",

        intro:
            "Singapura é uma sociedade multicultural formada por diferentes comunidades que convivem em um território pequeno e altamente urbanizado.",

        paragraphs: [
            "A formação cultural de Singapura reúne principalmente comunidades de origem chinesa, malaia e indiana, além de diversos outros grupos que chegaram ao país ao longo de sua história.",
            "Essa diversidade aparece na arquitetura, na culinária, nas festas, nos idiomas, nos bairros históricos e nas tradições religiosas. Chinatown, Little India e Kampong Glam são exemplos de áreas que preservam diferentes elementos dessa identidade.",
            "O país possui quatro línguas oficiais: inglês, malaio, mandarim e tâmil. O malaio possui o status de língua nacional, enquanto o inglês ocupa papel central na administração, na educação e nos negócios.",
            "Para uma cidade inteligente, a diversidade cultural também representa um desafio de planejamento: espaços públicos, serviços digitais e políticas urbanas precisam atender uma população diversa sem apagar suas identidades."
        ],

        facts: [
            ["4", "línguas oficiais"],
            ["3+", "grandes comunidades históricas"],
            ["Chinatown", "bairro cultural"],
            ["Little India", "patrimônio cultural"]
        ],

        impact:
            "A diversidade é incorporada ao planejamento urbano por meio da preservação de bairros, espaços comunitários, gastronomia e patrimônio.",

        source:
            "Smart Nation Singapore e informações institucionais de Singapura"
    },


    "singlish": {
        title: "Singlish",
        tag: "Linguagem e identidade",
        image:
            "https://images.unsplash.com/photo-1496939376851-89342e90adcd?auto=format&fit=crop&w=1800&q=85",

        intro:
            "Singlish é uma variedade local do inglês associada à identidade cultural de Singapura.",

        paragraphs: [
            "Embora o inglês seja uma das línguas oficiais e tenha grande importância no sistema educacional e administrativo, o uso cotidiano do idioma em Singapura desenvolveu características próprias.",
            "O Singlish recebeu influências de línguas presentes na sociedade singapuriana, incluindo malaio, hokkien, cantonês, tâmil e outras variedades linguísticas.",
            "Expressões, ritmo, estrutura das frases e partículas utilizadas na comunicação informal fazem com que o Singlish seja facilmente reconhecido como uma característica cultural local.",
            "O fenômeno mostra que uma cidade global não precisa abandonar sua identidade para se modernizar. Tecnologia, internacionalização e cultura local podem coexistir."
        ],

        facts: [
            ["English", "língua de trabalho"],
            ["Malay", "língua nacional"],
            ["Mandarin", "língua oficial"],
            ["Tamil", "língua oficial"]
        ],

        impact:
            "O Singlish representa a dimensão humana da cidade inteligente: inovação urbana também precisa considerar identidade, comunicação e pertencimento.",

        source:
            "Government of Singapore / Smart Nation"
    },


    "hawker-centres": {
        title: "Hawker Centres",
        tag: "Alimentação e vida urbana",
        image:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85",

        intro:
            "Os Hawker Centres são grandes espaços públicos de alimentação que fazem parte da vida cotidiana de Singapura.",

        paragraphs: [
            "Em vez de restaurantes individuais espalhados somente por áreas comerciais, os Hawker Centres concentram dezenas de pequenos vendedores em um mesmo espaço.",
            "Eles oferecem refeições acessíveis e uma enorme variedade de culinárias, tornando-se importantes pontos de encontro para diferentes grupos sociais.",
            "Além do valor econômico, os centros hawker possuem enorme importância cultural. Em 2020, a cultura hawker de Singapura foi inscrita na Lista Representativa do Patrimônio Cultural Imaterial da Humanidade da UNESCO.",
            "Do ponto de vista urbano, esses espaços mostram como infraestrutura pública pode cumprir simultaneamente funções econômicas, sociais e culturais."
        ],

        facts: [
            ["UNESCO", "patrimônio cultural"],
            ["Centenas", "de bancas"],
            ["Acessível", "alimentação cotidiana"],
            ["Público", "espaço de convivência"]
        ],

        impact:
            "Os Hawker Centres ajudam a manter alimentação acessível, comércio local e convivência social dentro da cidade.",

        source:
            "UNESCO e Singapore Government"
    },


    "economia-avancada": {
        title: "Economia avançada",
        tag: "Economia",
        image:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85",

        intro:
            "Singapura transformou sua posição geográfica em uma das principais vantagens competitivas de sua economia.",

        paragraphs: [
            "O país possui uma economia altamente integrada ao comércio internacional e concentra atividades de finanças, logística, tecnologia, indústria avançada, biomedicina e serviços.",
            "A localização estratégica no Sudeste Asiático contribuiu para o desenvolvimento do país como centro de comércio e distribuição.",
            "A infraestrutura urbana é planejada para sustentar essa economia: aeroporto, porto, transporte público, conectividade digital e áreas empresariais funcionam de forma integrada.",
            "A estratégia de cidade inteligente não é tratada apenas como tecnologia. Ela está relacionada à capacidade de tornar a infraestrutura mais eficiente e criar condições para inovação econômica."
        ],

        facts: [
            ["Finanças", "setor estratégico"],
            ["Logística", "conexão global"],
            ["Tecnologia", "economia digital"],
            ["Biomedicina", "indústria avançada"]
        ],

        impact:
            "Infraestrutura eficiente reduz custos, melhora conectividade e aumenta a capacidade da cidade de participar das redes econômicas globais.",

        source:
            "Smart Nation Singapore"
    },


    "porto-de-singapura": {
        title: "Porto de Singapura",
        tag: "Logística e infraestrutura",
        image:
            "https://images.unsplash.com/photo-1759216373582-a24c4a65b031?fm=jpg&auto=format&fit=crop&w=1800&q=85",

        intro:
            "O Porto de Singapura é um dos elementos centrais da posição estratégica do país no comércio marítimo mundial.",

        paragraphs: [
            "Singapura está localizada próxima a uma das principais rotas marítimas que conectam o Oceano Índico ao Pacífico. Essa posição ajudou o país a se tornar um importante centro de transbordo e logística.",
            "O desenvolvimento do Tuas Port representa uma nova etapa dessa estratégia. O projeto utiliza automação e tecnologias digitais para aumentar a capacidade e a eficiência das operações portuárias.",
            "Guindastes automatizados, sistemas de gerenciamento e integração de dados permitem coordenar uma quantidade enorme de movimentações em uma área relativamente compacta.",
            "O porto mostra como uma cidade inteligente depende não apenas de aplicativos e sensores urbanos, mas também de grandes infraestruturas físicas conectadas digitalmente."
        ],

        facts: [
            ["Tuas Port", "nova geração"],
            ["Automação", "operações"],
            ["Transbordo", "função global"],
            ["Dados", "gestão logística"]
        ],

        impact:
            "A digitalização da infraestrutura portuária aumenta eficiência operacional e fortalece a posição de Singapura nas cadeias globais de comércio.",

        source:
            "Port of Singapore / Government of Singapore"
    },


    "virtual-singapore": {
        title: "Virtual Singapore",
        tag: "Gêmeo digital",
        image:
            "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1800&q=85",

        intro:
            "Virtual Singapore é uma plataforma tridimensional que representa digitalmente o território urbano e permite estudar diferentes cenários.",

        paragraphs: [
            "Um modelo tridimensional detalhado da cidade pode ser utilizado para visualizar edifícios, infraestrutura, espaços públicos e diferentes características do ambiente urbano.",
            "A ideia central é permitir que planejadores testem possibilidades antes de realizar alterações físicas na cidade.",
            "É possível utilizar modelos digitais para estudar sombra, circulação, implantação de infraestrutura, uso do solo e diversos outros aspectos do planejamento.",
            "Esse conceito é conhecido como gêmeo digital urbano: uma representação computacional do território que pode apoiar análise, simulação e tomada de decisões."
        ],

        facts: [
            ["3D", "modelo urbano"],
            ["Simulação", "de cenários"],
            ["Planejamento", "baseado em dados"],
            ["Digital Twin", "tecnologia-chave"]
        ],

        impact:
            "O planejamento deixa de depender somente de mapas bidimensionais e passa a utilizar modelos digitais capazes de representar diferentes cenários urbanos.",

        source:
            "Singapore Smart Nation"
    },


    "plano-30-por-30": {
        title: "Plano 30 by 30",
        tag: "Segurança alimentar",
        image:
            "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1800&q=85",

        intro:
            "O programa 30 by 30 busca aumentar a capacidade de Singapura de produzir alimentos localmente.",

        paragraphs: [
            "Singapura possui uma disponibilidade extremamente limitada de terras agrícolas. Por isso, durante muito tempo o país dependeu fortemente das importações para abastecer sua população.",
            "A estratégia 30 by 30 estabeleceu a meta de produzir localmente 30% das necessidades nutricionais do país até 2030.",
            "A proposta está relacionada ao uso de tecnologias agrícolas mais eficientes, incluindo cultivo em ambientes controlados, automação e produção vertical.",
            "O programa demonstra como segurança alimentar também pode ser considerada uma questão de planejamento urbano e resiliência nacional."
        ],

        facts: [
            ["30%", "meta nutricional"],
            ["2030", "ano-alvo"],
            ["Tecnologia", "produção eficiente"],
            ["Resiliência", "segurança alimentar"]
        ],

        impact:
            "A produção local reduz parte da vulnerabilidade provocada por interrupções nas cadeias internacionais de abastecimento.",

        source:
            "Singapore Food Agency / Government of Singapore"
    },


    "agricultura-vertical": {
        title: "Agricultura vertical",
        tag: "Agro tecnologia",
        image:
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1800&q=85",

        intro:
            "A agricultura vertical utiliza estruturas empilhadas para produzir alimentos em ambientes urbanos com pouca disponibilidade de terreno.",

        paragraphs: [
            "Em uma cidade extremamente compacta como Singapura, reservar grandes áreas horizontais para agricultura é difícil.",
            "A agricultura vertical resolve parte desse problema utilizando estruturas de vários níveis. Cultivos podem ser realizados em ambientes internos com controle de iluminação, temperatura, umidade e nutrientes.",
            "Algumas fazendas utilizam hidroponia ou outros sistemas que reduzem a necessidade de solo convencional.",
            "Apesar de oferecer vantagens, a agricultura indoor também exige energia, tecnologia e investimentos. Por isso, a eficiência do sistema depende do equilíbrio entre produtividade, consumo energético e custos."
        ],

        facts: [
            ["Vertical", "uso eficiente do espaço"],
            ["Indoor", "ambiente controlado"],
            ["Hydroponics", "produção sem solo"],
            ["30 by 30", "estratégia nacional"]
        ],

        impact:
            "A tecnologia permite transformar espaços urbanos limitados em áreas produtivas.",

        source:
            "Singapore Food Agency"
    },


    "supertrees": {
        title: "Supertrees",
        tag: "Infraestrutura verde",
        image:
            "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1800&q=85",

        intro:
            "Os Supertrees do Gardens by the Bay combinam paisagismo, arquitetura e tecnologias ambientais.",

        paragraphs: [
            "As estruturas gigantescas do Gardens by the Bay se tornaram um dos símbolos visuais mais conhecidos de Singapura.",
            "Existem 18 Supertrees, com alturas que variam aproximadamente de 25 a 50 metros.",
            "Algumas dessas estruturas possuem sistemas fotovoltaicos que ajudam a gerar energia. Também podem participar dos sistemas ambientais utilizados pelos jardins e conservatórios.",
            "Além da função tecnológica, os Supertrees mostram como infraestrutura pode ser transformada em elemento paisagístico e turístico."
        ],

        facts: [
            ["18", "Supertrees"],
            ["25–50 m", "altura aproximada"],
            ["Solar", "algumas estruturas"],
            ["Gardens by the Bay", "localização"]
        ],

        impact:
            "A integração entre engenharia, vegetação e arquitetura cria infraestrutura que também funciona como espaço público e símbolo urbano.",

        source:
            "Gardens by the Bay / Singapore Government"
    },


    "newater": {
        title: "NEWater",
        tag: "Gestão da água",
        image:
            "https://images.unsplash.com/photo-1504610926078-a1611febcad3?auto=format&fit=crop&w=1800&q=85",

        intro:
            "NEWater é o nome dado à água altamente purificada produzida a partir do tratamento avançado de água recuperada.",

        paragraphs: [
            "A escassez de recursos hídricos sempre foi um dos grandes desafios estratégicos de Singapura.",
            "Para aumentar sua segurança hídrica, o país desenvolveu sistemas avançados de tratamento e reutilização da água.",
            "O processo do NEWater utiliza diferentes etapas de tratamento, incluindo tecnologias de membranas e desinfecção ultravioleta.",
            "Grande parte dessa água é utilizada por setores industriais. Uma parcela também pode ser introduzida nos reservatórios para posterior tratamento dentro do sistema nacional de abastecimento."
        ],

        facts: [
            ["NEWater", "água recuperada"],
            ["Membranas", "filtragem avançada"],
            ["UV", "desinfecção"],
            ["Resiliência", "segurança hídrica"]
        ],

        impact:
            "A reutilização reduz a dependência de fontes externas e transforma águas residuais em parte estratégica do sistema hídrico.",

        source:
            "PUB Singapore — National Water Agency"
    },


    "transporte": {
        title: "Transporte inteligente",
        tag: "Mobilidade urbana",
        image:
            "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1800&q=85",

        intro:
            "O sistema de mobilidade de Singapura combina transporte público, planejamento urbano, gestão da demanda e tecnologias digitais.",

        paragraphs: [
            "O transporte público é formado principalmente pela rede ferroviária MRT e pelos ônibus, conectando diferentes regiões da cidade.",
            "O planejamento urbano procura aproximar moradia, trabalho, comércio e serviços, reduzindo a necessidade de deslocamentos excessivamente longos.",
            "Singapura também utiliza sistemas eletrônicos para administrar o tráfego e controlar a demanda pelo uso das vias.",
            "A mobilidade inteligente não significa apenas instalar sensores. Ela depende de planejamento territorial, transporte coletivo eficiente e políticas que incentivem o uso racional do espaço viário."
        ],

        facts: [
            ["MRT", "rede ferroviária"],
            ["Ônibus", "transporte público"],
            ["Dados", "gestão do tráfego"],
            ["Integração", "planejamento urbano"]
        ],

        impact:
            "A combinação de infraestrutura e gestão reduz a dependência absoluta do automóvel e aumenta a eficiência dos deslocamentos.",

        source:
            "Land Transport Authority — Singapore"
    },


    "governanca": {
        title: "Governança digital",
        tag: "Governo e tecnologia",
        image:
            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85",

        intro:
            "A governança digital é um dos pilares da estratégia Smart Nation de Singapura.",

        paragraphs: [
            "O governo utiliza plataformas digitais para oferecer serviços públicos, compartilhar informações e facilitar a interação entre cidadãos e Estado.",
            "A estratégia Smart Nation procura utilizar tecnologia e dados para melhorar a forma como serviços públicos são planejados e entregues.",
            "Dados urbanos também podem apoiar decisões relacionadas a transporte, saúde, planejamento territorial, infraestrutura e segurança.",
            "Ao mesmo tempo, uma cidade cada vez mais digital precisa lidar com questões como privacidade, segurança cibernética, inclusão digital e confiança da população."
        ],

        facts: [
            ["Smart Nation", "estratégia nacional"],
            ["Dados", "apoio às decisões"],
            ["Serviços", "digitais"],
            ["Cibersegurança", "prioridade"]
        ],

        impact:
            "A digitalização pode tornar serviços públicos mais acessíveis e eficientes, mas exige governança responsável dos dados.",

        source:
            "Smart Nation Singapore"
    },


    "chiclete": {
        title: "O caso do chiclete",
        tag: "Política urbana",
        image:
            "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1800&q=85",

        intro:
            "As regras de Singapura sobre chicletes são um exemplo conhecido de como políticas públicas podem interferir diretamente na manutenção dos espaços urbanos.",

        paragraphs: [
            "No início da década de 1990, Singapura introduziu restrições severas relacionadas à importação e venda de chicletes convencionais.",
            "A medida ficou internacionalmente conhecida como uma 'proibição do chiclete', embora a situação seja mais específica do que essa expressão sugere.",
            "Existem exceções relacionadas a determinados chicletes terapêuticos ou odontológicos, que podem ser disponibilizados sob regras específicas.",
            "O episódio é frequentemente utilizado para discutir a relação entre comportamento individual, limpeza urbana, custos de manutenção e políticas públicas."
        ],

        facts: [
            ["1992", "restrições introduzidas"],
            ["Importação", "fortemente controlada"],
            ["Exceções", "uso terapêutico"],
            ["Limpeza", "questão urbana"]
        ],

        impact:
            "O caso demonstra que uma cidade inteligente também envolve políticas comportamentais e mecanismos de manutenção do espaço público.",

        source:
            "Singapore Customs / Government of Singapore"
    }

};


/* =========================================================
   ALIASES
   Permitem que diferentes nomes usados no HTML
   encontrem o mesmo conteúdo.
   ========================================================= */

const singaporeAliases = {

    "mosaico": "mosaico-cultural",
    "cultura": "mosaico-cultural",
    "mosaico-cultural": "mosaico-cultural",

    "singlish": "singlish",

    "hawker": "hawker-centres",
    "hawker-centres": "hawker-centres",
    "hawker-centers": "hawker-centres",

    "economia": "economia-avancada",
    "economia-avancada": "economia-avancada",

    "porto": "porto-de-singapura",
    "porto-singapura": "porto-de-singapura",
    "porto-de-singapura": "porto-de-singapura",

    "virtual-singapore": "virtual-singapore",
    "virtual": "virtual-singapore",
    "digital-twin": "virtual-singapore",

    "30-by-30": "plano-30-por-30",
    "30by30": "plano-30-por-30",
    "plano-30-por-30": "plano-30-por-30",

    "agricultura": "agricultura-vertical",
    "agricultura-vertical": "agricultura-vertical",

    "supertrees": "supertrees",
    "supertree": "supertrees",

    "newater": "newater",
    "agua": "newater",

    "transporte": "transporte",
    "mobilidade": "transporte",

    "governanca": "governanca",
    "governança": "governanca",

    "chiclete": "chiclete"
};


/* =========================================================
   NORMALIZAÇÃO DOS TÓPICOS
   ========================================================= */

function normalizeSingaporeTopic(value) {

    if (!value) {
        return null;
    }

    const normalized = String(value)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/_/g, "-");

    if (singaporeTopics[normalized]) {
        return normalized;
    }

    if (singaporeAliases[normalized]) {
        return singaporeAliases[normalized];
    }

    return null;
}


/* =========================================================
   LOCALIZAÇÃO DOS ELEMENTOS DE DETALHE
   ========================================================= */

function getSingaporeDetailSection() {

    const selectors = [
        "#detalhes-singapura",
        "#singapore-details",
        "#singaporeDetail",
        ".singapore-detail",
        ".singapore-details",
        "[data-singapore-detail-container]"
    ];

    for (const selector of selectors) {

        const element = document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


function getSingaporeDetailTitle() {

    const section = getSingaporeDetailSection();

    if (!section) {
        return null;
    }

    const selectors = [
        "[data-detail-title]",
        "#singaporeDetailTitle",
        ".detail-header-content h1",
        ".detail-header h1",
        ".singapore-detail-title",
        "h1"
    ];

    for (const selector of selectors) {

        const element = section.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


function getSingaporeDetailTag() {

    const section = getSingaporeDetailSection();

    if (!section) {
        return null;
    }

    const selectors = [
        "[data-detail-tag]",
        "#singaporeDetailTag",
        ".detail-header-content .badge",
        ".detail-header-content .eyebrow",
        ".singapore-detail-tag"
    ];

    for (const selector of selectors) {

        const element = section.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


function getSingaporeDetailImage() {

    const section = getSingaporeDetailSection();

    if (!section) {
        return null;
    }

    const selectors = [
        "[data-detail-image]",
        "#singaporeDetailImage",
        ".detail-header-image",
        ".singapore-detail-image",
        ".detail-image"
    ];

    for (const selector of selectors) {

        const element = section.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


function getSingaporeDetailContent() {

    const section = getSingaporeDetailSection();

    if (!section) {
        return null;
    }

    const selectors = [
        "[data-detail-content]",
        "#singaporeDetailContent",
        ".detail-article",
        ".singapore-detail-content",
        ".detail-content"
    ];

    for (const selector of selectors) {

        const element = section.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


/* =========================================================
   CRIAÇÃO DO CONTEÚDO DOS DETALHES
   ========================================================= */

function buildSingaporeDetailHTML(topic) {

    if (!topic) {
        return "";
    }

    const factsHTML = topic.facts
        .map(fact => `
            <div class="detail-fact">
                <strong>${safeText(fact[0])}</strong>
                <span>${safeText(fact[1])}</span>
            </div>
        `)
        .join("");

    const paragraphsHTML = topic.paragraphs
        .map(paragraph => `
            <p>${safeText(paragraph)}</p>
        `)
        .join("");

    return `
        <div class="singapore-detail-introduction">
            <p class="detail-lead">
                ${safeText(topic.intro)}
            </p>
        </div>

        <div class="detail-facts-grid">
            ${factsHTML}
        </div>

        <div class="detail-text">
            ${paragraphsHTML}
        </div>

        <div class="detail-impact">
            <span class="detail-impact-label">
                IMPACTO URBANO
            </span>

            <p>
                ${safeText(topic.impact)}
            </p>
        </div>

        <div class="detail-source">
            <span>Fonte relacionada</span>
            <strong>${safeText(topic.source)}</strong>
        </div>
    `;
}


/* =========================================================
   RENDERIZAÇÃO DE UM DETALHE
   ========================================================= */

function renderSingaporeDetail(topicId, options = {}) {

    const normalizedId = normalizeSingaporeTopic(topicId);

    if (!normalizedId) {
        console.warn(
            "Tópico de Singapura não encontrado:",
            topicId
        );
        return false;
    }

    const topic = singaporeTopics[normalizedId];

    if (!topic) {
        return false;
    }

    const section = getSingaporeDetailSection();

    if (!section) {

        console.warn(
            "Seção de detalhes de Singapura não encontrada."
        );

        return false;
    }

    const title = getSingaporeDetailTitle();
    const tag = getSingaporeDetailTag();
    const image = getSingaporeDetailImage();
    const content = getSingaporeDetailContent();

    if (title) {
        title.textContent = topic.title;
    }

    if (tag) {
        tag.textContent = topic.tag;
    }

    if (image) {

        if (image.tagName === "IMG") {

            image.src = topic.image;
            image.alt = topic.title;

        } else {

            image.style.backgroundImage =
                `linear-gradient(
                    to bottom,
                    rgba(0,0,0,.05),
                    rgba(0,0,0,.65)
                ), url("${topic.image}")`;

            image.setAttribute(
                "aria-label",
                topic.title
            );
        }
    }

    if (content) {
        content.innerHTML =
            buildSingaporeDetailHTML(topic);
    }

    section.dataset.activeTopic = normalizedId;

    document.body.dataset.singaporeTopic =
        normalizedId;

    /*
     * Atualiza o hash sem recarregar a página.
     */
    try {

        const newHash =
            `#singapura-${normalizedId}`;

        history.replaceState(
            null,
            "",
            newHash
        );

    } catch (error) {

        console.warn(
            "Não foi possível atualizar o hash.",
            error
        );
    }

    /*
     * Marca o card correspondente como ativo.
     */
    $$(
        "[data-singapore], [data-singapore-topic]"
    ).forEach(card => {

        const cardTopic =
            normalizeSingaporeTopic(
                card.dataset.singapore ||
                card.dataset.singaporeTopic
            );

        card.classList.toggle(
            "is-active",
            cardTopic === normalizedId
        );
    });

    /*
     * Animação de entrada.
     */
    section.classList.remove(
        "detail-enter"
    );

    void section.offsetWidth;

    section.classList.add(
        "detail-enter"
    );

    /*
     * Exibe a seção.
     */
    section.hidden = false;

    section.classList.add(
        "is-visible"
    );

    /*
     * Se o usuário clicou em um card,
     * leva suavemente para o detalhe.
     */
    if (options.scroll !== false) {

        setTimeout(() => {

            scrollToElement(
                section,
                88
            );

        }, 60);
    }

    /*
     * Evento personalizado.
     */
    document.dispatchEvent(
        new CustomEvent(
            "singaporedetailchange",
            {
                detail: {
                    id: normalizedId,
                    topic
                }
            }
        )
    );

    return true;
}


/* =========================================================
   ABRIR DETALHE A PARTIR DE UM CARD
   ========================================================= */

function openSingaporeDetail(topicId) {

    const normalizedId = normalizeSingaporeTopic(topicId);

    if (!normalizedId) return;

    const topic = singaporeTopics[normalizedId];
    if (!topic) return;

    // Remove modal anterior, caso exista.
    const oldModal = document.getElementById("singaporeContentModal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.id = "singaporeContentModal";
    modal.className = "singapore-content-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", topic.title);

    const facts = Array.isArray(topic.facts)
        ? topic.facts.map(fact => `
            <div class="modal-fact">
                <strong>${safeText(fact[0])}</strong>
                <span>${safeText(fact[1])}</span>
            </div>
        `).join("")
        : "";

    const paragraphs = Array.isArray(topic.paragraphs)
        ? topic.paragraphs.map(paragraph =>
            `<p>${safeText(paragraph)}</p>`
          ).join("")
        : `<p>${safeText(topic.intro || "")}</p>`;

    modal.innerHTML = `
        <div class="singapore-modal-backdrop" data-close-singapore-modal></div>
        <article class="singapore-modal-card">
            <button class="singapore-modal-close" type="button" aria-label="Fechar conteúdo" data-close-singapore-modal>×</button>

            <div class="singapore-modal-image">
                <img src="${safeText(topic.image)}" alt="${safeText(topic.title)}">
                <span class="singapore-modal-tag">${safeText(topic.tag)}</span>
            </div>

            <div class="singapore-modal-body">
                <span class="eyebrow">EXPLORE SINGAPURA</span>
                <h2>${safeText(topic.title)}</h2>
                <p class="singapore-modal-intro">${safeText(topic.intro || "")}</p>

                ${facts ? `<div class="singapore-modal-facts">${facts}</div>` : ""}

                <div class="singapore-modal-text">
                    ${paragraphs}
                </div>

                ${topic.impact ? `
                    <div class="singapore-modal-impact">
                        <span>IMPACTO URBANO</span>
                        <p>${safeText(topic.impact)}</p>
                    </div>
                ` : ""}

                ${topic.source ? `
                    <div class="singapore-modal-source">
                        <span>Fonte relacionada</span>
                        <strong>${safeText(topic.source)}</strong>
                    </div>
                ` : ""}
            </div>
        </article>
    `;

    document.body.appendChild(modal);
    document.body.classList.add("modal-open");

    requestAnimationFrame(() => {
        modal.classList.add("is-visible");
    });

    const close = () => {
        modal.classList.remove("is-visible");
        document.body.classList.remove("modal-open");
        setTimeout(() => modal.remove(), 220);

        /*
         * Remove o hash da URL para que recarregar a página
         * ou reabrir o link não reabra este modal sozinho.
         */
        try {
            history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
            );
        } catch (_) {}
    };

    modal.querySelectorAll("[data-close-singapore-modal]").forEach(button => {
        button.addEventListener("click", close);
    });

    modal.addEventListener("click", event => {
        if (event.target === modal) close();
    });

    document.addEventListener("keydown", function esc(event) {
        if (event.key === "Escape") {
            close();
            document.removeEventListener("keydown", esc);
        }
    });

    // Mantém o endereço navegável sem depender de uma seção inexistente.
    try {
        history.replaceState(null, "", `#singapura-${normalizedId}`);
    } catch (_) {}

    $$('[data-singapore], [data-singapore-topic]').forEach(card => {
        const cardTopic = normalizeSingaporeTopic(
            card.dataset.singapore || card.dataset.singaporeTopic
        );
        card.classList.toggle("is-active", cardTopic === normalizedId);
    });
}


/* =========================================================
   DESCOBERTA AUTOMÁTICA DO TÓPICO DO CARD
   ========================================================= */

function getTopicFromSingaporeCard(card) {

    if (!card) {
        return null;
    }

    const values = [
        card.dataset.singapore,
        card.dataset.singaporeTopic,
        card.dataset.topic,
        card.dataset.detail,
        card.dataset.detailTopic,
        card.dataset.detailTarget,
        card.getAttribute("data-id")
    ];

    for (const value of values) {

        const topic =
            normalizeSingaporeTopic(value);

        if (topic) {
            return topic;
        }
    }

    /*
     * Alguns cards podem possuir um link interno
     * com o ID do detalhe.
     */
    const link =
        card.querySelector(
            "a[href*='singapura'], a[href*='detalhes']"
        );

    if (link) {

        const href =
            link.getAttribute("href") || "";

        const clean =
            href
                .replace("#", "")
                .replace(
                    "singapura-",
                    ""
                )
                .replace(
                    "detalhes-",
                    ""
                );

        const topic =
            normalizeSingaporeTopic(clean);

        if (topic) {
            return topic;
        }
    }

    /*
     * Última tentativa:
     * utiliza o texto do título do card.
     */
    const heading =
        card.querySelector(
            "h2, h3, h4, .card-title, .singapore-card-title"
        );

    if (heading) {

        const text =
            normalizeText(
                heading.textContent
            );

        for (const [alias, topicId]
            of Object.entries(singaporeAliases)) {

            const normalizedAlias =
                normalizeText(alias)
                    .replace(/\s+/g, "-");

            if (
                text.includes(
                    normalizedAlias.replace(
                        /-/g,
                        " "
                    )
                )
            ) {

                return topicId;
            }
        }
    }

    return null;
}



/* =========================================================
   FILTROS DA ABA "EXPLORE SINGAPURA"
   ========================================================= */
function initializeSingaporeFilters() {
    const buttons = $$(".filter-button");
    const cards = $$(".information-grid .info-card");

    if (!buttons.length || !cards.length) return;

    buttons.forEach(button => {
        if (button.dataset.filterInitialized === "true") return;

        button.dataset.filterInitialized = "true";

        button.addEventListener("click", () => {
            const filter = normalizeText(
                button.dataset.filter || "todos"
            );

            buttons.forEach(item => {
                item.classList.toggle(
                    "active",
                    item === button
                );
                item.setAttribute(
                    "aria-pressed",
                    item === button ? "true" : "false"
                );
            });

            cards.forEach(card => {
                const category = normalizeText(
                    card.dataset.category || ""
                );

                const matches =
                    filter === "todos" ||
                    category
                        .split(/\s+/)
                        .includes(filter);

                card.classList.toggle(
                    "filter-priority",
                    filter !== "todos" && matches
                );

                card.classList.toggle(
                    "filter-muted",
                    filter !== "todos" && !matches
                );

                card.setAttribute(
                    "aria-hidden",
                    filter !== "todos" && !matches
                        ? "true"
                        : "false"
                );
            });

            const firstPriority =
                cards.find(card =>
                    card.classList.contains("filter-priority")
                );

            if (firstPriority && filter !== "todos") {
                firstPriority.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            }
        });
    });
}


/* =========================================================
   EVENTOS DOS CARDS DE SINGAPURA
   ========================================================= */

function initializeSingaporeCards() {

    const cards =
        $$(
            "[data-singapore], " +
            "[data-singapore-topic], " +
            ".singapore-card, " +
            ".singapore-topic-card, " +
            ".info-card[data-detail], " +
            "[data-detail]"
        );

    if (!cards.length) {
        return;
    }

    cards.forEach(card => {

        const topic =
            getTopicFromSingaporeCard(card);

        if (!topic) {
            return;
        }

        card.dataset.singaporeResolved =
            topic;

        /*
         * Acessibilidade.
         */
        if (
            card.tagName !== "BUTTON" &&
            card.tagName !== "A"
        ) {

            card.setAttribute(
                "role",
                "button"
            );

            card.setAttribute(
                "tabindex",
                "0"
            );
        }

        card.setAttribute(
            "aria-label",
            `Ver detalhes sobre ${singaporeTopics[topic].title}`
        );

        /*
         * Evita registrar vários listeners
         * caso a função seja chamada novamente.
         */
        if (
            card.dataset.singaporeInitialized ===
            "true"
        ) {
            return;
        }

        card.dataset.singaporeInitialized =
            "true";

        card.addEventListener(
            "click",
            event => {

                /*
                 * Se o clique ocorreu em um link
                 * externo, não interfere.
                 */
                const clickedLink =
                    event.target.closest("a");

                if (
                    clickedLink &&
                    clickedLink.getAttribute("href") &&
                    !clickedLink
                        .getAttribute("href")
                        .startsWith("#")
                ) {
                    return;
                }

                event.preventDefault();

                openSingaporeDetail(topic);
            }
        );

        card.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openSingaporeDetail(
                        topic
                    );
                }
            }
        );
    });
}


/* =========================================================
   BOTÃO "VOLTAR PARA SINGAPURA"
   ========================================================= */

function initializeSingaporeBackButtons() {

    const buttons =
        $$(
            "[data-back-singapore], " +
            ".detail-back, " +
            ".singapore-detail-back"
        );

    buttons.forEach(button => {

        if (
            button.dataset.backInitialized ===
            "true"
        ) {
            return;
        }

        button.dataset.backInitialized =
            "true";

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const detail =
                    getSingaporeDetailSection();

                if (detail) {

                    detail.classList.remove(
                        "is-visible"
                    );
                }

                if (
                    typeof window.openTab ===
                    "function"
                ) {

                    window.openTab(
                        "singapura",
                        {
                            scroll: true
                        }
                    );
                }
            }
        );
    });
}


/* =========================================================
   BOTÕES "EXPLORAR" DOS CARDS
   ========================================================= */

function initializeSingaporeExploreButtons() {

    const buttons =
        $$(
            "[data-explore-singapore], " +
            "[data-singapore-open]"
        );

    buttons.forEach(button => {

        if (
            button.dataset.exploreInitialized ===
            "true"
        ) {
            return;
        }

        button.dataset.exploreInitialized =
            "true";

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                const topic =
                    button.dataset.exploreSingapore ||
                    button.dataset.singaporeOpen ||
                    button.dataset.topic;

                openSingaporeDetail(
                    topic
                );
            }
        );
    });
}


/* =========================================================
   IMAGENS DOS CARDS
   ========================================================= */

function initializeSingaporeCardImages() {

    const cards =
        $$(
            "[data-singapore], " +
            "[data-singapore-topic], " +
            ".singapore-card, " +
            ".singapore-topic-card, " +
            ".info-card[data-detail], " +
            "[data-detail]"
        );

    cards.forEach(card => {

        const topic =
            getTopicFromSingaporeCard(card);

        if (!topic) {
            return;
        }

        const data =
            singaporeTopics[topic];

        if (!data || !data.image) {
            return;
        }

        /*
         * Primeiro tenta encontrar uma imagem real.
         */
        const image =
            card.querySelector(
                "img"
            );

        if (image) {

            /*
             * Só substitui se a imagem
             * estiver vazia ou quebrada.
             */
            if (
                !image.getAttribute("src") ||
                image.getAttribute("src") === "#"
            ) {

                image.src =
                    data.image;
            }

            if (
                !image.getAttribute("alt")
            ) {

                image.alt =
                    data.title;
            }

            return;
        }

        /*
         * Caso o card utilize uma div
         * como área visual.
         */
        const visual =
            card.querySelector(
                ".card-image, " +
                ".singapore-card-image, " +
                ".card-visual, " +
                ".image"
            );

        if (visual) {

            const current =
                visual.style.backgroundImage;

            if (
                !current ||
                current === "none"
            ) {

                visual.style.backgroundImage =
                    `linear-gradient(
                        to bottom,
                        rgba(0,0,0,.02),
                        rgba(0,0,0,.6)
                    ), url("${data.image}")`;
            }
        }
    });
}


/* =========================================================
   DETALHE VIA HASH
   ========================================================= */

function handleSingaporeHash() {

    const hash =
        window.location.hash;

    if (!hash) {
        return;
    }

    if (
        !hash.startsWith(
            "#singapura-"
        )
    ) {
        return;
    }

    const topic =
        hash
            .replace(
                "#singapura-",
                ""
            );

    const normalized =
        normalizeSingaporeTopic(
            topic
        );

    if (!normalized) {
        return;
    }

    setTimeout(() => {

        openSingaporeDetail(
            normalized
        );

    }, 150);
}


/* =========================================================
   EVENTO DO HASH
   ========================================================= */

window.addEventListener(
    "hashchange",
    handleSingaporeHash
);


/* =========================================================
   API PÚBLICA DE SINGAPURA
   ========================================================= */

window.Singapore = {

    topics: singaporeTopics,

    aliases: singaporeAliases,

    open: openSingaporeDetail,

    render: renderSingaporeDetail,

    normalize: normalizeSingaporeTopic,

    getTopic: topicId => {

        const id =
            normalizeSingaporeTopic(
                topicId
            );

        return id
            ? singaporeTopics[id]
            : null;
    }
};


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function initializeSingaporeModule() {

    initializeSingaporeCards();
    initializeSingaporeFilters();

    initializeSingaporeBackButtons();

    initializeSingaporeExploreButtons();

    initializeSingaporeCardImages();

    handleSingaporeHash();
}


/*
 * Inicializa imediatamente caso o documento
 * já esteja carregado.
 */
if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSingaporeModule,
        {
            once: true
        }
    );

} else {

    initializeSingaporeModule();
}


/* =========================================================
   EVENTO PARA REINICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "smartcity:content-updated",
    () => {

        initializeSingaporeCards();
        initializeSingaporeFilters();

        initializeSingaporeBackButtons();

        initializeSingaporeExploreButtons();

        initializeSingaporeCardImages();
    }
);


/* =========================================================
   EFEITO VISUAL DOS CARDS
   ========================================================= */

function initializeSingaporeCardHover() {

    const cards =
        $$(
            ".singapore-card, " +
            ".singapore-topic-card"
        );

    cards.forEach(card => {

        if (
            card.dataset.hoverInitialized ===
            "true"
        ) {
            return;
        }

        card.dataset.hoverInitialized =
            "true";

        card.addEventListener(
            "mouseenter",
            () => {

                card.classList.add(
                    "is-hovered"
                );
            }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                card.classList.remove(
                    "is-hovered"
                );
            }
        );
    });
}

initializeSingaporeCardHover();


/* =========================================================
   PRELOAD DAS IMAGENS PRINCIPAIS
   ========================================================= */

function preloadSingaporeImages() {

    Object.values(
        singaporeTopics
    ).forEach(topic => {

        if (!topic.image) {
            return;
        }

        const image =
            new Image();

        image.src =
            topic.image;
    });
}

preloadSingaporeImages();


/* =========================================================
   CONTADOR DOS TÓPICOS DISPONÍVEIS
   ========================================================= */

function updateSingaporeTopicCount() {

    const counters =
        $$(
            "[data-singapore-topic-count]"
        );

    const total =
        Object.keys(
            singaporeTopics
        ).length;

    counters.forEach(counter => {

        counter.textContent =
            total;
    });
}

updateSingaporeTopicCount();


/* =========================================================
   ACESSIBILIDADE DO DETALHE
   ========================================================= */

function improveSingaporeDetailAccessibility() {

    const section =
        getSingaporeDetailSection();

    if (!section) {
        return;
    }

    if (
        !section.hasAttribute(
            "aria-live"
        )
    ) {

        section.setAttribute(
            "aria-live",
            "polite"
        );
    }

    if (
        !section.hasAttribute(
            "tabindex"
        )
    ) {

        section.setAttribute(
            "tabindex",
            "-1"
        );
    }
}

improveSingaporeDetailAccessibility();


/* =========================================================
   FINAL DA PARTE 2
   ========================================================= */

/* =========================================================
   SCRIPT.JS — PARTE 3/5
   TECNOLOGIAS
   ========================================================= */


/* =========================================================
   BANCO DE DADOS DAS TECNOLOGIAS
   ========================================================= */

const technologyData = {

    mobilidade: {
        title: "Mobilidade inteligente",
        category: "Mobilidade",

        image:
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85",

        description:
            "Utilização de dados, sensores, transporte público e sistemas digitais para tornar os deslocamentos urbanos mais eficientes, seguros e sustentáveis.",

        paragraphs: [
            "A mobilidade inteligente procura compreender como pessoas e veículos se deslocam pela cidade e utilizar essas informações para melhorar o sistema de transporte.",
            "Sensores, câmeras, GPS, aplicativos e sistemas de controle podem fornecer informações sobre trânsito, demanda e condições das vias.",
            "O objetivo não é simplesmente aumentar a velocidade dos automóveis. Uma política de mobilidade inteligente também prioriza transporte coletivo, caminhada, bicicleta, acessibilidade e integração entre diferentes modos.",
            "Em Singapura, planejamento urbano e transporte são tratados de maneira integrada, mostrando que tecnologia funciona melhor quando está associada a políticas públicas."
        ],

        examples: [
            "MRT e ônibus integrados",
            "Sistemas de gestão de tráfego",
            "Informações em tempo real",
            "Semáforos inteligentes",
            "Aplicativos de mobilidade"
        ],

        benefits: [
            "Menos congestionamentos",
            "Maior previsibilidade das viagens",
            "Melhor uso da infraestrutura",
            "Redução de emissões"
        ]
    },


    iot: {
        title: "IoT e sensores",
        category: "Internet das Coisas",

        image:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85",

        description:
            "A Internet das Coisas conecta objetos físicos à internet para coletar, transmitir e utilizar dados.",

        paragraphs: [
            "Em uma cidade inteligente, sensores podem ser instalados em ruas, edifícios, sistemas de água, iluminação e equipamentos públicos.",
            "Esses dispositivos conseguem registrar informações continuamente, permitindo que gestores tenham uma visão mais detalhada do funcionamento da cidade.",
            "Um sensor pode, por exemplo, detectar nível de água, temperatura, qualidade do ar, ocupação de uma vaga ou funcionamento de um equipamento.",
            "Os dados coletados precisam ser tratados e analisados. Um sensor isolado não torna uma cidade inteligente: o valor está na capacidade de transformar dados em decisões e ações."
        ],

        examples: [
            "Sensores ambientais",
            "Iluminação conectada",
            "Monitoramento de água",
            "Estacionamento inteligente",
            "Sensores de ocupação"
        ],

        benefits: [
            "Monitoramento contínuo",
            "Detecção rápida de problemas",
            "Manutenção preventiva",
            "Dados urbanos em tempo real"
        ]
    },


    ia: {
        title: "IA e dados urbanos",
        category: "Inteligência Artificial",

        image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=85",

        description:
            "Inteligência Artificial e análise de dados podem ajudar governos e organizações a identificar padrões e apoiar decisões urbanas.",

        paragraphs: [
            "Cidades produzem enormes quantidades de dados diariamente. Informações de transporte, energia, água, clima e serviços públicos podem revelar padrões importantes.",
            "Algoritmos de Inteligência Artificial podem ajudar a identificar esses padrões e produzir previsões ou classificações.",
            "Um exemplo seria analisar históricos de trânsito para prever regiões com maior probabilidade de congestionamento.",
            "Entretanto, sistemas de IA precisam de dados de qualidade, transparência, segurança e supervisão humana. Uma decisão automatizada pode reproduzir problemas existentes nos dados utilizados para treiná-la."
        ],

        examples: [
            "Previsão de congestionamentos",
            "Análise de consumo energético",
            "Detecção de anomalias",
            "Previsão de demanda",
            "Análise de imagens"
        ],

        benefits: [
            "Decisões mais informadas",
            "Identificação de padrões",
            "Automação de tarefas",
            "Uso estratégico dos dados"
        ]
    },


    smartgrid: {
        title: "Smart Grid",
        category: "Energia",

        image:
            "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=85",

        description:
            "Smart Grid é uma rede elétrica que utiliza comunicação e dados para monitorar e gerenciar melhor a produção, distribuição e consumo de energia.",

        paragraphs: [
            "A rede elétrica tradicional possui fluxos relativamente previsíveis. Com a expansão das fontes renováveis e de novos consumidores, como veículos elétricos, a gestão se torna mais complexa.",
            "Uma Smart Grid utiliza sensores, medidores inteligentes e sistemas de comunicação para obter informações sobre a rede.",
            "Essas informações podem ajudar a identificar falhas, equilibrar oferta e demanda e melhorar a eficiência.",
            "A tecnologia também pode facilitar a integração de geração distribuída, armazenamento de energia e fontes renováveis."
        ],

        examples: [
            "Medidores inteligentes",
            "Monitoramento da rede",
            "Integração solar",
            "Armazenamento de energia",
            "Gestão da demanda"
        ],

        benefits: [
            "Maior eficiência",
            "Detecção de falhas",
            "Integração de renováveis",
            "Melhor gerenciamento energético"
        ]
    },


    agua: {
        title: "Água inteligente",
        category: "Recursos hídricos",

        image:
            "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1600&q=85",

        description:
            "Tecnologias digitais podem monitorar redes de abastecimento, detectar perdas e melhorar o gerenciamento dos recursos hídricos.",

        paragraphs: [
            "A água é um dos recursos mais importantes para o funcionamento das cidades e, em muitas regiões, um dos mais vulneráveis.",
            "Sensores podem monitorar pressão, vazão, qualidade da água e outros parâmetros ao longo da rede.",
            "A análise desses dados pode ajudar a localizar vazamentos e identificar alterações anormais no sistema.",
            "Singapura é um caso especialmente relevante porque desenvolveu uma estratégia integrada de segurança hídrica que inclui captação, reutilização, dessalinização e gestão da demanda."
        ],

        examples: [
            "Detecção de vazamentos",
            "Monitoramento de qualidade",
            "Medição inteligente",
            "Reutilização de água",
            "Gestão de reservatórios"
        ],

        benefits: [
            "Redução de perdas",
            "Maior segurança hídrica",
            "Monitoramento contínuo",
            "Uso mais eficiente"
        ]
    },


    residuos: {
        title: "Gestão inteligente de resíduos",
        category: "Resíduos",

        image:
            "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1600&q=85",

        description:
            "Tecnologias digitais podem melhorar a coleta, separação, monitoramento e destinação dos resíduos urbanos.",

        paragraphs: [
            "A produção de resíduos é diretamente relacionada ao tamanho da população, aos hábitos de consumo e à atividade econômica.",
            "Sensores podem indicar o nível de preenchimento de contêineres, permitindo otimizar rotas de coleta.",
            "Sistemas digitais também podem acompanhar veículos, analisar volumes coletados e identificar pontos com maior geração de resíduos.",
            "A tecnologia, entretanto, deve estar associada à redução, reutilização, reciclagem e educação ambiental."
        ],

        examples: [
            "Lixeiras com sensores",
            "Rotas de coleta otimizadas",
            "Rastreamento de veículos",
            "Centrais de triagem",
            "Monitoramento de reciclagem"
        ],

        benefits: [
            "Coleta mais eficiente",
            "Menor desperdício de combustível",
            "Melhor planejamento",
            "Redução de custos operacionais"
        ]
    },


    conectividade: {
        title: "5G e conectividade",
        category: "Conectividade",

        image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=85",

        description:
            "Redes de comunicação de alta capacidade fornecem infraestrutura para conectar pessoas, sensores, veículos e serviços.",

        paragraphs: [
            "Uma cidade inteligente depende de comunicação confiável para transmitir informações entre dispositivos e sistemas.",
            "O 5G pode oferecer maior capacidade e menor latência em determinadas aplicações, embora a necessidade real dependa do caso de uso.",
            "Conectividade urbana também envolve fibra óptica, Wi-Fi público, redes móveis e infraestrutura de data centers.",
            "Uma estratégia de cidade inteligente deve considerar inclusão digital. Uma infraestrutura tecnologicamente avançada não é suficiente se parte da população não consegue acessá-la."
        ],

        examples: [
            "Redes 5G",
            "Fibra óptica",
            "IoT conectada",
            "Wi-Fi público",
            "Comunicação veículo-infraestrutura"
        ],

        benefits: [
            "Maior conectividade",
            "Comunicação rápida",
            "Suporte à IoT",
            "Novos serviços digitais"
        ]
    },


    digitaltwin: {
        title: "Digital Twin",
        category: "Gêmeo digital",

        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",

        description:
            "Um Digital Twin urbano é uma representação digital de elementos físicos da cidade que pode ser utilizada para análise e simulação.",

        paragraphs: [
            "O conceito de gêmeo digital vai além de simplesmente criar um modelo 3D bonito. O objetivo é conectar a representação digital a informações sobre o sistema físico.",
            "Em um ambiente urbano, isso pode significar associar edifícios, ruas, redes de infraestrutura e outros elementos a dados.",
            "Modelos desse tipo podem ajudar a avaliar cenários antes da implementação de determinadas intervenções.",
            "Virtual Singapore é um dos exemplos mais conhecidos de aplicação de modelos digitais tridimensionais para apoiar o planejamento urbano."
        ],

        examples: [
            "Modelagem 3D",
            "Simulação urbana",
            "Planejamento territorial",
            "Análise de infraestrutura",
            "Visualização de cenários"
        ],

        benefits: [
            "Testes antes da obra",
            "Melhor visualização",
            "Análise de cenários",
            "Apoio ao planejamento"
        ]
    },


    governo: {
        title: "Governo digital",
        category: "Governança",

        image:
            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=85",

        description:
            "O governo digital utiliza tecnologias para melhorar serviços públicos, processos administrativos, participação e tomada de decisão.",

        paragraphs: [
            "A transformação digital do governo não significa simplesmente colocar formulários na internet.",
            "O objetivo é redesenhar processos para torná-los mais acessíveis, eficientes e integrados.",
            "Dados podem apoiar políticas públicas e ajudar gestores a compreender problemas urbanos com maior precisão.",
            "Ao mesmo tempo, governo digital exige proteção de dados, segurança cibernética, acessibilidade e mecanismos de inclusão."
        ],

        examples: [
            "Serviços públicos digitais",
            "Identidade digital",
            "Portais integrados",
            "Dados abertos",
            "Participação digital"
        ],

        benefits: [
            "Maior acessibilidade",
            "Redução de burocracia",
            "Serviços mais rápidos",
            "Melhor gestão pública"
        ]
    }

};


/* =========================================================
   ALIASES DAS TECNOLOGIAS
   ========================================================= */

const technologyAliases = {

    "mobilidade": "mobilidade",
    "transporte": "mobilidade",

    "iot": "iot",
    "sensores": "iot",
    "iot-e-sensores": "iot",

    "ia": "ia",
    "dados": "ia",
    "ia-e-dados": "ia",

    "smart-grid": "smartgrid",
    "smartgrid": "smartgrid",
    "energia": "smartgrid",

    "agua": "agua",
    "água": "agua",

    "residuos": "residuos",
    "resíduos": "residuos",

    "5g": "conectividade",
    "conectividade": "conectividade",

    "digital-twin": "digitaltwin",
    "digitaltwin": "digitaltwin",
    "gêmeo-digital": "digitaltwin",

    "governo": "governo",
    "governo-digital": "governo"
};


/* =========================================================
   NORMALIZAÇÃO
   ========================================================= */

function normalizeTechnology(value) {

    if (!value) {
        return null;
    }

    const normalized =
        String(value)
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-")
            .replace(/_/g, "-");

    if (technologyData[normalized]) {
        return normalized;
    }

    return technologyAliases[normalized] || null;
}


/* =========================================================
   CONSTRÓI O PAINEL DA TECNOLOGIA
   ========================================================= */

function buildTechnologyPanelHTML(data) {

    if (!data) {
        return "";
    }

    const examples =
        data.examples
            .map(item => `
                <li>
                    <span class="technology-check">✓</span>
                    ${safeText(item)}
                </li>
            `)
            .join("");

    const benefits =
        data.benefits
            .map(item => `
                <li>
                    <span class="technology-check">+</span>
                    ${safeText(item)}
                </li>
            `)
            .join("");

    const paragraphs =
        data.paragraphs
            .map(paragraph => `
                <p>${safeText(paragraph)}</p>
            `)
            .join("");

    return `
        <div class="technology-panel-inner">

            <div class="technology-panel-image">
                <img
                    src="${data.image}"
                    alt="${safeText(data.title)}"
                    loading="lazy"
                >
            </div>

            <div class="technology-panel-content">

                <span class="technology-panel-category">
                    ${safeText(data.category)}
                </span>

                <h3>
                    ${safeText(data.title)}
                </h3>

                <p class="technology-panel-lead">
                    ${safeText(data.description)}
                </p>

                <div class="technology-panel-text">
                    ${paragraphs}
                </div>

                <div class="technology-columns">

                    <div class="technology-list-block">
                        <h4>Aplicações</h4>

                        <ul>
                            ${examples}
                        </ul>
                    </div>

                    <div class="technology-list-block">
                        <h4>Benefícios</h4>

                        <ul>
                            ${benefits}
                        </ul>
                    </div>

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   ENCONTRA O PAINEL ATUAL
   ========================================================= */

function findTechnologyPanel() {

    const selectors = [
        "[data-technology-panel]",
        "[data-panel-content]",
        ".technology-panel-content-area",
        "#technologyPanelContent",
        ".technology-display",
        ".technology-panels"
    ];

    for (const selector of selectors) {

        const element =
            document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


/* =========================================================
   RENDERIZA TECNOLOGIA
   ========================================================= */

function renderTechnology(
    technologyId,
    options = {}
) {

    const id =
        normalizeTechnology(
            technologyId
        );

    if (!id) {
        console.warn(
            "Tecnologia não encontrada:",
            technologyId
        );
        return false;
    }

    const data =
        technologyData[id];

    /*
     * Primeiro tenta utilizar painéis existentes
     * no HTML.
     */
    const existingPanels =
        $$(
            "[data-panel], " +
            "[data-technology-panel], " +
            ".technology-panel"
        );

    let matchedPanel = null;

    existingPanels.forEach(panel => {

        const panelId =
            normalizeTechnology(
                panel.dataset.panel ||
                panel.dataset.technologyPanel ||
                panel.dataset.techPanel
            );

        if (
            panelId === id
        ) {
            matchedPanel = panel;
        }
    });

    /*
     * Se existir painel correspondente,
     * ativa somente ele.
     */
    if (matchedPanel) {

        existingPanels.forEach(panel => {

            panel.classList.toggle(
                "active",
                panel === matchedPanel
            );

            panel.classList.toggle(
                "is-active",
                panel === matchedPanel
            );

            panel.hidden =
                panel !== matchedPanel;
        });

        /*
         * Se o painel estiver vazio,
         * cria o conteúdo.
         */
        if (
            !matchedPanel.innerHTML.trim() ||
            matchedPanel.dataset.dynamic ===
            "true"
        ) {

            matchedPanel.innerHTML =
                buildTechnologyPanelHTML(
                    data
                );

            matchedPanel.dataset.dynamic =
                "true";
        }
    }

    /*
     * Caso exista uma área única de renderização.
     */
    const panelContainer =
        findTechnologyPanel();

    if (
        panelContainer &&
        !matchedPanel
    ) {

        panelContainer.innerHTML =
            buildTechnologyPanelHTML(
                data
            );
    }

    /*
     * Atualiza as abas.
     */
    $$(
        "[data-technology], " +
        "[data-tech], " +
        ".technology-tab"
    ).forEach(tab => {

        const tabId =
            normalizeTechnology(
                tab.dataset.technology ||
                tab.dataset.tech ||
                tab.dataset.topic
            );

        const active =
            tabId === id;

        tab.classList.toggle(
            "active",
            active
        );

        tab.classList.toggle(
            "is-active",
            active
        );

        tab.setAttribute(
            "aria-selected",
            active ? "true" : "false"
        );

        if (
            tab.hasAttribute("tabindex")
        ) {

            tab.tabIndex =
                active ? 0 : -1;
        }
    });

    /*
     * Marca o sistema inteiro.
     */
    const technologyArea =
        document.querySelector(
            "#tecnologias, " +
            ".technologies-section, " +
            "[data-technologies]"
        );

    if (technologyArea) {

        technologyArea.dataset.activeTechnology =
            id;
    }

    /*
     * Evento personalizado.
     */
    document.dispatchEvent(
        new CustomEvent(
            "technologychange",
            {
                detail: {
                    id,
                    data
                }
            }
        )
    );

    if (options.scroll) {

        const target =
            matchedPanel ||
            panelContainer;

        if (target) {

            setTimeout(() => {

                scrollToElement(
                    target,
                    100
                );

            }, 50);
        }
    }

    return true;
}


/* =========================================================
   INICIALIZAÇÃO DAS ABAS DE TECNOLOGIA
   ========================================================= */

function initializeTechnologyTabs() {

    const tabs =
        $$(
            "[data-technology], " +
            "[data-tech], " +
            ".technology-tab"
        );

    if (!tabs.length) {
        return;
    }

    tabs.forEach(tab => {

        const id =
            normalizeTechnology(
                tab.dataset.technology ||
                tab.dataset.tech ||
                tab.dataset.topic
            );

        if (!id) {
            return;
        }

        tab.dataset.resolvedTechnology =
            id;

        /*
         * Acessibilidade.
         */
        tab.setAttribute(
            "role",
            "tab"
        );

        if (
            !tab.hasAttribute(
                "aria-selected"
            )
        ) {

            tab.setAttribute(
                "aria-selected",
                "false"
            );
        }

        if (
            tab.dataset.technologyInitialized ===
            "true"
        ) {
            return;
        }

        tab.dataset.technologyInitialized =
            "true";

        tab.addEventListener(
            "click",
            event => {

                event.preventDefault();

                renderTechnology(
                    id,
                    {
                        scroll: false
                    }
                );
            }
        );

        tab.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    renderTechnology(
                        id,
                        {
                            scroll: false
                        }
                    );
                }

                /*
                 * Navegação horizontal
                 * usando as setas.
                 */
                if (
                    event.key === "ArrowRight" ||
                    event.key === "ArrowDown"
                ) {

                    event.preventDefault();

                    const currentIndex =
                        tabs.indexOf(tab);

                    const nextIndex =
                        (
                            currentIndex + 1
                        ) % tabs.length;

                    tabs[nextIndex].focus();
                }

                if (
                    event.key === "ArrowLeft" ||
                    event.key === "ArrowUp"
                ) {

                    event.preventDefault();

                    const currentIndex =
                        tabs.indexOf(tab);

                    const previousIndex =
                        (
                            currentIndex - 1 +
                            tabs.length
                        ) % tabs.length;

                    tabs[previousIndex].focus();
                }
            }
        );
    });

    /*
     * Seleciona a primeira tecnologia
     * inicialmente.
     */
    const active =
        tabs.find(tab =>
            tab.classList.contains("active") ||
            tab.classList.contains("is-active")
        );

    const first =
        active || tabs[0];

    if (first) {

        const id =
            normalizeTechnology(
                first.dataset.technology ||
                first.dataset.tech ||
                first.dataset.topic
            );

        if (id) {

            renderTechnology(
                id,
                {
                    scroll: false
                }
            );
        }
    }
}


/* =========================================================
   API DAS TECNOLOGIAS
   ========================================================= */

window.Technologies = {

    data: technologyData,

    aliases: technologyAliases,

    normalize: normalizeTechnology,

    open: renderTechnology,

    get: id => {

        const normalized =
            normalizeTechnology(id);

        return normalized
            ? technologyData[normalized]
            : null;
    }
};



/* =========================================================
   INICIALIZAÇÃO DO MÓDULO
   ========================================================= */

function initializeTechnologyModule() {

    initializeTechnologyTabs();
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeTechnologyModule,
        {
            once: true
        }
    );

} else {

    initializeTechnologyModule();
}


/* =========================================================
   REINICIALIZAÇÃO APÓS ALTERAÇÕES DINÂMICAS
   ========================================================= */

document.addEventListener(
    "smartcity:content-updated",
    () => {

        initializeTechnologyTabs();

    }
);


/* =========================================================
   BUSCA — TECNOLOGIAS
   ========================================================= */

function searchTechnology(query) {

    if (!query) {
        return [];
    }

    const normalized =
        normalizeText(query);

    return Object.entries(
        technologyData
    )
        .filter(
            ([id, data]) => {

                const text =
                    normalizeText(
                        [
                            id,
                            data.title,
                            data.category,
                            data.description,
                            ...data.paragraphs,
                            ...data.examples,
                            ...data.benefits
                        ].join(" ")
                    );

                return text.includes(
                    normalized
                );
            }
        )
        .map(
            ([id, data]) => ({
                id,
                ...data
            })
        );
}


/* =========================================================
   API DE PESQUISA
   ========================================================= */

window.SmartCitySearch = {

    technologies:
        searchTechnology
};


/* =========================================================
   FINAL DA PARTE 3/5
   ========================================================= */
/* =========================================================
   SCRIPT.JS — PARTE 4/5
   QUIZ — 15 QUESTÕES + RESULTADO
   ========================================================= */


/* =========================================================
   BANCO DE QUESTÕES
   ========================================================= */

const quizData = [

    {
        id: 1,

        question:
            "O que caracteriza principalmente uma cidade inteligente?",

        options: [
            "Ter o maior número possível de prédios tecnológicos",
            "Utilizar tecnologia, dados e planejamento para melhorar a vida urbana",
            "Substituir todos os trabalhadores por máquinas",
            "Construir somente áreas comerciais modernas"
        ],

        answer: 1,

        explanation:
            "Uma cidade inteligente utiliza tecnologia, dados, planejamento e participação para melhorar serviços, sustentabilidade, eficiência e qualidade de vida.",

        source:
            "Carta Brasileira para Cidades Inteligentes"
    },


    {
        id: 2,

        question:
            "Qual é uma das principais características da estratégia Smart Nation de Singapura?",

        options: [
            "Eliminar completamente o transporte público",
            "Utilizar tecnologia e dados para melhorar serviços e a vida da população",
            "Construir cidades exclusivamente subterrâneas",
            "Substituir o planejamento urbano por Inteligência Artificial"
        ],

        answer: 1,

        explanation:
            "A estratégia Smart Nation busca utilizar tecnologia e dados para melhorar serviços públicos, oportunidades e qualidade de vida.",

        source:
            "Smart Nation Singapore"
    },


    {
        id: 3,

        question:
            "O que é IoT?",

        options: [
            "Um sistema exclusivo de transporte ferroviário",
            "Uma tecnologia utilizada apenas em computadores pessoais",
            "Uma rede de objetos e dispositivos conectados capazes de coletar e trocar dados",
            "Um tipo de energia renovável"
        ],

        answer: 2,

        explanation:
            "Internet of Things, ou Internet das Coisas, conecta objetos físicos a redes para coletar, transmitir e utilizar informações.",

        source:
            "Conceito de Internet das Coisas aplicado às cidades inteligentes"
    },


    {
        id: 4,

        question:
            "Qual é uma das funções de sensores urbanos?",

        options: [
            "Coletar informações sobre o ambiente e os sistemas da cidade",
            "Substituir automaticamente todas as decisões governamentais",
            "Impedir qualquer alteração no trânsito",
            "Eliminar a necessidade de infraestrutura física"
        ],

        answer: 0,

        explanation:
            "Sensores podem coletar dados sobre trânsito, temperatura, qualidade do ar, água, iluminação, ocupação e diversos outros aspectos urbanos.",

        source:
            "Carta Brasileira para Cidades Inteligentes"
    },


    {
        id: 5,

        question:
            "O que é um Digital Twin urbano?",

        options: [
            "Uma segunda cidade construída fisicamente",
            "Uma representação digital de elementos físicos da cidade",
            "Um aplicativo de mensagens",
            "Um sistema utilizado somente para entretenimento"
        ],

        answer: 1,

        explanation:
            "Um gêmeo digital é uma representação computacional de elementos ou sistemas físicos que pode apoiar análise, monitoramento e simulação.",

        source:
            "Conceito de Digital Twin / Virtual Singapore"
    },


    {
        id: 6,

        question:
            "Qual projeto de Singapura está relacionado a um modelo digital tridimensional da cidade?",

        options: [
            "NEWater",
            "Virtual Singapore",
            "30 by 30",
            "Hawker Centres"
        ],

        answer: 1,

        explanation:
            "Virtual Singapore é associado a uma plataforma tridimensional do território que pode apoiar planejamento, análise e simulação.",

        source:
            "Smart Nation Singapore"
    },


    {
        id: 7,

        question:
            "O que significa a meta 30 by 30?",

        options: [
            "Construir 30 novos metrôs até 2030",
            "Reduzir em 30% todos os impostos até 2030",
            "Produzir localmente 30% das necessidades nutricionais do país até 2030",
            "Plantar 30 milhões de árvores todos os anos"
        ],

        answer: 2,

        explanation:
            "A estratégia 30 by 30 busca aumentar a capacidade de produção local de alimentos de Singapura para atingir 30% das necessidades nutricionais até 2030.",

        source:
            "Singapore Food Agency"
    },


    {
        id: 8,

        question:
            "Por que a agricultura vertical é relevante para Singapura?",

        options: [
            "Porque o país possui grande quantidade de terras agrícolas disponíveis",
            "Porque permite utilizar o espaço vertical para produzir alimentos em um território limitado",
            "Porque elimina completamente o consumo de energia",
            "Porque não necessita de tecnologia"
        ],

        answer: 1,

        explanation:
            "Singapura possui disponibilidade limitada de terras. A agricultura vertical permite produzir alimentos utilizando estruturas empilhadas e ambientes controlados.",

        source:
            "Singapore Food Agency"
    },


    {
        id: 9,

        question:
            "Qual é a principal finalidade do NEWater?",

        options: [
            "Produzir combustível",
            "Produzir água altamente purificada a partir de água recuperada",
            "Resfriar automaticamente todas as ruas",
            "Substituir o transporte público"
        ],

        answer: 1,

        explanation:
            "NEWater é uma água altamente purificada produzida por meio de processos avançados de tratamento e reutilização da água.",

        source:
            "PUB Singapore"
    },


    {
        id: 10,

        question:
            "Os Supertrees estão localizados em qual atração de Singapura?",

        options: [
            "Gardens by the Bay",
            "Changi Airport",
            "Tuas Port",
            "Marina Barrage"
        ],

        answer: 0,

        explanation:
            "Os Supertrees são estruturas icônicas do Gardens by the Bay e combinam arquitetura, paisagismo e elementos tecnológicos.",

        source:
            "Gardens by the Bay"
    },


    {
        id: 11,

        question:
            "Qual é a importância dos Hawker Centres?",

        options: [
            "São exclusivamente centros administrativos",
            "São espaços de alimentação e convivência importantes para a cultura de Singapura",
            "São exclusivamente estações ferroviárias",
            "São centros de processamento de dados"
        ],

        answer: 1,

        explanation:
            "Os Hawker Centres são importantes espaços de alimentação, comércio e convivência social. A cultura hawker de Singapura também possui reconhecimento internacional.",

        source:
            "UNESCO / Singapore Government"
    },


    {
        id: 12,

        question:
            "Qual alternativa apresenta uma característica importante da mobilidade inteligente?",

        options: [
            "Priorizar exclusivamente automóveis particulares",
            "Integrar transporte, dados, planejamento e infraestrutura",
            "Eliminar todos os ônibus",
            "Construir apenas novas rodovias"
        ],

        answer: 1,

        explanation:
            "Mobilidade inteligente envolve integração entre transporte, infraestrutura, dados, planejamento e diferentes formas de deslocamento.",

        source:
            "Carta Brasileira para Cidades Inteligentes"
    },


    {
        id: 13,

        question:
            "Qual é uma vantagem de uma Smart Grid?",

        options: [
            "Impedir o uso de energia renovável",
            "Aumentar a capacidade de monitorar e gerenciar a rede elétrica",
            "Desconectar consumidores da rede",
            "Eliminar todos os medidores"
        ],

        answer: 1,

        explanation:
            "Smart Grids utilizam sensores, comunicação e dados para melhorar o monitoramento, gerenciamento e eficiência da rede elétrica.",

        source:
            "Conceito de Smart Grid"
    },


    {
        id: 14,

        question:
            "Por que a governança é importante em uma cidade inteligente?",

        options: [
            "Porque tecnologia sozinha não define prioridades públicas",
            "Porque governos não precisam utilizar dados",
            "Porque elimina a necessidade de participação social",
            "Porque substitui completamente as políticas públicas"
        ],

        answer: 0,

        explanation:
            "Tecnologia precisa estar associada a governança, planejamento, transparência, participação, segurança e políticas públicas.",

        source:
            "Carta Brasileira para Cidades Inteligentes"
    },


    {
        id: 15,

        question:
            "Qual princípio deve estar no centro de uma cidade inteligente?",

        options: [
            "Somente o crescimento econômico",
            "Somente a automação",
            "As pessoas e a melhoria da qualidade de vida",
            "Somente a quantidade de sensores instalados"
        ],

        answer: 2,

        explanation:
            "Uma cidade inteligente deve utilizar tecnologia como instrumento para melhorar a vida das pessoas, considerando inclusão, sustentabilidade, eficiência e direitos.",

        source:
            "Carta Brasileira para Cidades Inteligentes"
    }

];


/* =========================================================
   ESTADO DO QUIZ
   ========================================================= */

const quizState = {

    currentQuestion: 0,

    score: 0,

    answered: false,

    answers: [],

    started: false,

    finished: false
};


/* =========================================================
   ELEMENTOS DO QUIZ
   ========================================================= */

function getQuizElements() {

    return {

        container:
            byId("quizQuestions"),

        progressText:
            byId("quizProgressText") ||
            byId("quizQuestionNumber"),

        scoreText:
            byId("quizScoreText") ||
            byId("quizScore"),

        progressFill:
            byId("quizProgressFill") ||
            byId("quizProgressBar"),

        result:
            byId("quizResult"),

        resultTitle:
            byId("quizResultTitle"),

        finalScore:
            byId("quizFinalScore"),

        resultMessage:
            byId("quizResultMessage"),

        restart:
            byId("restartQuiz")
    };
}


/* =========================================================
   ESCONDE O RESULTADO
   ========================================================= */

function hideQuizResult() {

    const elements =
        getQuizElements();

    if (!elements.result) {
        return;
    }

    elements.result.hidden =
        true;

    elements.result.classList.add(
        "hidden"
    );

    elements.result.classList.remove(
        "active",
        "is-visible",
        "visible"
    );
}


/* =========================================================
   MOSTRA RESULTADO
   ========================================================= */

function showQuizResult() {

    const elements =
        getQuizElements();

    const total =
        quizData.length;

    const percentage =
        Math.round(
            (
                quizState.score /
                total
            ) * 100
        );

    let title;
    let message;

    if (percentage >= 90) {

        title =
            "Excelente resultado!";

        message =
            "Você demonstrou um ótimo domínio dos conceitos de cidades inteligentes e das soluções utilizadas em Singapura.";

    } else if (percentage >= 70) {

        title =
            "Muito bom!";

        message =
            "Você compreendeu os principais conceitos. Algumas áreas ainda podem ser aprofundadas.";

    } else if (percentage >= 50) {

        title =
            "Bom começo!";

        message =
            "Você já possui uma base sobre cidades inteligentes, mas ainda existem conceitos importantes para revisar.";

    } else {

        title =
            "Vamos aprender mais!";

        message =
            "Revise as explicações das questões e explore as seções de Singapura e Tecnologias para fortalecer seus conhecimentos.";
    }

    if (elements.container) {

        elements.container.innerHTML =
            "";
    }

    if (elements.resultTitle) {

        elements.resultTitle.textContent =
            title;
    }

    if (elements.finalScore) {

        elements.finalScore.textContent =
            `${quizState.score}/${total}`;
    }

    if (elements.resultMessage) {

        elements.resultMessage.textContent =
            message;
    }

    if (elements.result) {

        elements.result.hidden =
            false;

        elements.result.classList.remove(
            "hidden"
        );

        elements.result.classList.add(
            "active",
            "is-visible",
            "visible"
        );

        setTimeout(() => {

            scrollToElement(
                elements.result,
                100
            );

        }, 100);
    }

    quizState.finished =
        true;
}


/* =========================================================
   ATUALIZA PROGRESSO
   ========================================================= */

function updateQuizProgress() {

    const elements =
        getQuizElements();

    const current =
        Math.min(
            quizState.currentQuestion + 1,
            quizData.length
        );

    const percentage =
        Math.round(
            (
                quizState.currentQuestion /
                quizData.length
            ) * 100
        );

    if (elements.progressText) {

        elements.progressText.textContent =
            `${current} de ${quizData.length}`;
    }

    if (elements.scoreText) {

        elements.scoreText.textContent =
            `${quizState.score} ponto${quizState.score === 1 ? "" : "s"}`;
    }

    if (elements.progressFill) {

        elements.progressFill.style.width =
            `${percentage}%`;

        elements.progressFill.setAttribute(
            "aria-valuenow",
            percentage
        );
    }
}


/* =========================================================
   RENDERIZA QUESTÃO
   ========================================================= */

function renderQuizQuestion() {

    const elements =
        getQuizElements();

    const question =
        quizData[
            quizState.currentQuestion
        ];

    if (
        !question ||
        !elements.container
    ) {
        return;
    }

    quizState.answered =
        false;

    hideQuizResult();

    updateQuizProgress();

    const letters = [
        "A",
        "B",
        "C",
        "D",
        "E"
    ];

    const optionsHTML =
        question.options
            .map(
                (option, index) => `
                    <button
                        type="button"
                        class="quiz-option"
                        data-quiz-option="${index}"
                        aria-label="Alternativa ${letters[index]}"
                    >
                        <span class="quiz-option-letter">
                            ${letters[index]}
                        </span>

                        <span class="quiz-option-text">
                            ${safeText(option)}
                        </span>
                    </button>
                `
            )
            .join("");

    elements.container.innerHTML = `

        <article
            class="quiz-question-card"
            data-question-id="${question.id}"
        >

            <div class="quiz-question-top">

                <span class="quiz-question-index">
                    QUESTÃO ${question.id}
                </span>

                <span class="quiz-question-topic">
                    Cidade inteligente
                </span>

            </div>

            <h3 class="quiz-question-title">
                ${safeText(question.question)}
            </h3>

            <div
                class="quiz-options"
                role="radiogroup"
                aria-label="Alternativas"
            >
                ${optionsHTML}
            </div>

            <div
                class="quiz-feedback"
                hidden
                aria-live="polite"
            ></div>

            <button
                type="button"
                class="quiz-next"
                data-quiz-next
                hidden
            >
                Próxima questão
                <span aria-hidden="true">→</span>
            </button>

        </article>
    `;

    const options =
        $$(
            "[data-quiz-option]",
            elements.container
        );

    options.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            option.dataset.quizOption
                        );

                    answerQuizQuestion(
                        index
                    );
                }
            );
        }
    );

    const next =
        elements.container.querySelector(
            "[data-quiz-next]"
        );

    if (next) {

        next.addEventListener(
            "click",
            nextQuizQuestion
        );
    }

    /*
     * Foco na questão.
     */
    const card =
        elements.container.querySelector(
            ".quiz-question-card"
        );

    if (card) {

        card.setAttribute(
            "tabindex",
            "-1"
        );

        setTimeout(() => {

            card.focus({
                preventScroll: true
            });

        }, 50);
    }
}


/* =========================================================
   RESPONDE QUESTÃO
   ========================================================= */

function answerQuizQuestion(selectedIndex) {

    if (quizState.answered) {
        return;
    }

    const question =
        quizData[
            quizState.currentQuestion
        ];

    if (!question) {
        return;
    }

    quizState.answered =
        true;

    const correct =
        selectedIndex ===
        question.answer;

    if (correct) {

        quizState.score++;

    }

    quizState.answers[
        quizState.currentQuestion
    ] = {

        questionId:
            question.id,

        selected:
            selectedIndex,

        correct
    };

    const elements =
        getQuizElements();

    const optionButtons =
        $$(
            "[data-quiz-option]",
            elements.container
        );

    optionButtons.forEach(
        (button, index) => {

            button.disabled =
                true;

            if (
                index ===
                question.answer
            ) {

                button.classList.add(
                    "correct"
                );
            }

            if (
                index === selectedIndex &&
                !correct
            ) {

                button.classList.add(
                    "incorrect"
                );
            }
        }
    );

    const feedback =
        elements.container.querySelector(
            ".quiz-feedback"
        );

    if (feedback) {

        feedback.hidden =
            false;

        feedback.className =
            `quiz-feedback ${
                correct
                    ? "is-correct"
                    : "is-incorrect"
            }`;

        feedback.innerHTML = `

            <div class="quiz-feedback-icon">
                ${correct ? "✓" : "×"}
            </div>

            <div class="quiz-feedback-content">

                <strong>
                    ${
                        correct
                            ? "Resposta correta!"
                            : "Resposta incorreta."
                    }
                </strong>

                <p>
                    ${safeText(
                        question.explanation
                    )}
                </p>

                <small>
                    Fonte: ${safeText(
                        question.source
                    )}
                </small>

            </div>
        `;
    }

    const next =
        elements.container.querySelector(
            "[data-quiz-next]"
        );

    if (next) {

        next.hidden =
            false;

        next.textContent =
            quizState.currentQuestion >=
            quizData.length - 1
                ? "Ver resultado"
                : "Próxima questão";

        const arrow =
            document.createElement(
                "span"
            );

        arrow.textContent =
            " →";

        next.appendChild(
            arrow
        );
    }

    updateQuizProgress();

    /*
     * Pequeno atraso antes de avançar
     * automaticamente.
     */
    setTimeout(
        () => {

            if (
                !quizState.finished &&
                quizState.answered
            ) {

                /*
                 * O usuário ainda pode ler
                 * a explicação.
                 */
                const nextButton =
                    elements.container.querySelector(
                        "[data-quiz-next]"
                    );

                if (nextButton) {

                    nextButton.focus({
                        preventScroll: true
                    });
                }
            }

        },
        150
    );
}


/* =========================================================
   PRÓXIMA QUESTÃO
   ========================================================= */

function nextQuizQuestion() {

    if (!quizState.answered) {
        return;
    }

    if (
        quizState.currentQuestion >=
        quizData.length - 1
    ) {

        showQuizResult();

        updateQuizProgress();

        return;
    }

    quizState.currentQuestion++;

    renderQuizQuestion();

    const elements =
        getQuizElements();

    if (elements.container) {

        setTimeout(() => {

            scrollToElement(
                elements.container,
                105
            );

        }, 80);
    }
}


/* =========================================================
   REINICIA QUIZ
   ========================================================= */

function restartQuiz() {

    quizState.currentQuestion =
        0;

    quizState.score =
        0;

    quizState.answered =
        false;

    quizState.answers =
        [];

    quizState.started =
        true;

    quizState.finished =
        false;

    hideQuizResult();

    renderQuizQuestion();

    const elements =
        getQuizElements();

    if (elements.container) {

        setTimeout(() => {

            scrollToElement(
                elements.container,
                105
            );

        }, 80);
    }
}


/* =========================================================
   INICIA QUIZ
   ========================================================= */

function initializeQuiz() {

    const elements =
        getQuizElements();

    if (
        !elements.container
    ) {
        return;
    }

    /*
     * Evita inicializações duplicadas.
     */
    if (
        elements.container.dataset.quizInitialized ===
        "true"
    ) {

        return;
    }

    elements.container.dataset.quizInitialized =
        "true";

    quizState.currentQuestion =
        0;

    quizState.score =
        0;

    quizState.answers =
        [];

    quizState.started =
        true;

    quizState.finished =
        false;

    renderQuizQuestion();

    if (elements.restart) {

        elements.restart.addEventListener(
            "click",
            event => {

                event.preventDefault();

                restartQuiz();
            }
        );
    }

    /*
     * Compatibilidade com botões
     * criados dinamicamente.
     */
    document.addEventListener(
        "click",
        event => {

            const restart =
                event.target.closest(
                    "#restartQuiz"
                );

            if (
                restart &&
                restart !== elements.restart
            ) {

                event.preventDefault();

                restartQuiz();
            }
        }
    );
}


/* =========================================================
   RESULTADO EM PORCENTAGEM
   ========================================================= */

function getQuizPercentage() {

    if (!quizData.length) {
        return 0;
    }

    return Math.round(
        (
            quizState.score /
            quizData.length
        ) * 100
    );
}


/* =========================================================
   DESEMPENHO DO QUIZ
   ========================================================= */

function getQuizPerformance() {

    const percentage =
        getQuizPercentage();

    if (percentage >= 90) {
        return "excelente";
    }

    if (percentage >= 70) {
        return "muito-bom";
    }

    if (percentage >= 50) {
        return "bom";
    }

    return "iniciante";
}


/* =========================================================
   RESUMO DO QUIZ
   ========================================================= */

function getQuizSummary() {

    return {

        total:
            quizData.length,

        score:
            quizState.score,

        percentage:
            getQuizPercentage(),

        performance:
            getQuizPerformance(),

        completed:
            quizState.finished,

        answers:
            [...quizState.answers]
    };
}


/* =========================================================
   API DO QUIZ
   ========================================================= */

window.Quiz = {

    data:
        quizData,

    state:
        quizState,

    start:
        restartQuiz,

    next:
        nextQuizQuestion,

    answer:
        answerQuizQuestion,

    restart:
        restartQuiz,

    getPercentage:
        getQuizPercentage,

    getPerformance:
        getQuizPerformance,

    getSummary:
        getQuizSummary
};


/* =========================================================
   ATALHOS DO QUIZ
   ========================================================= */

function initializeQuizKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Só responde quando o foco
             * estiver dentro do quiz.
             */
            const active =
                document.activeElement;

            if (
                !active ||
                !active.closest(
                    "#quizQuestions"
                )
            ) {
                return;
            }

            /*
             * Números 1–4 selecionam
             * diretamente uma alternativa.
             */
            const number =
                Number(event.key);

            if (
                number >= 1 &&
                number <= 4 &&
                !quizState.answered
            ) {

                const option =
                    document.querySelector(
                        `[data-quiz-option="${number - 1}"]`
                    );

                if (option) {

                    option.click();
                }
            }

            /*
             * Enter ou seta direita
             * avança após responder.
             */
            if (
                (
                    event.key === "Enter" ||
                    event.key === "ArrowRight"
                ) &&
                quizState.answered
            ) {

                const next =
                    document.querySelector(
                        "[data-quiz-next]"
                    );

                if (next) {

                    event.preventDefault();

                    next.click();
                }
            }
        }
    );
}


/* =========================================================
   INDICADOR VISUAL DO DESEMPENHO
   ========================================================= */

function updateQuizBodyState() {

    const percentage =
        getQuizPercentage();

    document.body.dataset.quizScore =
        String(percentage);

    document.body.classList.remove(
        "quiz-excellent",
        "quiz-good",
        "quiz-average",
        "quiz-beginner"
    );

    if (percentage >= 90) {

        document.body.classList.add(
            "quiz-excellent"
        );

    } else if (percentage >= 70) {

        document.body.classList.add(
            "quiz-good"
        );

    } else if (percentage >= 50) {

        document.body.classList.add(
            "quiz-average"
        );

    } else {

        document.body.classList.add(
            "quiz-beginner"
        );
    }
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function initializeQuizModule() {

    initializeQuiz();

    initializeQuizKeyboard();
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeQuizModule,
        {
            once: true
        }
    );

} else {

    initializeQuizModule();
}


/* =========================================================
   REINICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "smartcity:content-updated",
    () => {

        initializeQuiz();

    }
);


/* =========================================================
   ATUALIZA O ESTADO APÓS RESPOSTA
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "[data-quiz-option]"
            )
        ) {

            setTimeout(
                updateQuizBodyState,
                20
            );
        }
    }
);


/* =========================================================
   EVENTO DE FINALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-quiz-next]"
            );

        if (!button) {
            return;
        }

        if (
            quizState.currentQuestion >=
            quizData.length - 1 &&
            quizState.answered
        ) {

            setTimeout(
                () => {

                    document.dispatchEvent(
                        new CustomEvent(
                            "quizfinished",
                            {
                                detail:
                                    getQuizSummary()
                            }
                        )
                    );

                },
                50
            );
        }
    }
);


/* =========================================================
   FINAL DA PARTE 4/5
   ========================================================= */
/* =========================================================
   5/5 — DIAGNÓSTICO DA CIDADE + FONTES + OPINIÃO
   ========================================================= */

(function () {
    "use strict";

    /* ---------------------------------------------------------
       DIAGNÓSTICO DE CIDADE
       --------------------------------------------------------- */

    const cityDiagnosisData = [
        {
            id: "governanca",
            title: "Governança e participação",
            questions: [
                "A prefeitura possui canais digitais ativos para ouvir moradores?",
                "A população participa de decisões e projetos importantes da cidade?"
            ],
            recommendation:
                "Amplie canais de participação, consultas públicas, transparência e acompanhamento dos projetos municipais."
        },

        {
            id: "mobilidade",
            title: "Mobilidade urbana",
            questions: [
                "A cidade possui transporte público integrado e acessível?",
                "Existem boas condições para caminhar e utilizar bicicleta?"
            ],
            recommendation:
                "Priorize transporte coletivo, integração tarifária, calçadas acessíveis, ciclovias e dados de mobilidade."
        },

        {
            id: "ambiente",
            title: "Meio ambiente",
            questions: [
                "A cidade possui políticas para reduzir emissões e poluição?",
                "Existem áreas verdes, parques ou projetos de recuperação ambiental?"
            ],
            recommendation:
                "Aumente áreas verdes, monitore a qualidade ambiental e estabeleça metas mensuráveis de redução de emissões."
        },

        {
            id: "agua",
            title: "Água e saneamento",
            questions: [
                "A maior parte da população possui acesso adequado à água potável?",
                "A cidade possui tratamento adequado de esgoto?"
            ],
            recommendation:
                "Invista em universalização do saneamento, redução de perdas, monitoramento da água e infraestrutura resiliente."
        },

        {
            id: "energia",
            title: "Energia",
            questions: [
                "Existem iniciativas de eficiência energética em prédios e serviços públicos?",
                "A cidade utiliza ou incentiva fontes renováveis de energia?"
            ],
            recommendation:
                "Amplie eficiência energética, geração distribuída e uso de fontes renováveis em instalações públicas e privadas."
        },

        {
            id: "residuos",
            title: "Resíduos e economia circular",
            questions: [
                "A cidade possui coleta seletiva funcionando de forma significativa?",
                "Existem iniciativas de reciclagem, reaproveitamento ou economia circular?"
            ],
            recommendation:
                "Fortaleça coleta seletiva, reciclagem, compostagem, logística reversa e redução da geração de resíduos."
        },

        {
            id: "tecnologia",
            title: "Conectividade e tecnologia",
            questions: [
                "A população possui acesso amplo à internet de qualidade?",
                "A cidade utiliza sensores ou dispositivos conectados para melhorar serviços?"
            ],
            recommendation:
                "Expanda conectividade e infraestrutura digital, priorizando também regiões com menor acesso tecnológico."
        },

        {
            id: "dados",
            title: "Dados e serviços digitais",
            questions: [
                "A prefeitura oferece serviços públicos que podem ser acessados pela internet?",
                "A administração utiliza dados para orientar decisões e políticas públicas?"
            ],
            recommendation:
                "Integre bases de dados, digitalize serviços e utilize indicadores para avaliar continuamente as políticas públicas."
        },

        {
            id: "planejamento",
            title: "Planejamento e inclusão",
            questions: [
                "Os projetos urbanos consideram acessibilidade e inclusão social?",
                "A cidade possui planejamento de longo prazo baseado em indicadores?"
            ],
            recommendation:
                "Integre planejamento urbano, inclusão, acessibilidade e metas de longo prazo com indicadores públicos."
        }
    ];

    const cityState = {
        active: false,
        finished: false,
        cityName: "",
        currentQuestion: 0,
        answers: {},
        questions: [],
        result: null
    };

    function cityElements() {
        return {
            section: byId("cityTest") ||
                byId("cityDiagnosis") ||
                document.querySelector('[data-section="city-test"]'),

            intro: byId("cityIntro"),
            nameInput: byId("cityName"),
            startButton: byId("startCityTest"),

            questionsContainer: byId("cityQuestions"),
            questionList: byId("cityQuestionList"),

            progressText: byId("cityProgressText"),
            progressFill: byId("cityProgressFill"),

            cancelButton: byId("cancelCityTest"),
            submitButton: byId("submitCityTest"),

            result: byId("cityResult"),
            resultCityName: byId("resultCityName"),
            overallScore: byId("overallScore"),
            maturityLevel: byId("maturityLevel"),
            maturityDescription: byId("maturityDescription"),

            dimensionResults: byId("dimensionResults"),
            strengths: byId("cityStrengths"),
            priorities: byId("cityPriorities"),
            recommendations: byId("cityRecommendations"),

            restartButton: byId("restartCityTest")
        };
    }

    function createCityQuestions() {
        const questions = [];

        cityDiagnosisData.forEach(function (dimension) {
            dimension.questions.forEach(function (question, index) {
                questions.push({
                    id: `${dimension.id}-${index + 1}`,
                    dimension: dimension.id,
                    dimensionTitle: dimension.title,
                    text: question
                });
            });
        });

        return questions;
    }

    function getCityQuestionContainer() {
        const elements = cityElements();

        return elements.questionList ||
            elements.questionsContainer ||
            null;
    }

    function showCityElement(element, visible) {
        if (!element) return;

        element.hidden = !visible;
        element.classList.toggle("visible", visible);
        element.classList.toggle("hidden", !visible);

        if (visible) {
            element.style.removeProperty("display");
        } else {
            element.style.display = "none";
        }
    }

    function startCityDiagnosis() {
        const elements = cityElements();

        const enteredName = elements.nameInput
            ? elements.nameInput.value.trim()
            : "";

        cityState.cityName = enteredName || "Minha cidade";
        cityState.active = true;
        cityState.finished = false;
        cityState.currentQuestion = 0;
        cityState.answers = {};
        cityState.questions = createCityQuestions();
        cityState.result = null;

        /*
         * Importante:
         * não escondemos a seção inteira.
         * Isso evita o problema anterior em que o conteúdo desaparecia
         * depois de clicar em "Começar".
         */
        showCityElement(elements.intro, false);
        showCityElement(elements.questionsContainer, true);
        showCityElement(elements.questionList, true);
        showCityElement(elements.result, false);

        if (elements.startButton) {
            elements.startButton.disabled = false;
        }

        if (elements.cancelButton) {
            elements.cancelButton.disabled = false;
        }

        renderCityQuestion();
    }

    function renderCityQuestion() {
        const elements = cityElements();
        const container = getCityQuestionContainer();

        if (!container || !cityState.active) return;

        const question = cityState.questions[cityState.currentQuestion];

        if (!question) {
            finishCityDiagnosis();
            return;
        }

        const number = cityState.currentQuestion + 1;
        const total = cityState.questions.length;

        if (elements.progressText) {
            elements.progressText.textContent =
                `Pergunta ${number} de ${total}`;
        }

        if (elements.progressFill) {
            const progress = ((number - 1) / total) * 100;
            elements.progressFill.style.width = `${progress}%`;
        }

        const previousAnswer = cityState.answers[question.id];

        container.innerHTML = `
            <article class="city-question-card" data-question-id="${question.id}">
                <div class="city-question-meta">
                    <span class="city-question-number">
                        ${number.toString().padStart(2, "0")}
                    </span>

                    <span class="city-question-dimension">
                        ${safeText(question.dimensionTitle)}
                    </span>
                </div>

                <h3 class="city-question-title">
                    ${safeText(question.text)}
                </h3>

                <div class="city-answer-options" role="group"
                     aria-label="Resposta da pergunta">
                    
                    <button
                        type="button"
                        class="city-answer-button ${
                            previousAnswer === true ? "selected" : ""
                        }"
                        data-city-answer="yes"
                        aria-pressed="${
                            previousAnswer === true ? "true" : "false"
                        }">
                        <span class="answer-icon">✓</span>
                        <span>Sim</span>
                    </button>

                    <button
                        type="button"
                        class="city-answer-button ${
                            previousAnswer === false ? "selected" : ""
                        }"
                        data-city-answer="no"
                        aria-pressed="${
                            previousAnswer === false ? "true" : "false"
                        }">
                        <span class="answer-icon">×</span>
                        <span>Não</span>
                    </button>
                </div>

                <div class="city-question-hint">
                    Responda de acordo com a realidade atual da cidade.
                </div>
            </article>
        `;

        const buttons = container.querySelectorAll("[data-city-answer]");

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                const answer = button.dataset.cityAnswer === "yes";

                answerCityQuestion(question.id, answer);
            });
        });

        if (elements.submitButton) {
            const answered = Object.keys(cityState.answers).length;

            elements.submitButton.disabled =
                answered !== total;

            elements.submitButton.style.display =
                answered === total ? "" : "none";
        }
    }

    function answerCityQuestion(questionId, answer) {
        cityState.answers[questionId] = answer;

        updateCityProgress();

        /*
         * Pequena pausa para o usuário perceber a seleção.
         * Depois avançamos automaticamente.
         */
        setTimeout(function () {
            if (!cityState.active) return;

            if (cityState.currentQuestion <
                cityState.questions.length - 1) {

                cityState.currentQuestion += 1;
                renderCityQuestion();

                const container = getCityQuestionContainer();

                if (container) {
                    container.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }

            } else {
                finishCityDiagnosis();
            }
        }, 220);
    }

    function updateCityProgress() {
        const elements = cityElements();
        const total = cityState.questions.length;

        if (!total) return;

        const answered = Object.keys(cityState.answers).length;
        const progress = (answered / total) * 100;

        if (elements.progressText) {
            elements.progressText.textContent =
                `${answered} de ${total} respondidas`;
        }

        if (elements.progressFill) {
            elements.progressFill.style.width =
                `${Math.min(100, progress)}%`;
        }
    }

    function calculateCityResult() {
        const total = cityState.questions.length;

        let yesCount = 0;

        cityState.questions.forEach(function (question) {
            if (cityState.answers[question.id] === true) {
                yesCount++;
            }
        });

        const overall = Math.round((yesCount / total) * 100);

        const dimensions = cityDiagnosisData.map(function (dimension) {
            const relatedQuestions = cityState.questions.filter(function (q) {
                return q.dimension === dimension.id;
            });

            const yes = relatedQuestions.filter(function (q) {
                return cityState.answers[q.id] === true;
            }).length;

            return {
                id: dimension.id,
                title: dimension.title,
                score: Math.round(
                    (yes / relatedQuestions.length) * 100
                ),
                yes,
                total: relatedQuestions.length,
                recommendation: dimension.recommendation
            };
        });

        return {
            overall,
            yesCount,
            total,
            dimensions
        };
    }

    function getMaturity(score) {
        if (score < 25) {
            return {
                level: "Emergente",
                description:
                    "A cidade está começando sua jornada de transformação inteligente. O foco deve estar na criação de bases, infraestrutura e planejamento."
            };
        }

        if (score < 45) {
            return {
                level: "Inicial",
                description:
                    "Existem algumas iniciativas positivas, mas ainda há importantes lacunas de integração, infraestrutura e gestão."
            };
        }

        if (score < 65) {
            return {
                level: "Em desenvolvimento",
                description:
                    "A cidade apresenta uma base relevante de iniciativas inteligentes, mas ainda pode integrar melhor seus sistemas e serviços."
            };
        }

        if (score < 85) {
            return {
                level: "Avançada",
                description:
                    "A cidade possui uma estrutura relativamente madura de políticas, tecnologia e sustentabilidade, com espaço para integração e inovação."
            };
        }

        return {
            level: "Referência",
            description:
                "A cidade demonstra alto nível de maturidade em diferentes dimensões e apresenta características de uma cidade inteligente integrada."
        };
    }

    function finishCityDiagnosis() {
        const elements = cityElements();

        const unanswered = cityState.questions.filter(function (question) {
            return typeof cityState.answers[question.id] !== "boolean";
        });

        if (unanswered.length > 0) {
            cityState.currentQuestion =
                cityState.questions.indexOf(unanswered[0]);

            renderCityQuestion();
            return;
        }

        cityState.result = calculateCityResult();
        cityState.active = false;
        cityState.finished = true;

        const maturity = getMaturity(cityState.result.overall);

        if (elements.progressText) {
            elements.progressText.textContent =
                `${cityState.result.total} de ${cityState.result.total} respondidas`;
        }

        if (elements.progressFill) {
            elements.progressFill.style.width = "100%";
        }

        showCityElement(elements.questionsContainer, false);
        showCityElement(elements.questionList, false);
        showCityElement(elements.result, true);

        if (elements.resultCityName) {
            elements.resultCityName.textContent = cityState.cityName;
        }

        if (elements.overallScore) {
            elements.overallScore.textContent =
                `${cityState.result.overall}%`;
        }

        if (elements.maturityLevel) {
            elements.maturityLevel.textContent = maturity.level;
        }

        if (elements.maturityDescription) {
            elements.maturityDescription.textContent =
                maturity.description;
        }

        renderDimensionResults(cityState.result.dimensions);
        renderCityStrengths(cityState.result.dimensions);
        renderCityPriorities(cityState.result.dimensions);
        renderCityRecommendations(cityState.result.dimensions);

        animateCityScore(elements.overallScore);

        if (elements.result) {
            setTimeout(function () {
                elements.result.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 100);
        }
    }

    function renderDimensionResults(dimensions) {
        const elements = cityElements();

        if (!elements.dimensionResults) return;

        elements.dimensionResults.innerHTML = dimensions.map(function (item) {
            return `
                <div class="dimension-result" data-dimension="${item.id}">
                    <div class="dimension-result-header">
                        <span>${safeText(item.title)}</span>
                        <strong>${item.score}%</strong>
                    </div>

                    <div class="dimension-progress">
                        <span style="width: ${item.score}%"></span>
                    </div>
                </div>
            `;
        }).join("");
    }

    function renderCityStrengths(dimensions) {
        const elements = cityElements();

        if (!elements.strengths) return;

        const strengths = [...dimensions]
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        elements.strengths.innerHTML = strengths.map(function (item, index) {
            return `
                <div class="city-result-item strength-item">
                    <span class="result-rank">${index + 1}</span>
                    <div>
                        <strong>${safeText(item.title)}</strong>
                        <small>${item.score}% de desempenho</small>
                    </div>
                </div>
            `;
        }).join("");
    }

    function renderCityPriorities(dimensions) {
        const elements = cityElements();

        if (!elements.priorities) return;

        const priorities = [...dimensions]
            .sort((a, b) => a.score - b.score)
            .slice(0, 3);

        elements.priorities.innerHTML = priorities.map(function (item, index) {
            return `
                <div class="city-result-item priority-item">
                    <span class="result-rank">${index + 1}</span>
                    <div>
                        <strong>${safeText(item.title)}</strong>
                        <small>${item.score}% — prioridade de melhoria</small>
                    </div>
                </div>
            `;
        }).join("");
    }

    function renderCityRecommendations(dimensions) {
        const elements = cityElements();

        if (!elements.recommendations) return;

        const priorities = [...dimensions]
            .sort((a, b) => a.score - b.score)
            .slice(0, 3);

        elements.recommendations.innerHTML = priorities.map(function (item) {
            return `
                <article class="recommendation-card">
                    <div class="recommendation-icon">→</div>
                    <div>
                        <h4>${safeText(item.title)}</h4>
                        <p>${safeText(item.recommendation)}</p>
                    </div>
                </article>
            `;
        }).join("");
    }

    function animateCityScore(element) {
        if (!element || !cityState.result) return;

        const target = cityState.result.overall;
        const duration = 900;
        const start = performance.now();

        function frame(now) {
            const elapsed = now - start;
            const progress = Math.min(1, elapsed / duration);

            const eased =
                1 - Math.pow(1 - progress, 3);

            const value = Math.round(target * eased);

            element.textContent = `${value}%`;

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }

        requestAnimationFrame(frame);
    }

    function resetCityDiagnosis() {
        const elements = cityElements();

        cityState.active = false;
        cityState.finished = false;
        cityState.cityName = "";
        cityState.currentQuestion = 0;
        cityState.answers = {};
        cityState.questions = [];
        cityState.result = null;

        showCityElement(elements.intro, true);
        showCityElement(elements.questionsContainer, false);
        showCityElement(elements.questionList, false);
        showCityElement(elements.result, false);

        if (elements.progressText) {
            elements.progressText.textContent = "0 de 18 respondidas";
        }

        if (elements.progressFill) {
            elements.progressFill.style.width = "0%";
        }

        if (elements.nameInput) {
            elements.nameInput.value = "";
        }

        if (elements.submitButton) {
            elements.submitButton.disabled = true;
            elements.submitButton.style.display = "none";
        }
    }

    function cancelCityDiagnosis() {
        resetCityDiagnosis();
    }

    function initializeCityDiagnosis() {
        const elements = cityElements();

        if (!elements.startButton &&
            !elements.questionList &&
            !elements.questionsContainer) {
            return;
        }

        /*
         * Remove listeners anteriores usando clones apenas quando
         * necessário. Isso também torna a inicialização mais segura
         * caso o site seja reinicializado após troca de aba.
         */

        if (elements.startButton) {
            elements.startButton.addEventListener(
                "click",
                startCityDiagnosis
            );
        }

        if (elements.cancelButton) {
            elements.cancelButton.addEventListener(
                "click",
                cancelCityDiagnosis
            );
        }

        if (elements.submitButton) {
            elements.submitButton.addEventListener(
                "click",
                finishCityDiagnosis
            );
        }

        if (elements.restartButton) {
            elements.restartButton.addEventListener(
                "click",
                resetCityDiagnosis
            );
        }

        /*
         * Estado inicial seguro:
         * a seção continua visível e somente os elementos internos
         * necessários ficam ocultos.
         */
        showCityElement(elements.questionsContainer, false);
        showCityElement(elements.questionList, false);
        showCityElement(elements.result, false);

        if (elements.progressText &&
            !elements.progressText.textContent.trim()) {
            elements.progressText.textContent =
                "0 de 18 respondidas";
        }

        if (elements.progressFill) {
            elements.progressFill.style.width = "0%";
        }
    }

    /* ---------------------------------------------------------
       FILTRO E BUSCA DE FONTES
       --------------------------------------------------------- */

    function initializeSources() {
        const searchInput =
            byId("sourcesSearch") ||
            document.querySelector(".sources-search input");

        const filterButtons =
            $$(".source-filter, [data-source-filter]");

        const sourceCards =
            $$(".source-card, [data-source-category]");

        function applySourceFilter() {
            const search =
                searchInput
                    ? normalizeText(searchInput.value)
                    : "";

            let activeFilter = "todos";

            const activeButton =
                document.querySelector(
                    ".source-filter.active, " +
                    "[data-source-filter].active"
                );

            if (activeButton) {
                activeFilter = normalizeText(
                    activeButton.dataset.sourceFilter ||
                    activeButton.dataset.filter ||
                    activeButton.dataset.category ||
                    "todos"
                );
            }

            sourceCards.forEach(function (card) {
                const text = normalizeText(
                    card.textContent || ""
                );

                const category = normalizeText(
                    card.dataset.sourceCategory ||
                    card.dataset.category ||
                    ""
                );

                const categoryTokens =
                    category.split(/\s+/).filter(Boolean);

                const matchesSearch =
                    !search || text.includes(search);

                const matchesFilter =
                    activeFilter === "todos" ||
                    activeFilter === "all" ||
                    categoryTokens.includes(activeFilter);

                const visible =
                    matchesSearch && matchesFilter;

                card.style.display = visible ? "" : "none";

                // Mesmo comportamento visual de "Explorar Singapura":
                // a categoria selecionada fica em primeiro plano.
                const priority =
                    activeFilter !== "todos" &&
                    activeFilter !== "all" &&
                    matchesFilter &&
                    matchesSearch;

                card.classList.toggle(
                    "filter-priority",
                    priority
                );

                card.classList.toggle(
                    "filter-muted",
                    activeFilter !== "todos" &&
                    activeFilter !== "all" &&
                    !matchesFilter
                );
            });
        }

        if (searchInput) {
            searchInput.addEventListener(
                "input",
                applySourceFilter
            );
        }

        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                filterButtons.forEach(function (item) {
                    item.classList.remove("active");
                    item.setAttribute("aria-pressed", "false");
                });

                button.classList.add("active");
                button.setAttribute("aria-pressed", "true");

                applySourceFilter();
            });
        });

        applySourceFilter();
    }

    /* ---------------------------------------------------------
       FORMULÁRIO DE OPINIÃO
       --------------------------------------------------------- */

    function initializeOpinionForm() {
        const form =
            byId("opinionForm") ||
            document.querySelector(".opinion-form");

        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const message =
                byId("opinionMessage") ||
                form.querySelector("textarea");

            const feedback =
                byId("opinionFeedback") ||
                form.querySelector(".opinion-feedback");

            if (!message || !message.value.trim()) {
                if (feedback) {
                    feedback.textContent =
                        "Escreva uma opinião antes de enviar.";
                    feedback.classList.add("show");
                }
                return;
            }

            if (feedback) {
                feedback.textContent =
                    "Obrigado! Sua opinião foi registrada nesta demonstração.";
                feedback.classList.add("show");
            }

            form.reset();
        });
    }

    /* ---------------------------------------------------------
       CONTADORES DA PÁGINA INICIAL
       --------------------------------------------------------- */

    function initializeCounters() {
        const counters =
            $$("[data-counter]");

        if (!counters.length) return;

        const observer =
            new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;

                    const element = entry.target;

                    if (element.dataset.counterAnimated === "true") {
                        return;
                    }

                    element.dataset.counterAnimated = "true";

                    const target =
                        parseFloat(element.dataset.counter) || 0;

                    const suffix =
                        element.dataset.suffix || "";

                    const decimals =
                        Number(element.dataset.decimals || 0);

                    const duration = 1100;
                    const start = performance.now();

                    function animate(now) {
                        const elapsed = now - start;
                        const progress =
                            Math.min(1, elapsed / duration);

                        const eased =
                            1 - Math.pow(1 - progress, 3);

                        const value =
                            target * eased;

                        element.textContent =
                            value.toFixed(decimals) + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    }

                    requestAnimationFrame(animate);
                    obs.unobserve(element);
                });
            }, {
                threshold: 0.25
            });

        counters.forEach(function (counter) {
            observer.observe(counter);
        });
    }

    /* ---------------------------------------------------------
       NAVEGAÇÃO EXTRA / LINKS INTERNOS
       --------------------------------------------------------- */

    
/* CTA interno: botão -> aba */
function initializeScrollTabButtons() {
    document.addEventListener("click", function (event) {
        const button = event.target.closest("[data-scroll-tab]");
        if (!button) return;

        const target = button.dataset.scrollTab;
        if (!target) return;

        event.preventDefault();

        if (typeof window.openTab === "function") {
            window.openTab(target);
        }
    });
}

function initializeInternalLinks() {
        document.addEventListener("click", function (event) {
            const link =
                event.target.closest(
                    'a[href^="#"], [data-scroll-target]'
                );

            if (!link) return;

            const targetId =
                link.dataset.scrollTarget ||
                link.getAttribute("href")?.replace("#", "");

            if (!targetId) return;

            const target = byId(targetId);

            if (!target) return;

            event.preventDefault();

            scrollToElement(target);

            if (history.replaceState) {
                history.replaceState(
                    null,
                    "",
                    `#${targetId}`
                );
            }
        });
    }

    /* ---------------------------------------------------------
       TECLADO DO DIAGNÓSTICO
       --------------------------------------------------------- */

    function initializeCityKeyboard() {
        document.addEventListener("keydown", function (event) {
            if (!cityState.active) return;

            /*
             * 1 = Sim
             * 2 = Não
             */
            if (event.key === "1") {
                const question =
                    cityState.questions[cityState.currentQuestion];

                if (question) {
                    answerCityQuestion(question.id, true);
                }
            }

            if (event.key === "2") {
                const question =
                    cityState.questions[cityState.currentQuestion];

                if (question) {
                    answerCityQuestion(question.id, false);
                }
            }
        });
    }

    /* ---------------------------------------------------------
       API PÚBLICA DO DIAGNÓSTICO
       --------------------------------------------------------- */

    window.CityDiagnosis = {
        start: startCityDiagnosis,
        cancel: cancelCityDiagnosis,
        restart: resetCityDiagnosis,
        answer: answerCityQuestion,
        finish: finishCityDiagnosis,
        getState: function () {
            return {
                active: cityState.active,
                finished: cityState.finished,
                cityName: cityState.cityName,
                currentQuestion: cityState.currentQuestion,
                answers: {
                    ...cityState.answers
                },
                result: cityState.result
            };
        },

        getQuestions: function () {
            return cityState.questions.map(function (question) {
                return {
                    ...question
                };
            });
        }
    };

    /* ---------------------------------------------------------
       API GLOBAL
       --------------------------------------------------------- */

    window.SmartCity = window.SmartCity || {};

    Object.assign(window.SmartCity, {
        cityDiagnosis: window.CityDiagnosis,
        sources: {
            initialize: initializeSources,
            filter: function () {
                const input = byId("sourcesSearch");

                if (input) {
                    input.dispatchEvent(
                        new Event("input", {
                            bubbles: true
                        })
                    );
                }
            }
        }
    });

    /* ---------------------------------------------------------
       INICIALIZAÇÃO FINAL
       --------------------------------------------------------- */

    function initializePartFive() {
        initializeCityDiagnosis();
        initializeSources();
        initializeOpinionForm();
        initializeCounters();
        initializeInternalLinks();
        initializeCityKeyboard();
    }

    /*
     * Como as partes anteriores podem já ter registrado
     * DOMContentLoaded, esta parte utiliza uma inicialização
     * independente e segura.
     */
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializePartFive,
            { once: true }
        );
    } else {
        initializePartFive();
    }

})();


/* Garantia de inicialização dos botões data-scroll-tab. */
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeScrollTabButtons,
        { once: true }
    );
} else {
    initializeScrollTabButtons();
}
