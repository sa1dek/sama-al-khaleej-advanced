const galleryDataScript = document.querySelector('script[src$="js/data.js"]');
const galleryAssetsBase = new URL(
  "../assets/img/",
  galleryDataScript?.src || document.baseURI,
);

window.SAMA_GALLERY = {
  images: [
    {
      src: new URL(
        "WhatsApp Image 2026-10-27 at 4.24.41 PM.jpeg",
        galleryAssetsBase,
      ).href,
      title: "تنظيف خزانات",
    },
    {
      src: new URL(
        "WhatsApp Image 2026-10-25 at 6.02.59 PM (2).jpeg",
        galleryAssetsBase,
      ).href,
      title: "تنظيف فيلا",
    },
    {
      src: new URL(
        "WhatsApp Image 2026-10-25 at 6.02.59 PM (3).jpeg",
        galleryAssetsBase,
      ).href,
      title: "تنظيف كنبة",
    },
  ],
  videos: [
    "WhatsApp Video 2026-10-25 at 6.02.44 PM.mp4",
    "WhatsApp Video 2026-10-25 at 6.02.45 PM.mp4",
    "WhatsApp Video 2026-10-25 at 6.02.58 PM.mp4",
    "WhatsApp Video 2026-10-25 at 6.02.58 PM (1).mp4",
    "WhatsApp Video 2026-10-25 at 6.02.58 PM (2).mp4",
    "WhatsApp Video 2026-10-25 at 6.02.59 PM.mp4",
    "WhatsApp Video 2026-10-25 at 6.02.59 PM (1).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.00 PM.mp4",
    "WhatsApp Video 2026-10-25 at 6.03.00 PM (1).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.00 PM (2).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.00 PM (3).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.00 PM (4).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.00 PM (5).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.01 PM.mp4",
    "WhatsApp Video 2026-10-25 at 6.03.01 PM (1).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.01 PM (2).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.01 PM (3).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.01 PM (4).mp4",
    "WhatsApp Video 2026-10-25 at 6.03.01 PM (5).mp4",
  ].map((src) => ({
    src: new URL(src, galleryAssetsBase).href,
    title: "فيديو من خدمات التنظيف",
  })),
};

window.SAMA_TESTIMONIALS = [
  {
    name: "البندري",
    initial: "ب",
    rating: 5,
    text: "مبدعين ما شاء الله عليهم، الله يبارك لهم ويرزقهم. شغلهم محترم ومتعاونين وخدماتهم مرة روعة. جربنا عندهم إصلاح المكيفات والنظافة وكانوا جداً روعة.",
  },
  {
    name: "سمي",
    initial: "س",
    rating: 5,
    text: "شغلهم بطل الله يوفقهم.",
  },
  {
    name: "نوره محمد",
    initial: "ن",
    rating: 5,
    text: "من أفضل من تعاملنا معهم في النظافة، دقة وسرعة إنجاز. شكراً لكم.",
  },
  {
    name: "Reem Otaibi",
    initial: "R",
    rating: 5,
    text: "طلبتهم للبيت عندي ينظفون السجاد والكنب. ما شاء الله شغلهم ممتاز وأسعارهم مناسبة.",
  },
  {
    name: "سارة الحربي",
    initial: "س",
    rating: 5,
    text: "ما شاء الله شغل جميل ومحترمين، وغير كذا أسعارهم جداً معقولة.",
  },
  {
    name: "ابراهيم سليمان",
    initial: "إ",
    rating: 5,
    text: "ما شاء الله خدمة ممتازة وما قصّروا، الله يجزاهم خير.",
  },
  {
    name: "Almaha",
    initial: "A",
    rating: 5,
    text: "شغل ممتاز.",
  },
  {
    name: "Al",
    initial: "A",
    rating: 5,
    text: "ما شاء الله تعامل راقي وجميل، وشغل ممتاز وفوق التقييم. الله يوفقهم ويرزقهم.",
  },
  {
    name: "شيمه العتيبي",
    initial: "ش",
    rating: 5,
    text: "ما شاء الله من أفضل شركات التنظيف، شغلهم ممتاز.",
  },
];
