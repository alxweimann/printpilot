export type MaterialPricingMode = "perSheet" | "perReam" | "perKg"

export type MaterialType =
  | "Bilderdruck"
  | "Offset"
  | "Naturpapier"
  | "Karton"
  | "Synthetik"
  | "Rollenmaterial"

export type GrainDirection = "Schmalbahn" | "Breitbahn" | "Unbekannt"

export type Material = {
  id: string
  name: string
  type: MaterialType
  supplier: string
  widthMm: number
  heightMm: number
  grammage: number
  sheetsPerReam: number
  pricingMode: MaterialPricingMode
  pricePerSheet?: number
  pricePerReam?: number
  pricePerKg?: number
  stockSheets: number
  minimumStockSheets: number
  grainDirection: GrainDirection
  notes?: string
}

export const materials: Material[] = [
  {
    id: "sra3-bd-matt-300",
    name: "SRA3 Bilderdruck matt 300 g",
    type: "Bilderdruck",
    supplier: "Papier Union",
    widthMm: 450,
    heightMm: 320,
    grammage: 300,
    sheetsPerReam: 500,
    pricingMode: "perKg",
    pricePerKg: 2.4,
    stockSheets: 1850,
    minimumStockSheets: 1000,
    grainDirection: "Schmalbahn",
    notes: "Standardmaterial für hochwertige Flyer, Karten und Umschläge.",
  },
  {
    id: "sra3-offset-120",
    name: "SRA3 Offset 120 g",
    type: "Offset",
    supplier: "Igepa",
    widthMm: 450,
    heightMm: 320,
    grammage: 120,
    sheetsPerReam: 500,
    pricingMode: "perReam",
    pricePerReam: 18.5,
    stockSheets: 4200,
    minimumStockSheets: 1500,
    grainDirection: "Schmalbahn",
    notes: "Gutes Universalpapier für Briefbogen, einfache Flyer und Formulare.",
  },
  {
    id: "sra3-colorcopy-250",
    name: "SRA3 Color Copy 250 g",
    type: "Naturpapier",
    supplier: "Antalis",
    widthMm: 450,
    heightMm: 320,
    grammage: 250,
    sheetsPerReam: 500,
    pricingMode: "perSheet",
    pricePerSheet: 0.16,
    stockSheets: 760,
    minimumStockSheets: 1000,
    grainDirection: "Schmalbahn",
    notes: "Für Präsentationen, Karten und hochwertige Digitaldrucksachen.",
  },
  {
    id: "sra3-offset-170",
    name: "SRA3 Offset 170 g",
    type: "Offset",
    supplier: "Papier Union",
    widthMm: 450,
    heightMm: 320,
    grammage: 170,
    sheetsPerReam: 500,
    pricingMode: "perKg",
    pricePerKg: 2.15,
    stockSheets: 2300,
    minimumStockSheets: 1200,
    grainDirection: "Schmalbahn",
    notes: "Solides Papier für Flyer, Broschürenumschläge und Beileger.",
  },
  {
    id: "sra3-bd-glanz-135",
    name: "SRA3 Bilderdruck glänzend 135 g",
    type: "Bilderdruck",
    supplier: "Igepa",
    widthMm: 450,
    heightMm: 320,
    grammage: 135,
    sheetsPerReam: 500,
    pricingMode: "perKg",
    pricePerKg: 2.05,
    stockSheets: 950,
    minimumStockSheets: 1200,
    grainDirection: "Schmalbahn",
    notes: "Glänzende Flyer und Beilagen.",
  },
  {
    id: "sra3-karton-350",
    name: "SRA3 Chromokarton 350 g",
    type: "Karton",
    supplier: "Antalis",
    widthMm: 450,
    heightMm: 320,
    grammage: 350,
    sheetsPerReam: 250,
    pricingMode: "perReam",
    pricePerReam: 67.5,
    stockSheets: 520,
    minimumStockSheets: 500,
    grainDirection: "Breitbahn",
    notes: "Stärkeres Material für Karten, Gutscheine und Einladungen.",
  },
  {
    id: "roland-vinyl-matt",
    name: "Vinylfolie matt weiß",
    type: "Rollenmaterial",
    supplier: "Gröner",
    widthMm: 1370,
    heightMm: 1000,
    grammage: 0,
    sheetsPerReam: 1,
    pricingMode: "perSheet",
    pricePerSheet: 4.9,
    stockSheets: 28,
    minimumStockSheets: 10,
    grainDirection: "Unbekannt",
    notes: "Preis pro laufendem Meter bei 1370 mm Rollenbreite.",
  },
]