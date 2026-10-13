export function bindPrivacyWorksheet() {
  const form = document.querySelector('#lead-form');
  if (!form) return;
  const listeners = new AbortController();
  const options = {signal: listeners.signal};
  const zh = document.documentElement.lang === 'zh-CN';
  const say = (cn, en) => zh ? cn : en;
  const method = document.querySelector('#contact-method');
  const contact = document.querySelector('#contact-value');
  const button = document.querySelector('#lead-submit');
  const status = document.querySelector('#form-status');
  const localPreview = location.protocol === 'file:';
  if (localPreview) {
    const note = document.createElement('p');
    note.className = 'preview-note';
    note.textContent = say('本地审核预览：可体验填写及下载，不发送联系方式。网站版将在接收成功后开放下载。','Local review preview: try the form and download without sending contact details. The website version unlocks after successful receipt.');
    form.prepend(note);
  }
  method.addEventListener('change', () => {
    contact.value = '';
    contact.setCustomValidity('');
    const email = method.value === 'Email';
    const wechat = method.value === 'WeChat';
    contact.type = email ? 'email' : wechat ? 'text' : 'tel';
    contact.autocomplete = email ? 'email' : wechat ? 'off' : 'tel';
    contact.placeholder = email ? 'you@company.com' : wechat ? 'WeChat ID' : '+52 …';
    document.querySelector('#contact-label').textContent = email ? say('邮箱','Email address') : wechat ? say('微信号','WeChat ID') : say('WhatsApp号码（含国家区号）','WhatsApp number, including country code');
  }, options);
  contact.addEventListener('input', () => contact.setCustomValidity(''), options);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    const value = contact.value.trim();
    if (method.value === 'WhatsApp' && (!/^\+[\d\s().-]{7,25}$/.test(value) || value.replace(/\D/g, '').length < 7)) {
      contact.setCustomValidity(say('请输入带+国家区号的WhatsApp号码。','Enter a WhatsApp number starting with + and the country code.'));
    } else if (method.value === 'WeChat' && !/^[A-Za-z][A-Za-z0-9_-]{5,19}$/.test(value)) {
      contact.setCustomValidity(say('请输入6–20位微信号，以字母开头。','Enter a 6–20 character WeChat ID starting with a letter.'));
    } else if (!value) contact.setCustomValidity(say('请填写联系方式。','Please enter your contact details.'));
    if (!form.reportValidity()) return;
    if (form.elements._gotcha.value) return;
    button.disabled = true;
    status.textContent = say('正在处理…','Processing…');
    try {
      if (!localPreview) {
        const payload = Object.fromEntries(new FormData(form));
        payload.contact_value = value;
        if (method.value === 'Email') payload.email = value;
        payload.message = 'PRIVACY10 worksheet request\n' + method.value + ': ' + value + '\n' + (payload.buying_requirements || '');
        payload.page_url = location.origin + location.pathname;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);
        let response;
        try {
          response = await fetch(form.action, {method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
        } finally { clearTimeout(timer); }
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.ok !== true) throw new Error('Lead delivery not confirmed');
      }
      if (listeners.signal.aborted) return;
      const link = document.querySelector('#download-link');
      link.href = '/images/posts/top-10-privacy-screen-protector-manufacturers-china/privacy-glass-rfq.csv';
      document.querySelector('#download-area').hidden = false;
      status.textContent = localPreview ? say('预览完成，未发送信息。可以下载查看资料。','Preview complete. No information sent. You can download the worksheet.') : say('提交成功，询价表已可下载。','Received. Your worksheet is ready to download.');
      contact.value = '';
      if (!localPreview) link.click();
    } catch (error) {
      status.textContent = say('暂未确认提交成功，请重试或通过下方WhatsApp联系我们。','We could not confirm receipt. Please retry or contact us on WhatsApp below.');
    } finally { button.disabled = false; }
  }, options);
  return () => listeners.abort();
}
