export type FinishingPricingMode =
  | "perJob"
  | "perPiece"
  | "perSheet"
  | "perMinute"
  | "per100Pieces"

export type FinishingCategory =
  | "Schneiden"
  | "Falzen"
  | "Rillen"
  | "Heften"
  | "Leimen"
  | "Stanzen"
  | "Kuvertieren"
  | "Handarbeit"

export type FinishingOperation = {
  id: string
  name: string
  category: FinishingCategory
  pricingMode: FinishingPricingMode
  setupMinutes: number
  basePrice: number
  unitPrice: number
  minimumPrice: number
  hourlyRate: number
  active: boolean
  notes: string
}

export const finishingOperations: FinishingOperation[] = [
  {
    id: "cutting-standard",
    name: "Schneiden Standard",
    category: "Schneiden",
    pricingMode: "perSheet",
    setupMinutes: 8,
    basePrice: 8,
    unitPrice: 0.006,
    minimumPrice: 12,
    hourlyRate: 65,
    active: true,
    notes: "Planschnitt für Standard-Digitaldruckprodukte.",
  },
  {
    id: "folding-simple",
    name: "Falzen einfach",
    category: "Falzen",
    pricingMode: "per100Pieces",
    setupMinutes: 12,
    basePrice: 12,
    unitPrice: 1.8,
    minimumPrice: 18,
    hourlyRate: 70,
    active: true,
    notes: "Einbruchfalz, Wickelfalz oder Zickzackfalz nach Aufwand.",
  },
  {
    id: "creasing",
    name: "Rillen",
    category: "Rillen",
    pricingMode: "per100Pieces",
    setupMinutes: 10,
    basePrice: 10,
    unitPrice: 2.2,
    minimumPrice: 18,
    hourlyRate: 70,
    active: true,
    notes: "Rillen für Karten, Umschläge und starke Grammaturen.",
  },
  {
    id: "saddle-stitching",
    name: "Rückendrahtheftung",
    category: "Heften",
    pricingMode: "per100Pieces",
    setupMinutes: 18,
    basePrice: 20,
    unitPrice: 4.5,
    minimumPrice: 35,
    hourlyRate: 80,
    active: true,
    notes: "Broschürenheftung inklusive Einrichten.",
  },
  {
    id: "die-cutting",
    name: "Stanzen",
    category: "Stanzen",
    pricingMode: "perJob",
    setupMinutes: 30,
    basePrice: 75,
    unitPrice: 0,
    minimumPrice: 75,
    hourlyRate: 85,
    active: true,
    notes: "Pauschale ohne Werkzeugkosten. Werkzeugkosten separat kalkulieren.",
  },
  {
    id: "block-stitching",
    name: "Blockheftung",
    category: "Heften",
    pricingMode: "per100Pieces",
    setupMinutes: 15,
    basePrice: 18,
    unitPrice: 3.5,
    minimumPrice: 30,
    hourlyRate: 75,
    active: true,
    notes: "Heften von Blöcken oder Formularsätzen.",
  },
  {
    id: "set-gluing",
    name: "Satzleimung",
    category: "Leimen",
    pricingMode: "per100Pieces",
    setupMinutes: 20,
    basePrice: 25,
    unitPrice: 5,
    minimumPrice: 40,
    hourlyRate: 75,
    active: true,
    notes: "Leimung von Durchschreibesätzen oder Formularsätzen.",
  },
  {
    id: "block-gluing",
    name: "Blockleimung",
    category: "Leimen",
    pricingMode: "per100Pieces",
    setupMinutes: 20,
    basePrice: 25,
    unitPrice: 4,
    minimumPrice: 38,
    hourlyRate: 75,
    active: true,
    notes: "Leimung von Notizblöcken, Schreibblöcken und Abreißblöcken.",
  },
  {
    id: "perfect-binding",
    name: "Klebebindung",
    category: "Leimen",
    pricingMode: "perPiece",
    setupMinutes: 25,
    basePrice: 30,
    unitPrice: 1.1,
    minimumPrice: 45,
    hourlyRate: 85,
    active: true,
    notes: "Klebebindung für Broschüren und Bücher.",
  },
  {
    id: "enveloping",
    name: "Kuvertieren",
    category: "Kuvertieren",
    pricingMode: "per100Pieces",
    setupMinutes: 15,
    basePrice: 20,
    unitPrice: 3.2,
    minimumPrice: 35,
    hourlyRate: 70,
    active: true,
    notes: "Einlegen, Kuvertieren und einfache Mailings.",
  },
  {
    id: "manual-work",
    name: "Handarbeit",
    category: "Handarbeit",
    pricingMode: "perMinute",
    setupMinutes: 0,
    basePrice: 0,
    unitPrice: 1.1,
    minimumPrice: 15,
    hourlyRate: 66,
    active: true,
    notes: "Manuelle Arbeiten nach Minutenaufwand.",
  },
]