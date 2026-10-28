(() => {
  const WHATSAPP_NUMBER = "966562752902";
  const form = document.querySelector("#booking-form");
  if (!form) return;

  const status = document.querySelector("#booking-status");
  const date = form.elements.date;
  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  const minimumDate = localToday.toISOString().slice(0, 10);

  function toWesternDigits(value) {
    return value
      .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));
  }

  function formatUsDateInput(field) {
    const cursor = field.selectionStart ?? field.value.length;
    const digitsBeforeCursor = toWesternDigits(field.value.slice(0, cursor)).replace(/\D/g, "").length;
    const digits = toWesternDigits(field.value).replace(/\D/g, "").slice(0, 8);
    let value = digits.slice(0, 2);
    if (digits.length > 2) value += `/${digits.slice(2, 4)}`;
    if (digits.length > 4) value += `/${digits.slice(4)}`;
    field.value = value;

    const nextCursor = digitsBeforeCursor + (digitsBeforeCursor > 2 ? 1 : 0) + (digitsBeforeCursor > 4 ? 1 : 0);
    field.setSelectionRange(nextCursor, nextCursor);
  }

  function parseUsDate(value) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if (!match) return null;
    const [, monthText, dayText, yearText] = match;
    const month = Number(monthText);
    const day = Number(dayText);
    const year = Number(yearText);
    const candidate = new Date(year, month - 1, day);
    if (
      candidate.getFullYear() !== year ||
      candidate.getMonth() !== month - 1 ||
      candidate.getDate() !== day
    ) return null;
    return `${yearText}-${monthText}-${dayText}`;
  }

  const queryService = new URLSearchParams(window.location.search).get("service");
  if (queryService) {
    const aliases = {
      "النظافة بعد البناء": "النظافة التأهيلية بعد البناء والتشطيب",
      "غسيل الأرضيات": "غسيل وتلميع الأرضيات والبلاط والرخام",
      "تنظيف الخزانات": "تنظيف وغسيل الخزانات الأرضية والعلوية",
      "تنظيف المكيفات": "غسيل وتنظيف وصيانة المكيفات",
    };
    const option = [...form.elements.service.options].find(
      (item) =>
        item.text === queryService ||
        item.value === queryService ||
        item.text.includes(queryService) ||
        item.text === aliases[queryService],
    );
    if (option) form.elements.service.value = option.value;
  }

  const labels = {
    name: "الاسم الكامل",
    phone: "رقم الجوال",
    service: "الخدمة المطلوبة",
    city: "المدينة أو الموقع",
    property: "نوع العقار",
    date: "التاريخ المفضل",
    time: "الوقت المفضل",
  };

  function validate() {
    let firstInvalid = null;
    for (const field of form.querySelectorAll("[required]")) {
      field.setCustomValidity("");
      const value = field.value.trim();
      let message = "";
      if (!value) message = `يرجى إدخال ${labels[field.name] || "هذه المعلومة"}.`;
      if (field.name === "phone" && value) {
        const normalized = value.replace(/[\s()-]/g, "");
        if (!/^(?:05\d{8}|(?:\+?966)5\d{8})$/.test(normalized)) {
          message = "أدخل رقم جوال سعوديًا صحيحًا يبدأ بـ 05 أو +9665.";
        }
      }
      if (field.name === "date" && value) {
        const parsedDate = parseUsDate(value);
        if (!parsedDate) message = "أدخل تاريخًا صحيحًا بصيغة MM/DD/YYYY.";
        else if (parsedDate < minimumDate) message = "اختر تاريخًا اليوم أو بعده.";
      }
      field.setCustomValidity(message);
      field.classList.toggle("input-error", Boolean(message));
      const error = document.querySelector(`#${field.id}-error`);
      if (error) error.textContent = message;
      if (message && !firstInvalid) firstInvalid = field;
    }
    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  form.addEventListener("input", (event) => {
    const field = event.target;
    if (!field.matches("input,select,textarea")) return;
    if (field === date) formatUsDateInput(field);
    field.setCustomValidity("");
    field.classList.remove("input-error");
    const error = document.querySelector(`#${field.id}-error`);
    if (error) error.textContent = "";
    status.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    if (!validate()) return;

    const rows = [
      ["الاسم", form.elements.name.value.trim()],
      ["الجوال", form.elements.phone.value.trim()],
      ["الخدمة", form.elements.service.value],
      ["الموقع", form.elements.city.value.trim()],
      ["نوع العقار", form.elements.property.value],
      ["التاريخ المفضل", form.elements.date.value],
      ["الوقت المفضل", form.elements.time.value],
    ];
    const optionalDetails = [
      ["عدد الأدوار", form.elements.floorCount.value],
      ["عدد الغرف", form.elements.roomCount.value],
      ["عدد دورات المياه", form.elements.bathroomCount.value],
      ["عدد مقاعد الكنب", form.elements.sofaSeats.value],
      ["عدد قطع السجاد أو الموكيت", form.elements.carpetCount.value],
      ["المساحة التقريبية (م²)", form.elements.areaSize.value],
    ];
    rows.push(...optionalDetails.filter(([, value]) => value.trim()));
    const notes = form.elements.notes.value.trim();
    if (notes) rows.push(["تفاصيل إضافية", notes]);

    const message = [
      "طلب خدمة منزلية — سما الخليج المتقدمة",
      ...rows.map(([label, value]) => `${label}: ${value}`),
      "",
      "أرجو تأكيد استلام الطلب والموعد عبر واتساب.",
    ].join("\n");
    const target = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open("about:blank", "_blank");

    if (whatsappWindow) {
      whatsappWindow.opener = null;
      whatsappWindow.location.href = target;
      status.textContent = "فتحنا واتساب برسالة طلبك الجاهزة. اضغط إرسال لإيصالها للمؤسسة.";
    } else {
      status.textContent = "فتحنا واتساب برسالة طلبك الجاهزة. اضغط إرسال لإيصالها للمؤسسة.";
      window.location.href = target;
    }
  });
})();
