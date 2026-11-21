"use strict";

(function () {
  const STORAGE_KEY = "iwss_lang";
  let isApplying = false;
  let observer = null;

  const UI_TEXT = {
    ar: {
      toggleBtn: "English",
      toggleTitle: "Switch to English",
      navHome: "الرئيسية",
      navClickjacking: "Clickjacking",
      navOrigin: "التحقق من المصدر (Origin Validation)",
      navProto: "Prototype Pollution",
      brandMeta: "بيئة تفاعلية لأمن الويب",
      modeVuln: "ضعيف (Vulnerable)",
      modeFixed: "آمن (Fixed)",
      resetBtn: "إعادة ضبط",
      copyCode: "نسخ الكود",
      copiedToast: "تم نسخ الكود إلى الحافظة",
      copyFailToast: "تعذر النسخ — حدد الكود يدوياً",
      footerKicker: "42 إربد · مشروع التخرج في الأمن السيبراني · نوفمبر 2026",
      footerTitle: "IWSS — بيئة تفاعلية لأمن الويب",
      footerTeam: "الفريق: raajloun, aal_ness, sal-fara, ahalshou, aabtah.",
      footerDisclaimer: "محاكاة تعليمية فقط. لا يتم استهداف أي أنظمة حقيقية."
    },
    en: {
      toggleBtn: "عربي",
      toggleTitle: "التبديل إلى العربية",
      navHome: "Home",
      navClickjacking: "Clickjacking",
      navOrigin: "Origin Validation",
      navProto: "Prototype Pollution",
      brandMeta: "Interactive Web Security Sandbox",
      modeVuln: "Vulnerable",
      modeFixed: "Fixed",
      resetBtn: "Reset",
      copyCode: "Copy code",
      copiedToast: "Code copied to clipboard",
      copyFailToast: "Could not copy — select the code manually",
      footerKicker: "42 Irbid · Cybersecurity Final Project · November 2026",
      footerTitle: "IWSS — Interactive Web Security Sandbox",
      footerTeam: "Team: raajloun, aal_ness, sal-fara, ahalshou, aabtah.",
      footerDisclaimer: "Educational simulations only. No real systems are targeted."
    }
  };

  const EXACT_TRANSLATIONS = {
    // Home page (index.html)
    "See how it breaks, then how it's fixed.": "شاهد كيف ينكسر النظام، ثم كيف يُصلح.",
    "See how it breaks,": "شاهد كيف ينكسر النظام،",
    "then how it's fixed.": "ثم كيف يُصلح.",
    "Explore each vulnerability step by step: watch the attack happen, read the code that caused it, and check the safe fix.": "استكشف كل ثغرة خطوة بخطوة: شاهد الهجوم يحدث، واقرأ الكود الذي تسبب به، وتحقق من الحل الآمن.",
    "Explore the labs": "استكشف المختبرات",
    "How each lab works": "كيف يعمل كل مختبر",
    "Clear steps, real behavior.": "خطوات واضحة، وسلوك واقعي.",
    "Every lab walks you through the bug and the solution in order: see how the attack works, check the vulnerable code, then compare it with the fixed code.": "يأخذك كل مختبر عبر الثغرة والحل بالترتيب: شاهد كيف يعمل الهجوم، وتحقق من الكود الضعيف، ثم قارنه بالكود الآمن.",
    "See the attack": "شاهد الهجوم",
    "Test Vulnerable vs. Fixed": "جرّب الوضع الضعيف مقابل الآمن",
    "Read the flaw": "اقرأ الخلل",
    "Spot why the code fails": "اكتشف سبب فشل الكود",
    "Check the fix": "تحقق من الإصلاح",
    "See how it stays safe": "شاهد كيف يبقى آمناً",
    "Explore and experiment": "استكشف وجرّب",
    "Choose your security lab": "اختر مختبر الأمان",
    "Three common web flaws, explained simply with live examples, broken code, and safe fixes.": "ثلاث ثغرات شائعة في الويب، مشروحة ببساطة مع أمثلة حية، وكود ضعيف، وحلول آمنة.",
    "03 hands-on labs": "03 مختبرات عملية",
    "Lab 01 · Browser security": "المختبر 01 · أمان المتصفح",
    "CWE-1021 — A hidden frame tricks a visitor into clicking a button for an action they did not intend.": "CWE-1021 — إطار مخفي يخدع الزائر للضغط على زر ينفّذ إجراءً لم يقصد القيام به.",
    "Easy": "سهل",
    "Lab 02 · Message security": "المختبر 02 · أمان الرسائل",
    "Origin Validation": "التحقق من المصدر (Origin Validation)",
    "CWE-346 — A page accepts postMessage data without checking event.origin, letting untrusted sites act.": "CWE-346 — صفحة تقبل بيانات postMessage دون التحقق من event.origin، مما يسمح لمواقع غير موثوقة بالتصرف.",
    "Medium": "متوسط",
    "Lab 03 · JavaScript security": "المختبر 03 · أمان جافاسكريبت",
    "CWE-1321 — Unsafe object merging alters a shared prototype and gives other objects unexpected values.": "CWE-1321 — دمج كائنات غير آمن يغيّر الـ prototype المشترك ويعطي كائنات أخرى قيماً غير متوقعة.",
    "Hard": "متقدم",

    // Shared lab headings & sections
    "Real-world impact": "الأثر في الواقع",
    "Why it matters": "لماذا يهم هذا الأمر",
    "Vulnerability discovery": "اكتشاف الثغرة",
    "See how the attack happens": "شاهد كيف يحدث الهجوم",
    "Code analysis": "تحليل الكود",
    "The vulnerable code": "الكود الضعيف",
    "Remediation": "المعالجة",
    "The fixed code": "الكود الآمن",
    "References": "المراجع",
    "Sources": "المصادر",

    // Clickjacking
    "Security lab / Clickjacking": "مختبر الأمان / Clickjacking",
    "CWE-1021 · OWASP A04:2021 Insecure Design": "CWE-1021 · OWASP A04:2021 تصميم غير آمن",
    "Clickjacking lets an attacker load your page invisibly under a decoy button, so the visitor's click triggers an action they never meant to perform. It works because the browser only refuses to show a page inside another site if the server tells it to, with a header.": "يسمح هجوم Clickjacking للمهاجم بتحميل صفحتك بشكل غير مرئي أسفل زر خادع، بحيث تؤدي نقرة الزائر إلى تنفيذ إجراء لم يقصد فعله. يحدث ذلك لأن المتصفح لا يرفض عرض صفحة داخل موقع آخر إلا إذا أخبره الخادم بذلك عبر ترويسة (Header).",
    "If an attacker hides a sensitive button—such as deleting an account, changing privacy settings, or approving a transfer—under a fake offer, a single click can cause real damage without the user noticing. Clickjacking bugs have historically affected major web platforms and social apps when framing headers were missing on sensitive actions.": "إذا أخفى مهاجم زراً حساساً — مثل حذف حساب، أو تغيير إعدادات الخصوصية، أو الموافقة على تحويل — أسفل عرض وهمي، فقد تسبب نقرة واحدة ضرراً حقيقياً دون أن ينتبه المستخدم. تاريخياً أثرت ثغرات Clickjacking على منصات وتطبيقات كبرى عند غياب ترويسات الإطارات على الإجراءات الحساسة.",
    "Claim your free gift!": "احصل على هديتك المجانية!",
    "Your gift is waiting for you.": "هديتك بانتظارك.",
    "Claim Now!": "احصل عليها الآن!",
    "What the visitor sees": "ما يراه الزائر",
    "Hidden layer revealed": "تم إظهار الطبقة المخفية",
    "The browser blocked the hidden page": "المتصفح حجب الصفحة المخفية",
    "Reveal layers": "إظهار الطبقات",
    "Hide layers": "إخفاء الطبقات",
    "The page is returned without a framing policy. Another site can therefore load it inside an invisible iframe and place it over a misleading button.": "تُعاد الصفحة دون سياسة تحدد الإطارات؛ ولذلك يمكن لموقع آخر تحميلها داخل iframe غير مرئي ووضعها فوق زر مضلِّل.",
    "These headers restrict which sites are allowed to embed the page. The simulation demonstrates this browser decision; a real application must send the headers from its server.": "تقيّد هذه الترويسات المواقع المسموح لها بتضمين الصفحة. توضح المحاكاة قرار المتصفح هذا، بينما يجب على التطبيق الحقيقي إرسال الترويسات من الخادم.",

    // Origin Validation
    "Security lab / Origin validation": "مختبر الأمان / التحقق من المصدر (Origin Validation)",
    "Origin Validation Error": "خطأ التحقق من المصدر (Origin Validation Error)",
    "CWE-346 · OWASP A01:2021 Broken Access Control": "CWE-346 · OWASP A01:2021 خلل في التحكم بالوصول",
    "When a page uses postMessage(), any open website can send it data. If your code does not check who sent the message (event.origin), a bad site can trick your app into moving money or changing settings for the visitor.": "عندما تستخدم صفحة postMessage()، يمكن لأي موقع مفتوح إرسال بيانات إليها. إذا لم يتحقق الكود من مرسل الرسالة (event.origin)، يمكن لموقع خبيث خداع تطبيقك لتحويل أموال أو تغيير إعدادات للزائر.",
    "If a page trusts any sender on postMessage, a malicious site opened in another tab or frame can trigger actions or send forged data on behalf of the visitor. Missing origin checks in postMessage handlers is a well-known web vulnerability that has exposed sensitive actions and data across real-world web apps.": "إذا وثقت صفحة بأي مرسل عبر postMessage، يمكن لموقع خبيث مفتوح في تبويب أو إطار آخر تشغيل إجراءات أو إرسال بيانات مزورة نيابة عن الزائر. يُعد غياب فحص المصدر في معالجات postMessage ثغرة معروفة كشفت إجراءات وبيانات حساسة في تطبيقات ويب واقعية.",
    "Senders (Simulated postMessage)": "المرسلون (محاكاة postMessage)",
    "Trusted site (app.iwss.example) · Send $50": "موقع موثوق (app.iwss.example) · إرسال $50",
    "Untrusted site (evil.example) · Send $500": "موقع غير موثوق (evil.example) · إرسال $500",
    'Trusted site · Bad amount ("lots")': 'موقع موثوق · مبلغ غير صالح ("lots")',
    "Receiving App": "التطبيق المستقبل",
    "Balance:": "الرصيد:",
    "Activity log": "سجل النشاط",
    "The listener reads event.data right away without checking event.origin. Any other website can send a message and lower the user's balance.": "يقرأ المستمع event.data مباشرة دون التحقق من event.origin. يمكن لأي موقع آخر إرسال رسالة وخفض رصيد المستخدم.",
    "The code checks event.origin against an exact list of trusted sites and makes sure the transfer amount is a valid positive number before changing the balance.": "يتحقق الكود من event.origin مقابل قائمة دقيقة بالمواقع الموثوقة ويتأكد من أن مبلغ التحويل رقم موجب صالح قبل تعديل الرصيد.",

    // Prototype Pollution
    "Security lab / Prototype pollution": "مختبر الأمان / تلويث النموذج الأولي (Prototype Pollution)",
    "CWE-1321 · OWASP A08:2021 Software and Data Integrity Failures": "CWE-1321 · OWASP A08:2021 أعطال سلامة البرمجيات والبيانات",
    "In JavaScript, objects can inherit properties from a shared prototype. If untrusted input sets a key like __proto__ during an object merge, it can change the shared prototype and give other objects unexpected values—such as admin access.": "في جافاسكريبت، يمكن للكائنات أن ترث خصائص من prototype مشترك. إذا عيّن إدخال غير موثوق مفتاحاً مثل __proto__ أثناء دمج كائنات، فقد يغيّر ذلك الـ prototype المشترك ويعطي كائنات أخرى قيماً غير متوقعة — مثل صلاحيات الأدمن.",
    "Polluting a shared prototype can affect many objects across the app at once—altering default options, bypassing checks, or causing unexpected errors. A well-known real-world example is CVE-2019-10744 in lodash, where unsafe merge or defaults helpers allowed prototype pollution.": "يمكن لتلويث الـ prototype المشترك أن يؤثر على كائنات كثيرة في التطبيق دفعة واحدة — بتغيير الخيارات الافتراضية، أو تجاوز الفحوصات، أو إحداث أخطاء غير متوقعة. مثال واقعي معروف هو CVE-2019-10744 في مكتبة lodash حيث سمحت دوال الدمج أو الافتراضات غير الآمنة بتلويث الـ prototype.",
    "Profile update input": "إدخال تحديث الملف الشخصي",
    "Send a JSON update into user and check if an untouched guest becomes admin:": "أرسل تحديث JSON إلى user وتحقق مما إذا أصبح guest (الذي لم يُمسّ مباشرة) أدمن:",
    "__proto__ payload (set isAdmin: true)": "حمولة __proto__ (تعيين isAdmin: true)",
    "constructor.prototype payload": "حمولة constructor.prototype",
    "Harmless update (change name only)": "تحديث آمن (تغيير الاسم فقط)",
    "Object state inspector": "فاحص حالة الكائنات",
    "The merge helper follows keys like __proto__ or constructor.prototype into the shared prototype, and isAdmin accepts inherited properties instead of checking only the object's own properties.": "تتبع دالة الدمج مفاتيح مثل __proto__ أو constructor.prototype نحو الـ prototype المشترك، وتقبل isAdmin الخصائص الموروثة بدلاً من فحص خصائص الكائن نفسه فقط.",
    "Dangerous keys are blocked, nested objects use Object.create(null) without a prototype chain, and Object.hasOwn ensures admin checks ignore inherited values.": "يتم حظر المفاتيح الخطيرة، وتستخدم الكائنات المتداخلة Object.create(null) دون سلسلة prototype، وتضمن Object.hasOwn تجاهل القيم الموروثة عند فحص صلاحيات الأدمن."
  };

  const DYNAMIC_PHRASES = {
    ar: [
      ["Framing blocked — nothing hidden to reveal", "تم حجب التضمين — لا توجد طبقة مخفية لإظهارها"],
      ["The browser refused to embed bank.example inside evil.example, so there is no hidden layer sitting above the gift button.", "رفض المتصفح تضمين bank.example داخل evil.example، لذا لا توجد طبقة مخفية فوق زر الهدية."],
      ["Hidden action aligned over the decoy button", "تمت محاذاة الإجراء المخفي فوق الزر الخادع"],
      ["The bank page sits invisibly above the gift page. When the visitor clicks Claim Now!, the hidden Delete my account button receives the click.", "تقع صفحة البنك بشكل غير مرئي فوق صفحة الهدية. وعندما يضغط الزائر على Claim Now!، يتلقى زر Delete my account المخفي النقرة."],
      ["Layer hidden again", "تم إخفاء الطبقة مجدداً"],
      ["The bank frame is invisible once more, but in vulnerable mode it remains positioned directly over the decoy button.", "أصبح إطار البنك غير مرئي مرة أخرى، لكنه في الوضع الضعيف يبقى متمركزاً مباشرة فوق الزر الخادع."],
      ["Click hijacked! Hidden action triggered", "تم اختطاف النقرة! تم تنفيذ إجراء مخفي"],
      ["You meant to claim a gift, but your click hit the invisible bank.example layer and triggered account deletion instead.", "كنت تقصد الحصول على هدية، لكن نقرتك أصابت طبقة bank.example غير المرئية ونفّذت حذف الحساب بدلاً من ذلك."],
      ["Attack prevented — click stayed harmless", "تم منع الهجوم — بقيت النقرة غير ضارة"],
      ["Because framing was blocked, your click went only to the visible gift button (opening the safe decoy page) and never touched bank.example.", "لأن التضمين كان محجوباً، ذهبت نقرتك فقط إلى زر الهدية الظاهر (وفتحت الصفحة الآمنة) ولم تلمس bank.example أبداً."],
      ["Test both states", "جرّب الحالتين"],
      ["Protection is active: click Claim Now! to see the blocked framing in action, or click Reveal layers.", "الحماية مفعّلة: اضغط Claim Now! لمشاهدة حجب التضمين عملياً، أو اضغط Reveal layers."],
      ["No framing header is set: click Claim Now! to see the hidden layer steal your click, then click Reveal layers.", "لا توجد ترويسة لحجب الإطارات: اضغط Claim Now! لترى الطبقة المخفية تلتقط نقرتك، ثم اضغط Reveal layers."],

      ["Ready to test", "جاهز للاختبار"],
      ["Allowlist check is active: try clicking the untrusted site or bad amount button to see how it gets blocked.", "فحص القائمة المسموحة مفعّل: جرّب الضغط على الموقع غير الموثوق أو المبلغ غير الصالح لترى كيف يتم حجبه."],
      ["No origin check is active: try clicking the untrusted site button to see what happens.", "لا يوجد فحص للمصدر: جرّب الضغط على زر الموقع غير الموثوق لترى ما يحدث."],
      ["Attack succeeded! An untrusted or invalid message changed the balance", "نجح الهجوم! رسالة غير موثوقة أو غير صالحة غيّرت الرصيد"],
      ["Trusted message accepted", "تم قبول الرسالة الموثوقة"],
      ["Message blocked safely", "تم حظر الرسالة بأمان"],
      ["BLOCKED ·", "محظور ·"],
      ["UNSAFE ACCEPT ·", "قبول غير آمن ·"],
      ["TRUSTED OK ·", "موثوق وصحيح ·"],
      ["is not on the allowlist", "ليس ضمن القائمة المسموحة"],
      ["is not a valid number", "ليس رقماً صالحاً"],
      ["Balance stays $", "يبقى الرصيد $"],
      ["Balance is now $", "الرصيد الآن $"],
      ["requested", "طلب"],
      ["Your balance stays safe at $", "رصيدك آمن عند $"],
      ["Current balance: $", "الرصيد الحالي: $"],

      ["Dangerous key blocked safely", "تم حظر المفتاح الخطير بأمان"],
      ["The shared prototype stayed clean and no one got admin access.", "بقي الـ prototype المشترك نظيفاً ولم يحصل أحد على صلاحيات الأدمن."],
      ["Prototype polluted! Guest gained admin access", "تم تلويث الـ prototype! حصل guest على صلاحيات الأدمن"],
      ['Editing the shared prototype affected "guest" too, even though "guest" was never touched directly.', 'تعديل الـ prototype المشترك أثّر على "guest" أيضاً، رغم أن "guest" لم يُمسّ مباشرة.'],
      ["Safe update applied cleanly", "تم تطبيق التحديث الآمن بنجاح"],
      ['Only the allowed property changed on "user", and "guest" has no admin access.', 'تغيّرت الخاصية المسموحة فقط على "user"، ولا يملك "guest" صلاحيات الأدمن.'],
      ["Protection is active: try a dangerous payload to see it blocked.", "الحماية مفعّلة: جرّب حمولة خطيرة لترى كيف يتم حظرها."],
      ["No protection is active: try a __proto__ payload to see how it affects guest.", "لا توجد حماية: جرّب حمولة __proto__ لترى كيف تؤثر على guest."],
      ["Payload sent:", "الحمولة المرسلة:"],
      ["Dangerous key rejected:", "تم رفض المفتاح الخطير:"],
      ["user own props     :", "خصائص user الخاصة :"],
      ["shared prototype   :", "الـ prototype المشترك:"],
      ["null (no prototype)", "null (بدون prototype)"],
      ["(never edited directly)", "(لم يُعدَّل مباشرة)"],
      ["real Object.prototype polluted?", "هل تلوّث Object.prototype الحقيقي؟"],

      ["Select a payload first.", "اختر حمولة أولاً."],
      ["Fire a payload in Section 3 before switching modes.", "أرسل حمولة قبل التبديل بين الأوضاع."]
    ]
  };

  function getLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ar" || saved === "en") return saved;
    } catch (_) {}
    return "en";
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  }

  function ensureToggleButton() {
    const nav = document.querySelector("header nav");
    if (!nav) return null;

    let btn = document.getElementById("lang-toggle-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "lang-toggle-btn";
      btn.type = "button";
      btn.style.cssText =
        "margin-inline-start:12px;padding:6px 12px;border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit;font:600 13px/1 system-ui,-apple-system,sans-serif;cursor:pointer;";
      const linksContainer = nav.querySelector(".links");
      if (linksContainer) {
        linksContainer.appendChild(btn);
      } else {
        nav.appendChild(btn);
      }
    }
    return btn;
  }

  function translateDynamicText(text) {
    if (!text) return text;
    let out = text;
    for (const [en, ar] of DYNAMIC_PHRASES.ar) {
      if (out.includes(en)) {
        out = out.split(en).join(ar);
      }
    }
    return out;
  }

  function translateTextNodes(root, lang) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest("pre, code, script, style, svg, #lang-toggle-btn")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let current;
    while ((current = walker.nextNode())) {
      nodes.push(current);
    }

    nodes.forEach((node) => {
      if (typeof node.__origText !== "string") {
        node.__origText = node.nodeValue;
      }

      if (lang === "en") {
        if (node.nodeValue !== node.__origText) {
          node.nodeValue = node.__origText;
        }
        return;
      }

      const raw = node.__origText;
      const normalized = raw.replace(/\s+/g, " ").trim();
      let target = null;

      if (EXACT_TRANSLATIONS[raw]) {
        target = EXACT_TRANSLATIONS[raw];
      } else if (EXACT_TRANSLATIONS[normalized]) {
        const leading = (raw.match(/^\s*/) || [""])[0];
        const trailing = (raw.match(/\s*$/) || [""])[0];
        target = leading + EXACT_TRANSLATIONS[normalized] + trailing;
      } else {
        const dyn = translateDynamicText(raw);
        if (dyn !== raw) target = dyn;
      }

      if (target !== null && node.nodeValue !== target) {
        node.nodeValue = target;
      }
    });
  }

  function applyChromeAndStaticLabels(lang) {
    const t = UI_TEXT[lang];
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
    const dir = lang === "ar" ? "rtl" : "ltr";
    if (document.documentElement.dir !== dir) {
      document.documentElement.dir = dir;
    }

    const btn = ensureToggleButton();
    if (btn && btn.textContent !== t.toggleBtn) {
      btn.textContent = t.toggleBtn;
      btn.title = t.toggleTitle;
      btn.setAttribute("aria-label", t.toggleTitle);
    }

    const brandMeta = document.querySelector(".brand-meta");
    if (brandMeta && brandMeta.textContent !== t.brandMeta) {
      brandMeta.textContent = t.brandMeta;
    }

    const navLinks = document.querySelectorAll("header nav .links a");
    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      let nextLabel = null;
      if (href.endsWith("index.html")) nextLabel = t.navHome;
      else if (href.includes("clickjacking.html")) nextLabel = t.navClickjacking;
      else if (href.includes("origin-validation.html")) nextLabel = t.navOrigin;
      else if (href.includes("prototype-pollution.html")) nextLabel = t.navProto;
      if (nextLabel && a.textContent !== nextLabel) {
        a.textContent = nextLabel;
      }
    });

    document.querySelectorAll('[data-mode="vulnerable"]').forEach((el) => {
      if (el.textContent.trim() !== t.modeVuln) el.textContent = t.modeVuln;
    });
    document.querySelectorAll('[data-mode="fixed"]').forEach((el) => {
      if (el.textContent.trim() !== t.modeFixed) el.textContent = t.modeFixed;
    });
    document.querySelectorAll("[data-reset]").forEach((el) => {
      if (el.textContent.trim() !== t.resetBtn) el.textContent = t.resetBtn;
    });
    document.querySelectorAll(".code-copy").forEach((el) => {
      if (el.textContent.trim() !== t.copyCode) el.textContent = t.copyCode;
    });

    const footerKicker = document.querySelector("footer .footer-kicker");
    const footerParas = document.querySelectorAll("footer .foot p");
    if (footerKicker && footerKicker.textContent !== t.footerKicker) {
      footerKicker.textContent = t.footerKicker;
    }
    if (footerParas[1]) {
      const b = footerParas[1].querySelector("b");
      if (b && b.textContent !== t.footerTitle) b.textContent = t.footerTitle;
    }
    if (footerParas[2] && footerParas[2].textContent !== t.footerTeam) {
      footerParas[2].textContent = t.footerTeam;
    }
    if (footerParas[3] && footerParas[3].textContent !== t.footerDisclaimer) {
      footerParas[3].textContent = t.footerDisclaimer;
    }
  }

  function applyLanguage(lang) {
    if (isApplying) return;
    isApplying = true;
    try {
      if (observer) observer.disconnect();
      applyChromeAndStaticLabels(lang);
      translateTextNodes(document.body, lang);
    } finally {
      isApplying = false;
      attachObserver();
    }
  }

  function attachObserver() {
    if (typeof MutationObserver === "undefined") return;
    if (!observer) {
      observer = new MutationObserver(() => {
        if (isApplying) return;
        if (getLang() === "ar") {
          applyLanguage("ar");
        }
      });
    }
    const targets = ["out", "log", "inspect", "stage-label", "reveal-btn"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    targets.forEach((el) => {
      observer.observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

function initI18n() {
    const initialLang = getLang();
    const btn = ensureToggleButton();
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        const nextLang = getLang() === "ar" ? "en" : "ar";
        saveLang(nextLang);
        applyLanguage(nextLang);
      });
    }
    applyLanguage(initialLang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initI18n);
  } else {
    initI18n();
  }
})();