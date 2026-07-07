export const extraProducts4 = [
  // --- BUDGET USED GPUS ---
  { sku: 'GPU-AMD-RX580-8GB', categorySlug: 'gpus', name: 'XFX Radeon RX 580 8GB (Used/Refurbished)', slug: 'xfx-rx-580-8gb-used', brand: 'XFX', basePrice: 22000, description: 'The legendary budget king of 1080p gaming. Excellent performance for Esports titles on a strict budget.', specs: { vram: '8GB' }, compatibility: { category: 'GPU', tdp: 185 } },
  { sku: 'GPU-NVIDIA-GTX1060-6GB', categorySlug: 'gpus', name: 'ZOTAC GeForce GTX 1060 6GB (Used)', slug: 'zotac-gtx-1060-6gb-used', brand: 'ZOTAC', basePrice: 26500, description: 'Still highly capable for 1080p medium settings gaming.', specs: { vram: '6GB' }, compatibility: { category: 'GPU', tdp: 120 } },
  { sku: 'GPU-NVIDIA-1660S', categorySlug: 'gpus', name: 'Palit GeForce GTX 1660 Super 6GB (Used)', slug: 'palit-gtx-1660-super-used', brand: 'Palit', basePrice: 38000, description: 'A massive step up from the RX 580, running cool and quiet while playing all modern games at 1080p.', specs: { vram: '6GB' }, compatibility: { category: 'GPU', tdp: 125 } },

  // --- BUDGET CPUs ---
  { sku: 'CPU-INT-I7-3770', categorySlug: 'processors', name: 'Intel Core i7-3770 (Used)', slug: 'intel-core-i7-3770-used', brand: 'Intel', basePrice: 7500, description: 'A classic quad-core processor for ultra-budget starter builds.', specs: { cores: '4', threads: '8', socket: 'LGA1155' }, compatibility: { category: 'CPU', socket: 'LGA1155', tdp: 77 } },
  { sku: 'CPU-INT-I5-4590', categorySlug: 'processors', name: 'Intel Core i5-4590 (Used)', slug: 'intel-core-i5-4590-used', brand: 'Intel', basePrice: 3500, description: 'Cheapest entry for office or basic e-sports gaming systems.', specs: { cores: '4', threads: '4', socket: 'LGA1150' }, compatibility: { category: 'CPU', socket: 'LGA1150', tdp: 84 } },
  { sku: 'CPU-AMD-R3-3200G', categorySlug: 'processors', name: 'AMD Ryzen 3 3200G with Radeon Vega 8', slug: 'amd-ryzen-3-3200g', brand: 'AMD', basePrice: 14500, description: 'Excellent entry-level APU. You do not even need a graphics card to play games like Valorant and CS2.', specs: { cores: '4', threads: '4', socket: 'AM4', integratedGpu: 'Vega 8' }, compatibility: { category: 'CPU', socket: 'AM4', tdp: 65, includesCooler: true } },

  // --- BUDGET MOTHERBOARDS ---
  { sku: 'MB-INT-H81', categorySlug: 'motherboards', name: 'Generic H81 Motherboard LGA1150', slug: 'generic-h81-lga1150', brand: 'Generic', basePrice: 4500, description: 'Brand new generic motherboard for older 4th Gen Intel processors.', specs: { socket: 'LGA1150', chipset: 'H81', formFactor: 'Micro-ATX', memoryType: 'DDR3' }, compatibility: { category: 'MOTHERBOARD', socket: 'LGA1150', formFactor: 'Micro-ATX' } },
  { sku: 'MB-AMD-A320M', categorySlug: 'motherboards', name: 'Biostar A320M-H AM4 Motherboard', slug: 'biostar-a320m-h', brand: 'Biostar', basePrice: 13500, description: 'The most affordable entry point for Ryzen processors.', specs: { socket: 'AM4', chipset: 'A320', formFactor: 'Micro-ATX', memoryType: 'DDR4' }, compatibility: { category: 'MOTHERBOARD', socket: 'AM4', formFactor: 'Micro-ATX' } },

  // --- BUDGET RAM ---
  { sku: 'RAM-DDR3-8GB', categorySlug: 'memory', name: 'Kingston 8GB DDR3 1600MHz', slug: 'kingston-8gb-ddr3', brand: 'Kingston', basePrice: 2200, description: 'Basic DDR3 memory for older systems.', specs: { capacity: '8GB', speed: '1600 MHz', memoryType: 'DDR3' }, compatibility: { category: 'RAM' } },
  { sku: 'RAM-CORSAIR-VENG-8GB', categorySlug: 'memory', name: 'Corsair Vengeance LPX 8GB DDR4 3200MHz', slug: 'corsair-vengeance-8gb-ddr4', brand: 'Corsair', basePrice: 6500, description: 'A single stick of reliable, high-speed DDR4 memory for modern budget builds.', specs: { capacity: '8GB', speed: '3200 MHz', memoryType: 'DDR4' }, compatibility: { category: 'RAM' } },

  // --- BUDGET STORAGE ---
  { sku: 'SSD-SATA-128GB', categorySlug: 'storage', name: 'Adata SU650 128GB SATA SSD', slug: 'adata-su650-128gb', brand: 'ADATA', basePrice: 3200, description: 'Affordable OS drive to make any older PC feel lightning fast.', specs: { capacity: '128GB', type: 'SATA 2.5"', readSpeed: '520 MB/s' }, compatibility: { category: 'STORAGE' } },
  { sku: 'SSD-SATA-256GB', categorySlug: 'storage', name: 'Hikvision C100 256GB SATA SSD', slug: 'hikvision-c100-256gb', brand: 'Hikvision', basePrice: 5500, description: 'Plenty of space for your OS and a few favorite games.', specs: { capacity: '256GB', type: 'SATA 2.5"', readSpeed: '550 MB/s' }, compatibility: { category: 'STORAGE' } },
  { sku: 'HDD-SEAGATE-500GB', categorySlug: 'storage', name: 'Seagate 500GB Desktop HDD (Used)', slug: 'seagate-500gb-hdd-used', brand: 'Seagate', basePrice: 1500, description: 'Cheap mass storage for budget builds.', specs: { capacity: '500GB', type: '3.5" HDD', rpm: '7200 RPM' }, compatibility: { category: 'STORAGE' } },

  // --- BUDGET CASES ---
  { sku: 'CASE-SPACE-ATX', categorySlug: 'cases', name: 'Space Gaming ATX Casing (No Fans)', slug: 'space-gaming-atx', brand: 'Space', basePrice: 4500, description: 'The absolute cheapest way to house your gaming PC.', specs: { type: 'Mid Tower', color: 'Black', includedFans: 'None' }, compatibility: { category: 'CASE', formFactor: 'ATX' } },
  { sku: 'CASE-EASE-EOC1', categorySlug: 'cases', name: 'EASE EOC1 Mesh Mini Tower', slug: 'ease-eoc1-mesh', brand: 'EASE', basePrice: 6800, description: 'Compact and breathable mesh front case for budget Micro-ATX builds.', specs: { type: 'Mini Tower', color: 'Black', includedFans: '1x Rear' }, compatibility: { category: 'CASE', formFactor: 'Micro-ATX' } },

  // --- BUDGET POWER SUPPLIES ---
  { sku: 'PSU-GENERIC-500W', categorySlug: 'power-supplies', name: 'Generic 500W PSU', slug: 'generic-500w-psu', brand: 'Generic', basePrice: 2500, description: 'Basic power supply for non-gaming or extreme budget systems.', specs: { wattage: '500W', efficiency: 'None', modularity: 'Non-Modular' }, compatibility: { category: 'PSU', wattage: 500 } },
  { sku: 'PSU-RED-500W', categorySlug: 'power-supplies', name: 'Redragon RGPS 500W 80+ Bronze', slug: 'redragon-rgps-500w', brand: 'Redragon', basePrice: 9500, description: 'Safe and certified power for budget gaming systems.', specs: { wattage: '500W', efficiency: '80+ Bronze', modularity: 'Non-Modular' }, compatibility: { category: 'PSU', wattage: 500 } },

  // --- BUDGET MONITORS ---
  { sku: 'MON-DELL-22-USED', categorySlug: 'monitors', name: 'Dell 22" 60Hz 1080p Monitor (Used)', slug: 'dell-22-1080p-used', brand: 'Dell', basePrice: 11000, description: 'Standard used office monitor. Perfectly fine for budget gaming and productivity.', specs: { size: '22"', resolution: '1920x1080', refreshRate: '60Hz', panel: 'TN' }, compatibility: { category: 'MONITOR' } },
  { sku: 'MON-EASE-22-75HZ', categorySlug: 'monitors', name: 'EASE 22" 75Hz IPS Monitor', slug: 'ease-22-75hz-ips', brand: 'EASE', basePrice: 21000, description: 'Brand new, cheap IPS monitor with a slightly faster 75Hz refresh rate.', specs: { size: '22"', resolution: '1920x1080', refreshRate: '75Hz', panel: 'IPS' }, compatibility: { category: 'MONITOR' } },

  // --- BUDGET PERIPHERALS ---
  { sku: 'MICE-A4TECH-OP730D', categorySlug: 'mice', name: 'A4Tech OP-730D Optical Mouse', slug: 'a4tech-op-730d', brand: 'A4Tech', basePrice: 950, description: 'The absolute classic. Found in every office and internet cafe in Pakistan.', specs: { sensor: 'Optical', connection: 'Wired' }, compatibility: { category: 'MOUSE' } },
  { sku: 'KB-A4TECH-KR85', categorySlug: 'keyboards', name: 'A4Tech KR-85 Comfort Keyboard', slug: 'a4tech-kr-85', brand: 'A4Tech', basePrice: 1200, description: 'Durable, cheap, and lasts forever.', specs: { type: 'Membrane', connection: 'Wired' }, compatibility: { category: 'KEYBOARD' } },
  { sku: 'COMBO-BLOODY-Q1300', categorySlug: 'keyboards', name: 'Bloody Q1300 Keyboard & Mouse Combo', slug: 'bloody-q1300-combo', brand: 'A4Tech Bloody', basePrice: 5500, description: 'Excellent entry-level gaming combo from A4Techs premium gaming brand.', specs: { type: 'Membrane + Optical', lighting: 'Neon' }, compatibility: { category: 'KEYBOARD' } },

  // --- BUDGET LAPTOPS ---
  { sku: 'LAP-LEN-THINKPAD-T460', categorySlug: 'laptops', name: 'Lenovo ThinkPad T460 (Used)', slug: 'lenovo-thinkpad-t460-used', brand: 'Lenovo', basePrice: 38000, description: 'Indestructible business laptop perfect for students on a tight budget. Core i5 6th Gen.', specs: { cpu: 'Core i5-6300U', ram: '8GB', storage: '256GB SSD', display: '14" HD' }, compatibility: { category: 'LAPTOP' } },
  { sku: 'LAP-HP-PROBOOK-640', categorySlug: 'laptops', name: 'HP ProBook 640 G2 (Used)', slug: 'hp-probook-640-g2-used', brand: 'HP', basePrice: 42000, description: 'Reliable everyday performance for office work and studying.', specs: { cpu: 'Core i5-6200U', ram: '8GB', storage: '256GB SSD', display: '14" FHD' }, compatibility: { category: 'LAPTOP' } }
];
