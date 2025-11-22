export function resolveImage(src?: string | null, fallback?: string) {
  const PLACEHOLDER = fallback || '';
  if (!src) return PLACEHOLDER;

  // If already absolute URL, return as-is
  if (/^https?:\/\//i.test(src)) return src;

  // Determine API base (strip any /api paths)
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  let base = raw;
  try {
    const u = new URL(raw);
    // if path contains /api, strip it to get site root
    if (u.pathname && u.pathname.startsWith('/api')) {
      u.pathname = '/';
    }
    base = u.origin;
  } catch (e) {
    // fallback: remove /api part by regex
    base = raw.replace(/\/api\/.*/i, '').replace(/\/$/, '') || 'http://localhost:8000';
  }

  // If src already begins with a slash, treat as absolute path on server
  if (src.startsWith('/')) {
    return `${base}${src}`;
  }

  // Otherwise assume relative path under server root
  return `${base}/${src}`;
}

export default resolveImage;
