/* Modelgegevens, overgenomen van de productpagina's op mapfour.com (november 2026).
   Waarden zijn taalneutraal; tekst tussen {accolades} wordt vertaald via dict.specs.values. */

export type FamilyKey = "city" | "trekking" | "utility";
export type ColorKey = "ink-green" | "anthracite" | "space-grey" | "midnight-blue" | "champagne" | "black";

export const COLOR_HEX: Record<ColorKey, string> = {
  "ink-green": "#55695b",
  anthracite: "#4d4d55",
  "space-grey": "#6f7277",
  "midnight-blue": "#2f4b7c",
  champagne: "#cdb98f",
  black: "#1f1f22",
};

export type HighlightKey =
  | "carbonFrame" | "lightweight" | "torqueSensor" | "removableBattery" | "gps" | "hydraulic"
  | "midMotor80" | "fastCharge" | "smartLock" | "shimano10" | "fullSuspension" | "beltDrive"
  | "hubGear" | "midMotor100" | "bigBattery" | "rideGuard" | "foldable" | "payload" | "fatTires" | "iot4g" | "award";

export type ViewKey = "side" | "front" | "rear" | "folded";

export type SpecGroupKey = "general" | "electric" | "drivetrain" | "frame";
export type SpecLabelKey =
  | "weight" | "maxLoad" | "riderHeight" | "range" | "maxSpeed" | "certification" | "waterproof"
  | "motor" | "power" | "torque" | "sensor" | "battery" | "charging" | "display" | "connectivity" | "lights"
  | "drivetrain" | "gears" | "brakes"
  | "frame" | "fork" | "rearSuspension" | "tires" | "frameSize" | "folded" | "included";

export type SpecRow = { label: SpecLabelKey; value: string };
export type SpecGroup = { group: SpecGroupKey; rows: SpecRow[] };

export type Model = {
  slug: string;
  name: string;
  family: FamilyKey;
  /** Adviesprijs incl. btw in centen (lijstprijs op mapfour.com) */
  rrpCents: number;
  badge?: "bestseller" | "award";
  stepThrough?: boolean;
  /** `image` is het zijaanzicht; `angles` zijn extra aanzichten (vrijstaande studiofoto's). */
  colors: { key: ColorKey; sku: string; image: string; angles?: { view: ViewKey; src: string }[] }[];
  stats: { rangeKm: number; torqueNm: number; weightKg: number; batteryWh: number; charge: string };
  highlights: HighlightKey[];
  specs: SpecGroup[];
  gallery: { src: string; wide?: boolean }[];
  /** Sfeerbeeld voor de modelpagina */
  hero: string;
};

const img = (name: string) => `/images/bikes/${name}.webp`;

const raySpecs = (o: { weight: string; height: string; motor: string; torque: string; charging: string; display: string; gears: string; tires: string; connectivity: string }): SpecGroup[] => [
  {
    group: "general",
    rows: [
      { label: "weight", value: o.weight },
      { label: "maxLoad", value: "120 kg" },
      { label: "riderHeight", value: o.height },
      { label: "range", value: "{upTo} 100 km (PAS 1)" },
      { label: "maxSpeed", value: "25 km/h" },
      { label: "certification", value: "EN 15194" },
    ],
  },
  {
    group: "electric",
    rows: [
      { label: "motor", value: o.motor },
      { label: "power", value: "250 W" },
      { label: "torque", value: o.torque },
      { label: "sensor", value: "{torqueSensor}" },
      { label: "battery", value: "36 V · 10 Ah · 360 Wh, {removable}" },
      { label: "charging", value: o.charging },
      { label: "display", value: o.display },
      { label: "connectivity", value: o.connectivity },
    ],
  },
  {
    group: "drivetrain",
    rows: [
      { label: "gears", value: o.gears },
      { label: "brakes", value: "Tektro, {hydraulicDisc}, 160 mm" },
    ],
  },
  {
    group: "frame",
    rows: [
      { label: "frame", value: "{carbon}" },
      { label: "fork", value: "{aluminium}" },
      { label: "tires", value: o.tires },
      { label: "included", value: "{mudguards}, {kickstand}, {lightsFrontRear}" },
    ],
  },
];

