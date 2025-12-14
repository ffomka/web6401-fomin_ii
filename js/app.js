(function () {
  // ===== АКТИВАЦИЯ ТЕКУЩЕЙ ССЫЛКИ В НАВИГАЦИИ =====
  const currentPath = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".site-nav__link");
  links.forEach((link) => {
    const isActive =
      link.getAttribute("href") === currentPath ||
      (!currentPath && link.getAttribute("href") === "index.html");
    if (isActive) {
      link.classList.add("is-active");
    }
  });

  // ===== ПЕРЕКЛЮЧЕНИЕ МОБИЛЬНОГО МЕНЮ =====
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // ===== АВТОМАТИЧЕСКОЕ ОТОБРАЖЕНИЕ ТЕКУЩЕГО ГОДА В ФУТЕРЕ =====
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== ЛОГИКА КАРУСЕЛИ (ТОЛЬКО ДЛЯ DESTINATIONS.HTML) =====
  const carouselTrack = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const indicatorsContainer = document.getElementById("indicators");

  if (carouselTrack && prevBtn && nextBtn && indicatorsContainer) {
    const itemsPerView = 3;
    const items = carouselTrack.querySelectorAll(".carousel-item");
    const totalItems = items.length;
    let currentIndex = 0;

    // ===== СОЗДАНИЕ ИНДИКАТОРОВ-ТОЧЕК =====
    for (let i = 0; i < totalItems - itemsPerView + 1; i++) {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      if (i === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Перейти на карточку ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i));
      indicatorsContainer.appendChild(dot);
    }

    // ===== ФУНКЦИЯ ОБНОВЛЕНИЯ КАРУСЕЛИ =====
    function updateCarousel() {
      const itemWidth = 100 / itemsPerView;
      const offset = currentIndex * itemWidth;
      carouselTrack.style.transform = `translateX(-${offset}%)`;

      const dots = indicatorsContainer.querySelectorAll(".carousel-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
      });

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= totalItems - itemsPerView;
    }

    // ===== ФУНКЦИЯ ПЕРЕХОДА К ОПРЕДЕЛЕННОЙ ПОЗИЦИИ =====
    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, totalItems - itemsPerView));
      updateCarousel();
    }

    // ===== ОБРАБОТЧИК КНОПКИ "ПРЕДЫДУЩАЯ" =====
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    // ===== ОБРАБОТЧИК КНОПКИ "СЛЕДУЮЩАЯ" =====
    nextBtn.addEventListener("click", () => {
      if (currentIndex < totalItems - itemsPerView) {
        currentIndex++;
        updateCarousel();
      }
    });

    // ===== КЛАВИАТУРНАЯ НАВИГАЦИЯ =====
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prevBtn.click();
      if (e.key === "ArrowRight") nextBtn.click();
    });

    updateCarousel();
  }

  // ===== ВАЛИДАЦИЯ ФОРМЫ =====
  /**
   * Валидирует имя и фамилию
   * Требования: минимум 2 слова, от 3 символов каждое
   */
  function validateFullName(value) {
    const trimmed = value.trim();
    const parts = trimmed.split(/\s+/);

    if (!trimmed) {
      return {
        valid: false,
        message: "Пожалуйста, введите имя и фамилию",
      };
    }

    if (parts.length < 2) {
      return {
        valid: false,
        message: "Требуется минимум 2 слова (имя и фамилия)",
      };
    }

    if (parts[0].length < 3 || parts[1].length < 3) {
      return {
        valid: false,
        message: "Каждое слово должно содержать минимум 3 буквы",
      };
    }

    return {
      valid: true,
      message: "✓ Имя и фамилия правильные",
    };
  }

  /**
   * Валидирует email
   */
  function validateEmail(value) {
    const email = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return {
        valid: false,
        message: "Пожалуйста, введите email",
      };
    }

    if (!emailRegex.test(email)) {
      return {
        valid: false,
        message: "Email должен быть в формате: example@domain.com",
      };
    }

    return {
      valid: true,
      message: "✓ Email валиден",
    };
  }

  /**
   * Валидирует, что выбран стиль путешествия
   */
  function validateTravelStyle(value) {
    if (!value || value === "") {
      return {
        valid: false,
        message: "Пожалуйста, выберите стиль путешествия",
      };
    }

    return {
      valid: true,
      message: "✓ Стиль выбран",
    };
  }

  /**
   * Обновляет UI поля при изменении валидности
   */
  function updateFieldUI(field, isValid, message) {
    const hint = field.parentElement.querySelector(".feedback-form__hint");

    if (isValid) {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      if (hint) {
        hint.textContent = message;
        hint.classList.remove("is-error");
        hint.classList.add("is-success");
      }
    } else {
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
      if (hint) {
        hint.textContent = message;
        hint.classList.remove("is-success");
        hint.classList.add("is-error");
      }
    }
  }

  // ===== КЛАСС ДЛЯ ПРЕДСТАВЛЕНИЯ ДАННЫХ ФОРМЫ =====
  class Submission {
    constructor({ fullName, email, travelStyle, notes, consent }) {
      this.fullName = fullName;
      this.email = email;
      this.travelStyle = travelStyle;
      this.notes = notes || "Без комментариев";
      this.consent = consent;
      this.timestamp = new Date();
    }

    // ===== МЕТОД ДЛЯ ВЫВОДА ДАННЫХ В КОНСОЛЬ =====
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

    // ===== МЕТОД ДЛЯ ПРЕОБРАЗОВАНИЯ В JSON =====
    toJSON() {
      return {
        fullName: this.fullName,
        email: this.email,
        travelStyle: this.travelStyle,
        notes: this.notes,
        consent: this.consent,
        timestamp: this.timestamp.toISOString(),
      };
    }
  }

  // ===== ОБРАБОТКА ФОРМЫ ОБРАТНОЙ СВЯЗИ =====
  const form = document.getElementById("travel-form");

  if (form) {
    const fullNameInput = form.querySelector('input[name="fullName"]');
    const emailInput = form.querySelector('input[name="email"]');
    const travelStyleInput = form.querySelector('select[name="travelStyle"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    // ===== ТРЕБОВАНИЕ 1: LIVE-ВАЛИДАЦИЯ ПРИ ВВОДЕ =====

    // Валидация имени при вводе
    if (fullNameInput) {
      fullNameInput.addEventListener("input", (e) => {
        const result = validateFullName(e.target.value);
        updateFieldUI(e.target, result.valid, result.message);
      });

      // Сразу проверяем при загрузке, если поле содержит данные
      fullNameInput.addEventListener("blur", (e) => {
        const result = validateFullName(e.target.value);
        updateFieldUI(e.target, result.valid, result.message);
      });
    }

    // Валидация email при вводе
    if (emailInput) {
      emailInput.addEventListener("input", (e) => {
        const result = validateEmail(e.target.value);
        updateFieldUI(e.target, result.valid, result.message);
      });

      emailInput.addEventListener("blur", (e) => {
        const result = validateEmail(e.target.value);
        updateFieldUI(e.target, result.valid, result.message);
      });
    }

    // Валидация стиля путешествия при изменении
    if (travelStyleInput) {
      travelStyleInput.addEventListener("change", (e) => {
        const result = validateTravelStyle(e.target.value);
        updateFieldUI(e.target, result.valid, result.message);
      });
    }

    // ===== ТРЕБОВАНИЕ 2: POST-ОТПРАВКА НА СЕРВЕР =====
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Проверяем валидность всех полей перед отправкой
      const fullNameResult = validateFullName(fullNameInput?.value || "");
      const emailResult = validateEmail(emailInput?.value || "");
      const travelStyleResult = validateTravelStyle(travelStyleInput?.value || "");

      // Обновляем UI для всех полей
      if (fullNameInput) updateFieldUI(fullNameInput, fullNameResult.valid, fullNameResult.message);
      if (emailInput) updateFieldUI(emailInput, emailResult.valid, emailResult.message);
      if (travelStyleInput) updateFieldUI(travelStyleInput, travelStyleResult.valid, travelStyleResult.message);

      // Если есть ошибки, не отправляем
      if (!fullNameResult.valid || !emailResult.valid || !travelStyleResult.valid) {
        showErrorNotification("⚠️ Пожалуйста, заполните все поля корректно");
        return;
      }

      // Собираем данные формы
      const formData = new FormData(form);
      const submission = new Submission({
        fullName: formData.get("fullName")?.trim(),
        email: formData.get("email")?.trim(),
        travelStyle: formData.get("travelStyle"),
        notes: formData.get("notes"),
        consent: formData.get("consent") === "on",
      });

      // Выводим в консоль
      submission.logFormatted();

      // Отправляем POST-запрос на сервер
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Отправка...";

        const response = await fetch('http://localhost:3000/api/submit-feedback', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission.toJSON()),
        });

        if (response.ok) {
          showSuccessNotification("✓ Спасибо! Куратор свяжется с вами в ближайшее время.");
          form.reset();

          // Очищаем классы валидации после успешной отправки
          form.querySelectorAll(".feedback-form__input").forEach((input) => {
            input.classList.remove("is-valid", "is-invalid");
            const hint = input.parentElement.querySelector(".feedback-form__hint");
            if (hint) hint.textContent = "";
          });

          submitBtn.textContent = "Отправить";
        } else {
          const errorData = await response.json().catch(() => ({}));
          showErrorNotification(
            `✗ Ошибка отправки: ${errorData.message || response.statusText}`
          );
          submitBtn.textContent = "Отправить";
        }
      } catch (error) {
        showErrorNotification(`✗ Ошибка сети: ${error.message}`);
        submitBtn.textContent = "Отправить";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // ===== ТРЕБОВАНИЕ 3 И 4: АСИНХРОННЫЙ FETCH МАРШРУТОВ =====
  /**
   * Асинхронно получает список маршрутов с сервера
   * Включает полную обработку ошибок
   */
  async function fetchDestinations() {
    const carouselTrack = document.getElementById("carouselTrack");

    // Если карусели нет на странице, функция не нужна
    if (!carouselTrack) {
      return;
    }

    try {
      console.log("📡 Загружаем маршруты...");

      const response = await fetch("/api/destinations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Сервер вернул пустой или невалидный список маршрутов");
      }

      // Обновляем карусель с новыми данными
      updateCarouselWithData(data);
      console.log("✓ Маршруты загружены успешно:", data.length, "маршрутов");
    } catch (error) {
      console.error("✗ Ошибка при загрузке маршрутов:", error.message);
      showErrorNotification(`Ошибка загрузки маршрутов: ${error.message}`);
    }
  }

  /**
   * Обновляет карусель с новыми данными маршрутов
   */
  function updateCarouselWithData(destinations) {
    const carouselTrack = document.getElementById("carouselTrack");
    if (!carouselTrack) return;

    // Очищаем старые карточки (кроме них может быть дополнительная разметка)
    const oldItems = carouselTrack.querySelectorAll(".carousel-item");
    oldItems.forEach((item) => item.remove());

    // Добавляем новые карточки на основе данных
    destinations.forEach((destination) => {
      const item = document.createElement("div");
      item.className = "carousel-item";
      item.innerHTML = `
        <img 
          src="${destination.image || 'images/placeholder.jpg'}" 
          alt="${destination.name}" 
          class="carousel-item__image"
        />
        <div class="carousel-item__body">
          <h3 class="carousel-item__title">${destination.name || "Маршрут"}</h3>
          <p class="carousel-item__text">${destination.description || "Описание недоступно"}</p>
        </div>
      `;
      carouselTrack.appendChild(item);
    });

    console.log("📋 Карусель обновлена с", destinations.length, "маршрутами");
  }

  // ===== ТРЕБОВАНИЕ 4: ПЕРИОДИЧЕСКОЕ ОБНОВЛЕНИЕ КАЖДЫЕ 5 МИНУТ =====
  // Загружаем маршруты при загрузке страницы
  fetchDestinations();

  // Устанавливаем периодическое обновление (каждые 5 минут = 300000 мс)
  const updateInterval = setInterval(() => {
    console.log("⏰ Периодическое обновление маршрутов (каждые 5 минут)...");
    fetchDestinations();
  }, 5 * 60 * 1000);

  // Опционально: очищаем интервал при выгрузке страницы
  window.addEventListener("beforeunload", () => {
    clearInterval(updateInterval);
  });

  // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ УВЕДОМЛЕНИЙ =====

  /**
   * Показывает уведомление об ошибке
   */
  function showErrorNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification notification--error";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(220, 38, 38, 0.9);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  /**
   * Показывает уведомление об успехе
   */
  function showSuccessNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification notification--success";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(34, 197, 94, 0.9);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Добавляем CSS анимации для уведомлений
  if (!document.querySelector("style[data-notifications]")) {
    const style = document.createElement("style");
    style.setAttribute("data-notifications", "true");
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();