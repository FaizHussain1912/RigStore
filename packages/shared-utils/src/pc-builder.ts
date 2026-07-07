import { BuildSelection } from './types';

export type IssueLevel = 'ERROR' | 'WARNING' | 'INFO';

export interface CompatibilityIssue {
  level: IssueLevel;
  title: string;
  message: string;
  componentsAffected: string[]; // Names of the components causing the issue
}

export function validateBuild(build: BuildSelection): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  const { cpu, motherboard, ram, gpu, psu, pcCase, cooler, storage } = build;

  // 1. CPU & Motherboard Socket Check
  if (cpu && motherboard) {
    if (cpu.socket !== motherboard.socket) {
      issues.push({
        level: 'ERROR',
        title: 'Incompatible Socket',
        message: `The CPU requires an ${cpu.socket} socket, but the Motherboard has an ${motherboard.socket} socket.`,
        componentsAffected: [cpu.name, motherboard.name]
      });
    }
  }

  // 2. Motherboard & RAM Generation Check
  if (motherboard && ram.length > 0) {
    for (const r of ram) {
      if (r.memoryType !== motherboard.memoryType) {
        issues.push({
          level: 'ERROR',
          title: 'Incompatible Memory Type',
          message: `The Motherboard supports ${motherboard.memoryType}, but you selected ${r.memoryType} RAM.`,
          componentsAffected: [motherboard.name, r.name]
        });
      }
    }

    // Check RAM slots
    const totalModules = ram.reduce((sum, r) => sum + r.modules, 0);
    if (totalModules > motherboard.ramSlots) {
      issues.push({
        level: 'ERROR',
        title: 'Not Enough RAM Slots',
        message: `You selected ${totalModules} RAM modules, but the Motherboard only has ${motherboard.ramSlots} slots.`,
        componentsAffected: [motherboard.name, ...ram.map(r => r.name)]
      });
    }
  }

  // 3. Motherboard & Case Form Factor Check
  if (motherboard && pcCase) {
    if (pcCase.supportedMoboSizes && !pcCase.supportedMoboSizes.includes(motherboard.formFactor)) {
      issues.push({
        level: 'ERROR',
        title: 'Motherboard Too Large',
        message: `The Case does not support ${motherboard.formFactor} motherboards.`,
        componentsAffected: [pcCase.name, motherboard.name]
      });
    }
  }

  // 4. GPU Length Clearance Check
  if (gpu.length > 0 && pcCase) {
    for (const g of gpu) {
      if (g.lengthMm > pcCase.maxGpuLengthMm) {
        issues.push({
          level: 'ERROR',
          title: 'GPU Too Long',
          message: `The GPU is ${g.lengthMm}mm long, but the Case only supports up to ${pcCase.maxGpuLengthMm}mm.`,
          componentsAffected: [pcCase.name, g.name]
        });
      }
    }
  }

  // 5. Cooler Clearance and Compatibility
  if (cooler) {
    if (cpu && cooler.supportedSockets && !cooler.supportedSockets.includes(cpu.socket)) {
      issues.push({
        level: 'ERROR',
        title: 'Cooler Socket Mismatch',
        message: `The Cooler does not include mounting brackets for the ${cpu.socket} socket.`,
        componentsAffected: [cooler.name, cpu.name]
      });
    }

    if (pcCase) {
      if (cooler.type === 'AIR' && cooler.heightMm && pcCase.maxCoolerHeightMm) {
        if (cooler.heightMm > pcCase.maxCoolerHeightMm) {
          issues.push({
            level: 'ERROR',
            title: 'Cooler Too Tall',
            message: `The Air Cooler is ${cooler.heightMm}mm tall, but the Case only clears ${pcCase.maxCoolerHeightMm}mm.`,
            componentsAffected: [pcCase.name, cooler.name]
          });
        }
      }
      if (cooler.type === 'AIO' && cooler.radiatorSizeMm && pcCase.supportedRadiators) {
        if (pcCase.supportedRadiators && !pcCase.supportedRadiators.includes(cooler.radiatorSizeMm)) {
          issues.push({
            level: 'ERROR',
            title: 'Radiator Not Supported',
            message: `The Case does not officially support mounting a ${cooler.radiatorSizeMm}mm radiator.`,
            componentsAffected: [pcCase.name, cooler.name]
          });
        }
      }
    }
  } else if (cpu && !cpu.includesCooler) {
    issues.push({
      level: 'WARNING',
      title: 'Missing CPU Cooler',
      message: 'This CPU does not come with a stock cooler. You need to purchase an aftermarket cooler.',
      componentsAffected: [cpu.name]
    });
  }

  // 6. Storage Check
  if (motherboard && storage.length > 0) {
    const nvmeCount = storage.filter(s => s.type === 'NVMe').length;
    if (nvmeCount > motherboard.m2Slots) {
      issues.push({
        level: 'ERROR',
        title: 'Not Enough M.2 Slots',
        message: `You selected ${nvmeCount} NVMe drives, but the Motherboard only has ${motherboard.m2Slots} M.2 slots.`,
        componentsAffected: [motherboard.name, ...storage.filter(s => s.type === 'NVMe').map(s => s.name)]
      });
    }
  }

  // 7. Power Supply and Wattage Calculator
  const totalTdp = (cpu?.tdp || 0) + gpu.reduce((sum, g) => sum + g.tdp, 0) + 50; // +50W overhead for mobo/fans/storage
  const recommendedWattage = totalTdp * 1.5;

  if (psu) {
    if (psu.wattage < totalTdp) {
      issues.push({
        level: 'ERROR',
        title: 'Insufficient Power Supply',
        message: `Your components require at least ${totalTdp}W, but you selected a ${psu.wattage}W PSU. The system will shut down under load.`,
        componentsAffected: [psu.name]
      });
    } else if (psu.wattage < recommendedWattage) {
      issues.push({
        level: 'WARNING',
        title: 'Low Power Overhead',
        message: `Your system draws ~${totalTdp}W. A ${psu.wattage}W PSU works, but we recommend at least ${Math.ceil(recommendedWattage/50)*50}W for safety and future upgrades.`,
        componentsAffected: [psu.name]
      });
    }

    if (pcCase && pcCase.psuFormFactor && !pcCase.psuFormFactor.includes(psu.formFactor)) {
      issues.push({
        level: 'ERROR',
        title: 'PSU Size Incompatible',
        message: `The Case requires ${pcCase.psuFormFactor.join(' or ')} power supplies, but you selected an ${psu.formFactor} PSU.`,
        componentsAffected: [pcCase.name, psu.name]
      });
    }
  }

  // 8. GPU Manufacturer Recommendation
  if (psu && gpu.length > 0) {
    const highestGpuRec = Math.max(...gpu.map(g => g.recommendedPsu || 0));
    if (highestGpuRec > psu.wattage) {
      issues.push({
        level: 'WARNING',
        title: 'Below GPU Manufacturer Recommendation',
        message: `The GPU manufacturer recommends a ${highestGpuRec}W PSU, but you selected ${psu.wattage}W.`,
        componentsAffected: [psu.name, ...gpu.filter(g => g.recommendedPsu === highestGpuRec).map(g => g.name)]
      });
    }
  }

  return issues;
}
