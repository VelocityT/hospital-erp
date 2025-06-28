export function generateUniqueNumber(prefix) {
  const now = Date.now().toString().slice(-6);
  const rand = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}-${now}${rand}`;
}