const roamSpecs = (o: { weight: string; height: string; frameSize: string }): SpecGroup[] => [
  {
    group: "general",
    rows: [
      { label: "weight", value: o.weight },
      { label: "maxLoad", value: "120 kg" },
      { label: "riderHeight", value: o.height },
      { label: "range", value: "{upTo} 150 km (Eco)" },
      { label: "maxSpeed", value: "25 km/h" },
      { label: "certification", value: "CE · EN 15194 · EN 50604" },
      { label: "waterproof", value: "IPX5" },
    ],
  },
  {
    group: "electric",
    rows: [
      { label: "motor", value: "{midMotor} Mivice X700 · 36 V" },
      { label: "power", value: "250 W" },
      { label: "torque", value: "100 Nm" },
      { label: "sensor", value: "{torqueSensor}" },
      { label: "battery", value: "36 V · 20 Ah · 720 Wh, LG 21700" },
      { label: "charging", value: "42 V · 8 A, ± 2 h" },
      { label: "display", value: '3,5" TFT' },
      { label: "connectivity", value: "RideGuard™: GPS, {motionAlarm}, {geofencing}, {appLock}" },
      { label: "lights", value: "30 lux, {kMark}" },
    ],
  },
  {
    group: "drivetrain",
    rows: [
      { label: "drivetrain", value: "Michelin Carbon Belt Drive" },
      { label: "gears", value: "Shimano Nexus 5, {hubGear}" },
      { label: "brakes", value: "Tektro HD-R280, {hydraulicDisc}, 180 mm" },
    ],
  },
  {
    group: "frame",
    rows: [
      { label: "frame", value: "{aluminium}" },
      { label: "frameSize", value: o.frameSize },
      { label: "fork", value: "Zoom, 100 mm" },
      { label: "rearSuspension", value: "DNM, 60 mm" },
      { label: "tires", value: 'Kenda 27,5 × 2,35", {punctureLayer}' },
      { label: "included", value: "{rack}, {kickstand}, {mudguards}, {beltGuard}" },
    ],
  },
];

const loopSpecs = (o: { weight: string; range: string; motor: string; torque: string; battery: string; gears: string; connectivity: string }): SpecGroup[] => [
  {
    group: "general",
    rows: [
      { label: "weight", value: o.weight },
      { label: "maxLoad", value: "150 kg" },
      { label: "riderHeight", value: "155–190 cm" },
      { label: "range", value: o.range },
      { label: "maxSpeed", value: "25 km/h" },
      { label: "certification", value: "CE · EN 15194" },
      { label: "waterproof", value: "IPX7 ({wiring})" },
    ],
  },
  {
    group: "electric",
    rows: [
      { label: "motor", value: o.motor },
      { label: "power", value: "250 W" },
      { label: "torque", value: o.torque },
      { label: "sensor", value: "{torqueSensor}" },
      { label: "battery", value: o.battery },
      { label: "charging", value: "54,6 V · 8 A" },
      { label: "display", value: '3,5" {colourDisplay}' },
      { label: "connectivity", value: o.connectivity },
      { label: "lights", value: "30 lux, {kMark}, {brakeLight}" },
    ],
  },
  {
    group: "drivetrain",
    rows: [
      { label: "gears", value: o.gears },
      { label: "brakes", value: "Tektro, {hydraulicDisc}, 180 mm" },
    ],
  },
  {
    group: "frame",
    rows: [
      { label: "frame", value: "{aluminium} 6061, {foldableFrame}" },
      { label: "fork", value: "Zoom, {hydraulicLockout}" },
      { label: "rearSuspension", value: "30 mm" },
      { label: "tires", value: '20 × 3,0", {punctureLayer} 3 mm' },
      { label: "folded", value: "100 × 51 × 75 cm" },
      { label: "included", value: "{rack}, Selle Royal" },
    ],
  },
];

