// ===== GIT WORKTREE GUIDE - JAVASCRIPT FUNCTIONALITY =====
// ===== ОСНОВНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ =====
const THEME_KEY = 'git-worktree-theme';
const SCROLL_THRESHOLD = 100;
const ANIMATION_DELAY = 100;

// DOM элементы
let themeToggle;
let mobileMenuToggle;
let mobileMenu;
let navLinks;
let scrollToTopBtn;

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeCodeBlocks();
    initializeMobileMenu();
    initializeInteractiveElements();
    initializeScrollToTop();
    injectAdditionalStyles();

    console.log('🚀 Git Worktree Guide - JavaScript initialized');
});

// ===== УПРАВЛЕНИЕ ТЕМОЙ =====
function initializeTheme() {
    // Создаем кнопку переключения темы если её нет
    createThemeToggle();

    // Загружаем сохраненную тему или используем системную
    const savedTheme = localStorage.getItem(THEME_KEY);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;

    // Применяем тему
    setTheme(currentTheme);

    // Слушаем изменения системной темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function createThemeToggle() {
    // Проверяем, есть ли уже кнопка
    themeToggle = document.querySelector('.theme-toggle');

    if (!themeToggle) {
        themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Переключить тему');
        themeToggle.innerHTML = `
            <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
        document.body.appendChild(themeToggle);
    }

    // Добавляем обработчик события
    themeToggle.addEventListener('click', toggleTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Обновляем иконку в кнопке
    if (themeToggle) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');

        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            themeToggle.setAttribute('aria-label', 'Переключить на светлую тему');
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            themeToggle.setAttribute('aria-label', 'Переключить на темную тему');
        }
    }

    // Анимация переключения
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    // Анимация кнопки
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
}

// ===== НАВИГАЦИЯ И ПЛАВНАЯ ПРОКРУТКА =====
function initializeNavigation() {
    // Плавная прокрутка для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80; // Отступ для фиксированной навигации
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Закрываем мобильное меню если открыто
                closeMobileMenu();
            }
        });
    });

    // Подсветка активного пункта навигации
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;

        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== ЭФФЕКТЫ ПРОКРУТКИ И АНИМАЦИИ =====
function initializeScrollEffects() {
    // Intersection Observer для анимаций появления
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Добавляем задержку для последовательной анимации
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * ANIMATION_DELAY;
                entry.target.style.animationDelay = `${delay}ms`;
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.card, .code-block, .btn, h1, h2, h3, p, ul, ol').forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });

    // Параллакс эффект для hero секции
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }, 16));
    }
}

// ===== БЛОКИ КОДА =====
function initializeCodeBlocks() {
    document.querySelectorAll('.code-block, pre').forEach(codeBlock => {
        // Добавляем кнопку копирования
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Копировать</span>
        `;
        copyButton.setAttribute('aria-label', 'Копировать код');

        // Позиционируем кнопку
        codeBlock.style.position = 'relative';
        codeBlock.appendChild(copyButton);

        // Обработчик копирования
        copyButton.addEventListener('click', async () => {
            const code = codeBlock.querySelector('code');
            const text = code ? code.textContent : codeBlock.textContent;

            try {
                await navigator.clipboard.writeText(text);
                showCopySuccess(copyButton);
            } catch (err) {
                // Fallback для старых браузеров
                fallbackCopyTextToClipboard(text, copyButton);
            }
        });

        // Подсветка синтаксиса (базовая)
        highlightSyntax(codeBlock);
    });
}

function showCopySuccess(button) {
    const originalContent = button.innerHTML;
    button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        <span>Скопировано!</span>
    `;
    button.classList.add('copied');

    setTimeout(() => {
        button.innerHTML = originalContent;
        button.classList.remove('copied');
    }, 2000);
}

function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        console.error('Не удалось скопировать текст: ', err);
    }

    document.body.removeChild(textArea);
}

function highlightSyntax(codeBlock) {
    const code = codeBlock.querySelector('code');
    if (!code) return;

    let text = code.innerHTML;

    // Базовая подсветка для Git команд
    text = text.replace(/\b(git|worktree|add|commit|push|pull|merge|branch|checkout|status|log|clone|fetch|rebase|stash|tag|remote|config|init|diff|show|reset|clean|mv|rm)\b/g, '<span class="keyword">$1</span>');
    text = text.replace(/--[a-zA-Z-]+/g, '<span class="option">$&</span>');
    text = text.replace(/"[^"]*"/g, '<span class="string">$&</span>');
    text = text.replace(/'[^']*'/g, '<span class="string">$&</span>');
    text = text.replace(/#[^\n]*/g, '<span class="comment">$&</span>');
    text = text.replace(/\b\d+\b/g, '<span class="number">$&</span>');

    code.innerHTML = text;
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initializeMobileMenu() {
    // Создаем кнопку мобильного меню если её нет
    createMobileMenuToggle();

    // Находим мобильное меню
    mobileMenu = document.querySelector('.mobile-menu') || createMobileMenu();

    // Обработчики событий
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Закрытие меню при изменении размера экрана
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250));
}

function createMobileMenuToggle() {
    mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

    if (!mobileMenuToggle) {
        const nav = document.querySelector('.nav, nav, header');
        if (nav) {
            mobileMenuToggle = document.createElement('button');
            mobileMenuToggle.className = 'mobile-menu-toggle';
            mobileMenuToggle.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
            nav.appendChild(mobileMenuToggle);
        }
    }
}

function createMobileMenu() {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';

    // Копируем ссылки из основной навигации
    const navLinks = document.querySelectorAll('.nav-link, nav a, header a');
    const menuList = document.createElement('ul');

    navLinks.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            const listItem = document.createElement('li');
            const menuLink = link.cloneNode(true);
            menuLink.addEventListener('click', closeMobileMenu);
            listItem.appendChild(menuLink);
            menuList.appendChild(listItem);
        }
    });

    menu.appendChild(menuList);
    document.body.appendChild(menu);

    return menu;
}

function toggleMobileMenu() {
    if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-label', 'Закрыть меню');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
    document.body.style.overflow = '';
}

// ===== УТИЛИТЫ =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}