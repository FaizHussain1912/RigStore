import { z } from 'zod';

// Hardware Category Enums
export const CategoryEnum = z.enum([
  'CPU', 'MOTHERBOARD', 'RAM', 'GPU', 'PSU', 'CASE', 'COOLER', 'STORAGE'
]);
export type Category = z.infer<typeof CategoryEnum>;

// Component Base
const ComponentBase = z.object({
  id: z.string(),
  name: z.string(),
  category: CategoryEnum,
  price: z.number(),
});

// Specific Component Compatibility Schemas
export const CpuSchema = ComponentBase.extend({
  category: z.literal('CPU'),
  socket: z.string(),
  tdp: z.number(),           // Thermal Design Power in Watts
  includesCooler: z.boolean().default(false),
});

export const MotherboardSchema = ComponentBase.extend({
  category: z.literal('MOTHERBOARD'),
  socket: z.string(),
  formFactor: z.enum(['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX']),
  memoryType: z.enum(['DDR4', 'DDR5']),
  ramSlots: z.number(),
  m2Slots: z.number(),
});

export const RamSchema = ComponentBase.extend({
  category: z.literal('RAM'),
  memoryType: z.enum(['DDR4', 'DDR5']),
  modules: z.number(),       // e.g. 2 for a 2x16GB kit
});

export const GpuSchema = ComponentBase.extend({
  category: z.literal('GPU'),
  tdp: z.number(),
  lengthMm: z.number(),      // Length in millimeters for case clearance
  recommendedPsu: z.number().optional(), // Manufacturer recommended PSU wattage
});

export const PsuSchema = ComponentBase.extend({
  category: z.literal('PSU'),
  wattage: z.number(),
  formFactor: z.enum(['ATX', 'SFX']),
});

export const CaseSchema = ComponentBase.extend({
  category: z.literal('CASE'),
  formFactor: z.enum(['ATX', 'Micro-ATX', 'Mini-ITX']),
  supportedMoboSizes: z.array(z.enum(['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'])),
  maxGpuLengthMm: z.number(),
  maxCoolerHeightMm: z.number().optional(),
  supportedRadiators: z.array(z.number()).optional(), // e.g. [120, 240, 280, 360]
  psuFormFactor: z.array(z.enum(['ATX', 'SFX'])).default(['ATX', 'SFX']),
});

export const CoolerSchema = ComponentBase.extend({
  category: z.literal('COOLER'),
  type: z.enum(['AIR', 'AIO']),
  supportedSockets: z.array(z.string()),
  heightMm: z.number().optional(),    // For Air coolers
  radiatorSizeMm: z.number().optional(), // For AIOs (e.g. 240, 360)
});

export const StorageSchema = ComponentBase.extend({
  category: z.literal('STORAGE'),
  type: z.enum(['NVMe', 'SATA_SSD', 'HDD']),
});

// Discriminated Union for a selected build component
export const HardwareComponentSchema = z.discriminatedUnion('category', [
  CpuSchema, MotherboardSchema, RamSchema, GpuSchema, PsuSchema, CaseSchema, CoolerSchema, StorageSchema
]);

export type HardwareComponent = z.infer<typeof HardwareComponentSchema>;

export type BuildSelection = {
  cpu?: z.infer<typeof CpuSchema>;
  motherboard?: z.infer<typeof MotherboardSchema>;
  ram: z.infer<typeof RamSchema>[];
  gpu: z.infer<typeof GpuSchema>[];
  psu?: z.infer<typeof PsuSchema>;
  pcCase?: z.infer<typeof CaseSchema>;
  cooler?: z.infer<typeof CoolerSchema>;
  storage: z.infer<typeof StorageSchema>[];
};