export const MODELS: Model[] = [
  {
    slug: "ray-air",
    name: "Ray Air",
    family: "city",
    rrpCents: 199900,
    colors: [
      { key: "ink-green", sku: "EURAYAGN", image: img("ray-air-ink-green"), angles: [{ view: "front", src: img("ray-air-ink-green-front") }, { view: "rear", src: img("ray-air-ink-green-rear") }] },
      { key: "anthracite", sku: "EURAYAGY", image: img("ray-air-anthracite") },
    ],
    stats: { rangeKm: 100, torqueNm: 40, weightKg: 17.2, batteryWh: 360, charge: "5–8 h" },
    highlights: ["carbonFrame", "lightweight", "torqueSensor", "removableBattery", "gps", "hydraulic"],
    specs: raySpecs({
      weight: "17,2 kg",
      height: "160–195 cm",
      motor: "{rearHubMotor} Mivice M070",
      torque: "40 Nm",
      charging: "5–8 h",
      display: "TFT, {colourDisplay}",
      gears: "Shimano Acera, 8",
      tires: "700 × 38C",
      connectivity: "GPS, {motionDetection}, {appControl}",
    }),
    gallery: [{ src: "/images/city-skyline.webp", wide: true }, { src: "/images/details/ray-air-d1.webp" }, { src: "/images/details/ray-air-d3.webp" }, { src: "/images/details/ray-air-drivetrain.webp" }],
    hero: "/images/city-skyline.webp",
  },
  {
    slug: "ray-air-st",
    name: "Ray Air ST",
    family: "city",
    rrpCents: 199900,
    stepThrough: true,
    colors: [
      { key: "ink-green", sku: "EURAYSTGN", image: img("ray-air-st-ink-green"), angles: [{ view: "front", src: img("ray-air-st-ink-green-front") }, { view: "rear", src: img("ray-air-st-ink-green-rear") }] },
      { key: "anthracite", sku: "EURAYSTGY", image: img("ray-air-st-anthracite") },
    ],
    stats: { rangeKm: 100, torqueNm: 40, weightKg: 17.5, batteryWh: 360, charge: "5–8 h" },
    highlights: ["carbonFrame", "lightweight", "torqueSensor", "removableBattery", "gps", "hydraulic"],
    specs: raySpecs({
      weight: "17,5 kg",
      height: "155–188 cm",
      motor: "{rearHubMotor} Mivice M070",
      torque: "40 Nm",
      charging: "5–8 h",
      display: "TFT, {colourDisplay}",
      gears: "Shimano Acera, 8",
      tires: "700 × 38C",
      connectivity: "GPS, {motionDetection}, {appControl}",
    }),
    gallery: [{ src: "/images/city-bridge.webp", wide: true }, { src: "/images/details/ray-air-d2.webp" }, { src: "/images/details/ray-air-d1.webp" }, { src: "/images/details/ray-air-st-drivetrain.webp" }],
    hero: "/images/city-bridge.webp",
  },
  {
    slug: "ray-pro",
    name: "Ray Pro",
    family: "city",
    rrpCents: 239900,
    colors: [
      { key: "ink-green", sku: "EURAYPGN", image: img("ray-pro-ink-green"), angles: [{ view: "front", src: img("ray-pro-ink-green-front") }, { view: "rear", src: img("ray-pro-ink-green-rear") }] },
      { key: "anthracite", sku: "EURAYPGY", image: img("ray-pro-anthracite") },
    ],
    stats: { rangeKm: 100, torqueNm: 80, weightKg: 21.2, batteryWh: 360, charge: "1,5–2 h" },
    highlights: ["midMotor80", "carbonFrame", "fastCharge", "smartLock", "shimano10", "hydraulic"],
    specs: raySpecs({
      weight: "21,2 kg",
      height: "165–189 cm",
      motor: "{midMotor} Ananda",
      torque: "80 Nm",
      charging: "8 A, 1,5–2 h",
      display: "LED, {integrated}",
      gears: "Shimano CUES, 10",
      tires: "700 × 42C",
      connectivity: "{antiTheft}, Smart Lock",
    }),
    gallery: [{ src: "/images/city-pro.webp", wide: true }, { src: "/images/details/ray-pro-cockpit.webp" }, { src: "/images/details/ray-pro-motor.webp" }],
    hero: "/images/city-pro.webp",
  },
  {
    slug: "roam",
    name: "Roam",
    family: "trekking",
    rrpCents: 279900,
    badge: "award",
    colors: [
      { key: "space-grey", sku: "EUROAMGY", image: img("roam-space-grey") },
      { key: "midnight-blue", sku: "EUROAMBU", image: img("roam-midnight-blue") },
    ],
    stats: { rangeKm: 150, torqueNm: 100, weightKg: 34, batteryWh: 720, charge: "± 2 h" },
    highlights: ["fullSuspension", "midMotor100", "beltDrive", "hubGear", "rideGuard", "award"],
    specs: roamSpecs({ weight: "34 kg", height: "165–185 cm", frameSize: '20"' }),
    gallery: [{ src: "/images/trekking-ride.webp", wide: true }, { src: "/images/details/roam-belt.webp" }, { src: "/images/details/roam-battery.webp" }, { src: "/images/trekking-camp.webp", wide: true }],
    hero: "/images/trekking-ride.webp",
  },
  {
    slug: "roam-st",
    name: "Roam ST",
    family: "trekking",
    rrpCents: 279900,
    badge: "bestseller",
    stepThrough: true,
    colors: [
      { key: "space-grey", sku: "EUROAMSTGY", image: img("roam-st-space-grey") },
      { key: "midnight-blue", sku: "EUROAMSTBU", image: img("roam-st-midnight-blue") },
    ],
    stats: { rangeKm: 150, torqueNm: 100, weightKg: 33, batteryWh: 720, charge: "± 2 h" },
    highlights: ["fullSuspension", "midMotor100", "beltDrive", "hubGear", "rideGuard", "bigBattery"],
    specs: roamSpecs({ weight: "33 kg", height: "160–180 cm", frameSize: '19"' }),
    gallery: [{ src: "/images/trekking-plaza.webp", wide: true }, { src: "/images/details/roam-hub.webp" }, { src: "/images/details/roam-belt.webp" }, { src: "/images/trekking-duo.webp", wide: true }],
    hero: "/images/trekking-duo.webp",
  },
  {
    slug: "loop",
    name: "Loop",
    family: "utility",
    rrpCents: 169900,
    badge: "bestseller",
    stepThrough: true,
    colors: [
      { key: "black", sku: "EULOOPBK", image: img("loop-black"), angles: [{ view: "front", src: img("loop-black-front") }, { view: "rear", src: img("loop-black-rear") }] },
      { key: "champagne", sku: "EULOOPCP", image: img("loop-champagne"), angles: [{ view: "front", src: img("loop-champagne-front") }, { view: "rear", src: img("loop-champagne-rear") }] },
    ],
    stats: { rangeKm: 120, torqueNm: 75, weightKg: 33.2, batteryWh: 720, charge: "8 A" },
    highlights: ["foldable", "fullSuspension", "bigBattery", "payload", "fatTires", "hydraulic"],
    specs: loopSpecs({
      weight: "33,2 kg",
      range: "{upTo} 120 km (PAS 1)",
      motor: "{hubMotor} 48 V",
      torque: "75 Nm",
      battery: "48 V · 15 Ah · 720 Wh, Samsung, {removable}",
      gears: "Shimano Altus, 8",
      connectivity: "Bluetooth, {appControl}",
    }),
    gallery: [{ src: "/images/utility-beach.webp", wide: true }, { src: "/images/details/loop-rack.webp" }, { src: "/images/details/loop-grip.webp" }, { src: "/images/details/loop-drivetrain.webp" }],
    hero: "/images/utility-beach.webp",
  },
  {
    slug: "loop-pro",
    name: "Loop Pro",
    family: "utility",
    rrpCents: 209900,
    stepThrough: true,
    colors: [
      { key: "champagne", sku: "EUL2030PROCP", image: img("loop-pro-champagne"), angles: [{ view: "folded", src: img("loop-pro-champagne-folded") }] },
      { key: "black", sku: "EUL2030PROBK", image: img("loop-pro-black"), angles: [{ view: "front", src: img("loop-pro-black-front") }, { view: "rear", src: img("loop-pro-black-rear") }] },
    ],
    stats: { rangeKm: 140, torqueNm: 100, weightKg: 32.8, batteryWh: 720, charge: "8 A" },
    highlights: ["midMotor100", "foldable", "iot4g", "shimano10", "fullSuspension", "payload"],
    specs: loopSpecs({
      weight: "32,8 kg",
      range: "{upTo} 140 km (PAS 1)",
      motor: "{midMotor} Mivice X700 · 48 V",
      torque: "100 Nm",
      battery: "48 V · 15 Ah · 720 Wh, Samsung 21700, {removable}",
      gears: "Shimano Tiagra, 10",
      connectivity: "IoT: GPS, 4G, Bluetooth, {appControl}",
    }),
    gallery: [{ src: "/images/utility-coast.webp", wide: true }, { src: "/images/details/loop-pro-folded.webp" }, { src: "/images/details/loop-pro-cockpit.webp" }, { src: "/images/details/loop-pro-rack.webp" }],
    hero: "/images/utility-coast.webp",
  },
];

