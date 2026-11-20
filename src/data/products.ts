export type ProductCategory = "lighting" | "acoustics" | "desk";
export type ProductFinish = "Obsidian" | "Raw Stone" | "Oxblood";

export interface KineticProduct {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  finishes: ProductFinish[];
  defaultFinish: ProductFinish;
  dimensions: string;
  weight: string;
  material: string;
  image: string;
  imageAlt: string;
  description: string;
}

export const PRODUCTS: KineticProduct[] = [
  {
    id: "prod-01",
    slug: "cantilever-desk-lamp-k1",
    sku: "AK-LMP-01",
    name: "K1 Cantilever Counterweight Lamp",
    category: "lighting",
    price: 680,
    finishes: ["Obsidian", "Raw Stone", "Oxblood"],
    defaultFinish: "Obsidian",
    dimensions: "460 × 140 × 420 mm",
    weight: "3.4 kg",
    material: "Bead-blasted aluminum & brushed steel",
    image: "/images/obj-01-lamp.jpg",
    imageAlt: "Monolithic anodized black and brushed steel cantilevered desk lamp on concrete plinth",
    description:
      "Machined from solid 6061 aluminum bar stock with an internal bronze friction pivot and warm 2700K recessed optical bar.",
  },
  {
    id: "prod-02",
    slug: "ceramic-monolith-speaker-s2",
    sku: "AK-ACU-02",
    name: "S2 Acoustic Ceramic Column",
    category: "acoustics",
    price: 890,
    finishes: ["Oxblood", "Raw Stone", "Obsidian"],
    defaultFinish: "Oxblood",
    dimensions: "180 × 180 × 310 mm",
    weight: "4.1 kg",
    material: "Slip-cast stoneware & Danish wool textile",
    image: "/images/obj-02-speaker.jpg",
    imageAlt: "Cylindrical raw ceramic acoustic desk speaker with deep oxblood woven grille",
    description:
      "High-mass unglazed ceramic enclosure eliminates cabinet resonance, wrapped in an acoustic oxblood wool membrane with dual-concentric driver.",
  },
  {
    id: "prod-03",
    slug: "split-dial-chronometer-c3",
    sku: "AK-DSK-03",
    name: "C3 Split-Dial Desk Chronometer",
    category: "desk",
    price: 440,
    finishes: ["Raw Stone", "Obsidian", "Oxblood"],
    defaultFinish: "Raw Stone",
    dimensions: "145 × 72 × 145 mm",
    weight: "1.9 kg",
    material: "CNC-milled billet aluminum & sapphire glass",
    image: "/images/obj-03-clock.jpg",
    imageAlt: "Machined brushed aluminum split-dial architectural desk clock on raw concrete cube",
    description:
      "Silent sweeping quartz-regulated chronometer milled from a single block with oxblood seconds pointer and chamfered dial ring.",
  },
  {
    id: "prod-04",
    slug: "obsidian-sphere-carafe-v4",
    sku: "AK-DSK-04",
    name: "V4 Smoked Borosilicate Carafe",
    category: "desk",
    price: 210,
    finishes: ["Obsidian", "Raw Stone"],
    defaultFinish: "Obsidian",
    dimensions: "110 × 110 × 265 mm",
    weight: "0.85 kg",
    material: "Hand-blown smoked borosilicate & turned basalt",
    image: "/images/obj-04-carafe.jpg",
    imageAlt: "Smoked architectural borosilicate glass carafe with matte obsidian sphere stopper",
    description:
      "Mouth-blown heavy-wall carafe sealed with a precision-lapped volcanic basalt sphere that doubles as an acoustic counterweight.",
  },
  {
    id: "prod-05",
    slug: "modular-cast-valet-tray-t5",
    sku: "AK-DSK-05",
    name: "T5 Modular Cast-Stone Valet",
    category: "desk",
    price: 265,
    finishes: ["Oxblood", "Raw Stone", "Obsidian"],
    defaultFinish: "Oxblood",
    dimensions: "320 × 190 × 32 mm",
    weight: "2.3 kg",
    material: "Mineral-filled cast concrete & kiln glaze",
    image: "/images/obj-05-tray.jpg",
    imageAlt: "Modular geometric cast-stone desk valet tray with slate sections and oxblood dish",
    description:
      "Three interlocking architectural bays cast in dense mineral composite with a removable deep oxblood vitrified stoneware vessel.",
  },
  {
    id: "prod-06",
    slug: "titanium-machined-pen-p6",
    sku: "AK-DSK-06",
    name: "P6 Grade-5 Titanium Writing Instrument",
    category: "desk",
    price: 340,
    finishes: ["Raw Stone", "Obsidian"],
    defaultFinish: "Raw Stone",
    dimensions: "142 × 13 × 13 mm",
    weight: "58 g",
    material: "Lathe-turned Grade-5 titanium & naval brass",
    image: "/images/obj-06-pen.jpg",
    imageAlt: "Heavy precision-milled raw titanium fountain pen resting on a raw concrete block",
    description:
      "Balanced around a solid naval brass internal sleeve and precision-ground steel nib for effortless long-session drafting.",
  },
];
