(function () {
    // ===== АКТИВАЦИЯ ТЕКУЩЕЙ ССЫЛКИ В НАВИГАЦИИ =====
    // Извлекаем имя текущего HTML-файла из URL (например, "destinations.html")
    const currentPath = window.location.pathname.split("/").pop();
    
    // Выбираем все ссылки навигации
    const links = document.querySelectorAll(".site-nav__link");
    
    // Проходим по каждой ссылке
    links.forEach((link) => {
        // Проверяем, совпадает ли href ссылки с текущим путем
        // Или если путь пустой (главная страница), проверяем на "index.html"
        const isActive =
            link.getAttribute("href") === currentPath ||
            (!currentPath && link.getAttribute("href") === "index.html");
        
        // Если ссылка активна, добавляем класс "is-active" для подсветки
        if (isActive) {
            link.classList.add("is-active");
        }
    });

    // ===== ПЕРЕКЛЮЧЕНИЕ МОБИЛЬНОГО МЕНЮ =====
    // Находим кнопку переключения меню
    const navToggle = document.getElementById("nav-toggle");
    // Находим контейнер ссылок навигации
    const navLinks = document.getElementById("nav-links");
    
    // Проверяем, что оба элемента существуют на странице
    if (navToggle && navLinks) {
        // Добавляем обработчик клика на кнопку
        navToggle.addEventListener("click", () => {
            // Переключаем класс "is-open" на контейнере ссылок (показываем/скрываем меню)
            const isOpen = navLinks.classList.toggle("is-open");
            // Обновляем атрибут aria-expanded для доступности (screen readers)
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    // ===== АВТОМАТИЧЕСКОЕ ОТОБРАЖЕНИЕ ТЕКУЩЕГО ГОДА В ФУТЕРЕ =====
    // Находим элемент для отображения года
    const yearEl = document.getElementById("year");
    
    // Если элемент существует, вставляем текущий год
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ===== ЛОГИКА КАРУСЕЛИ (ТОЛЬКО ДЛЯ DESTINATIONS.HTML) =====
    // Находим трек карусели (контейнер с карточками)
    const carouselTrack = document.getElementById("carouselTrack");
    // Находим кнопку "Предыдущая"
    const prevBtn = document.getElementById("prevBtn");
    // Находим кнопку "Следующая"
    const nextBtn = document.getElementById("nextBtn");
    // Находим контейнер для индикаторов-точек
    const indicatorsContainer = document.getElementById("indicators");

    // Проверяем, что все элементы карусели существуют (т.е. мы на destinations.html)
    if (carouselTrack && prevBtn && nextBtn && indicatorsContainer) {
        // Количество карточек, видимых одновременно
        const itemsPerView = 3;
        
        // Выбираем все карточки внутри трека
        const items = carouselTrack.querySelectorAll(".carousel-item");
        
        // Общее количество карточек
        const totalItems = items.length;
        
        // Текущий индекс (позиция карусели), начинаем с 0
        let currentIndex = 0;

        // ===== СОЗДАНИЕ ИНДИКАТОРОВ-ТОЧЕК =====
        // Количество точек = totalItems - itemsPerView + 1
        // Например: 6 карточек - 3 видимых + 1 = 4 точки (позиции: 0, 1, 2, 3)
        for (let i = 0; i < totalItems - itemsPerView + 1; i++) {
            // Создаем кнопку-точку
            const dot = document.createElement("button");
            // Добавляем класс для стилизации
            dot.classList.add("carousel-dot");
            // Первая точка активна по умолчанию
            if (i === 0) dot.classList.add("active");
            // Устанавливаем aria-label для доступности
            dot.setAttribute("aria-label", `Перейти на карточку ${i + 1}`);
            // Добавляем обработчик клика (переход к указанной позиции)
            dot.addEventListener("click", () => goToSlide(i));
            // Вставляем точку в контейнер индикаторов
            indicatorsContainer.appendChild(dot);
        }

        // ===== ФУНКЦИЯ ОБНОВЛЕНИЯ КАРУСЕЛИ =====
        // Перерисовывает карусель после изменения currentIndex
        function updateCarousel() {
            // Вычисляем ширину одной "страницы" в процентах (100% / 3 = 33.333%)
            const itemWidth = 100 / itemsPerView;
            
            // Вычисляем смещение трека в процентах
            // Например: currentIndex=1 → offset=33.333% (сдвиг на 1 карточку влево)
            const offset = currentIndex * itemWidth;
            
            // Применяем CSS transform для сдвига трека
            carouselTrack.style.transform = `translateX(-${offset}%)`;

            // Обновляем активную точку-индикатор
            const dots = indicatorsContainer.querySelectorAll(".carousel-dot");
            dots.forEach((dot, idx) => {
                // Добавляем класс "active" только к точке с индексом currentIndex
                dot.classList.toggle("active", idx === currentIndex);
            });

            // Отключаем кнопки на краях карусели
            prevBtn.disabled = currentIndex === 0; // Отключаем "Предыдущая" в начале
            nextBtn.disabled = currentIndex >= totalItems - itemsPerView; // Отключаем "Следующая" в конце
        }

        // ===== ФУНКЦИЯ ПЕРЕХОДА К ОПРЕДЕЛЕННОЙ ПОЗИЦИИ =====
        // Вызывается при клике на точку-индикатор
        function goToSlide(index) {
            // Ограничиваем индекс диапазоном [0, totalItems - itemsPerView]
            currentIndex = Math.max(0, Math.min(index, totalItems - itemsPerView));
            // Обновляем отображение карусели
            updateCarousel();
        }

        // ===== ОБРАБОТЧИК КНОПКИ "ПРЕДЫДУЩАЯ" =====
        prevBtn.addEventListener("click", () => {
            // Если не в начале, уменьшаем индекс
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // ===== ОБРАБОТЧИК КНОПКИ "СЛЕДУЮЩАЯ" =====
        nextBtn.addEventListener("click", () => {
            // Если не в конце, увеличиваем индекс
            if (currentIndex < totalItems - itemsPerView) {
                currentIndex++;
                updateCarousel();
            }
        });

        // ===== КЛАВИАТУРНАЯ НАВИГАЦИЯ =====
        // Слушаем нажатия клавиш по всему документу
        document.addEventListener("keydown", (e) => {
            // Стрелка влево → имитируем клик на кнопку "Предыдущая"
            if (e.key === "ArrowLeft") prevBtn.click();
            // Стрелка вправо → имитируем клик на кнопку "Следующая"
            if (e.key === "ArrowRight") nextBtn.click();
        });

        // Вызываем updateCarousel() при загрузке для инициализации состояния
        updateCarousel();
    }

    // ===== КЛАСС ДЛЯ ПРЕДСТАВЛЕНИЯ ДАННЫХ ФОРМЫ =====
    // Создает объект с данными, отправленными через форму обратной связи
    class Submission {
        constructor({ fullName, email, travelStyle, notes, consent }) {
            this.fullName = fullName; // Имя и фамилия
            this.email = email; // Email
            this.travelStyle = travelStyle; // Стиль путешествия (выбор из select)
            this.notes = notes || "Без комментариев"; // Комментарии (или значение по умолчанию)
            this.consent = consent; // Согласие на обработку данных (true/false)
            this.timestamp = new Date(); // Текущая дата и время
        }

        // ===== МЕТОД ДЛЯ ВЫВОДА ДАННЫХ В КОНСОЛЬ =====
        // Форматирует данные и выводит их в console.log
        logFormatted() {
            const info = `
------------ TravelRu submission ------------
Имя: ${this.fullName}
Email: ${this.email}
Стиль: ${this.travelStyle}
Комментарий: ${this.notes}
Согласие: ${this.consent ? "да" : "нет"}
Дата: ${this.timestamp.toLocaleString("ru-RU")}
---------------------------------------------`;
            console.log(info);
        }
    }

    // ===== ОБРАБОТКА ФОРМЫ ОБРАТНОЙ СВЯЗИ (FEEDBACK.HTML) =====
    // Находим форму по ID
    const form = document.getElementById("travel-form");
    
    // Проверяем, что форма существует на странице
    if (form) {
        // Добавляем обработчик события submit (отправка формы)
        form.addEventListener("submit", (event) => {
            // Предотвращаем стандартное поведение (перезагрузку страницы)
            event.preventDefault();
            
            // Собираем данные формы через FormData API
            const formData = new FormData(form);
            
            // Создаем объект Submission с данными формы
            const submission = new Submission({
                fullName: formData.get("fullName")?.trim(), // Имя (убираем пробелы)
                email: formData.get("email")?.trim(), // Email (убираем пробелы)
                travelStyle: formData.get("travelStyle"), // Стиль путешествия
                notes: formData.get("notes"), // Комментарии
                consent: formData.get("consent") === "on", // Чекбокс (преобразуем "on" в true)
            });
            
            // Выводим данные в консоль через метод logFormatted()
            submission.logFormatted();
            
            // Сбрасываем форму (очищаем все поля)
            form.reset();
            
            // Показываем уведомление пользователю
            alert("Спасибо! Куратор свяжется с вами в ближайшее время.");
        });
    }
})();
