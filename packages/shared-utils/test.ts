import { validateBuild, BuildSelection, CompatibilityIssue } from './src/index';

// --- MOCK PERFECT BUILD ---
const perfectBuild: BuildSelection = {
  cpu: { id: 'c1', name: 'Intel Core i9-14900K', category: 'CPU', price: 599, socket: 'LGA1700', tdp: 125, includesCooler: false },
  motherboard: { id: 'm1', name: 'MSI MEG Z790 GODLIKE', category: 'MOTHERBOARD', price: 1199, socket: 'LGA1700', formFactor: 'E-ATX', memoryType: 'DDR5', ramSlots: 4, m2Slots: 5 },
  ram: [{ id: 'r1', name: 'Corsair Dominator Titanium 64GB DDR5', category: 'RAM', price: 300, memoryType: 'DDR5', modules: 2 }],
  gpu: [{ id: 'g1', name: 'MSI RTX 4090 SUPRIM X', category: 'GPU', price: 1999, tdp: 450, lengthMm: 336, recommendedPsu: 1000 }],
  psu: { id: 'p1', name: 'Corsair AX1600i', category: 'PSU', price: 600, wattage: 1600, formFactor: 'ATX' },
  pcCase: { id: 'ca1', name: 'Corsair Obsidian 1000D', category: 'CASE', price: 500, formFactor: 'ATX', supportedMoboSizes: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLengthMm: 400, maxCoolerHeightMm: 180, supportedRadiators: [120, 240, 360, 420, 480], psuFormFactor: ['ATX'] },
  cooler: { id: 'co1', name: 'Corsair iCUE H150i 360mm AIO', category: 'COOLER', price: 200, type: 'AIO', supportedSockets: ['LGA1700', 'AM5'], radiatorSizeMm: 360 },
  storage: [
    { id: 's1', name: 'Samsung 990 PRO 2TB', category: 'STORAGE', price: 170, type: 'NVMe' },
    { id: 's2', name: 'Crucial T700 4TB Gen5', category: 'STORAGE', price: 400, type: 'NVMe' }
  ]
};

console.log("=== Testing Perfect Build ===");
const perfectIssues = validateBuild(perfectBuild);
if (perfectIssues.length === 0) console.log("✅ Perfect Build passed with 0 issues!\n");
else console.log(perfectIssues);

// --- MOCK INCOMPATIBLE BUILD ---
const incompatibleBuild: BuildSelection = {
  cpu: { id: 'c2', name: 'AMD Ryzen 9 7950X3D', category: 'CPU', price: 699, socket: 'AM5', tdp: 120, includesCooler: false },
  motherboard: { id: 'm2', name: 'ASUS ROG STRIX B550-F', category: 'MOTHERBOARD', price: 189, socket: 'AM4', formFactor: 'ATX', memoryType: 'DDR4', ramSlots: 4, m2Slots: 2 },
  ram: [{ id: 'r2', name: 'G.Skill Trident Z5 32GB DDR5', category: 'RAM', price: 150, memoryType: 'DDR5', modules: 2 }],
  gpu: [{ id: 'g2', name: 'NVIDIA RTX 4090 Founders Edition', category: 'GPU', price: 1599, tdp: 450, lengthMm: 304, recommendedPsu: 850 }],
  psu: { id: 'p2', name: 'EVGA SuperNOVA 500W', category: 'PSU', price: 50, wattage: 500, formFactor: 'ATX' },
  pcCase: { id: 'ca2', name: 'Cooler Master NR200P (Mini-ITX)', category: 'CASE', price: 100, formFactor: 'Mini-ITX', supportedMoboSizes: ['Mini-ITX'], maxGpuLengthMm: 330, maxCoolerHeightMm: 155, supportedRadiators: [120, 240, 280], psuFormFactor: ['SFX'] },
  storage: []
};

console.log("=== Testing Incompatible Build ===");
const incompatibleIssues = validateBuild(incompatibleBuild);
incompatibleIssues.forEach((i: CompatibilityIssue) => console.log(`[${i.level}] ${i.title}: ${i.message}`));
console.log(`\nFound ${incompatibleIssues.length} issues in the incompatible build.`);
