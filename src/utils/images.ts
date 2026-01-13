
const IMAGES_BASE = "https://fayez.store/uploads/"

const LEGACY_IMAGE_PREFIXES = [
  "https://fayez.store/uploads/",
]

export function getImageUrl(image?: string | null): string {
  if (!image) {
    return "/placeholder.png"
  }

  // لو الرابط يبدأ بأي Prefix قديم، نحوله لمسار نسبي (اسم الملف فقط)
  for (const prefix of LEGACY_IMAGE_PREFIXES) {
    if (image.startsWith(prefix)) {
      image = image.slice(prefix.length)
      break
    }
  }

  // لو الرابط بالفعل كامل (http / https) أو data/blob URL (لمكان خارجي) نرجّعه كما هو
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image
  }

  // لو المسار بيبدأ بـ "/uploads/" أو "uploads/" نشيل الجزء ده لتفادي تكرار "uploads"
  const normalized = image
    .replace(/^\/uploads\//, "") // /uploads/foo.jpg -> foo.jpg
    .replace(/^uploads\//, "")  // uploads/foo.jpg -> foo.jpg
    .replace(/^\//, "")        // /foo.jpg -> foo.jpg

  return `${IMAGES_BASE}${normalized}`
}


