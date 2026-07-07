export const extraProducts2 = [
  // --- LAPTOPS ---
  { sku: 'LAP-MSI-RAIDER', categorySlug: 'laptops', name: 'MSI Raider GE78 HX', slug: 'msi-raider-ge78-hx', brand: 'MSI', basePrice: 950000, description: 'Unleash the power with Core i9 13980HX and RTX 4080. A massive 17-inch display for desktop replacement.', specs: { cpu: 'Core i9-13980HX', ram: '32GB', gpu: 'RTX 4080 12GB', display: '17" QHD+ 240Hz' }, compatibility: { category: 'LAPTOP' } },
  { sku: 'LAP-LEN-LEGION-SLIM', categorySlug: 'laptops', name: 'Lenovo Legion Slim 7', slug: 'lenovo-legion-slim-7', brand: 'Lenovo', basePrice: 420000, description: 'Thin, light, and deadly. Ryzen 7 7840HS and RTX 4060 inside an all-metal chassis.', specs: { cpu: 'Ryzen 7 7840HS', ram: '16GB', gpu: 'RTX 4060 8GB' }, compatibility: { category: 'LAPTOP' } },
  { sku: 'LAP-HP-VICTUS-16', categorySlug: 'laptops', name: 'HP Victus 16', slug: 'hp-victus-16', brand: 'HP', basePrice: 245000, description: 'A great value 16-inch gaming laptop. Core i5 13th Gen and RTX 3050.', specs: { cpu: 'Core i5-13500H', ram: '16GB', gpu: 'RTX 3050' }, compatibility: { category: 'LAPTOP' } },

  // --- GPUs ---
  { sku: 'GIG-4080-AERO', categorySlug: 'gpus', name: 'GIGABYTE GeForce RTX 4080 AERO OC', slug: 'gigabyte-rtx-4080-aero-oc', brand: 'GIGABYTE', basePrice: 385000, description: 'A massive white GPU for clean aesthetic creator builds.', specs: { vram: '16GB' }, compatibility: { category: 'GPU', tdp: 320 } },
  { sku: 'MSI-4060-GAMINGX', categorySlug: 'gpus', name: 'MSI GeForce RTX 4060 GAMING X', slug: 'msi-rtx-4060-gaming-x', brand: 'MSI', basePrice: 105000, description: 'Premium cooling on an entry-level 40-series card. Stunning RGB.', specs: { vram: '8GB' }, compatibility: { category: 'GPU', tdp: 115 } },
  { sku: 'ASROCK-7600', categorySlug: 'gpus', name: 'ASRock Radeon RX 7600 Phantom Gaming', slug: 'asrock-rx-7600-phantom', brand: 'ASRock', basePrice: 85000, description: 'Triple fan cooling on a budget 1080p AMD GPU.', specs: { vram: '8GB' }, compatibility: { category: 'GPU', tdp: 165 } },

  // --- CPUs ---
  { sku: 'INT-14600K', categorySlug: 'processors', name: 'Intel Core i5-14600K Processor', slug: 'intel-core-i5-14600k', brand: 'Intel', basePrice: 98000, description: '14 cores (6P+8E) dominating 1440p gaming.', specs: { cores: 14, threads: 20, boostClock: '5.3 GHz', socket: 'LGA1700' }, compatibility: { category: 'CPU', socket: 'LGA1700', tdp: 125, includesCooler: false } },
  { sku: 'AMD-8700G', categorySlug: 'processors', name: 'AMD Ryzen 7 8700G APU', slug: 'amd-ryzen-7-8700g', brand: 'AMD', basePrice: 95000, description: 'The absolute best integrated graphics available. Play 1080p games without a dedicated GPU.', specs: { cores: 8, threads: 16, integratedGpu: 'Radeon 780M' }, compatibility: { category: 'CPU', socket: 'AM5', tdp: 65, includesCooler: true } },

  // --- MONITORS ---
  { sku: 'MON-SAMSUNG-NEO-G9', categorySlug: 'monitors', name: 'Samsung Odyssey Neo G9 49"', slug: 'samsung-odyssey-neo-g9', brand: 'Samsung', basePrice: 620000, description: 'Mini-LED 240Hz extreme ultrawide monitor.', specs: { size: '49"', resolution: '5120x1440', panel: 'Mini-LED VA' }, compatibility: { category: 'MONITOR' } },
  { sku: 'MON-MSI-MAG274', categorySlug: 'monitors', name: 'MSI Optix MAG274QRF-QD', slug: 'msi-optix-mag274qrf-qd', brand: 'MSI', basePrice: 125000, description: 'Quantum dot IPS panel for incredible 1440p colors.', specs: { size: '27"', resolution: '2560x1440', panel: 'Quantum Dot IPS' }, compatibility: { category: 'MONITOR' } },

  // --- CASES ---
  { sku: 'LIAN-LI-O11-VISION', categorySlug: 'cases', name: 'Lian Li O11 Vision', slug: 'lian-li-o11-vision', brand: 'Lian Li', basePrice: 48000, description: 'Three sides of glass with no pillars. A true showroom PC case.', specs: { type: 'Mid Tower', color: 'Black' }, compatibility: { category: 'CASE' } },
  { sku: 'COR-5000D-AIR', categorySlug: 'cases', name: 'Corsair 5000D Airflow', slug: 'corsair-5000d-airflow', brand: 'Corsair', basePrice: 46000, description: 'Massive cooling potential with side fan mounts.', specs: { type: 'Mid Tower', color: 'Black' }, compatibility: { category: 'CASE' } },

  // --- MOTHERBOARDS ---
  { sku: 'ASUS-STRIX-B650-A', categorySlug: 'motherboards', name: 'ASUS ROG Strix B650-A Gaming WiFi', slug: 'asus-rog-strix-b650-a', brand: 'ASUS', basePrice: 82000, description: 'Beautiful white and silver AM5 motherboard.', specs: { chipset: 'B650', formFactor: 'ATX' }, compatibility: { category: 'MOTHERBOARD', socket: 'AM5', formFactor: 'ATX' } },

  // --- RAM ---
  { sku: 'DOM-PLAT-32GB-D4', categorySlug: 'memory', name: 'Corsair Dominator Platinum 32GB DDR4', slug: 'corsair-dominator-platinum-32gb-ddr4', brand: 'Corsair', basePrice: 28000, description: 'Classic capellix RGB DDR4 memory.', specs: { speed: '3600 MHz' }, compatibility: { category: 'RAM' } },

  // --- STORAGE ---
  { sku: 'CRU-T700-1TB', categorySlug: 'storage', name: 'Crucial T700 1TB PCIe Gen5 NVMe', slug: 'crucial-t700-1tb', brand: 'Crucial', basePrice: 55000, description: 'Next generation Gen5 speeds reaching up to 11,700 MB/s.', specs: { capacity: '1TB', readSpeed: '11700 MB/s' }, compatibility: { category: 'STORAGE' } },

  // --- PERIPHERALS ---
  { sku: 'PER-RAZ-BASILISK-ULT', categorySlug: 'mice', name: 'Razer Basilisk Ultimate', slug: 'razer-basilisk-ultimate', brand: 'Razer', basePrice: 35000, description: 'Wireless ergonomic mouse with charging dock.', specs: { connection: 'Wireless' }, compatibility: { category: 'MOUSE' } },
  { sku: 'KB-WOOTING-TWO', categorySlug: 'keyboards', name: 'Wooting Two HE', slug: 'wooting-two-he', brand: 'Wooting', basePrice: 72000, description: 'Full size analog mechanical keyboard.', specs: { size: '100%' }, compatibility: { category: 'KEYBOARD' } }
];
