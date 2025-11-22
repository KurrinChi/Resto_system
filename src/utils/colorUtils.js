// Convert hex to RGB
export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};
// Convert RGB to Hex
export const rgbToHex = (r, g, b) => {
    return ("#" +
        [r, g, b]
            .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        })
            .join(""));
};
// Lighten or darken a color
export const adjustColor = (hex, percent) => {
    const rgb = hexToRgb(hex);
    if (!rgb)
        return hex;
    const adjust = (value) => {
        const adjusted = Math.round(value + (255 - value) * (percent / 100));
        return Math.max(0, Math.min(255, adjusted));
    };
    return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
};
// Generate light variant (20% lighter)
export const getLightVariant = (hex) => adjustColor(hex, 20);
// Generate dark variant (20% darker)
export const getDarkVariant = (hex) => adjustColor(hex, -20);
