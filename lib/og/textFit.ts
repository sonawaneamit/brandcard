export function clampFont(
  base: number, 
  min: number, 
  max: number, 
  len: number, 
  maxLen: number
) {
  if (!maxLen) return Math.min(max, Math.max(min, base));
  const ratio = Math.max(
    0.6, 
    1 - (len - Math.min(len, maxLen)) / Math.max(1, maxLen * 2)
  );
  const size = base * ratio;
  return Math.min(max, Math.max(min, Math.floor(size)));
}

export function ellipsize(s: string, maxLen?: number) {
  if (!maxLen) return s;
  return s.length <= maxLen ? s : s.slice(0, Math.max(0, maxLen - 1)) + "…";
}
