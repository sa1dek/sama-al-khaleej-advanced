(() => {
  const WHATSAPP_NUMBER = '966562752902';
  const form = document.querySelector('#booking-form');
  if (!form) return;
  const review = document.querySelector('#review');
  const details = document.querySelector('#review-details');
  const status = document.querySelector('#booking-status');
  const sendButton = document.querySelector('#send-request');
  const confirm = document.querySelector('#confirm-details');
  const date = form.elements.date;
  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  date.min = localToday.toISOString().slice(0, 10);
  const queryService = new URLSearchParams(window.location.search).get('service');
  if (queryService) {
    const aliases = {
      'النظافة بعد البناء': 'النظافة التأهيلية بعد البناء والتشطيب',
      'غسيل الأرضيات': 'غسيل وتلميع الأرضيات والبلاط والرخام',
      'تنظيف الخزانات': 'تنظيف وغسيل الخزانات الأرضية والعلوية',
      'تنظيف المكيفات': 'غسيل وتنظيف وصيانة المكيفات'
    };
    const option = [...form.elements.service.options].find(item => item.text === queryService || item.value === queryService || item.text.includes(queryService) || item.text === aliases[queryService]);
    if (option) form.elements.service.value = option.value;
  }
  const labels = { name: 'الاسم الكامل', phone: 'رقم الجوال', service: 'الخدمة المطلوبة', city: 'المدينة أو الموقع', property: 'نوع العقار', date: 'التاريخ المفضل', time: 'الوقت المفضل' };
  const errorFor = field => document.querySelector(`#${field.id}-error`);
  function validate() {
    let firstInvalid = null;
    [...form.querySelectorAll('[required]')].forEach(field => {
      field.setCustomValidity('');
      const val = field.value.trim();
      let message = '';
      if (!val) message = `يرجى إدخال ${labels[field.name] || 'هذه المعلومة'}.`;
      if (field.name === 'phone' && val) {
        const normalized = val.replace(/[\s()-]/g, '');
        if (!/^(?:05\d{8}|(?:\+?966)5\d{8})$/.test(normalized)) message = 'أدخل رقم جوال سعوديًا صحيحًا يبدأ بـ 05 أو +9665.';
      }
      if (field.name === 'date' && val && val < date.min) message = 'اختر تاريخًا اليوم أو بعده.';
      field.setCustomValidity(message);
      field.classList.toggle('input-error', Boolean(message));
      const error = errorFor(field);
      if (error) error.textContent = message;
      if (message && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) { firstInvalid.focus(); return false; }
    return true;
  }
  form.addEventListener('input', event => {
    const field = event.target;
    if (!field.matches('input,select')) return;
    field.setCustomValidity(''); field.classList.remove('input-error');
    const error = errorFor(field); if (error) error.textContent = '';
    status.textContent = '';
  });
  form.addEventListener('change', event => {
    const field = event.target;
    field.setCustomValidity(''); field.classList.remove('input-error');
    const error = errorFor(field); if (error) error.textContent = '';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate()) return;
    const rows = [['الاسم', form.elements.name.value.trim()], ['الجوال', form.elements.phone.value.trim()], ['الخدمة', form.elements.service.value], ['الموقع', form.elements.city.value.trim()], ['نوع العقار', form.elements.property.value], ['التاريخ المفضل', form.elements.date.value], ['الوقت المفضل', form.elements.time.value]];
    const notes = form.elements.notes.value.trim();
    if (notes) rows.push(['تفاصيل إضافية', notes]);
    details.replaceChildren();
    rows.forEach(([label, value]) => {
      const dt = document.createElement('dt'); dt.textContent = `${label}:`;
      const dd = document.createElement('dd'); dd.textContent = value;
      details.append(dt, dd);
    });
    review.hidden = false; status.textContent = '';
    review.scrollIntoView({ behavior: 'smooth', block: 'center' });
    confirm.focus();
  });
  sendButton.addEventListener('click', () => {
    if (!confirm.checked) { status.textContent = 'يرجى تأكيد صحة البيانات قبل المتابعة.'; confirm.focus(); return; }
    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      status.textContent = 'تعذر فتح واتساب حالياً. لم يتم إرسال طلبك ولم تُحفظ بياناتك.';
      return;
    }
    const rows = [...details.querySelectorAll('dt')].map((dt, index) => `${dt.textContent} ${details.querySelectorAll('dd')[index].textContent}`);
    const message = `طلب خدمة منزلية — مؤسسة سما الخليج المتقدمة للخدمات المنزلية\n${rows.join('\n')}\n\nهذا طلب لمراجعة التفاصيل وليس موعدًا مؤكدًا.`;
    const target = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const opened = window.open(target, '_blank');
    if (opened) { opened.opener = null; status.textContent = 'تم فتح واتساب لمراجعة إرسال الطلب. الموعد غير مؤكد حتى تتواصل معك المؤسسة.'; sendButton.disabled = true; }
    else status.textContent = 'تعذر فتح واتساب. اسمح بفتح النوافذ المنبثقة أو أعد المحاولة.';
  });
})();
