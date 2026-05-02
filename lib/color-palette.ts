import type { DesignPalette } from "./card-data";

export function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function getColorScore([red, green, blue, count]: [number, number, number, number]) {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return count * (0.7 + saturation) * (brightness > 28 && brightness < 245 ? 1 : 0.35);
}

function getBrightness(hexColor: string) {
  const red = Number.parseInt(hexColor.slice(1, 3), 16);
  const green = Number.parseInt(hexColor.slice(3, 5), 16);
  const blue = Number.parseInt(hexColor.slice(5, 7), 16);

  return (red * 299 + green * 587 + blue * 114) / 1000;
}

function hexToRgb(hexColor: string) {
  return {
    red: Number.parseInt(hexColor.slice(1, 3), 16),
    green: Number.parseInt(hexColor.slice(3, 5), 16),
    blue: Number.parseInt(hexColor.slice(5, 7), 16),
  };
}

function rgbToHsl(red: number, green: number, blue: number) {
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness };
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;

  if (max === normalizedRed) {
    hue = 60 * (((normalizedGreen - normalizedBlue) / delta) % 6);
  } else if (max === normalizedGreen) {
    hue = 60 * ((normalizedBlue - normalizedRed) / delta + 2);
  } else {
    hue = 60 * ((normalizedRed - normalizedGreen) / delta + 4);
  }

  return { hue: hue < 0 ? hue + 360 : hue, saturation, lightness };
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const match = lightness - chroma / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return rgbToHex(
    Math.round((red + match) * 255),
    Math.round((green + match) * 255),
    Math.round((blue + match) * 255),
  );
}

function getColorDistance(firstColor: string, secondColor: string) {
  const first = hexToRgb(firstColor);
  const second = hexToRgb(secondColor);

  return Math.sqrt(
    (first.red - second.red) ** 2 +
      (first.green - second.green) ** 2 +
      (first.blue - second.blue) ** 2,
  );
}

function buildSuggestedPalette(colors: string[], fallback: DesignPalette): DesignPalette {
  const primaryColor = colors[0] ?? fallback.primaryColor;
  const secondaryLogoColor = colors.find(
    (color) => getColorDistance(color, primaryColor) > 72 && getBrightness(color) < 230,
  );
  const { red, green, blue } = hexToRgb(primaryColor);
  const primaryHsl = rgbToHsl(red, green, blue);
  const isNeutralLogo = primaryHsl.saturation < 0.16;
  const softBrandColor = hslToHex(primaryHsl.hue, Math.max(primaryHsl.saturation * 0.34, 0.12), 0.9);
  const deeperBrandColor = hslToHex(primaryHsl.hue, Math.min(primaryHsl.saturation * 1.05, 0.78), 0.23);

  if (isNeutralLogo) {
    return {
      primaryColor,
      secondaryColor: colors.find((color) => getBrightness(color) > 130 && getBrightness(color) < 235) ?? "#e5e7eb",
      darkColor: colors.find((color) => getBrightness(color) < 90) ?? "#111827",
    };
  }

  return {
    primaryColor,
    secondaryColor: secondaryLogoColor ?? softBrandColor,
    darkColor: colors.find((color) => getBrightness(color) < 90) ?? deeperBrandColor,
  };
}

export function buildSuggestedPalettes(colors: string[], fallback: DesignPalette): DesignPalette[] {
  const basePalette = buildSuggestedPalette(colors, fallback);
  const primaryColor = basePalette.primaryColor;
  const secondaryLogoColor = colors.find(
    (color) => getColorDistance(color, primaryColor) > 72 && getBrightness(color) < 230,
  );
  const { red, green, blue } = hexToRgb(primaryColor);
  const { hue, saturation, lightness } = rgbToHsl(red, green, blue);
  const richSaturation = Math.max(saturation, 0.42);
  const softSaturation = Math.max(saturation * 0.28, 0.1);
  const darkNeutral = colors.find((color) => getBrightness(color) < 85) ?? "#111827";
  const softNeutral = colors.find((color) => getBrightness(color) > 150 && getBrightness(color) < 235) ?? "#e5e7eb";
  const darkBrand = hslToHex(hue, Math.min(richSaturation, 0.76), 0.22);
  const deepBrand = hslToHex(hue, Math.min(richSaturation, 0.7), 0.16);
  const softBrand = hslToHex(hue, softSaturation, 0.9);
  const midBrand = hslToHex(hue, Math.min(richSaturation, 0.72), Math.min(Math.max(lightness, 0.36), 0.52));
  const complement = hslToHex((hue + 180) % 360, Math.min(richSaturation, 0.58), 0.42);
  const analogous = hslToHex((hue + 28) % 360, Math.min(richSaturation, 0.62), 0.44);
  const secondAnalogous = hslToHex((hue + 332) % 360, Math.min(richSaturation, 0.62), 0.46);
  const palettes: DesignPalette[] = [
    basePalette,
    { primaryColor, secondaryColor: softBrand, darkColor: darkNeutral },
    { primaryColor: midBrand, secondaryColor: secondaryLogoColor ?? softNeutral, darkColor: deepBrand },
    { primaryColor, secondaryColor: complement, darkColor: darkNeutral },
    { primaryColor: analogous, secondaryColor: secondAnalogous, darkColor: darkBrand },
    { primaryColor, secondaryColor: "#f3f4f6", darkColor: "#111827" },
  ];
  const uniquePalettes = new Map<string, DesignPalette>();

  palettes.forEach((palette) => {
    uniquePalettes.set(`${palette.primaryColor}-${palette.secondaryColor}-${palette.darkColor}`, palette);
  });

  while (uniquePalettes.size < 6) {
    const index = uniquePalettes.size;
    const palette = {
      primaryColor: hslToHex((hue + index * 18) % 360, Math.min(richSaturation, 0.68), 0.46),
      secondaryColor: hslToHex((hue + index * 18) % 360, softSaturation, 0.88),
      darkColor: hslToHex((hue + index * 18) % 360, Math.min(richSaturation, 0.7), 0.18),
    };

    uniquePalettes.set(`${palette.primaryColor}-${palette.secondaryColor}-${palette.darkColor}`, palette);
  }

  return [...uniquePalettes.values()].slice(0, 6);
}
