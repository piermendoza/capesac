(function () {
  const phone = "51965003620";
  const maps = {
    "1": "https://www.google.com/maps/d/embed?mid=1_2V07nwncR3SMENPbXf6pA-95JrNtHR7",
    "2": "https://www.google.com/maps/d/u/0/embed?mid=12AMESvKyZL5XH9JMM8eh5A376l2b0S-N",
    "3": "https://www.google.com/maps/d/embed?mid=1MRpZfoxYbimpdY0v9Ny1o9bf7bETGMuC",
    "4": "https://www.google.com/maps/d/embed?mid=1S7MedkmdntUaSA4oqnsS5QknnVTQy46R",
    "5": "https://www.google.com/maps/d/embed?mid=1WO4eMoI2dPcJgI82QlOvL67LTW6jqrsS",
    "6": "https://www.google.com/maps/d/embed?mid=10foe9F2tuHajeQCHHbcbMOxeiNdHaqRa"
  };

  const hotelNames = {
    "1": "Hostal Dluxo",
    "2": "Hostal Tu y Yo",
    "3": "Hostal Emporio",
    "4": "Hotel Urban 901",
    "5": "Hostal La Parada",
    "6": "Hostal Costa Azul",
    "7": "Hostal Conquistador"
  };

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = (modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  const whatsapp = (text) => {
    window.open("https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(text), "_blank", "noopener");
  };

  const formatDate = (value) => value ? value.replace("T", " ") : "";
  const toDateTimeInputValue = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  };
  const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);
  const startOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  document.querySelector(".nav-toggle").addEventListener("click", function () {
    const nav = document.querySelector(".site-nav");
    const expanded = nav.classList.toggle("is-open");
    this.setAttribute("aria-expanded", expanded ? "true" : "false");
  });

  const bookingBand = document.getElementById("reservar");
  const stickyBookingQuery = window.matchMedia("(min-width: 761px)");
  const updateStickyBooking = () => {
    if (!bookingBand || !stickyBookingQuery.matches) {
      document.body.classList.remove("reserve-is-sticky");
      return;
    }
    document.body.classList.toggle("reserve-is-sticky", window.scrollY >= bookingBand.offsetTop - 1);
  };

  updateStickyBooking();
  window.addEventListener("scroll", updateStickyBooking, { passive: true });
  window.addEventListener("resize", updateStickyBooking);
  if (stickyBookingQuery.addEventListener) {
    stickyBookingQuery.addEventListener("change", updateStickyBooking);
  } else {
    stickyBookingQuery.addListener(updateStickyBooking);
  }

  const hotelSelect = document.getElementById("hs");
  const arrivalInput = document.getElementById("ini");
  const departureInput = document.getElementById("fin");

  const updateDateLimits = () => {
    const now = new Date();
    const today = startOfToday();
    const minArrival = toDateTimeInputValue(today);
    arrivalInput.min = minArrival;

    if (!arrivalInput.value || new Date(arrivalInput.value) < today) {
      arrivalInput.value = toDateTimeInputValue(now);
    }

    const arrivalDate = new Date(arrivalInput.value);
    const minDeparture = toDateTimeInputValue(addMinutes(arrivalDate, 360));
    departureInput.min = minDeparture;

    if (departureInput.value && new Date(departureInput.value) < addMinutes(arrivalDate, 360)) {
      departureInput.value = "";
    }
  };

  updateDateLimits();
  window.setInterval(updateDateLimits, 60000);
  arrivalInput.addEventListener("change", updateDateLimits);

  const selectHotel = (hotelId) => {
    if (hotelId && hotelSelect.value !== hotelId) {
      hotelSelect.value = hotelId;
    }
  };

  document.querySelectorAll(".hotel-feature").forEach((card) => {
    const reserveButton = card.querySelector("[data-reserve]");
    if (!reserveButton) return;
    const hotelId = reserveButton.dataset.reserve;
    card.addEventListener("mouseenter", () => selectHotel(hotelId));
    card.addEventListener("focusin", () => selectHotel(hotelId));
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const reserveButton = visible.target.querySelector("[data-reserve]");
      selectHotel(reserveButton && reserveButton.dataset.reserve);
    }, {
      rootMargin: "-42% 0px -38% 0px",
      threshold: [0.25, 0.45, 0.65]
    });

    document.querySelectorAll(".hotel-feature").forEach((card) => observer.observe(card));
  }

  document.querySelectorAll("[data-action='contact']").forEach((button) => {
    button.addEventListener("click", () => openModal("contactModal"));
  });

  document.querySelectorAll("[data-action='checking']").forEach((button) => {
    button.addEventListener("click", () => openModal("checkingModal"));
  });

  document.querySelectorAll("[data-map]").forEach((button) => {
    button.addEventListener("click", () => {
      const frame = document.getElementById("mapFrame");
      frame.src = maps[button.dataset.map] || "";
      openModal("mapModal");
    });
  });

  document.querySelectorAll("[data-reserve]").forEach((button) => {
    button.addEventListener("click", () => {
      selectHotel(button.dataset.reserve);
      document.getElementById("reservar").scrollIntoView({ behavior: "smooth", block: "start" });
      hotelSelect.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.matches("[data-close]")) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.is-open").forEach(closeModal);
    }
  });

  document.getElementById("bookingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    updateDateLimits();
    const hotel = hotelSelect.value;
    const arrival = arrivalInput.value;
    const departure = departureInput.value;

    if (!hotel || !arrival || !departure) {
      alert("Selecciona una sede y fechas validas.");
      return;
    }

    if (new Date(arrival) < startOfToday()) {
      alert("La fecha de llegada debe ser hoy o una fecha futura.");
      updateDateLimits();
      arrivalInput.focus();
      return;
    }

    if (new Date(departure) < addMinutes(new Date(arrival), 360)) {
      alert("La fecha de salida debe ser al menos 6 horas posterior a la llegada.");
      departureInput.focus();
      return;
    }

    whatsapp("Hola Grupo Capesac, quiero hacer una reserva.\nEstablecimiento: " + hotelNames[hotel] + "\nLlegada: " + formatDate(arrival) + "\nSalida: " + formatDate(departure));
  });

  document.getElementById("contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    whatsapp("Hola Grupo Capesac, tengo una consulta.\nNombre: " + data.get("name") + "\nTelefono: " + data.get("phone") + "\nCorreo: " + (data.get("email") || "-") + "\nMensaje: " + data.get("message"));
  });

  document.getElementById("checkingForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const result = document.getElementById("checkingResult");
    const data = new FormData(event.currentTarget);
    result.textContent = "Verificando...";

    try {
      const params = new URLSearchParams({ doc: data.get("doc"), code: data.get("code") });
      const response = await fetch("https://farbe.capesac.com.pe/tipo?" + params.toString());
      const json = await response.json();
      result.textContent = json.msj || "Solicitud procesada.";
    } catch (error) {
      result.textContent = "No se pudo verificar en este momento. Escribenos por WhatsApp para ayudarte.";
    }
  });
})();