export const FAMILIES: { key: FamilyKey; image: string; models: string[] }[] = [
  { key: "city", image: "/images/city-trio.webp", models: ["ray-air", "ray-air-st", "ray-pro"] },
  { key: "trekking", image: "/images/trekking-mountain.webp", models: ["roam", "roam-st"] },
  { key: "utility", image: "/images/utility-river.webp", models: ["loop", "loop-pro"] },
];

export function getModel(slug: string) {
  return MODELS.find((m) => m.slug === slug);
}

export type Accessory = { slug: "front-rack" | "sports-bag" | "pannier" | "pannier-set"; sku: string; image: string; rrpCents: number; spec: string };

export const ACCESSORIES: Accessory[] = [
  { slug: "front-rack", sku: "FRONTRACK", image: img("acc-front-rack"), rrpCents: 3900, spec: "Roam · Loop · max. 13 kg" },
  { slug: "sports-bag", sku: "SPORTTASCHE", image: img("acc-sports-bag"), rrpCents: 5900, spec: "10 L · 46 × 20 × 23 cm" },
  { slug: "pannier", sku: "EUPBAG", image: img("acc-pannier"), rrpCents: 5900, spec: "1 ×" },
  { slug: "pannier-set", sku: "EUP2BAG", image: img("acc-pannier-set"), rrpCents: 9900, spec: "2 ×" },
];
