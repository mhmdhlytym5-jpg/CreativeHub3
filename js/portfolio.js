

(function () {
  'use strict';


  var PROJECTS = [
    {
      slug: 'aura-identity',
      category: 'branding',
      year: '2023',
      accent: '#A0522D',
      titleEn: 'Nawa', titleAr: 'نوى',
      catLabelEn: 'Brand Identity', catLabelAr: 'هوية بصرية',
      clientEn: 'Nawa Coffee', clientAr: 'قهوة نوى',
      roleEn: 'Identity · Packaging · Art Direction',
      roleAr: 'هوية · تغليف · إدارة فنية',
      leadEn: 'A visual identity for an Arabic coffee brand that tells a story of authenticity in a modern language.',
      leadAr: 'هوية بصرية لعلامة قهوة عربية تروي حكاية الأصالة بلغة معاصرة.',
      descEn: "Nawa's identity was built on a concept that blends authenticity with modernity — an Arabic typeface that reflects character, paired with a warm colour palette that gives the brand a balanced, grounded presence. Every element was designed to form one cohesive visual experience that expresses the brand's identity with clarity and elegance.",
      descAr: 'تم بناء هوية نوى انطلاقًا من مفهوم يجمع بين الأصالة والحداثة، من خلال خط عربي يعكس الشخصية، ولوحة ألوان دافئة تمنح العلامة حضورًا متوازنًا وراسخًا. كل عنصر صُمم ليكوّن تجربة بصرية متكاملة تعبر عن هوية البراند بوضوح وأناقة.',
      services: [
        { en: 'Brand Strategy', ar: 'استراتيجية العلامة' },
        { en: 'Visual Identity', ar: 'الهوية البصرية' },
        { en: 'Packaging', ar: 'التغليف' }
      ],
      cover: '../assets/images/NAWA.webp',
      images: [
        { src: '../assets/images/nawa/nuwa-14.webp', w: 1600, h: 900 },
        { src: '../assets/images/nawa/nuwa-08.webp', w: 1600, h: 2000 },
        { src: '../assets/images/nawa/nuwa-04.webp', w: 1600, h: 2000 },
        { src: '../assets/images/nawa/nuwa-20.webp', w: 1600, h: 1000 },
        { src: '../assets/images/nawa/nuwa-26.webp', w: 1600, h: 900 },
        { src: '../assets/images/nawa/nuwa-24.webp', w: 1600, h: 900 },
        { src: '../assets/images/nawa/nuwa-21.webp', w: 1600, h: 900 },
        { src: '../assets/images/nawa/nuwa-25.webp', w: 1600, h: 900 },
        { src: '../assets/images/nawa/nuwa-17.webp', w: 1600, h: 2000 },
        { src: '../assets/images/nawa/nuwa-09.webp', w: 1600, h: 2000 },
        { src: '../assets/images/nawa/nuwa-15.webp', w: 1600, h: 900 }
      ]
    },
    {
      slug: 'ledgerly-app',
      category: 'branding',
      year: '2024',
      accent: '#2e8818',
      titleEn: 'Narjis', titleAr: 'نرجس',
      catLabelEn: 'Brand Identity', catLabelAr: 'هوية بصرية',
      clientEn: 'Narjis Jewelry', clientAr: 'Narjis للمجوهرات',
      roleEn: 'Identity · Brand Collateral · Art Direction',
      roleAr: 'هوية · عناصر بصرية · إدارة فنية',
      leadEn: 'Visual identity for Narjis Jewelry',
      leadAr: 'هوية بصرية لعلامة Narjis للمجوهرات',
      descEn: 'Narjis is a jewelry brand that reflects elegance and simplicity in a refined modern way, inspired by feminine beauty and subtle details that highlight the luxury of each piece and give the brand a distinctive, sophisticated identity.',
      descAr: 'Narjis هي علامة مجوهرات تعكس الأناقة والبساطة بأسلوب عصري راقٍ، مستوحاة من الجمال الأنثوي والتفاصيل الهادئة التي تبرز فخامة القطع وتمنحها طابعاً مميزاً يعبر عن الرقي والذوق الرفيع.',
      services: [
        { en: 'Brand Strategy', ar: 'استراتيجية العلامة' },
        { en: 'Visual Identity', ar: 'الهوية البصرية' },
        { en: 'Brand Collateral', ar: 'العناصر البصرية' }
      ],
      cover: '../assets/images/NARJES.webp',
      images: [
        { src: '../assets/images/narjes/NARJES.webp', w: 1600, h: 900 },
        { src: '../assets/images/narjes/narjes-13.webp', w: 1600, h: 1000 },
        { src: '../assets/images/narjes/narjes-05.webp', w: 1600, h: 2000 },
        { src: '../assets/images/narjes/narjes-03.webp', w: 1600, h: 2000 },
        { src: '../assets/images/narjes/narjes-14.webp', w: 1600, h: 1000 },
        { src: '../assets/images/narjes/narjes-08.webp', w: 1600, h: 2300 },
        { src: '../assets/images/narjes/narjes-06.webp', w: 1600, h: 2300 },
        { src: '../assets/images/narjes/narjes-15.webp', w: 1600, h: 900 },
        { src: '../assets/images/narjes/narjes-10.webp', w: 1600, h: 2000 },
        { src: '../assets/images/narjes/narjes-11.webp', w: 1600, h: 2000 },
        { src: '../assets/images/narjes/narjes-17.webp', w: 1600, h: 900 }
      ]
    },
    {
      slug: 'neon-drinks',
      category: 'packaging',
      year: '2023',
      accent: '#6F4FB8',
      titleEn: 'Rukna', titleAr:'ركنة',
      catLabelEn: 'Brand Identity', catLabelAr: 'هوية بصرية',
      clientEn: 'Neon Beverage Co.', clientAr: 'شركة نيون للمشروبات',
      roleEn: 'Packaging · Illustration · Retail System',
      roleAr: 'تغليف · رسوم · نظام عرض',
      leadEn: 'Six flavours, one shelf presence loud enough to survive a supermarket.',
      leadAr: 'ست نكهات، وحضور واحد على الرف عالٍ بما يكفي للنجاة في سوبرماركت.',
      descEn: 'Bold can design and shelf system for a sparkling drinks line — high-contrast gradients and a modular label grid that scales across six flavours without losing cohesion. The grid does the heavy lifting so new flavours ship without a redesign.',
      descAr: 'تصميم علب جريء ونظام رفوف لخط مشروبات غازية — تدرجات عالية التباين وشبكة ملصقات معيارية تتوسع عبر ست نكهات دون فقدان التماسك. الشبكة تتحمل العبء الأكبر لتُطلق النكهات الجديدة دون إعادة تصميم.',
      services: [
        { en: 'Packaging', ar: 'التغليف' },
        { en: 'Illustration', ar: 'الرسوم' },
        { en: 'Art Direction', ar: 'الإدارة الفنية' }
      ],
      cover: '../assets/images/RUKNA.webp',
      images: [
        { src: '../assets/images/rukna/rukna-06.webp', w: 1600, h: 900 },
        { src: '../assets/images/rukna/rukna-04.webp', w: 1600, h: 1400 },
        { src: '../assets/images/rukna/rukna-02.webp', w: 1600, h: 1400 },
        { src: '../assets/images/rukna/rukna-03.webp', w: 1600, h: 1000 },
        { src: '../assets/images/rukna/rukna-01.webp', w: 1600, h: 900 }
      ]
    },
    {
      slug: 'loop-ui-kit',
      category: 'branding',
      year: '2024',
      accent: '#6F4E37',
      titleEn: '3Sips', titleAr: '3Sips',
      catLabelEn: 'Brand Identity', catLabelAr: 'هوية بصرية',
      clientEn: '3Sips', clientAr: '3Sips',
      roleEn: 'Identity · Packaging · Art Direction',
      roleAr: 'هوية · تغليف · إدارة فنية',
      leadEn: 'A coffee identity that begins with the first sip.',
      leadAr: 'هوية بصرية لعلامة قهوة تبدأ من أول رشفة.',
      descEn: "3Sips's visual identity is built to turn every detail into a memorable experience — just like the first sip of coffee. 🤎",
      descAr: 'الهوية البصرية لـ 3sips تهدف إلى جعل كل تفصيلة بصرية تجربة مميزة... تمامًا مثل أول رشفة قهوة. 🤎',
      services: [
        { en: 'Brand Strategy', ar: 'استراتيجية العلامة' },
        { en: 'Visual Identity', ar: 'الهوية البصرية' },
        { en: 'Packaging', ar: 'التغليف' }
      ],
      cover: '../assets/images/3SIPS.webp',
      images: [
        { src: '../assets/images/3sips/3sips-10.webp', w: 2500, h: 900 },
        { src: '../assets/images/3sips/3sips-04.webp', w: 1600, h: 1400 },
        { src: '../assets/images/3sips/3sips-05.webp', w: 1600, h: 1400 },
        { src: '../assets/images/3sips/3sips-06.webp', w: 2600, h: 2000 },
        { src: '../assets/images/3sips/3sips-09.webp', w: 1600, h: 2000 },
        { src: '../assets/images/3sips/3sips-08.webp', w: 1600, h: 2000 },
        { src: '../assets/images/3sips/3sips-03.webp', w: 2600, h: 2000 },
        { src: '../assets/images/3sips/3sips-01.webp', w: 1600, h: 900 }
      ]
    },
    {
      slug: 'terra-coffee',
      category: 'branding',
      year: '2022',
      accent: '#C17817',
      titleEn: 'Aeris', titleAr: 'Aeris',
      catLabelEn: 'Brand Identity', catLabelAr: 'هوية بصرية',
      clientEn: 'Aeris Coffee Shop', clientAr: 'Aeris كوفي شوب',
      roleEn: 'Identity · Illustration · Packaging',
      roleAr: 'هوية · رسوم · تغليف',
      leadEn: 'Where slow mornings and warm aromas become a feeling.',
      leadAr: 'حيث تتحول الصباحات الهادئة والروائح الدافئة إلى شعور.',
      descEn: "Where slow mornings, warm aromas, and small moments start, Aeris is not just a coffee shop — it's a feeling.",
      descAr: 'حيث تبدأ الصباحات الهادئة، والروائح الدافئة، واللحظات الصغيرة، Aeris ليس مجرد مقهى، بل هو شعور.',
      services: [
        { en: 'Visual Identity', ar: 'الهوية البصرية' },
        { en: 'Illustration', ar: 'الرسوم' },
        { en: 'Packaging', ar: 'التغليف' }
      ],
      cover: '../assets/images/AERIS.webp',
      images: [
        { src: '../assets/images/aeris/aeris-08.webp', w: 1600, h: 900 },
        { src: '../assets/images/aeris/aeris-05.webp', w: 1600, h: 2000 },
        { src: '../assets/images/aeris/aeris-06.webp', w: 1600, h: 2000 },
        { src: '../assets/images/aeris/aeris-04.webp', w: 1600, h: 2000 },
        { src: '../assets/images/aeris/aeris-09.webp', w: 1600, h: 2000 },
        { src: '../assets/images/aeris/aeris-01.webp', w: 1600, h: 2000 },
        { src: '../assets/images/aeris/aeris-03.webp', w: 1600, h: 2000 },
        { src: '../assets/images/aeris/aeris-10.webp', w: 1600, h: 2000 },
        { src: '../assets/images/aeris/aeris-02.webp', w: 1600, h: 2000 },
        { src: '../assets/images/aeris/aeris-07.webp', w: 1600, h: 900 }
      ]
    },
    {
      slug: 'nova-snacks',
      category: 'branding',
      year: '2024',
      accent: '#C08A45',
      titleEn: 'Crossa', titleAr: 'Crossa',
      catLabelEn: 'Brand Identity', catLabelAr: 'هوية بصرية',
      clientEn: 'Crossa Bakery', clientAr: 'مخبزة Crossa',
      roleEn: 'Identity · Packaging · Illustration',
      roleAr: 'هوية · تغليف · رسوم',
      leadEn: 'A warm visual identity for a croissant bakery, baked into every detail.',
      leadAr: 'هوية بصرية دافئة لمخبزة كرواسون، محبوكة في كل تفصيلة.',
      descEn: 'A whole visual identity for a croissant bakery — from the mark to the packaging — built around warmth, texture, and the simple pleasure of fresh pastry.',
      descAr: 'هوية بصرية متكاملة لمخبزة كرواسون — من الشعار إلى التغليف — مبنية على الدفء والملمس ومتعة المعجنات الطازجة البسيطة.',
      services: [
        { en: 'Brand Strategy', ar: 'استراتيجية العلامة' },
        { en: 'Visual Identity', ar: 'الهوية البصرية' },
        { en: 'Packaging', ar: 'التغليف' }
      ],
      cover: '../assets/images/CROSSA.webp',
      images: [
        { src: '../assets/images/crossa/crossa-02.webp', w: 1600, h: 900 },
        { src: '../assets/images/crossa/crossa-05.webp', w: 1600, h: 2000 },
        { src: '../assets/images/crossa/crossa-04.webp', w: 1600, h: 2000 },
        { src: '../assets/images/crossa/crossa-09.webp', w: 1600, h: 2000 },
        { src: '../assets/images/crossa/crossa-06.webp', w: 1600, h: 2000 },
        { src: '../assets/images/crossa/crossa-11.webp', w: 1600, h: 350 },
        { src: '../assets/images/crossa/crossa-07.webp', w: 1600, h: 2000 },
        { src: '../assets/images/crossa/crossa-03.webp', w: 1600, h: 2000 },
        { src: '../assets/images/crossa/crossa-10.webp', w: 1600, h: 2000 },
        { src: '../assets/images/crossa/crossa-01.webp', w: 1600, h: 2000 },
        { src: '../assets/images/crossa/crossa-08.webp', w: 1600, h: 900 }
      ]
    },
    {
      slug: 'sable-leather',
      category: 'branding',
      year: '2025',
      accent: '#8765CB',
      titleEn: 'Tunay', titleAr: 'Tunay',
      catLabelEn: 'Brand Identity', catLabelAr: 'هوية بصرية',
      clientEn: 'Sable Leather Co.', clientAr: 'سيبل لصناعة الجلود',
      roleEn: 'Identity · Typography · Art Direction',
      roleAr: 'هوية · طباعة · إدارة فنية',
      leadEn: 'A leather-goods mark built to age as well as the product does.',
      leadAr: 'علامة لمنتجات جلدية صُممت لتزداد جمالاً مع الوقت، تماماً كالمنتج.',
      descEn: 'A restrained identity system for a small-batch leather workshop — a monogram that works stamped, embossed, or foiled, paired with a warm, tactile type pairing. Nothing about the system depends on colour, so it survives on raw hide as well as it does on paper.',
      descAr: 'نظام هوية رصين لورشة جلود تصنع دفعات محدودة — شعار حرفي يعمل مطبوعاً بالحرارة أو بارزاً أو بالرقائق المعدنية، مع أزواج خطوط دافئة وملموسة. لا يعتمد النظام على اللون إطلاقاً، فينجح على الجلد الخام كما ينجح على الورق.',
      services: [
        { en: 'Brand Strategy', ar: 'استراتيجية العلامة' },
        { en: 'Visual Identity', ar: 'الهوية البصرية' },
        { en: 'Typography', ar: 'الطباعة' }
      ],
      cover: '../assets/images/tunay/tunay-01.webp',
      images: [
        { src: '../assets/images/tunay/tunay-06.webp', w: 1600, h: 500 },
        { src: '../assets/images/tunay/tunay-08.webp', w: 1600, h: 2000 },
        { src: '../assets/images/tunay/tunay-05.webp', w: 1600, h: 2000 },
        { src: '../assets/images/tunay/tunay-01.webp', w: 1600, h: 2000 },
        { src: '../assets/images/tunay/tunay-02.webp', w: 1600, h: 2000 },
        { src: '../assets/images/tunay/tunay-07.webp', w: 1600, h: 2000 },
        { src: '../assets/images/tunay/tunay-03.webp', w: 1600, h: 2000 },
        { src: '../assets/images/tunay/tunay-04.webp', w: 1600, h: 700 }
      ]
    },
    {
      slug: 'pivot-analytics',
      category: 'uiux',
      year: '2025',
      accent: '#00FAA8',
      titleEn: 'Zetso', titleAr: 'Zetso',
      catLabelEn: 'Brand Identity', catLabelAr: 'هوية بصرية',
      clientEn: 'Pivot Analytics', clientAr: 'بيفوت للتحليلات',
      roleEn: 'Product Design · Data Visualization · Prototyping',
      roleAr: 'تصميم منتج · تصور البيانات · نماذج تفاعلية',
      leadEn: 'Making a dense analytics dashboard readable in one glance.',
      leadAr: 'جعل لوحة تحليلات كثيفة البيانات مفهومة بنظرة واحدة.',
      descEn: 'A redesign of a B2B analytics dashboard where the old version buried the one metric that mattered under a dozen equally-loud charts. We rebuilt the hierarchy around a single headline number per view, with detail available on demand instead of upfront.',
      descAr: 'إعادة تصميم لوحة تحليلات لشركات كانت نسختها القديمة تدفن المؤشر الأهم تحت عشرات الرسوم البيانية متساوية الصوت. أعدنا بناء التسلسل حول رقم رئيسي واحد لكل شاشة، مع تفاصيل متاحة عند الطلب لا مفروضة مسبقاً.',
      services: [
        { en: 'UX Research', ar: 'بحث تجربة المستخدم' },
        { en: 'UI Design', ar: 'تصميم الواجهات' },
        { en: 'Data Visualization', ar: 'تصور البيانات' }
      ],
      cover: '../assets/images/zetso/zetso.webp',
      images: [
        { src: '../assets/images/zetso/zetso-05.webp', w: 1600, h: 900 },
        { src: '../assets/images/zetso/zetso-08.webp', w: 2000, h: 1000 },
        { src: '../assets/images/zetso/zetso-07.webp', w: 1600, h: 2000 },
        { src: '../assets/images/zetso/zetso-06.webp', w: 1600, h: 2000 },
        { src: '../assets/images/zetso/zetso-01.webp', w: 1600, h: 900 },
        { src: '../assets/images/zetso/zetso-09.webp', w: 1600, h: 2000 },
        { src: '../assets/images/zetso/zetso-04.webp', w: 1600, h: 2000 },
        { src: '../assets/images/zetso/zetso-11.webp', w: 1600, h: 900 },
        { src: '../assets/images/zetso/zetso-02.webp', w: 1600, h: 2000 },
        { src: '../assets/images/zetso/zetso-10.webp', w: 1600, h: 2000 },
        { src: '../assets/images/zetso/zetso-03.webp', w: 1600, h: 700 }
      ]
    },
    {
      slug: 'mira-teas',
      category: 'branding',
      year: '2023',
      accent: '#1E1E1E',
      titleEn: 'ALAVEXA', titleAr: 'ALAVEXA',
      catLabelEn: 'Brand Identity', catLabelAr: 'هوية بصرية',
      clientEn: 'Alavexa', clientAr: 'Alavexa',
      roleEn: 'Identity · Typography · Art Direction',
      roleAr: 'هوية · طباعة · إدارة فنية',
      leadEn: 'A contemporary fashion identity built on minimalism and timeless design.',
      leadAr: 'هوية بصرية لعلامة أزياء عصرية مبنية على البساطة والتصميم الخالد.',
      descEn: 'ALAVEXA is a contemporary fashion brand built on minimalism, comfort, and timeless design.',
      descAr: 'ALAVEXA علامة أزياء عصرية مبنية على البساطة والراحة والتصميم الخالد.',
      services: [
        { en: 'Brand Strategy', ar: 'استراتيجية العلامة' },
        { en: 'Visual Identity', ar: 'الهوية البصرية' },
        { en: 'Typography', ar: 'الطباعة' }
      ],
      cover: '../assets/images/alavxa/alavxa-11.webp',
      images: [
        { src: '../assets/images/alavxa/alavxa-11.webp', w: 1600, h: 900 },
        { src: '../assets/images/alavxa/alavxa-04.webp', w: 1600, h: 2000 },
        { src: '../assets/images/alavxa/alavxa-09.webp', w: 1600, h: 2000 },
        { src: '../assets/images/alavxa/alavxa-02.webp', w: 1600, h: 900 },
        { src: '../assets/images/alavxa/alavxa-06.webp', w: 1600, h: 2000 },
        { src: '../assets/images/alavxa/alavxa-03.webp', w: 1600, h: 2000 },
        { src: '../assets/images/alavxa/alavxa-10.webp', w: 1600, h: 900 },
        { src: '../assets/images/alavxa/alavxa-08.webp', w: 1600, h: 2000 },
        { src: '../assets/images/alavxa/alavxa-05.webp', w: 1600, h: 2000 },
        { src: '../assets/images/alavxa/alavxa-01.webp', w: 1600, h: 700 }
      ]
    }
  ];

  
  var COPY = {
    client:   { en: 'Client',    ar: 'العميل' },
    year:     { en: 'Year',      ar: 'السنة' },
    services: { en: 'Services',  ar: 'الخدمات' },
    scope:    { en: 'Scope',     ar: 'نطاق العمل' },
    next:     { en: 'Next project', ar: 'المشروع التالي' },
    view:     { en: 'View case study', ar: 'استعرض دراسة الحالة' }
  };


  var grid = document.getElementById('pfGrid');
  var modal = document.getElementById('pfModal');
  if (!grid || !modal) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var lang = document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';

  var scrollEl   = document.getElementById('pfModalScroll');
  var progressEl = document.getElementById('pfModalProgress');
  var heroEl     = document.getElementById('pfHero');
  var heroImgEl  = document.getElementById('pfHeroImg');
  var galleryEl  = document.getElementById('pfGallery');
  var barTitleEl = document.getElementById('pfBarTitle');
  var barCatEl   = document.getElementById('pfBarCat');
  var counterEl  = document.getElementById('pfCounter');
  var nextWrapEl = document.getElementById('pfNext');

  var cards = [];
  var currentIndex = -1;
  var lastTrigger = null;
  var shotObserver = null;

  function t(entry) { return entry[lang]; }

  function el(tag, className, parent) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (parent) parent.appendChild(node);
    return node;
  }

  
  function bilingual(node, en, ar) {
    node.setAttribute('data-en', en);
    node.setAttribute('data-ar', ar);
    node.textContent = lang === 'ar' ? ar : en;
    return node;
  }


  function buildCard(project, index) {
    var card = el('article', 'pf-card');
    card.setAttribute('data-category', project.category);
    card.setAttribute('data-index', String(index));
    card.style.setProperty('--accent', project.accent);

    var trigger = el('button', 'pf-card-trigger', card);
    trigger.type = 'button';
    trigger.setAttribute('aria-label', project.titleEn + ' — ' + COPY.view.en);

    
    var frame = el('span', 'pf-card-frame', trigger);
    var media = el('span', 'pf-card-media', frame);

    var img = new Image();
    img.className = 'pf-card-img';
    img.src = project.cover;
    img.alt = '';
    img.loading = index < 2 ? 'eager' : 'lazy';
    img.decoding = 'async';
    media.appendChild(img);

    el('span', 'pf-card-veil', frame);

    var idx = el('span', 'pf-card-index', frame);
    idx.textContent = String(index + 1).padStart(2, '0');

    var tags = el('span', 'pf-card-tags', frame);
    project.services.forEach(function (service) {
      bilingual(el('span', 'pf-card-tag', tags), service.en, service.ar);
    });

    var cta = el('span', 'pf-card-cta', frame);
    cta.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg>';

    
    var foot = el('span', 'pf-card-foot', trigger);
    var head = el('span', 'pf-card-head', foot);
    bilingual(el('span', 'pf-card-title', head), project.titleEn, project.titleAr);

    var meta = el('span', 'pf-card-meta', foot);
    bilingual(el('span', 'pf-card-cat', meta), project.catLabelEn, project.catLabelAr);

    trigger.addEventListener('click', function () { openReader(index, img); });

    if (finePointer && !reduceMotion) attachPointerParallax(card, media);

    return card;
  }

  
  function attachPointerParallax(card, media) {
    var frame = 0;
    var tx = 0, ty = 0;

    function apply() {
      frame = 0;
      media.style.setProperty('--px', tx.toFixed(2) + '%');
      media.style.setProperty('--py', ty.toFixed(2) + '%');
    }

    card.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * -2.4;
      ty = ((e.clientY - r.top) / r.height - 0.5) * -2.4;
      if (!frame) frame = requestAnimationFrame(apply);
    });

    card.addEventListener('pointerleave', function () {
      tx = 0; ty = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    });
  }

  function renderGrid() {
    var frag = document.createDocumentFragment();
    cards = PROJECTS.map(function (project, i) {
      var card = buildCard(project, i);
      frag.appendChild(card);
      return card;
    });
    grid.innerHTML = '';
    grid.appendChild(frag);
    assignSpans();
  }

  
  function assignSpans() {
    var visible = cards.filter(function (c) { return !c.hidden; });
    var col = 0;
    var row = 0;

    visible.forEach(function (card) {
      var isLead = col === 0;
      var span;

      if (isLead) {
        span = row % 2 === 0 ? 7 : 5;
      } else {
        span = 12 - col;
      }

      card.style.setProperty('--span', span);
      card.classList.toggle('pf-card--lead', isLead);
      card.classList.toggle('pf-card--wide', span >= 7);

      col += span;
      if (col >= 12) { col = 0; row++; }
    });
  }


  function buildMetaRow(dl, label, valueEn, valueAr) {
    var dt = el('dt', 'pf-meta-label', dl);
    bilingual(dt, label.en, label.ar);
    var dd = el('dd', 'pf-meta-value', dl);
    bilingual(dd, valueEn, valueAr);
  }

  function populate(index) {
    var p = PROJECTS[index];
    modal.style.setProperty('--accent', p.accent);

    
    bilingual(barTitleEl, p.titleEn, p.titleAr);
    bilingual(barCatEl, p.catLabelEn, p.catLabelAr);
    counterEl.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(PROJECTS.length).padStart(2, '0');

    
    heroImgEl.src = p.cover;
    heroImgEl.alt = p.titleEn;
    bilingual(document.getElementById('pfHeroTitle'), p.titleEn, p.titleAr);
    bilingual(document.getElementById('pfHeroCat'), p.catLabelEn, p.catLabelAr);

    
    bilingual(document.getElementById('pfLead'), p.leadEn, p.leadAr);
    bilingual(document.getElementById('pfDesc'), p.descEn, p.descAr);

    
    var dl = document.getElementById('pfMeta');
    dl.innerHTML = '';
    buildMetaRow(dl, COPY.client, p.clientEn, p.clientAr);
    buildMetaRow(dl, COPY.scope, p.roleEn, p.roleAr);

    var dt = el('dt', 'pf-meta-label', dl);
    bilingual(dt, COPY.services.en, COPY.services.ar);
    var dd = el('dd', 'pf-meta-value', dl);
    var chips = el('span', 'pf-meta-chips', dd);
    p.services.forEach(function (s) {
      bilingual(el('span', 'pf-chip', chips), s.en, s.ar);
    });

    
    if (shotObserver) shotObserver.disconnect();
    galleryEl.innerHTML = '';
    var frag = document.createDocumentFragment();

    p.images.forEach(function (image, i) {
      var figure = el('figure', 'pf-shot');
      var ratio = image.w / image.h;
      figure.style.setProperty('--ratio', ratio.toFixed(4));
      if (ratio >= 1.2) figure.classList.add('pf-shot--full');

      var img = new Image();
      img.className = 'pf-shot-img';
      img.src = image.src;
      img.alt = p.titleEn + ' — ' + (i + 1);
      img.loading = i < 1 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.width = image.w;
      img.height = image.h;

      var done = function () { figure.classList.add('is-loaded'); };
      if (img.complete) done(); else img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });

      figure.appendChild(img);
      frag.appendChild(figure);
    });

    galleryEl.appendChild(frag);
    observeShots();

    
    buildNextTeaser(index);
  }

  function buildNextTeaser(index) {
    if (!nextWrapEl) return;
    var nextIndex = (index + 1) % PROJECTS.length;
    var n = PROJECTS[nextIndex];

    nextWrapEl.innerHTML = '';
    nextWrapEl.style.setProperty('--accent', n.accent);

    var btn = el('button', 'pf-next-card', nextWrapEl);
    btn.type = 'button';
    btn.setAttribute('aria-label', COPY.next.en + ': ' + n.titleEn);

    var img = new Image();
    img.className = 'pf-next-img';
    img.src = n.cover;
    img.alt = '';
    img.loading = 'lazy';
    btn.appendChild(img);

    el('span', 'pf-next-scrim', btn).setAttribute('aria-hidden', 'true');

    var inner = el('div', 'pf-next-inner', btn);

    var label = el('span', 'pf-next-label', inner);
    bilingual(label, COPY.next.en, COPY.next.ar);

    var titleRow = el('div', 'pf-next-title-row', inner);

    var text = el('div', 'pf-next-text', titleRow);
    bilingual(el('span', 'pf-next-title', text), n.titleEn, n.titleAr);
    bilingual(el('span', 'pf-next-cat', text), n.catLabelEn, n.catLabelAr);

    var arrow = el('span', 'pf-next-arrow', titleRow);
    arrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

    btn.addEventListener('click', function () { goTo(1); });
  }

  function observeShots() {
    var shots = galleryEl.querySelectorAll('.pf-shot');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      shots.forEach(function (s) { s.classList.add('is-in'); });
      return;
    }
    shotObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        shotObserver.unobserve(entry.target);
      });
    }, { root: scrollEl, threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    shots.forEach(function (s) { shotObserver.observe(s); });
  }

  
  function flyCoverIntoHero(sourceImg, done) {
    if (reduceMotion || !sourceImg || typeof sourceImg.animate !== 'function') {
      done();
      return;
    }

    var from = sourceImg.getBoundingClientRect();
    if (!from.width || !from.height) { done(); return; }

    var clone = document.createElement('img');
    clone.src = sourceImg.currentSrc || sourceImg.src;
    clone.className = 'pf-fly';
    clone.alt = '';
    clone.setAttribute('aria-hidden', 'true');
    clone.style.cssText =
      'position:fixed;z-index:500;margin:0;object-fit:cover;pointer-events:none;' +
      'border-radius:var(--radius-md);will-change:transform,width,height,border-radius;' +
      'left:' + from.left + 'px;top:' + from.top + 'px;' +
      'width:' + from.width + 'px;height:' + from.height + 'px;';
    document.body.appendChild(clone);

    var radius = getComputedStyle(document.documentElement)
      .getPropertyValue('--radius-md').trim() || '14px';
    modal.classList.add('is-open', 'is-entering');
    modal.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(function () {
      var to = heroImgEl.getBoundingClientRect();
      if (!to.width || !to.height) { clone.remove(); done(); return; }

      var anim = clone.animate(
        [
          { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px', borderRadius: radius },
          { left: to.left + 'px', top: to.top + 'px', width: to.width + 'px', height: to.height + 'px', borderRadius: '0px' }
        ],
        { duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      );

      var finish = function () {
        clone.remove();
        done();
      };
      anim.addEventListener('finish', finish, { once: true });
      anim.addEventListener('cancel', finish, { once: true });
      setTimeout(function () { if (clone.isConnected) finish(); }, 900);
    });
  }

  function openReader(index, sourceImg) {
    lastTrigger = document.activeElement;
    currentIndex = index;
    populate(index);

    document.body.classList.add('pf-modal-lock');
    if (scrollEl) scrollEl.scrollTop = 0;
    setProgress(0);

    var reveal = function () {
      modal.classList.remove('is-entering');
      modal.classList.add('is-ready');
      var closeBtn = document.getElementById('pfClose');
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    };

    if (sourceImg) {
      flyCoverIntoHero(sourceImg, reveal);
    } else {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(reveal);
    }

    setHash(PROJECTS[index].slug);
  }

  function closeReader() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pf-modal-lock');
    if (shotObserver) { shotObserver.disconnect(); shotObserver = null; }
    clearHash();

    window.setTimeout(function () {
      if (modal.classList.contains('is-open')) return;
      modal.classList.remove('is-ready', 'is-entering', 'is-scrolled', 'is-swapping');
    }, reduceMotion ? 0 : 320);

    if (lastTrigger && document.contains(lastTrigger)) {
      lastTrigger.focus({ preventScroll: true });
    }
    currentIndex = -1;
  }

  
  function goTo(delta) {
    if (currentIndex < 0) return;
    var next = (currentIndex + delta + PROJECTS.length) % PROJECTS.length;
    currentIndex = next;

    modal.classList.add('is-swapping');
    window.setTimeout(function () {
      populate(next);
      if (scrollEl) scrollEl.scrollTop = 0;
      setProgress(0);
      setHash(PROJECTS[next].slug, true);
      modal.classList.remove('is-swapping');
    }, reduceMotion ? 0 : 220);
  }

  function setProgress(ratio) {
    if (progressEl) progressEl.style.transform = 'scaleX(' + ratio + ')';
  }


  var suppressHash = false;
  var pushedEntry = false;

  
  function writeUrl(method, url) {
    try {
      suppressHash = true;
      history[method]({ pf: true }, '', url);
      return true;
    } catch (err) {
      return false;
    } finally {
      suppressHash = false;
    }
  }

  function setHash(slug, replace) {
    var url = '#work/' + slug;
    var method = (replace || pushedEntry) ? 'replaceState' : 'pushState';
    if (writeUrl(method, url) && method === 'pushState') pushedEntry = true;
  }

  function clearHash() {
    if (location.hash.indexOf('#work/') !== 0) { pushedEntry = false; return; }
    writeUrl('replaceState', location.pathname + location.search);
    pushedEntry = false;
  }

  function indexFromHash() {
    var match = /^#work\/(.+)$/.exec(location.hash);
    if (!match) return -1;
    for (var i = 0; i < PROJECTS.length; i++) {
      if (PROJECTS[i].slug === match[1]) return i;
    }
    return -1;
  }


  function focusables() {
    return Array.prototype.filter.call(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (node) { return node.getClientRects().length > 0 && !node.disabled; }
    );
  }

  function bindReader() {
    var closeBtn = document.getElementById('pfClose');
    var prevBtn = document.getElementById('pfPrev');
    var nextBtn = document.getElementById('pfNextBtn');
    var topBtn = document.getElementById('pfTop');

    if (closeBtn) closeBtn.addEventListener('click', closeReader);
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(1); });
    if (topBtn) topBtn.addEventListener('click', function () {
      if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;

      if (e.key === 'Escape') { closeReader(); return; }

      if (e.key === 'ArrowRight') { goTo(document.documentElement.dir === 'rtl' ? -1 : 1); return; }
      if (e.key === 'ArrowLeft') { goTo(document.documentElement.dir === 'rtl' ? 1 : -1); return; }
      if (e.key === 'Tab') {
        var list = focusables();
        if (!list.length) return;
        var first = list[0];
        var last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });

    if (scrollEl) {
      var ticking = false;
      scrollEl.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          var max = scrollEl.scrollHeight - scrollEl.clientHeight;
          setProgress(max > 0 ? Math.min(scrollEl.scrollTop / max, 1) : 0);
          modal.classList.toggle('is-scrolled', scrollEl.scrollTop > 60);
        });
      }, { passive: true });
    }

    window.addEventListener('popstate', function () {
      if (suppressHash) return;
      var idx = indexFromHash();
      if (idx === -1) {
        if (modal.classList.contains('is-open')) closeReader();
      } else if (idx !== currentIndex) {
        openReader(idx, null);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderGrid();
    bindReader();
    var deep = indexFromHash();
    if (deep > -1) openReader(deep, null);
    var pending = 0;
    window.addEventListener('resize', function () {
      if (pending) return;
      pending = requestAnimationFrame(function () { pending = 0; assignSpans(); });
    });
  });

  window.addEventListener('langChanged', function (e) {
    lang = e.detail;
  });
})();
