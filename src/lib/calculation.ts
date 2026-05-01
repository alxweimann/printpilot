import type { Material, MaterialPricingMode } from "../data/materials"

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value)
}

export function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function calculateSheetAreaSqm(widthMm: number, heightMm: number) {
  return (widthMm * heightMm) / 1_000_000
}

export function calculateSheetWeightKg(
  widthMm: number,
  heightMm: number,
  grammage: number,
) {
  const areaSqm = calculateSheetAreaSqm(widthMm, heightMm)
  return (areaSqm * grammage) / 1000
}

export function calculateMaterialPricePerSheet(material: Material) {
  if (material.pricingMode === "perSheet") {
    return material.pricePerSheet ?? 0
  }

  if (material.pricingMode === "perReam") {
    return (material.pricePerReam ?? 0) / Math.max(material.sheetsPerReam, 1)
  }

  const sheetWeightKg = calculateSheetWeightKg(
    material.widthMm,
    material.heightMm,
    material.grammage,
  )

  return sheetWeightKg * (material.pricePerKg ?? 0)
}

export function getPricingModeLabel(mode: MaterialPricingMode) {
  if (mode === "perSheet") return "€/Bogen"
  if (mode === "perReam") return "€/Ries"
  return "€/kg"
}

export function getClicksForColorMode(colorMode: string) {
  if (colorMode === "4/0 farbig") {
    return {
      colorClicksPerSheet: 1,
      blackClicksPerSheet: 0,
    }
  }

  if (colorMode === "4/4 farbig") {
    return {
      colorClicksPerSheet: 2,
      blackClicksPerSheet: 0,
    }
  }

  if (colorMode === "1/0 schwarz") {
    return {
      colorClicksPerSheet: 0,
      blackClicksPerSheet: 1,
    }
  }

  if (colorMode === "1/1 schwarz") {
    return {
      colorClicksPerSheet: 0,
      blackClicksPerSheet: 2,
    }
  }

  return {
    colorClicksPerSheet: 0,
    blackClicksPerSheet: 0,
  }
}