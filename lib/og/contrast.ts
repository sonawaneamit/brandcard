export function luminance(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const a = [r, g, b].map(v => 
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function contrastRatio(fg: string, bg: string) {
  const L1 = luminance(fg) + 0.05;
  const L2 = luminance(bg) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
}

export function isAccessibleContrast(fg: string, bg: string, level: "AA" | "AAA" = "AA") {
  const ratio = contrastRatio(fg, bg);
  return level === "AA" ? ratio >= 4.5 : ratio >= 7;
}
