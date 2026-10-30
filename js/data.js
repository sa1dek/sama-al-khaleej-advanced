const galleryDataScript = document.querySelector('script[src$="js/data.js"]');
const galleryAssetsBase = new URL(
  "../assets/img/",
  galleryDataScript?.src || document.baseURI,
);

const galleryImages = [
  "25.jpeg",
  "1.jpeg",
  "2.jpeg",
  "3.jpeg",
  "4.jpeg",
  "5.jpeg",
].map((src, index) => ({
  src: new URL(src, galleryAssetsBase).href,
  title: [
    "تنظيف كنب",
    "تنظيف كنب وأرضيات",
    "تنظيف فيلا",
    "تنظيف كنب",
    "عناية بالمفروشات والأرضيات",
    "تنظيف خزان",
  ][index],
}));

const galleryVideos = Array.from(
  { length: 19 },
  (_, index) => `${index + 6}.mp4`,
).map((src) => ({
  src: new URL(src, galleryAssetsBase).href,
  title: "فيديو من خدمات التنظيف",
}));

window.SAMA_GALLERY = {
  images: galleryImages,
  videos: galleryVideos,
  featured: [
    { ...galleryImages[0], type: "image" },
    { ...galleryImages[2], type: "image" },
    ...galleryVideos.slice(0, 4).map((item) => ({ ...item, type: "video" })),
  ],
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
