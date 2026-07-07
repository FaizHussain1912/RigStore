import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');
import { extraProducts } from './moreProducts';
import { extraProducts2 } from './moreProducts2';
import { extraProducts3 } from './moreProducts3';
import { extraProducts4 } from './moreProducts4';
import { extraProducts5 } from './moreProducts5';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding Categories...');
  const catCpu = await prisma.category.create({ data: { name: 'Processors', slug: 'processors' } });
  const catMobo = await prisma.category.create({ data: { name: 'Motherboards', slug: 'motherboards' } });
  const catRam = await prisma.category.create({ data: { name: 'Memory', slug: 'memory' } });
  const catGpu = await prisma.category.create({ data: { name: 'Graphic Cards', slug: 'gpus' } });
  const catPsu = await prisma.category.create({ data: { name: 'Power Supplies', slug: 'psus' } });
  const catCase = await prisma.category.create({ data: { name: 'Cases', slug: 'cases' } });
  const catCooler = await prisma.category.create({ data: { name: 'Coolers', slug: 'coolers' } });
  const catStorage = await prisma.category.create({ data: { name: 'Storage', slug: 'storage' } });
  
  // New Categories
  const catLaptops = await prisma.category.create({ data: { name: 'Laptops', slug: 'laptops' } });
  const catMonitors = await prisma.category.create({ data: { name: 'Monitors', slug: 'monitors' } });
  const catHeadphones = await prisma.category.create({ data: { name: 'Headphones', slug: 'headphones' } });
  const catMice = await prisma.category.create({ data: { name: 'Mice', slug: 'mice' } });
  const catKeyboards = await prisma.category.create({ data: { name: 'Keyboards', slug: 'keyboards' } });
  const catPeripherals = await prisma.category.create({ data: { name: 'Peripherals & Cables', slug: 'peripherals' } });
  const catDesktops = await prisma.category.create({ data: { name: 'Desktops', slug: 'desktops' } });

  console.log('Seeding Real Hardware Products...');

  const products = [
    // --- CPUs ---
    { sku: 'INT-14900K', categoryId: catCpu.id, name: 'Intel Core i9-14900K Processor', slug: 'intel-core-i9-14900k', brand: 'Intel', basePrice: 175000, description: 'The Intel Core i9-14900K is the ultimate processor for elite gamers and creators. With 24 cores (8 P-cores and 16 E-cores) and up to 6.0 GHz max turbo frequency, it handles the most demanding applications and extreme multitasking with ease.', specs: { cores: 24, threads: 32, boostClock: '6.0 GHz', socket: 'LGA1700' }, compatibility: { category: 'CPU', socket: 'LGA1700', tdp: 125, includesCooler: false } },
    { sku: 'AMD-7800X3D', categoryId: catCpu.id, name: 'AMD Ryzen 7 7800X3D Processor', slug: 'amd-ryzen-7-7800x3d', brand: 'AMD', basePrice: 110000, description: 'Built for gamers. The AMD Ryzen 7 7800X3D features massive AMD 3D V-Cache technology, ensuring unparalleled gaming performance. 8 cores and 16 threads provide smooth and fast performance for both modern titles and heavy workloads.', specs: { cores: 8, threads: 16, boostClock: '5.0 GHz', cache: '96MB L3' }, compatibility: { category: 'CPU', socket: 'AM5', tdp: 120, includesCooler: false } },

    // --- MOTHERBOARDS ---
    { sku: 'ASUS-ROG-Z790-E', categoryId: catMobo.id, name: 'ASUS ROG Strix Z790-E Gaming WiFi', slug: 'asus-rog-z790-e', brand: 'ASUS', basePrice: 145000, description: 'Push your Intel 13th and 14th Gen processors to the limit. Features PCIe 5.0, robust power delivery, exceptional cooling solutions, and WiFi 6E for the best connectivity.', specs: { chipset: 'Z790', formFactor: 'ATX', wifi: 'Wi-Fi 6E' }, compatibility: { category: 'MOTHERBOARD', socket: 'LGA1700', formFactor: 'ATX', memoryType: 'DDR5', ramSlots: 4, m2Slots: 5 } },

    // --- RAM ---
    { sku: 'COR-DOM-64GB-D5', categoryId: catRam.id, name: 'Corsair Dominator Titanium 64GB (2x32GB) DDR5 6000MHz', slug: 'corsair-dominator-64gb-ddr5', brand: 'Corsair', basePrice: 75000, description: 'Extreme performance DDR5 memory tailored for Intel platforms. Boasting customizable iCUE RGB lighting and hand-sorted memory chips to ensure maximum performance and overclocking headroom.', specs: { speed: '6000 MHz', casLatency: 30, voltage: '1.4V' }, compatibility: { category: 'RAM', memoryType: 'DDR5', modules: 2 } },

    // --- GPUs ---
    { sku: 'ASUS-4090-ROG', categoryId: catGpu.id, name: 'ASUS ROG Strix GeForce RTX 4090 24GB', slug: 'asus-rog-rtx-4090', brand: 'ASUS', basePrice: 650000, description: 'The absolute pinnacle of gaming graphics. The ROG Strix RTX 4090 features a massive die-cast shroud, patented Vapor Chamber cooling, and 24GB of GDDR6X memory to handle 4K gaming with ray tracing maxed out.', specs: { vram: '24GB', cores: 16384, memoryBus: '384-bit' }, compatibility: { category: 'GPU', tdp: 450, lengthMm: 357, recommendedPsu: 1000 } },
    { sku: 'ZOT-4060-TWIN', categoryId: catGpu.id, name: 'ZOTAC GAMING GeForce RTX 4060 Twin Edge OC', slug: 'zotac-rtx-4060', brand: 'ZOTAC', basePrice: 95000, description: 'Excellent 1080p performance featuring NVIDIA DLSS 3 and Ada Lovelace architecture. Compact dual-fan design fits easily into most cases while running cool and quiet.', specs: { vram: '8GB', cores: 3072 }, compatibility: { category: 'GPU', tdp: 115, lengthMm: 221, recommendedPsu: 500 } },

    // --- LAPTOPS ---
    { sku: 'LAP-ASUS-G16', categoryId: catLaptops.id, name: 'ASUS ROG Zephyrus G16 (2024) GU605', slug: 'asus-rog-zephyrus-g16-2024', brand: 'ASUS', basePrice: 685000, description: 'Ultra-sleek aluminum chassis, OLED Nebula Display, and Intel Core Ultra 9 processor paired with RTX 4070. The ultimate thin-and-light gaming laptop.', specs: { cpu: 'Intel Core Ultra 9 185H', ram: '32GB', gpu: 'RTX 4070 8GB', display: '16" 2.5K OLED 240Hz' }, compatibility: { category: 'LAPTOP' } },
    { sku: 'LAP-LEN-LOQ', categoryId: catLaptops.id, name: 'Lenovo LOQ 15 Gaming Laptop', slug: 'lenovo-loq-15', brand: 'Lenovo', basePrice: 245000, description: 'Best value gaming laptop. Featuring Intel Core i5 13th Gen and RTX 4050, perfect for smooth 1080p gaming on the go.', specs: { cpu: 'Core i5-13420H', ram: '16GB', gpu: 'RTX 4050 6GB', display: '15.6" FHD 144Hz' }, compatibility: { category: 'LAPTOP' } },
    { sku: 'LAP-MAC-M3', categoryId: catLaptops.id, name: 'Apple MacBook Pro 14" M3 Pro (2023)', slug: 'apple-macbook-pro-14-m3-pro', brand: 'Apple', basePrice: 625000, description: 'Mind-blowing performance. The M3 Pro chip makes heavy professional workflows like video editing and 3D rendering feel effortless. Liquid Retina XDR display is stunning.', specs: { cpu: 'Apple M3 Pro (11-core)', ram: '18GB', storage: '512GB SSD', display: '14.2" Liquid Retina XDR' }, compatibility: { category: 'LAPTOP' } },

    // --- DESKTOPS ---
    { sku: 'DESK-ALIEN-R15', categoryId: catDesktops.id, name: 'Alienware Aurora R15 Gaming Desktop', slug: 'alienware-aurora-r15', brand: 'Dell Alienware', basePrice: 890000, description: 'Pre-built monster with Core i9-13900KF and RTX 4090. Cryo-tech liquid cooling ensures it stays quiet even under the heaviest loads.', specs: { cpu: 'Core i9-13900KF', ram: '64GB', gpu: 'RTX 4090 24GB', storage: '2TB NVMe SSD' }, compatibility: { category: 'DESKTOP' } },

    // --- MONITORS ---
    { sku: 'MON-SAMSUNG-G9', categoryId: catMonitors.id, name: 'Samsung Odyssey G9 49" Curved Gaming Monitor', slug: 'samsung-odyssey-g9', brand: 'Samsung', basePrice: 385000, description: 'Experience pure immersion with this 49-inch curved ultrawide monitor. Features a 240Hz refresh rate and 1ms response time.', specs: { size: '49"', resolution: '5120x1440 (DQHD)', refreshRate: '240Hz', panel: 'QLED VA' }, compatibility: { category: 'MONITOR' } },
    { sku: 'MON-GIG-G24F2', categoryId: catMonitors.id, name: 'Gigabyte G24F 2 24" 165Hz Gaming Monitor', slug: 'gigabyte-g24f-2', brand: 'GIGABYTE', basePrice: 52000, description: 'The perfect budget esports monitor. 165Hz (OC 180Hz) IPS panel with 1ms response time.', specs: { size: '23.8"', resolution: '1920x1080 (FHD)', refreshRate: '165Hz / 180Hz OC', panel: 'IPS' }, compatibility: { category: 'MONITOR' } },

    // --- HEADPHONES ---
    { sku: 'HP-LOGI-PROX2', categoryId: catHeadphones.id, name: 'Logitech G PRO X 2 LIGHTSPEED Wireless Gaming Headset', slug: 'logitech-g-pro-x-2-wireless', brand: 'Logitech G', basePrice: 78000, description: 'Designed with esports pros. Graphene drivers provide unbelievable audio clarity and spatial awareness. Up to 50 hours of battery life.', specs: { connection: 'Wireless LIGHTSPEED', drivers: '50mm Graphene', battery: 'Up to 50 Hours' }, compatibility: { category: 'HEADPHONE' } },
    { sku: 'HP-RAZ-BLACKSHARK', categoryId: catHeadphones.id, name: 'Razer BlackShark V2 Pro Wireless', slug: 'razer-blackshark-v2-pro', brand: 'Razer', basePrice: 65000, description: 'Crystal clear mic and perfect isolation. THX Spatial Audio ensures you hear every footstep in tactical shooters.', specs: { connection: 'Wireless 2.4GHz', drivers: 'Razer TriForce Titanium 50mm' }, compatibility: { category: 'HEADPHONE' } },

    // --- MICE ---
    { sku: 'MS-LOGI-GPX2', categoryId: catMice.id, name: 'Logitech G PRO X SUPERLIGHT 2', slug: 'logitech-g-pro-x-superlight-2', brand: 'Logitech G', basePrice: 48000, description: 'The next generation of the world’s most trusted esports mouse. Now featuring LIGHTFORCE hybrid switches and HERO 2 sensor at just 60 grams.', specs: { weight: '60g', sensor: 'HERO 2', dpi: '32000 DPI' }, compatibility: { category: 'MOUSE' } },
    { sku: 'MS-RAZ-DAV3', categoryId: catMice.id, name: 'Razer DeathAdder V3 Pro', slug: 'razer-deathadder-v3-pro', brand: 'Razer', basePrice: 46000, description: 'Ultra-lightweight ergonomic mouse perfected for right-handed users. Focus Pro 30K Optical Sensor delivers flawless tracking.', specs: { weight: '63g', sensor: 'Focus Pro 30K', polling: 'Up to 4000Hz (with dongle)' }, compatibility: { category: 'MOUSE' } },

    // --- KEYBOARDS ---
    { sku: 'KB-WOOTING-60HE', categoryId: catKeyboards.id, name: 'Wooting 60HE Analog Mechanical Keyboard', slug: 'wooting-60he', brand: 'Wooting', basePrice: 65000, description: 'The competitive advantage. Analog Lekker switches give you rapid trigger technology, allowing instant strafing in games like CS2 and Valorant.', specs: { switches: 'Lekker Linear Analog', size: '60%', rgb: 'Per-key RGB' }, compatibility: { category: 'KEYBOARD' } },
    { sku: 'KB-LOGI-G915', categoryId: catKeyboards.id, name: 'Logitech G915 LIGHTSPEED Wireless', slug: 'logitech-g915-wireless', brand: 'Logitech G', basePrice: 72000, description: 'Ultra-thin, premium aluminum build with low-profile GL mechanical switches. Pro-grade wireless performance.', specs: { switches: 'Low Profile GL Tactile', size: 'Full Size', connection: 'LIGHTSPEED Wireless' }, compatibility: { category: 'KEYBOARD' } },

    // --- PERIPHERALS & CABLES ---
    { sku: 'PER-UGREEN-DP', categoryId: catPeripherals.id, name: 'UGREEN 8K DisplayPort 1.4 Cable 2m', slug: 'ugreen-8k-dp-cable-2m', brand: 'UGREEN', basePrice: 3500, description: 'Premium braided DisplayPort 1.4 cable supporting 8K@60Hz and 4K@144Hz. Gold-plated connectors.', specs: { length: '2 Meters', type: 'DisplayPort 1.4', maxResolution: '8K @ 60Hz' }, compatibility: { category: 'PERIPHERAL' } },
    { sku: 'PER-LOGI-C920', categoryId: catPeripherals.id, name: 'Logitech C920x HD Pro Webcam', slug: 'logitech-c920x-webcam', brand: 'Logitech', basePrice: 22000, description: 'The gold standard for streaming and video calls. Crisp 1080p video with dual stereo microphones.', specs: { resolution: '1080p @ 30fps', mic: 'Dual Stereo', focus: 'Autofocus' }, compatibility: { category: 'PERIPHERAL' } },
    { sku: 'PER-KING-USB-128', categoryId: catPeripherals.id, name: 'Kingston DataTraveler Max 128GB Type-C', slug: 'kingston-dt-max-128gb', brand: 'Kingston', basePrice: 8500, description: 'Unprecedented speeds in a USB flash drive. Read speeds up to 1000MB/s.', specs: { capacity: '128GB', interface: 'USB 3.2 Gen 2 Type-C', readSpeed: '1000 MB/s' }, compatibility: { category: 'PERIPHERAL' } },

    // --- NEW BATCH OF PRODUCTS (EXPANDED CATALOG) ---

    // CPUs
    { sku: 'INT-14700K', categoryId: catCpu.id, name: 'Intel Core i7-14700K Processor', slug: 'intel-core-i7-14700k', brand: 'Intel', basePrice: 125000, description: 'Featuring 20 cores (8 P-cores + 12 E-cores) and 28 threads, this CPU dominates high-end gaming and multi-threaded rendering.', specs: { cores: 20, threads: 28, boostClock: '5.6 GHz', socket: 'LGA1700' }, compatibility: { category: 'CPU', socket: 'LGA1700', tdp: 125, includesCooler: false } },
    { sku: 'AMD-7600X', categoryId: catCpu.id, name: 'AMD Ryzen 5 7600X Processor', slug: 'amd-ryzen-5-7600x', brand: 'AMD', basePrice: 75000, description: 'Amazing value for gaming. 6 cores and 12 threads with blazing fast 5.3 GHz boost clock on the modern AM5 platform.', specs: { cores: 6, threads: 12, boostClock: '5.3 GHz', socket: 'AM5' }, compatibility: { category: 'CPU', socket: 'AM5', tdp: 105, includesCooler: false } },
    { sku: 'INT-12400F', categoryId: catCpu.id, name: 'Intel Core i5-12400F Processor', slug: 'intel-core-i5-12400f', brand: 'Intel', basePrice: 42000, description: 'The absolute king of budget gaming. 6 powerful Performance cores, handling modern titles with zero bottlenecks.', specs: { cores: 6, threads: 12, boostClock: '4.4 GHz', socket: 'LGA1700' }, compatibility: { category: 'CPU', socket: 'LGA1700', tdp: 65, includesCooler: true } },

    // MOTHERBOARDS
    { sku: 'MSI-MAG-B760M', categoryId: catMobo.id, name: 'MSI MAG B760M MORTAR WIFI', slug: 'msi-mag-b760m-mortar-wifi', brand: 'MSI', basePrice: 65000, description: 'Micro-ATX powerhouse. Military-inspired design, beefy VRM cooling, and DDR5 support for optimal 12th/13th/14th Gen Intel performance.', specs: { chipset: 'B760', formFactor: 'Micro-ATX', wifi: 'Wi-Fi 6E' }, compatibility: { category: 'MOTHERBOARD', socket: 'LGA1700', formFactor: 'Micro-ATX', memoryType: 'DDR5', ramSlots: 4, m2Slots: 2 } },
    { sku: 'GIG-B650-AORUS', categoryId: catMobo.id, name: 'GIGABYTE B650 AORUS ELITE AX', slug: 'gigabyte-b650-aorus-elite-ax', brand: 'GIGABYTE', basePrice: 72000, description: 'Rule the game. Premium AM5 motherboard with PCIe 5.0 M.2 slot, massive heatsinks, and EZ-Latch designs for DIY builders.', specs: { chipset: 'B650', formFactor: 'ATX', wifi: 'Wi-Fi 6E' }, compatibility: { category: 'MOTHERBOARD', socket: 'AM5', formFactor: 'ATX', memoryType: 'DDR5', ramSlots: 4, m2Slots: 3 } },

    // RAM
    { sku: 'GSK-TRI-32GB-D5', categoryId: catRam.id, name: 'G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5 6000MHz', slug: 'gskill-trident-z5-neo-32gb-ddr5', brand: 'G.Skill', basePrice: 42000, description: 'Optimized for AMD EXPO. Offers ultra-low latency and stunning dual-textured heatspreaders with vivid RGB lighting.', specs: { speed: '6000 MHz', casLatency: 30, voltage: '1.35V' }, compatibility: { category: 'RAM', memoryType: 'DDR5', modules: 2 } },
    { sku: 'COR-VEN-16GB-D4', categoryId: catRam.id, name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz', slug: 'corsair-vengeance-lpx-16gb-ddr4', brand: 'Corsair', basePrice: 13500, description: 'Classic low-profile DDR4 memory. Highly reliable, great overclocking headroom, and fits under huge CPU air coolers.', specs: { speed: '3200 MHz', casLatency: 16, voltage: '1.35V' }, compatibility: { category: 'RAM', memoryType: 'DDR4', modules: 2 } },

    // GPUs
    { sku: 'MSI-4080S-SUP', categoryId: catGpu.id, name: 'MSI GeForce RTX 4080 SUPER SUPRIM X 16GB', slug: 'msi-geforce-rtx-4080-super-suprim-x', brand: 'MSI', basePrice: 385000, description: 'Masterpiece of engineering. The SUPRIM X features brushed aluminum, Tri Frozr 3S cooling, and Torx Fan 5.0 for silent high-end 4K gaming.', specs: { vram: '16GB', cores: 10240, memoryBus: '256-bit' }, compatibility: { category: 'GPU', tdp: 320, lengthMm: 336, recommendedPsu: 850 } },
    { sku: 'SAP-7800XT-NITRO', categoryId: catGpu.id, name: 'Sapphire NITRO+ AMD Radeon RX 7800 XT 16GB', slug: 'sapphire-nitro-rx-7800-xt', brand: 'Sapphire', basePrice: 175000, description: 'The 1440p King. Premium vapor chamber cooling, incredible aesthetic design with ARGB light bar, and massive 16GB VRAM.', specs: { vram: '16GB', streamProcessors: 3840 }, compatibility: { category: 'GPU', tdp: 263, lengthMm: 320, recommendedPsu: 700 } },
    { sku: 'GIG-4070S-WF', categoryId: catGpu.id, name: 'GIGABYTE GeForce RTX 4070 SUPER WINDFORCE OC 12GB', slug: 'gigabyte-rtx-4070-super-windforce', brand: 'GIGABYTE', basePrice: 205000, description: 'Triple-fan Windforce cooling system provides excellent thermal performance in a slim form factor, offering superb 1440p frame rates.', specs: { vram: '12GB', cores: 7168 }, compatibility: { category: 'GPU', tdp: 220, lengthMm: 261, recommendedPsu: 650 } },

    // STORAGE
    { sku: 'SAM-990-PRO-2TB', categoryId: catStorage.id, name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD', slug: 'samsung-990-pro-2tb', brand: 'Samsung', basePrice: 58000, description: 'Pushing the limits of PCIe 4.0. Read speeds up to 7,450 MB/s and write speeds up to 6,900 MB/s. Perfect for PS5 and high-end PCs.', specs: { capacity: '2TB', type: 'NVMe M.2 Gen4', readSpeed: '7450 MB/s' }, compatibility: { category: 'STORAGE' } },
    { sku: 'CRU-P3-1TB', categoryId: catStorage.id, name: 'Crucial P3 1TB PCIe 3.0 NVMe SSD', slug: 'crucial-p3-1tb', brand: 'Crucial', basePrice: 18500, description: 'Reliable, affordable, and fast. Boot up faster and load games in seconds with sequential reads up to 3500MB/s.', specs: { capacity: '1TB', type: 'NVMe M.2 Gen3', readSpeed: '3500 MB/s' }, compatibility: { category: 'STORAGE' } },
    { sku: 'SEA-BAR-2TB', categoryId: catStorage.id, name: 'Seagate BarraCuda 2TB Desktop HDD', slug: 'seagate-barracuda-2tb-hdd', brand: 'Seagate', basePrice: 15500, description: 'Cost-effective mass storage. 7200 RPM speed with a 256MB cache ensures fast data access for your media library.', specs: { capacity: '2TB', type: '3.5" HDD', speed: '7200 RPM' }, compatibility: { category: 'STORAGE' } },

    // POWER SUPPLIES
    { sku: 'COR-RM850E', categoryId: catPsu.id, name: 'Corsair RM850e Fully Modular Low-Noise ATX Power Supply', slug: 'corsair-rm850e', brand: 'Corsair', basePrice: 42000, description: 'ATX 3.0 and PCIe 5.0 compliant. Features a 12VHPWR cable and 105°C-rated capacitors for robust, quiet power delivery.', specs: { wattage: '850W', efficiency: '80+ Gold', modular: 'Full' }, compatibility: { category: 'PSU', wattage: 850, formFactor: 'ATX' } },
    { sku: 'XPG-CORE-750', categoryId: catPsu.id, name: 'XPG Core Reactor 750W 80 Plus Gold Modular', slug: 'xpg-core-reactor-750w', brand: 'XPG', basePrice: 31000, description: 'Compact and powerful. Premium Japanese capacitors and an incredibly quiet 120mm FDB fan.', specs: { wattage: '750W', efficiency: '80+ Gold', modular: 'Full' }, compatibility: { category: 'PSU', wattage: 750, formFactor: 'ATX' } },

    // CASES
    { sku: 'LIAN-O11D-EVO', categoryId: catCase.id, name: 'Lian Li O11 Dynamic EVO Mid-Tower Case', slug: 'lian-li-o11-dynamic-evo', brand: 'Lian Li', basePrice: 55000, description: 'The iconic dual-chamber case. Fully reversible layout, massive cooling potential, and gorgeous tempered glass panels to showcase your rig.', specs: { type: 'Mid Tower', color: 'Black', materials: 'Aluminum / Glass' }, compatibility: { category: 'CASE', formFactor: 'ATX', supportedMoboSizes: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'] } },
    { sku: 'COR-4000D-AIR', categoryId: catCase.id, name: 'Corsair 4000D Airflow Tempered Glass Mid-Tower Case', slug: 'corsair-4000d-airflow', brand: 'Corsair', basePrice: 32000, description: 'High-airflow front panel ensures maximum cooling for your components. Excellent cable management system makes building a breeze.', specs: { type: 'Mid Tower', color: 'Black', includesFans: '2x 120mm' }, compatibility: { category: 'CASE', formFactor: 'ATX', supportedMoboSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'] } },

    // COOLERS
    { sku: 'NOC-NH-D15', categoryId: catCooler.id, name: 'Noctua NH-D15 Premium CPU Cooler', slug: 'noctua-nh-d15', brand: 'Noctua', basePrice: 36000, description: 'The absolute benchmark for air cooling. Dual-tower design with two NF-A15 PWM fans rivals the performance of many liquid coolers while remaining practically silent.', specs: { type: 'Air Cooler', fans: '2x 140mm', height: '165mm' }, compatibility: { category: 'COOLER', type: 'AIR', heightMm: 165 } },
    { sku: 'COR-H150I-ELITE', categoryId: catCooler.id, name: 'Corsair iCUE H150i ELITE CAPELLIX XT Liquid CPU Cooler', slug: 'corsair-h150i-elite-capellix-xt', brand: 'Corsair', basePrice: 65000, description: 'Brilliant RGB lighting and extreme cooling performance. Includes three AF120 RGB ELITE PWM fans and an iCUE Commander CORE.', specs: { type: 'AIO Liquid', size: '360mm', fans: '3x 120mm RGB' }, compatibility: { category: 'COOLER', type: 'AIO', radiatorSizeMm: 360 } },
    { sku: 'DEEP-AK400', categoryId: catCooler.id, name: 'DeepCool AK400 Zero Dark Plus', slug: 'deepcool-ak400-zero-dark', brand: 'DeepCool', basePrice: 12500, description: 'Sleek all-black matrix fin design with four copper heat pipes and dual FDB fans for excellent heat dissipation on budget builds.', specs: { type: 'Air Cooler', fans: '2x 120mm', height: '155mm' }, compatibility: { category: 'COOLER', type: 'AIR', heightMm: 155 } },

    // LAPTOPS
    { sku: 'LAP-VICTUS-15', categoryId: catLaptops.id, name: 'HP Victus 15 Gaming Laptop', slug: 'hp-victus-15', brand: 'HP', basePrice: 215000, description: 'Affordable entry into PC gaming. Features an Intel Core i5 12th Gen processor and GTX 1650 graphics, packed in an elegant mica silver chassis.', specs: { cpu: 'Core i5-12450H', ram: '8GB', gpu: 'GTX 1650 4GB', display: '15.6" FHD 144Hz' }, compatibility: { category: 'LAPTOP' } },
    { sku: 'LAP-LEGION-PRO-5', categoryId: catLaptops.id, name: 'Lenovo Legion Pro 5i Gen 8', slug: 'lenovo-legion-pro-5i', brand: 'Lenovo', basePrice: 485000, description: 'Desktop-tier performance. Features Intel Core i7-13700HX, RTX 4070, and a stunning 16-inch 2560x1600 240Hz display. Tuned by AI engine+.', specs: { cpu: 'Core i7-13700HX', ram: '32GB', gpu: 'RTX 4070 8GB', display: '16" WQXGA 240Hz' }, compatibility: { category: 'LAPTOP' } },

    // DESKTOPS
    { sku: 'DESK-HP-OMEN-40L', categoryId: catDesktops.id, name: 'HP OMEN 40L Gaming Desktop', slug: 'hp-omen-40l', brand: 'HP', basePrice: 620000, description: 'Easily upgradable, tool-less access case. Liquid cooled Intel Core i7-13700K paired with NVIDIA RTX 4070 Ti for incredibly smooth 1440p/4K gaming.', specs: { cpu: 'Core i7-13700K', ram: '32GB', gpu: 'RTX 4070 Ti 12GB', storage: '1TB NVMe SSD' }, compatibility: { category: 'DESKTOP' } },

    // MONITORS
    { sku: 'MON-ASUS-TUF-VG27', categoryId: catMonitors.id, name: 'ASUS TUF Gaming VG27AQ 27" 165Hz', slug: 'asus-tuf-vg27aq', brand: 'ASUS', basePrice: 95000, description: 'The legendary 1440p sweet spot monitor. IPS panel, G-SYNC compatible, and extreme low motion blur sync (ELMB SYNC) for buttery smooth visuals.', specs: { size: '27"', resolution: '2560x1440 (QHD)', refreshRate: '165Hz', panel: 'IPS' }, compatibility: { category: 'MONITOR' } },
    { sku: 'MON-AOC-24G2', categoryId: catMonitors.id, name: 'AOC 24G2SP 24" 165Hz Gaming Monitor', slug: 'aoc-24g2sp', brand: 'AOC', basePrice: 48000, description: 'Incredible value for competitive gamers. 165Hz refresh rate, 1ms MPRT, and a highly color-accurate IPS panel.', specs: { size: '23.8"', resolution: '1920x1080 (FHD)', refreshRate: '165Hz', panel: 'IPS' }, compatibility: { category: 'MONITOR' } },

    // KEYBOARDS
    { sku: 'KB-KEYCHRON-K8', categoryId: catKeyboards.id, name: 'Keychron K8 Pro QMK/VIA Wireless Custom', slug: 'keychron-k8-pro', brand: 'Keychron', basePrice: 35000, description: 'A massive upgrade for typing enthusiasts. Tenkeyless layout, hot-swappable switches, sound-absorbing foam, and full VIA programmability.', specs: { switches: 'Gateron G Pro Red', size: 'TKL (80%)', connection: 'Bluetooth / Wired' }, compatibility: { category: 'KEYBOARD' } },
    { sku: 'KB-RED-K552', categoryId: catKeyboards.id, name: 'Redragon K552 Kumara Mechanical Keyboard', slug: 'redragon-k552-kumara', brand: 'Redragon', basePrice: 10500, description: 'The ultimate budget mechanical keyboard. Sturdy metal-abs construction, splash-proof design, and clicky blue switches.', specs: { switches: 'Outemu Blue', size: 'TKL (80%)', rgb: 'Red LED' }, compatibility: { category: 'KEYBOARD' } },

    // MICE
    { sku: 'MS-LOGI-G502', categoryId: catMice.id, name: 'Logitech G502 HERO High Performance Gaming Mouse', slug: 'logitech-g502-hero', brand: 'Logitech G', basePrice: 15500, description: 'The world\'s most popular gaming mouse. Features 11 programmable buttons, adjustable weights, and the hyper-accurate HERO 25K sensor.', specs: { weight: '121g (adjustable)', sensor: 'HERO 25K', dpi: '25600 DPI' }, compatibility: { category: 'MOUSE' } },
    { sku: 'MS-RAZ-VIPER-MINI', categoryId: catMice.id, name: 'Razer Viper Mini Ultra-Lightweight', slug: 'razer-viper-mini', brand: 'Razer', basePrice: 8500, description: 'Born to push the very limits of ultra-lightweight gaming. Weighing just 61g, it offers lightning-fast optical switches and a Speedflex cable.', specs: { weight: '61g', sensor: 'Optical 8500 DPI', buttons: 6 }, compatibility: { category: 'MOUSE' } },

    // HEADPHONES
    { sku: 'HP-HYPERX-C2', categoryId: catHeadphones.id, name: 'HyperX Cloud II Gaming Headset', slug: 'hyperx-cloud-ii', brand: 'HyperX', basePrice: 28000, description: 'Legendary comfort and sound. Features signature memory foam, premium leatherette, and virtual 7.1 surround sound driven by a USB audio control box.', specs: { connection: 'Wired USB / 3.5mm', drivers: '53mm Neodymium', surround: 'Virtual 7.1' }, compatibility: { category: 'HEADPHONE' } },

    // PERIPHERALS & CABLES
    { sku: 'PER-THERM-TG7', categoryId: catPeripherals.id, name: 'Thermal Grizzly Kryonaut Thermal Paste (1g)', slug: 'thermal-grizzly-kryonaut-1g', brand: 'Thermal Grizzly', basePrice: 3200, description: 'Extremely high thermal conductivity (12.5 W/mk). Specially developed for extremely demanding applications and the highest expectations of the overclocking community.', specs: { volume: '1g', conductivity: '12.5 W/mk', type: 'Thermal Paste' }, compatibility: { category: 'PERIPHERAL' } },
    { sku: 'PER-ASUS-BT500', categoryId: catPeripherals.id, name: 'ASUS USB-BT500 Bluetooth 5.0 USB Adapter', slug: 'asus-usb-bt500', brand: 'ASUS', basePrice: 5500, description: 'Ultra-small Bluetooth 5.0 USB adapter. Equips your PC with faster transmission speeds and 4x greater range than older generations.', specs: { interface: 'USB 2.0', standard: 'Bluetooth 5.0', range: 'Up to 40 meters' }, compatibility: { category: 'PERIPHERAL' } },

    // --- EVEN MORE MASSIVE BATCH OF PRODUCTS (PAKISTAN MARKET) ---

    // CPUs
    { sku: 'AMD-5600', categoryId: catCpu.id, name: 'AMD Ryzen 5 5600 Processor', slug: 'amd-ryzen-5-5600', brand: 'AMD', basePrice: 38000, description: 'The 1080p gaming sweet spot for AM4. Excellent 6-core 12-thread performance with low TDP.', specs: { cores: 6, threads: 12, boostClock: '4.4 GHz', socket: 'AM4' }, compatibility: { category: 'CPU', socket: 'AM4', tdp: 65, includesCooler: true } },
    { sku: 'INT-13600K', categoryId: catCpu.id, name: 'Intel Core i5-13600K Processor', slug: 'intel-core-i5-13600k', brand: 'Intel', basePrice: 95000, description: 'Incredible value for gaming and productivity. Features 14 cores (6P+8E) and performs like a flagship.', specs: { cores: 14, threads: 20, boostClock: '5.1 GHz', socket: 'LGA1700' }, compatibility: { category: 'CPU', socket: 'LGA1700', tdp: 125, includesCooler: false } },
    { sku: 'AMD-5700X3D', categoryId: catCpu.id, name: 'AMD Ryzen 7 5700X3D Processor', slug: 'amd-ryzen-7-5700x3d', brand: 'AMD', basePrice: 78000, description: 'Breathe massive life into your AM4 platform. Huge L3 cache gives this chip incredible gaming frame rates.', specs: { cores: 8, threads: 16, boostClock: '4.1 GHz', socket: 'AM4', cache: '96MB' }, compatibility: { category: 'CPU', socket: 'AM4', tdp: 105, includesCooler: false } },

    // MOTHERBOARDS
    { sku: 'ASUS-TUF-B650', categoryId: catMobo.id, name: 'ASUS TUF GAMING B650-PLUS WIFI', slug: 'asus-tuf-gaming-b650-plus-wifi', brand: 'ASUS', basePrice: 68000, description: 'Military-grade components, beefy VRM, and comprehensive cooling for stable AMD Ryzen 7000 performance.', specs: { chipset: 'B650', formFactor: 'ATX', wifi: 'Wi-Fi 6' }, compatibility: { category: 'MOTHERBOARD', socket: 'AM5', formFactor: 'ATX', memoryType: 'DDR5', ramSlots: 4, m2Slots: 3 } },
    { sku: 'GIG-B550-DS3H', categoryId: catMobo.id, name: 'GIGABYTE B550M DS3H', slug: 'gigabyte-b550m-ds3h', brand: 'GIGABYTE', basePrice: 28000, description: 'The absolute king of budget AM4 boards. Supports PCIe 4.0, dual M.2, and solid VRMs for 6-core CPUs.', specs: { chipset: 'B550', formFactor: 'Micro-ATX', wifi: 'No' }, compatibility: { category: 'MOTHERBOARD', socket: 'AM4', formFactor: 'Micro-ATX', memoryType: 'DDR4', ramSlots: 4, m2Slots: 2 } },
    { sku: 'MSI-PRO-Z790-P', categoryId: catMobo.id, name: 'MSI PRO Z790-P WIFI DDR5', slug: 'msi-pro-z790-p-wifi-ddr5', brand: 'MSI', basePrice: 69000, description: 'Professional series motherboard. Sleek business aesthetic but packed with heavy enthusiast-level performance and tuning capabilities.', specs: { chipset: 'Z790', formFactor: 'ATX', wifi: 'Wi-Fi 6E' }, compatibility: { category: 'MOTHERBOARD', socket: 'LGA1700', formFactor: 'ATX', memoryType: 'DDR5', ramSlots: 4, m2Slots: 4 } },

    // RAM
    { sku: 'LEX-ARES-32GB', categoryId: catRam.id, name: 'Lexar ARES RGB 32GB (2x16GB) DDR5 6400MHz', slug: 'lexar-ares-rgb-32gb-ddr5', brand: 'Lexar', basePrice: 40000, description: 'Premium memory with extremely tight timings and SK Hynix A-die for insane overclocking potential.', specs: { speed: '6400 MHz', casLatency: 32, voltage: '1.4V' }, compatibility: { category: 'RAM', memoryType: 'DDR5', modules: 2 } },
    { sku: 'KNG-FURY-16GB', categoryId: catRam.id, name: 'Kingston FURY Beast 16GB (1x16GB) DDR4 3200MHz', slug: 'kingston-fury-beast-16gb-ddr4', brand: 'Kingston', basePrice: 10500, description: 'Cost-effective high-performance upgrade for any DDR4 system.', specs: { speed: '3200 MHz', casLatency: 16, voltage: '1.35V' }, compatibility: { category: 'RAM', memoryType: 'DDR4', modules: 1 } },
    { sku: 'TFRC-DELT-32GB', categoryId: catRam.id, name: 'TEAMGROUP T-Force Delta RGB 32GB (2x16GB) DDR5 6000MHz', slug: 'teamgroup-t-force-delta-rgb-32gb-ddr5', brand: 'TEAMGROUP', basePrice: 35000, description: 'Distinctive 120-degree ultra-wide angle RGB lighting and highly stable performance.', specs: { speed: '6000 MHz', casLatency: 38, voltage: '1.25V' }, compatibility: { category: 'RAM', memoryType: 'DDR5', modules: 2 } },

    // GPUs
    { sku: 'PALIT-4060TI-8GB', categoryId: catGpu.id, name: 'Palit GeForce RTX 4060 Ti Dual 8GB', slug: 'palit-rtx-4060-ti-dual', brand: 'Palit', basePrice: 125000, description: 'Incredible 1080p ray tracing powerhouse. DLSS 3 frame generation pushes frame rates beyond limits in supported games.', specs: { vram: '8GB', cores: 4352 }, compatibility: { category: 'GPU', tdp: 160, lengthMm: 249, recommendedPsu: 600 } },
    { sku: 'ASUS-7900XTX-TUF', categoryId: catGpu.id, name: 'ASUS TUF Gaming Radeon RX 7900 XTX 24GB', slug: 'asus-tuf-rx-7900-xtx', brand: 'ASUS', basePrice: 380000, description: 'AMDs flagship RDNA 3 architecture. Raw rasterization performance that beats almost anything else, built like a tank.', specs: { vram: '24GB', streamProcessors: 6144 }, compatibility: { category: 'GPU', tdp: 355, lengthMm: 352, recommendedPsu: 850 } },
    { sku: 'ZOT-3060-12GB', categoryId: catGpu.id, name: 'ZOTAC GAMING GeForce RTX 3060 Twin Edge 12GB', slug: 'zotac-rtx-3060-12gb', brand: 'ZOTAC', basePrice: 88000, description: 'A beloved classic. Huge 12GB VRAM buffer makes it incredible for heavy games and 3D creative workflows on a budget.', specs: { vram: '12GB', cores: 3584 }, compatibility: { category: 'GPU', tdp: 170, lengthMm: 224, recommendedPsu: 500 } },
    { sku: 'GAL-4070TI-S', categoryId: catGpu.id, name: 'GALAX GeForce RTX 4070 Ti SUPER EX Gamer 16GB', slug: 'galax-rtx-4070-ti-super', brand: 'GALAX', basePrice: 285000, description: 'Supercharged performance with a bumped up 16GB VRAM pool for seamless 4K gaming and heavy productivity.', specs: { vram: '16GB', cores: 8448 }, compatibility: { category: 'GPU', tdp: 285, lengthMm: 336, recommendedPsu: 750 } },

    // STORAGE
    { sku: 'WD-SN850X-1TB', categoryId: catStorage.id, name: 'WD_BLACK 1TB SN850X NVMe Gen4 PCIe', slug: 'wd-black-sn850x-1tb', brand: 'Western Digital', basePrice: 28000, description: 'Crush load times. Insane read speeds up to 7,300 MB/s. Perfect for high-end rigs and PS5 consoles.', specs: { capacity: '1TB', type: 'NVMe M.2 Gen4', readSpeed: '7300 MB/s' }, compatibility: { category: 'STORAGE' } },
    { sku: 'LEX-NM620-1TB', categoryId: catStorage.id, name: 'Lexar NM620 1TB M.2 2280 PCIe Gen3 NVMe', slug: 'lexar-nm620-1tb', brand: 'Lexar', basePrice: 15000, description: 'High-speed data transfer and fast boot ups for an extremely affordable price point.', specs: { capacity: '1TB', type: 'NVMe M.2 Gen3', readSpeed: '3500 MB/s' }, compatibility: { category: 'STORAGE' } },
    { sku: 'KNG-A400-480GB', categoryId: catStorage.id, name: 'Kingston A400 480GB SATA SSD', slug: 'kingston-a400-480gb', brand: 'Kingston', basePrice: 8500, description: 'Perfect drive for reviving older laptops and PCs or as a cheap secondary mass storage drive.', specs: { capacity: '480GB', type: '2.5" SATA', readSpeed: '500 MB/s' }, compatibility: { category: 'STORAGE' } },

    // POWER SUPPLIES
    { sku: 'SILVER-1000W', categoryId: catPsu.id, name: 'SilverStone DA1000R 1000W 80 Plus Gold ATX 3.0', slug: 'silverstone-da1000r', brand: 'SilverStone', basePrice: 48000, description: 'Native PCIe 5.0 and ATX 3.0 support. Includes the 12VHPWR cable to natively power RTX 4090s safely.', specs: { wattage: '1000W', efficiency: '80+ Gold', modular: 'Full' }, compatibility: { category: 'PSU', wattage: 1000, formFactor: 'ATX' } },
    { sku: 'COR-CX650', categoryId: catPsu.id, name: 'Corsair CX650 80 Plus Bronze Power Supply', slug: 'corsair-cx650', brand: 'Corsair', basePrice: 17500, description: 'Reliable and safe power delivery for entry to mid-range gaming builds. Sleek black cables.', specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Non-Modular' }, compatibility: { category: 'PSU', wattage: 650, formFactor: 'ATX' } },

    // CASES
    { sku: 'NZXT-H6-FLOW', categoryId: catCase.id, name: 'NZXT H6 Flow Dual-Chamber Compact Mid-Tower', slug: 'nzxt-h6-flow', brand: 'NZXT', basePrice: 38000, description: 'Unique angled front panel with 3 included 120mm fans creates brilliant direct airflow to the GPU. Dual-chamber design hides all cables.', specs: { type: 'Mid Tower', color: 'White', includesFans: '3x 120mm' }, compatibility: { category: 'CASE', formFactor: 'ATX', supportedMoboSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'] } },
    { sku: 'MON-SKY-TWO', categoryId: catCase.id, name: 'Montech SKY TWO ARGB ATX Mid Tower Case', slug: 'montech-sky-two', brand: 'Montech', basePrice: 28000, description: 'Stunning seamless dual-tempered glass view. Includes 4 high-quality ARGB PWM fans right out of the box.', specs: { type: 'Mid Tower', color: 'Black', includesFans: '4x 120mm ARGB' }, compatibility: { category: 'CASE', formFactor: 'ATX', supportedMoboSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'] } },
    { sku: 'AERO-HIVE', categoryId: catCase.id, name: 'Aerocool Hive ARGB Tempered Glass Mid-Tower', slug: 'aerocool-hive-argb', brand: 'Aerocool', basePrice: 12500, description: 'Budget friendly airflow chassis. Mesh front panel allows superior cooling, and a glass side panel shows off your rig.', specs: { type: 'Mid Tower', color: 'Black', includesFans: '1x 120mm ARGB' }, compatibility: { category: 'CASE', formFactor: 'ATX', supportedMoboSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'] } },

    // COOLERS
    { sku: 'Lian-Li-Galahad-360', categoryId: catCooler.id, name: 'Lian Li Galahad II Trinity 360 ARGB AIO Liquid Cooler', slug: 'lian-li-galahad-ii-360', brand: 'Lian Li', basePrice: 52000, description: 'Spectacular infinity mirror design on the pump block and extremely powerful cooling performance for high-end CPUs.', specs: { type: 'AIO Liquid', size: '360mm', fans: '3x 120mm ARGB' }, compatibility: { category: 'COOLER', type: 'AIO', radiatorSizeMm: 360 } },
    { sku: 'TMAT-PA120', categoryId: catCooler.id, name: 'Thermalright Peerless Assassin 120 SE', slug: 'thermalright-peerless-assassin-120-se', brand: 'Thermalright', basePrice: 16000, description: 'The absolute best value air cooler in the world. Dual tower, 6 heat-pipes, matching cooling performance of coolers three times its price.', specs: { type: 'Air Cooler', fans: '2x 120mm', height: '155mm' }, compatibility: { category: 'COOLER', type: 'AIR', heightMm: 155 } },

    // LAPTOPS
    { sku: 'LAP-ACER-NITRO', categoryId: catLaptops.id, name: 'Acer Nitro V 15 Gaming Laptop', slug: 'acer-nitro-v-15', brand: 'Acer', basePrice: 265000, description: 'The perfect budget companion. Intel Core i7-13620H and RTX 4050 graphics. Plays everything smoothly.', specs: { cpu: 'Core i7-13620H', ram: '16GB', gpu: 'RTX 4050 6GB', display: '15.6" FHD 144Hz' }, compatibility: { category: 'LAPTOP' } },
    { sku: 'LAP-MAC-M2-AIR', categoryId: catLaptops.id, name: 'Apple MacBook Air 13" M2 (2022)', slug: 'apple-macbook-air-13-m2', brand: 'Apple', basePrice: 315000, description: 'Thin, light, and incredibly powerful. The M2 chip gives amazing battery life while flying through everyday tasks and light editing.', specs: { cpu: 'Apple M2 (8-core)', ram: '8GB', gpu: '8-core GPU', storage: '256GB SSD' }, compatibility: { category: 'LAPTOP' } },
    { sku: 'LAP-ASUS-STRIX-G16', categoryId: catLaptops.id, name: 'ASUS ROG Strix G16 G614JV', slug: 'asus-rog-strix-g16', brand: 'ASUS', basePrice: 485000, description: 'Esports dominance. Core i9-13980HX and RTX 4060 graphics paired with a massive Nebula display for insane refresh rates.', specs: { cpu: 'Core i9-13980HX', ram: '16GB', gpu: 'RTX 4060 8GB', display: '16" QHD+ 240Hz' }, compatibility: { category: 'LAPTOP' } },

    // DESKTOPS
    { sku: 'DESK-MSI-AEGIS', categoryId: catDesktops.id, name: 'MSI MEG Aegis Ti5 13th', slug: 'msi-meg-aegis-ti5', brand: 'MSI', basePrice: 1100000, description: 'Looks like it came from the future. Core i9-13900K and RTX 4090. A true luxury, over-the-top flagship gaming prebuilt.', specs: { cpu: 'Core i9-13900K', ram: '64GB', gpu: 'RTX 4090 24GB', storage: '2TB NVMe SSD' }, compatibility: { category: 'DESKTOP' } },

    // MONITORS
    { sku: 'MON-DELL-ALIEN-34', categoryId: catMonitors.id, name: 'Alienware 34" Curved QD-OLED (AW3423DWF)', slug: 'alienware-aw3423dwf', brand: 'Dell Alienware', basePrice: 325000, description: 'Breathtaking visual fidelity. Quantum Dot OLED panel gives perfect true blacks and infinite contrast with a 165Hz refresh rate.', specs: { size: '34" Ultrawide', resolution: '3440x1440 (UWQHD)', refreshRate: '165Hz', panel: 'QD-OLED' }, compatibility: { category: 'MONITOR' } },
    { sku: 'MON-LG-27GP850', categoryId: catMonitors.id, name: 'LG UltraGear 27GP850-B 27" Nano IPS', slug: 'lg-ultragear-27gp850', brand: 'LG', basePrice: 115000, description: 'A legendary 1440p monitor. Nano IPS tech provides incredibly vivid colors and 1ms Nano IPS response time.', specs: { size: '27"', resolution: '2560x1440 (QHD)', refreshRate: '165Hz / 180Hz OC', panel: 'Nano IPS' }, compatibility: { category: 'MONITOR' } },
    { sku: 'MON-SAMSUNG-CRG5', categoryId: catMonitors.id, name: 'Samsung 24" CRG5 Curved 144Hz', slug: 'samsung-crg5-24', brand: 'Samsung', basePrice: 42000, description: 'Entry level curved 144Hz monitor. Smooth gameplay and immersive 1800R curvature.', specs: { size: '24"', resolution: '1920x1080 (FHD)', refreshRate: '144Hz', panel: 'VA' }, compatibility: { category: 'MONITOR' } },

    // KEYBOARDS
    { sku: 'KB-RAZ-HUNTSMAN', categoryId: catKeyboards.id, name: 'Razer Huntsman V2 Tenkeyless', slug: 'razer-huntsman-v2-tkl', brand: 'Razer', basePrice: 42000, description: 'Optical switches actuate with the speed of light. Includes a plush wrist rest and sound dampening foam.', specs: { switches: 'Razer Linear Optical', size: 'TKL (80%)', polling: '8000Hz' }, compatibility: { category: 'KEYBOARD' } },
    { sku: 'KB-RK61', categoryId: catKeyboards.id, name: 'Royal Kludge RK61 Wireless 60%', slug: 'royal-kludge-rk61', brand: 'Royal Kludge', basePrice: 11500, description: 'The legendary budget 60% mechanical keyboard. Clean looks, wireless capability, and hot-swappable switches.', specs: { switches: 'RK Brown', size: '60%', connection: 'Bluetooth / Wired' }, compatibility: { category: 'KEYBOARD' } },

    // MICE
    { sku: 'MS-ZOWIE-EC2CW', categoryId: catMice.id, name: 'BenQ ZOWIE EC2-CW Wireless', slug: 'benq-zowie-ec2-cw', brand: 'ZOWIE', basePrice: 58000, description: 'The king of ergonomics finally goes wireless. Features an enhanced receiver to ensure zero interference in loud esports arenas.', specs: { weight: '77g', shape: 'Ergonomic Right-hand', connection: 'Wireless' }, compatibility: { category: 'MOUSE' } },
    { sku: 'MS-GLOR-MODELO', categoryId: catMice.id, name: 'Glorious Model O Wireless', slug: 'glorious-model-o-wireless', brand: 'Glorious', basePrice: 22000, description: 'Honeycomb shell makes it extremely light. The BAMF sensor provides lag-free, crisp tracking.', specs: { weight: '69g', sensor: 'BAMF', dpi: '19000 DPI' }, compatibility: { category: 'MOUSE' } },

    // HEADPHONES
    { sku: 'HP-STEEL-ARCTIS', categoryId: catHeadphones.id, name: 'SteelSeries Arctis Nova Pro Wireless', slug: 'steelseries-arctis-nova-pro', brand: 'SteelSeries', basePrice: 95000, description: 'The absolute endgame gaming headset. Active Noise Canceling, hot-swappable batteries, and unparalleled audio quality via the base station.', specs: { connection: 'Wireless 2.4GHz + BT', anc: 'Yes', battery: 'Hot-swappable dual battery' }, compatibility: { category: 'HEADPHONE' } },
    { sku: 'HP-COR-HS80', categoryId: catHeadphones.id, name: 'Corsair HS80 RGB Wireless', slug: 'corsair-hs80-rgb-wireless', brand: 'Corsair', basePrice: 45000, description: 'Incredibly comfortable ski-band design. The broadcast-grade omni-directional microphone is arguably the best in any wireless headset.', specs: { connection: 'Wireless Slipstream', drivers: '50mm Neodymium', mic: 'Broadcast-grade Omni' }, compatibility: { category: 'HEADPHONE' } },

    // PERIPHERALS & CABLES
    { sku: 'PER-ELG-STREAMDECK', categoryId: catPeripherals.id, name: 'Elgato Stream Deck MK.2', slug: 'elgato-stream-deck-mk2', brand: 'Elgato', basePrice: 48000, description: '15 customizable LCD keys to control your stream, apps, and tools with a single touch.', specs: { keys: '15 LCD Keys', connection: 'USB-C', software: 'Stream Deck App' }, compatibility: { category: 'PERIPHERAL' } },
    { sku: 'PER-FIFINE-AM8', categoryId: catPeripherals.id, name: 'FIFINE AM8 RGB Dynamic USB/XLR Microphone', slug: 'fifine-am8-dynamic-mic', brand: 'FIFINE', basePrice: 18500, description: 'Budget friendly broadcasting microphone that rivals the big brands. Rejects background noise effectively.', specs: { type: 'Dynamic', connection: 'USB-C / XLR', polarPattern: 'Cardioid' }, compatibility: { category: 'PERIPHERAL' } }
  ];

  const catMap: Record<string, string> = {
    'processors': catCpu.id,
    'motherboards': catMobo.id,
    'memory': catRam.id,
    'gpus': catGpu.id,
    'psus': catPsu.id,
    'cases': catCase.id,
    'coolers': catCooler.id,
    'storage': catStorage.id,
    'laptops': catLaptops.id,
    'monitors': catMonitors.id,
    'headphones': catHeadphones.id,
    'mice': catMice.id,
    'keyboards': catKeyboards.id,
    'peripherals': catPeripherals.id,
    'desktops': catDesktops.id,
  };

  for (const extra of extraProducts) {
    const { categorySlug, ...rest } = extra;
    products.push({
      ...rest,
      categoryId: catMap[categorySlug] || catPeripherals.id
    });
  }

  for (const extra of extraProducts2) {
    const { categorySlug, ...rest } = extra;
    products.push({
      ...rest,
      categoryId: catMap[categorySlug] || catPeripherals.id
    });
  }

  for (const extra of extraProducts3) {
    const { categorySlug, ...rest } = extra;
    products.push({
      ...rest,
      categoryId: catMap[categorySlug] || catPeripherals.id
    });
  }

  for (const extra of extraProducts4) {
    const { categorySlug, ...rest } = extra;
    products.push({
      ...rest,
      categoryId: catMap[categorySlug] || catPeripherals.id
    });
  }

  for (const extra of extraProducts5) {
    const { categorySlug, ...rest } = extra;
    products.push({
      ...rest,
      categoryId: catMap[categorySlug] || catPeripherals.id
    });
  }

  for (const p of products) {
    // Determine image URL
    let imageUrl = `/images/${p.compatibility.category.toLowerCase()}.png`;
    
    const imageMap: Record<string, string> = {
      'asus-rog-rtx-4090': '/images/asus_4090.png',
      'zotac-rtx-4060': '/images/zotac_4060.png',
    };

    if (imageMap[p.slug]) {
      imageUrl = imageMap[p.slug];
    }

    const createdProduct = await prisma.product.create({
      data: {
        ...p,
        imageUrl,
        specs: p.specs,
        compatibility: p.compatibility
      }
    });

    await prisma.inventory.create({
      data: {
        productId: createdProduct.id,
        totalStock: Math.floor(Math.random() * 50) + 5,
        lockedStock: 0,
        salesVelocity7Days: Math.floor(Math.random() * 20),
        salesVelocity30Days: Math.floor(Math.random() * 60),
      }
    });
  }

  console.log('Seeding Admin User...');
  const adminPasswordHash = await bcrypt.hash('RigAdmin2024!', 10);
  
  await prisma.user.create({
    data: {
      email: 'admin@rigstore.com',
      name: 'RigStore Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    }
  });

  console.log(`Seeded completely with ${products.length} products in PKR and 1 admin user!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
