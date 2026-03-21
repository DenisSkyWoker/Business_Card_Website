// =========================================
// СТОК2 — Основной JavaScript
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Мобильное меню
    // =========================================
    const burgerBtn = document.querySelector('.header-burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const burgerIcon = burgerBtn?.querySelector('.fa-bars');
    const closeIcon = burgerBtn?.querySelector('.fa-times');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            burgerBtn.classList.toggle('active');
            if (burgerIcon) burgerIcon.style.display = burgerIcon.style.display === 'none' ? 'block' : 'none';
            if (closeIcon) closeIcon.style.display = closeIcon.style.display === 'none' ? 'block' : 'none';
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                burgerBtn.classList.remove('active');
                if (burgerIcon) burgerIcon.style.display = 'block';
                if (closeIcon) closeIcon.style.display = 'none';
                document.body.style.overflow = '';
            });
        });
    }

    // =========================================
    // Выпадающее меню услуг
    // =========================================
    const servicesDropdown = document.querySelector('.dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (servicesDropdown && dropdownMenu) {
        const handleDropdown = () => {
            servicesDropdown.replaceWith(servicesDropdown.cloneNode(true));
            const newDropdown = document.querySelector('.dropdown');
            const newDropdownMenu = document.querySelector('.dropdown-menu');

            if (window.innerWidth <= 992) {
                newDropdown.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.classList.toggle('active');
                    newDropdownMenu.classList.toggle('show');
                });
            } else {
                newDropdown.addEventListener('mouseenter', function() {
                    this.classList.add('active');
                    newDropdownMenu.classList.add('show');
                });
                newDropdown.addEventListener('mouseleave', function() {
                    this.classList.remove('active');
                    newDropdownMenu.classList.remove('show');
                });
            }
        };

        handleDropdown();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleDropdown, 250);
        });

        document.addEventListener('click', function(e) {
            const currentDropdown = document.querySelector('.dropdown');
            const currentMenu = document.querySelector('.dropdown-menu');
            if (currentDropdown && currentMenu && !currentDropdown.contains(e.target)) {
                currentDropdown.classList.remove('active');
                currentMenu.classList.remove('show');
            }
        });
    }

    // =========================================
    // Хедер при скролле
    // =========================================
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // =========================================
    // Модальные окна
    // =========================================
    const modalBtns = document.querySelectorAll('[data-modal-btn]');
    const modals = document.querySelectorAll('.modal');

    modalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('href');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    document.querySelectorAll('.modal-close, .modal-overlay').forEach(close => {
        close.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });

    // =========================================
    // Модальное окно контактов
    // =========================================
    const contactModal = document.getElementById('contactModal');
    const contactModalClose = document.getElementById('contactModalClose');
    const contactModalBooking = document.getElementById('contactModalBooking');
    const contactModalTriggers = document.querySelectorAll('[data-contact-modal]');

    if (contactModalTriggers.length > 0) {
        contactModalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                if (contactModal) {
                    contactModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    function closeContactModal() {
        if (contactModal) {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (contactModalClose) {
        contactModalClose.addEventListener('click', closeContactModal);
    }

    if (contactModal && contactModal.querySelector('.contact-modal-overlay')) {
        contactModal.querySelector('.contact-modal-overlay').addEventListener('click', closeContactModal);
    }

    if (contactModalBooking) {
        contactModalBooking.addEventListener('click', () => {
            closeContactModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
            closeContactModal();
        }
    });

    // =========================================
    // Кнопка Наверх
    // =========================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // Анимация счётчиков
    // =========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = target >= 100 ? '%' : '+';
            let count = 0;
            const increment = target / 60;
            const duration = 2000;
            const stepTime = duration / 60;

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count) + suffix;
                    setTimeout(updateCount, stepTime);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCount();
        });
    }

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        let countersAnimated = false;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // =========================================
    // Анимация появления при скролле
    // =========================================
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        fadeObserver.observe(el);
    });

    // =========================================
    // Лайтбокс для галереи
    // =========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg && lightboxCaption) {
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('click', () => {
                lightbox.classList.add('show');
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt;
                document.body.style.overflow = 'hidden';
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('show');
                document.body.style.overflow = '';
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // =========================================
    // Чат-бот
    // =========================================
    const chatbot = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotHeader = document.querySelector('.chatbot-header');
    const closeChat = document.querySelector('.close-chat');
    const chatbotBody = document.getElementById('chatbotBody');
    const chatInput = document.getElementById('chatInput');

    let waitingForPhone = false;

    function toggleChat() {
        if (chatbot) chatbot.classList.toggle('show');
    }

    if (chatbotToggle) chatbotToggle.addEventListener('click', toggleChat);
    if (chatbotHeader) chatbotHeader.addEventListener('click', toggleChat);
    if (closeChat) closeChat.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleChat();
    });

    function sendQuickMessage(message) {
        if (!chatbotBody) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `<p>${message}</p>`;
        chatbotBody.insertBefore(userMsg, chatbotBody.querySelector('.chat-options'));

        if (waitingForPhone) {
            const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

            if (phoneRegex.test(message.replace(/\s/g, ''))) {
                fetch('send.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        action: 'manager_request',
                        phone: message
                    })
                })
                    .then(response => response.json())
                    .then(data => console.log('Заявка менеджеру отправлена:', data))
                    .catch(err => console.error('Ошибка отправки:', err));

                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'chat-message bot';
                    botMsg.innerHTML = `<p>✅ Спасибо! Менеджер свяжется с вами по номеру ${message} в течение 5 минут.</p>`;
                    chatbotBody.insertBefore(botMsg, chatbotBody.querySelector('.chat-options'));
                    chatbotBody.scrollTop = chatbotBody.scrollHeight;
                }, 600);

                waitingForPhone = false;
            } else {
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'chat-message bot';
                    botMsg.innerHTML = `<p>❌ Пожалуйста, введите корректный номер телефона (например: +7 999 000-00-00)</p>`;
                    chatbotBody.insertBefore(botMsg, chatbotBody.querySelector('.chat-options'));
                    chatbotBody.scrollTop = chatbotBody.scrollHeight;
                }, 600);
            }
            return;
        }

        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            let response = '';
            let customHtml = false;

            if (message.includes('цену') || message.includes('💰')) {
                response = 'Для точного расчёта пришлите фото повреждений в ';
                botMsg.innerHTML = `<p>${response}<a href="https://t.me/Abramo180" target="_blank" class="telegram-link">Telegram <i class="fab fa-telegram-plane"></i></a></p>`;
                customHtml = true;
            } else if (message.includes('Записаться') || message.includes('📅')) {
                response = 'Вы можете записаться через форму выше или позвонить нам!';
            } else if (message.includes('Адрес') || message.includes('📍')) {
                response = 'г. Омск, ул. 3-я Островская, стр. 2А, корп. 5';
            } else if (message.includes('менеджером') || message.includes('Менеджер') || message.includes('📞')) {
                response = 'Пожалуйста, введите ваш номер телефона для связи с менеджером (например: +7 999 000-00-00)';
                waitingForPhone = true;
            } else {
                response = 'Сейчас соединю с менеджером. Ожидайте звонка!';
            }

            if (!customHtml) {
                botMsg.innerHTML = `<p>${response}</p>`;
            }

            chatbotBody.insertBefore(botMsg, chatbotBody.querySelector('.chat-options'));
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 600);
    }

    document.querySelectorAll('[data-chat-message]').forEach(btn => {
        btn.addEventListener('click', () => {
            sendQuickMessage(btn.getAttribute('data-chat-message'));
        });
    });

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim()) {
                sendQuickMessage(chatInput.value.trim());
                chatInput.value = '';
            }
        });
    }

    // =========================================
    // Формы - ОТПРАВКА В TELEGRAM
    // =========================================
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        const photoInput = document.getElementById('photoInput');
        const fileName = document.getElementById('fileName');

        if (photoInput && fileName) {
            photoInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    fileName.textContent = this.files[0].name;
                    fileName.style.color = 'var(--primary-color)';
                } else {
                    fileName.textContent = 'Файл не выбран';
                    fileName.style.color = 'var(--gray-500)';
                }
            });
        }

        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Отправка...';
            btn.disabled = true;

            const formData = new FormData(this);

            try {
                console.log('📤 Отправка данных с файлом...');

                const response = await fetch('send.php', {
                    method: 'POST',
                    body: formData
                });

                const text = await response.text();
                console.log('📥 Ответ сервера:', text);

                let result;
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    throw new Error('Сервер вернул не JSON: ' + text.substring(0, 100));
                }

                if (response.ok && result.status === 'success') {
                    alert('✅ Спасибо! Вы записаны. Мы подтвердим запись в течение 5 минут.');
                    this.reset();
                    if (fileName) {
                        fileName.textContent = 'Файл не выбран';
                        fileName.style.color = 'var(--gray-500)';
                    }
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
                alert('❌ Ошибка: ' + error.message + '\n\nПожалуйста, позвоните нам.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    const modalForm = document.getElementById('modalForm');
    if (modalForm) {
        modalForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.querySelector('span').innerText;
            btn.querySelector('span').innerText = 'Отправка...';
            btn.disabled = true;

            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone')
            };

            try {
                const response = await fetch('send.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(data)
                });

                const text = await response.text();
                let result;
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    throw new Error('Сервер вернул не JSON: ' + text.substring(0, 100));
                }

                if (response.ok && result.status === 'success') {
                    alert('✅ Спасибо! Мы перезвоним в течение 15 минут.');
                    this.reset();
                    document.getElementById('formModal').classList.remove('active');
                    document.body.style.overflow = '';
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                console.error('❌ Ошибка:', error);
                alert('❌ Ошибка: ' + error.message);
            } finally {
                btn.querySelector('span').innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // =========================================
    // FAQ аккордеон
    // =========================================
    document.querySelectorAll('.faq-item__title').forEach(title => {
        title.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });

            item.classList.toggle('active', !isActive);
        });
    });

    // =========================================
    // Cookie баннер
    // =========================================
    function acceptCookies() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        }
    }

    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        if (localStorage.getItem('cookiesAccepted') === 'true') {
            cookieBanner.classList.remove('show');
        } else {
            cookieBanner.classList.add('show');
        }

        const acceptBtn = document.getElementById('acceptCookiesBtn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCookies);
        }
    }

    // =========================================
    // Swiper отзывы
    // =========================================
    if (typeof Swiper !== 'undefined') {
        new Swiper('.home-reviews__slider', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            navigation: {
                nextEl: '.home-reviews__next',
                prevEl: '.home-reviews__prev',
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    // =========================================
    // Плавный скролл к якорям
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // =========================================
    // Активный пункт меню при скролле
    // =========================================
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 200;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.header-nav a[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }, { passive: true });

    // =========================================
    // Актуальный год в футере
    // =========================================
    const footerYear = document.querySelector('.footer-copy');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace(/© \d{4}/, `© ${currentYear}`);
    }

    console.log('✅ СТОК2 — Сайт загружен успешно!');
});