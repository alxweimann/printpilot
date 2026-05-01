export type MachineType =
  | "Digitaldruck Farbe"
  | "Digitaldruck Schwarz"
  | "Großformat"
  | "Inkjet Produktion"

export type MachineStatus = "Bereit" | "Wartung" | "Prüfen"

export type Machine = {
  id: string
  name: string
  type: MachineType
  status: MachineStatus
  colorClickCost: number
  blackClickCost: number
  hourlyRate: number
  duplex: boolean
  maxWidthMm: number
  maxHeightMm: number
  setupMinutesDefault: number
  speedSheetsPerHour: number
  notes: string
  specialFeatures: string[]
}

export const machines: Machine[] = [
  {
    id: "iridesse-1",
    name: "Xerox Iridesse 1",
    type: "Digitaldruck Farbe",
    status: "Bereit",
    colorClickCost: 0.033,
    blackClickCost: 0.008,
    hourlyRate: 85,
    duplex: true,
    maxWidthMm: 330,
    maxHeightMm: 488,
    setupMinutesDefault: 15,
    speedSheetsPerHour: 3000,
    notes: "Standardmaschine für farbige Digitaldruckaufträge.",
    specialFeatures: ["4/4 farbig", "Duplex", "SRA3", "Hohe Qualität"],
  },
  {
    id: "iridesse-2",
    name: "Xerox Iridesse 2 mit Sonderfarben",
    type: "Digitaldruck Farbe",
    status: "Bereit",
    colorClickCost: 0.033,
    blackClickCost: 0.008,
    hourlyRate: 90,
    duplex: true,
    maxWidthMm: 330,
    maxHeightMm: 488,
    setupMinutesDefault: 20,
    speedSheetsPerHour: 2800,
    notes: "Für hochwertige Farbdrucke und Sonderfarben wie Pink.",
    specialFeatures: ["Sonderfarben", "Pink", "Duplex", "Premiumdruck"],
  },
  {
    id: "nuvera",
    name: "Xerox Nuvera",
    type: "Digitaldruck Schwarz",
    status: "Bereit",
    colorClickCost: 0,
    blackClickCost: 0.008,
    hourlyRate: 75,
    duplex: true,
    maxWidthMm: 320,
    maxHeightMm: 450,
    setupMinutesDefault: 10,
    speedSheetsPerHour: 4500,
    notes: "Schnelle Schwarzweiß-Produktion für Text, Formulare und Bücher.",
    specialFeatures: ["1/1 schwarz", "Duplex", "Hohe Geschwindigkeit"],
  },
  {
    id: "canon-vp140",
    name: "Canon VP140",
    type: "Digitaldruck Schwarz",
    status: "Bereit",
    colorClickCost: 0,
    blackClickCost: 0.008,
    hourlyRate: 75,
    duplex: true,
    maxWidthMm: 320,
    maxHeightMm: 488,
    setupMinutesDefault: 10,
    speedSheetsPerHour: 5000,
    notes: "Produktionsmaschine für reine Schwarzweiß-Jobs.",
    specialFeatures: ["1/1 schwarz", "Duplex", "Produktionsdruck"],
  },
  {
    id: "roland-vg3",
    name: "Roland TrueVis VG3 540",
    type: "Großformat",
    status: "Prüfen",
    colorClickCost: 0.08,
    blackClickCost: 0,
    hourlyRate: 95,
    duplex: false,
    maxWidthMm: 1370,
    maxHeightMm: 50000,
    setupMinutesDefault: 25,
    speedSheetsPerHour: 0,
    notes: "Großformatdruck für Folien, Banner, Aufkleber und Rollenmaterial.",
    specialFeatures: ["Rolle", "Konturschnitt", "Eco-Solvent", "Großformat"],
  },
  {
    id: "riso-gl9730",
    name: "Riso Comcolor GL 9730",
    type: "Inkjet Produktion",
    status: "Bereit",
    colorClickCost: 0.018,
    blackClickCost: 0.006,
    hourlyRate: 70,
    duplex: true,
    maxWidthMm: 340,
    maxHeightMm: 550,
    setupMinutesDefault: 8,
    speedSheetsPerHour: 9000,
    notes: "Sehr schnelle Inkjet-Produktion für einfache Farbdrucksachen.",
    specialFeatures: ["Inkjet", "Sehr schnell", "Duplex", "Mailings"],
  },
]