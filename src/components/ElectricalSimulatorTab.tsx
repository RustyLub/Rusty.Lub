import { useState, useEffect, useRef } from 'react';
import fandomIcons from './fandom_icons.json';
import { 
  Zap, 
  Sun, 
  Wind, 
  Battery, 
  ToggleLeft, 
  ToggleRight, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Eye, 
  BookOpen, 
  Cpu, 
  ArrowRight, 
  Volume2, 
  VolumeX,
  Mail,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Web Audio API click/clack sound synthesized on-the-fly
const playClickSound = (isMuted: boolean, type: 'click' | 'power_on' | 'power_off') => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'power_on') {
      // Bzz-click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'power_off') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // Ignore audio failure
  }
};

export interface ComponentType {
  id: string;
  type: 'solar_panel' | 'wind_turbine' | 'large_battery' | 'electrical_branch' | 'switch' | 'splitter' | 'blocker' | 'auto_turret' | 'sam_site' | 'ceiling_light';
  nameRU: string;
  nameEN: string;
  powerIn: number;
  powerOut: number;
  branchOutValue?: number; // For electrical branches
  switchActive?: boolean; // For switches
  batteryCharge?: number; // For battery level (0-100)
  targetOutputs: { [port: string]: { targetId: string; targetPort: string } | null };
}

interface ElectricalSimulatorTabProps {
  lang: 'ru' | 'en';
}

export default function ElectricalSimulatorTab({ lang }: ElectricalSimulatorTabProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<number>(12); // 0 to 24 hours. 6-18 is daytime.
  const [windSpeed, setWindSpeed] = useState<number>(80); // 0-100% wind strength

  // Pre-made blueprints
  const blueprints = [
    {
      id: 'blueprint_turret',
      nameRU: '🔥 Автоматическая турель',
      nameEN: '🔥 Auto Turret Setup',
      descRU: 'Базовая схема автономного питания турели: Солнечная панель заряжает аккумулятор, а выключатель позволяет безопасно ее отключать.',
      descEN: 'Standard automatic turret circuit: Solar panel charges the battery, and a switch allows toggling the turret safely.',
      components: [
        {
          id: 'solar',
          type: 'solar_panel' as const,
          nameRU: 'Солнечная панель',
          nameEN: 'Solar Panel',
          powerIn: 0,
          powerOut: 20,
          targetOutputs: { 'output': { targetId: 'battery', targetPort: 'input' } }
        },
        {
          id: 'battery',
          type: 'large_battery' as const,
          nameRU: 'Большой аккумулятор',
          nameEN: 'Large Battery',
          powerIn: 0,
          powerOut: 100,
          batteryCharge: 85,
          targetOutputs: { 'output': { targetId: 'switch', targetPort: 'input' } }
        },
        {
          id: 'switch',
          type: 'switch' as const,
          nameRU: 'Выключатель',
          nameEN: 'Switch',
          powerIn: 0,
          powerOut: 0,
          switchActive: true,
          targetOutputs: { 'output': { targetId: 'turret', targetPort: 'input' } }
        },
        {
          id: 'turret',
          type: 'auto_turret' as const,
          nameRU: 'Авто-турель',
          nameEN: 'Auto Turret',
          powerIn: 0,
          powerOut: 0,
          targetOutputs: {}
        }
      ]
    },
    {
      id: 'blueprint_alarm',
      nameRU: '🚨 Система охраны базы',
      nameEN: '🚨 Anti-Raid Intruder Alarm',
      descRU: 'Электрическое разветвление питает активную турель (10W) и ПВО (25W) параллельно от мощной ветряной мельницы.',
      descEN: 'Electrical Branch split power from a massive wind turbine to power an Auto Turret (10W) and SAM Site (25W) simultaneously.',
      components: [
        {
          id: 'wind',
          type: 'wind_turbine' as const,
          nameRU: 'Ветрогенератор',
          nameEN: 'Wind Turbine',
          powerIn: 0,
          powerOut: 150,
          targetOutputs: { 'output': { targetId: 'battery', targetPort: 'input' } }
        },
        {
          id: 'battery',
          type: 'large_battery' as const,
          nameRU: 'Большой аккумулятор',
          nameEN: 'Large Battery',
          powerIn: 0,
          powerOut: 100,
          batteryCharge: 95,
          targetOutputs: { 'output': { targetId: 'branch', targetPort: 'input' } }
        },
        {
          id: 'branch',
          type: 'electrical_branch' as const,
          nameRU: 'Электро-разветвитель',
          nameEN: 'Electrical Branch',
          powerIn: 0,
          powerOut: 0,
          branchOutValue: 10,
          targetOutputs: { 
            'branch_out': { targetId: 'turret', targetPort: 'input' },
            'power_out': { targetId: 'sam', targetPort: 'input' }
          }
        },
        {
          id: 'turret',
          type: 'auto_turret' as const,
          nameRU: 'Авто-турель',
          nameEN: 'Auto Turret',
          powerIn: 0,
          powerOut: 0,
          targetOutputs: {}
        },
        {
          id: 'sam',
          type: 'sam_site' as const,
          nameRU: 'ПВО установка',
          nameEN: 'SAM Site',
          powerIn: 0,
          powerOut: 0,
          targetOutputs: {}
        }
      ]
    },
    {
      id: 'blueprint_ceiling',
      nameRU: '💡 Автоматическое освещение лутовой',
      nameEN: '💡 Automatic Base Lighting',
      descRU: 'Умная цепь: когда заходит солнце, Блокиратор пропускает накопленную энергию аккумулятора прямо на потолочные лампы!',
      descEN: 'Smart circuit: solar panel feeds a Blocker during daytime to keep lighting OFF. When night falls, Blocker releases battery power to lights automatically.',
      components: [
        {
          id: 'solar',
          type: 'solar_panel' as const,
          nameRU: 'Солнечная панель',
          nameEN: 'Solar Panel',
          powerIn: 0,
          powerOut: 20,
          targetOutputs: { 'output': { targetId: 'blocker', targetPort: 'block' } }
        },
        {
          id: 'battery',
          type: 'large_battery' as const,
          nameRU: 'Большой аккумулятор',
          nameEN: 'Large Battery',
          powerIn: 0,
          powerOut: 100,
          batteryCharge: 60,
          targetOutputs: { 'output': { targetId: 'blocker', targetPort: 'input' } }
        },
        {
          id: 'blocker',
          type: 'blocker' as const,
          nameRU: 'Блокиратор питания',
          nameEN: 'Blocker',
          powerIn: 0,
          powerOut: 0,
          targetOutputs: { 'output': { targetId: 'light1', targetPort: 'input' } }
        },
        {
          id: 'light1',
          type: 'ceiling_light' as const,
          nameRU: 'Потолочный светильник',
          nameEN: 'Ceiling Light',
          powerIn: 0,
          powerOut: 0,
          targetOutputs: {}
        }
      ]
    }
  ];

  // Active circuit state
  const [components, setComponents] = useState<ComponentType[]>(blueprints[0].components);

  // Connection selection state
  const [selectedSource, setSelectedSource] = useState<{ id: string; port: string } | null>(null);

  // Apply Blueprint preset
  const applyBlueprint = (bpId: string) => {
    const bp = blueprints.find(b => b.id === bpId);
    if (bp) {
      playClickSound(isMuted, 'power_on');
      // Clone deeply
      const cloned = JSON.parse(JSON.stringify(bp.components));
      setComponents(cloned);
      setSelectedSource(null);
    }
  };

  // Add Component to Sandbox
  const addComponent = (type: ComponentType['type']) => {
    playClickSound(isMuted, 'click');
    const newId = `${type}_${Math.floor(1000 + Math.random() * 9000)}`;
    const compMeta = getComponentMeta(type);
    
    const newComp: ComponentType = {
      id: newId,
      type,
      nameRU: compMeta.nameRU,
      nameEN: compMeta.nameEN,
      powerIn: 0,
      powerOut: 0,
      targetOutputs: {},
    };

    if (type === 'electrical_branch') {
      newComp.branchOutValue = 10;
    }
    if (type === 'switch') {
      newComp.switchActive = false;
    }
    if (type === 'large_battery') {
      newComp.batteryCharge = 100;
    }

    // Initialize targetOutputs structure for ports
    compMeta.outputs.forEach(port => {
      newComp.targetOutputs[port] = null;
    });

    setComponents(prev => [...prev, newComp]);
  };

  // Remove Component
  const removeComponent = (id: string) => {
    playClickSound(isMuted, 'power_off');
    setComponents(prev => {
      // 1. Remove the component itself
      // 2. Clear any incoming connections pointing to this component
      return prev.filter(c => c.id !== id).map(c => {
        const cleanedOutputs = { ...c.targetOutputs };
        Object.keys(cleanedOutputs).forEach(port => {
          if (cleanedOutputs[port]?.targetId === id) {
            cleanedOutputs[port] = null;
          }
        });
        return { ...c, targetOutputs: cleanedOutputs };
      });
    });
    if (selectedSource?.id === id) {
      setSelectedSource(null);
    }
  };

  // Switch Toggler
  const toggleSwitch = (id: string) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id) {
        const nextState = !c.switchActive;
        playClickSound(isMuted, nextState ? 'power_on' : 'power_off');
        return { ...c, switchActive: nextState };
      }
      return c;
    }));
  };

  // Change branch out setting
  const updateBranchValue = (id: string, val: number) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, branchOutValue: Math.max(1, Math.min(99, val)) };
      }
      return c;
    }));
  };

  // Handle port click to create/cut connection
  const handlePortClick = (compId: string, port: string, direction: 'input' | 'output') => {
    playClickSound(isMuted, 'click');

    if (direction === 'output') {
      // If we clicked the same source output, cancel selection
      if (selectedSource?.id === compId && selectedSource.port === port) {
        setSelectedSource(null);
        return;
      }
      
      // If clicked another output, set as new source
      setSelectedSource({ id: compId, port });
    } else {
      // Direction is input
      if (!selectedSource) {
        // No source selected, cannot connect to input
        return;
      }

      // We have a selected output source. Establish connection!
      const srcId = selectedSource.id;
      const srcPort = selectedSource.port;

      if (srcId === compId) {
        // Cannot connect component to itself
        setSelectedSource(null);
        return;
      }

      setComponents(prev => prev.map(c => {
        if (c.id === srcId) {
          return {
            ...c,
            targetOutputs: {
              ...c.targetOutputs,
              [srcPort]: { targetId: compId, targetPort: port }
            }
          };
        }
        return c;
      }));

      setSelectedSource(null);
    }
  };

  // Clear connection on output port
  const clearConnection = (compId: string, port: string) => {
    playClickSound(isMuted, 'power_off');
    setComponents(prev => prev.map(c => {
      if (c.id === compId) {
        return {
          ...c,
          targetOutputs: {
            ...c.targetOutputs,
            [port]: null
          }
        };
      }
      return c;
    }));
  };

  // Reset Sandbox fully
  const resetSandbox = () => {
    playClickSound(isMuted, 'power_off');
    setComponents([]);
    setSelectedSource(null);
  };

  // Component meta data
  const getComponentMeta = (type: ComponentType['type']) => {
    switch (type) {
      case 'solar_panel':
        return {
          nameRU: 'Солнечная панель',
          nameEN: 'Solar Panel',
          descRU: 'Выдает до 20W энергии в зависимости от положения солнца.',
          descEN: 'Outputs up to 20W depending on time of day.',
          inputs: [],
          outputs: ['output'],
          color: 'border-emerald-500/30 bg-emerald-500/5',
          activeColor: 'text-emerald-400',
        };
      case 'wind_turbine':
        return {
          nameRU: 'Ветрогенератор',
          nameEN: 'Wind Turbine',
          descRU: 'Вырабатывает до 150W энергии. Эффективность зависит от ветра.',
          descEN: 'Generates up to 150W. Power scales with wind speed.',
          inputs: [],
          outputs: ['output'],
          color: 'border-cyan-500/30 bg-cyan-500/5',
          activeColor: 'text-cyan-400',
        };
      case 'large_battery':
        return {
          nameRU: 'Большой аккумулятор',
          nameEN: 'Large Battery',
          descRU: 'Заряжается от входа. Выдает стабильные 100W на выходе.',
          descEN: 'Charges from input. Supplies up to 100W stable output.',
          inputs: ['input'],
          outputs: ['output'],
          color: 'border-teal-500/30 bg-teal-500/5',
          activeColor: 'text-teal-400',
        };
      case 'electrical_branch':
        return {
          nameRU: 'Электро-разветвитель',
          nameEN: 'Electrical Branch',
          descRU: 'Ответвляет заданную мощность (Branch Out). Остаток идет на Power Out.',
          descEN: 'Splits configured power (Branch Out). Remaining power passes to Power Out.',
          inputs: ['input'],
          outputs: ['branch_out', 'power_out'],
          color: 'border-indigo-500/30 bg-indigo-500/5',
          activeColor: 'text-indigo-400',
        };
      case 'switch':
        return {
          nameRU: 'Переключатель',
          nameEN: 'Switch',
          descRU: 'Ручной выключатель питания. При включении потребляет 1W.',
          descEN: 'Manual power switch. Consumes 1W when toggled ON.',
          inputs: ['input'],
          outputs: ['output'],
          color: 'border-amber-500/30 bg-amber-500/5',
          activeColor: 'text-amber-400',
        };
      case 'splitter':
        return {
          nameRU: 'Разветвитель (3 выхода)',
          nameEN: 'Splitter (3 Out)',
          descRU: 'Делит входное питание поровну на 3 активных выхода.',
          descEN: 'Divides incoming power equally among up to 3 active outputs.',
          inputs: ['input'],
          outputs: ['out1', 'out2', 'out3'],
          color: 'border-purple-500/30 bg-purple-500/5',
          activeColor: 'text-purple-400',
        };
      case 'blocker':
        return {
          nameRU: 'Блокиратор питания',
          nameEN: 'Blocker',
          descRU: 'Блокирует основной выход, если на порт Block подано питание.',
          descEN: 'Blocks primary output power if the Block port receives any voltage.',
          inputs: ['input', 'block'],
          outputs: ['output'],
          color: 'border-rose-500/30 bg-rose-500/5',
          activeColor: 'text-rose-400',
        };
      case 'auto_turret':
        return {
          nameRU: 'Автоматическая турель',
          nameEN: 'Auto Turret',
          descRU: 'Защитное орудие. Требует ровно 10W для активации.',
          descEN: 'Automated base defense turret. Requires 10W to operate.',
          inputs: ['input'],
          outputs: [],
          color: 'border-red-500/30 bg-red-500/5',
          activeColor: 'text-red-400',
        };
      case 'sam_site':
        return {
          nameRU: 'ПВО установка',
          nameEN: 'SAM Site',
          descRU: 'Сбивает вражеские коптеры. Требует 25W для работы.',
          descEN: 'Anti-air rocket battery. Requires 25W to operate.',
          inputs: ['input'],
          outputs: [],
          color: 'border-orange-500/30 bg-orange-500/5',
          activeColor: 'text-orange-400',
        };
      case 'ceiling_light':
        return {
          nameRU: 'Потолочный светильник',
          nameEN: 'Ceiling Light',
          descRU: 'Освещает базу ночью. Потребляет 2W.',
          descEN: 'Illuminates base interior. Consumes 2W.',
          inputs: ['input'],
          outputs: [],
          color: 'border-yellow-500/30 bg-yellow-500/5',
          activeColor: 'text-yellow-400',
        };
    }
  };

  // Helper for component icons
  const ComponentIcon = ({ type, size = 16 }: { type: string; size?: number }) => {
    const iconUrl = (fandomIcons as Record<string, string>)[type];
    const getRustlabsId = (type: string) => {
      switch (type) {
        case 'solar_panel': return 'solar.panel';
        case 'wind_turbine': return 'wind.turbine';
        case 'large_battery': return 'large.battery';
        case 'electrical_branch': return 'electrical.branch';
        case 'switch': return 'electrical.switch';
        case 'splitter': return 'electrical.splitter';
        case 'blocker': return 'electrical.blocker';
        case 'auto_turret': return 'autoturret';
        case 'sam_site': return 'sam.site';
        case 'ceiling_light': return 'ceiling.light';
        default: return type;
      }
    };
    
    return (
      <img 
        src={iconUrl || `https://rustlabs.com/img/items180/${getRustlabsId(type)}.png`} 
        alt={type} 
        style={{ width: size, height: size }} 
        className="object-contain" 
        loading="lazy"
        onError={(e) => { 
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    );
  };

  useEffect(() => {
    // 1. Reset all calculated power parameters
    const resetComps = components.map(c => ({ ...c, powerIn: 0, powerOut: 0 }));

    // Helper to find daytime Solar power
    // Day starts at 6:00 and ends at 18:00
    const isDay = timeOfDay >= 6 && timeOfDay <= 18;
    const solarFactor = isDay ? Math.sin(((timeOfDay - 6) / 12) * Math.PI) : 0;
    const currentSolarPower = Math.round(20 * solarFactor);

    // Wind power calculation
    const currentWindPower = Math.round(150 * (windSpeed / 100));

    // Queue of components to process power propagation
    // We start with source components that generate power
    resetComps.forEach(c => {
      if (c.type === 'solar_panel') {
        c.powerOut = currentSolarPower;
      } else if (c.type === 'wind_turbine') {
        c.powerOut = currentWindPower;
      }
    });

    // Run propagation iterations (up to 8 cycles to allow fully connected flow resolution)
    const activeNodes = [...resetComps];
    let iteration = 0;
    const maxIterations = 8;
    
    while (iteration < maxIterations) {
      let changed = false;

      // Loop through all items and update power
      for (let i = 0; i < activeNodes.length; i++) {
        const node = activeNodes[i];

        // Gather all incoming power directed to this component
        let incoming = 0;
        let blockingPower = 0;

        activeNodes.forEach(other => {
          Object.keys(other.targetOutputs).forEach(port => {
            const target = other.targetOutputs[port];
            if (target?.targetId === node.id) {
              if (target.targetPort === 'block') {
                blockingPower += other.powerOut;
              } else {
                incoming += other.powerOut;
              }
            }
          });
        });

        // Determine output power based on component logic
        let calculatedPowerOut = 0;
        let calculatedPowerIn = incoming;

        if (node.type === 'solar_panel') {
          calculatedPowerOut = currentSolarPower;
        } else if (node.type === 'wind_turbine') {
          calculatedPowerOut = currentWindPower;
        } else if (node.type === 'large_battery') {
          // Large Battery output: delivers up to 100W stable if charged, consumes 1W of internal logic
          if (node.batteryCharge && node.batteryCharge > 0) {
            calculatedPowerOut = 100;
          } else {
            // No charge, output only works if direct pass-through or solar actively charging
            calculatedPowerOut = Math.max(0, incoming - 1);
          }
        } else if (node.type === 'electrical_branch') {
          // Electrical Branch: consumes 1W of internal operation
          if (incoming >= 1) {
            calculatedPowerOut = incoming - 1;
          }
        } else if (node.type === 'switch') {
          // Switch: if ON, passes power with 1W consumption
          if (node.switchActive && incoming >= 1) {
            calculatedPowerOut = incoming - 1;
          } else {
            calculatedPowerOut = 0;
          }
        } else if (node.type === 'splitter') {
          // Splitter: divides incoming equally with 1W internal consumption
          if (incoming >= 1) {
            calculatedPowerOut = incoming - 1;
          }
        } else if (node.type === 'blocker') {
          // Blocker: lets power pass only if no blocking power is present
          if (blockingPower === 0 && incoming >= 1) {
            calculatedPowerOut = incoming - 1;
          } else {
            calculatedPowerOut = 0;
          }
        } else if (node.type === 'auto_turret' || node.type === 'sam_site' || node.type === 'ceiling_light') {
          calculatedPowerOut = 0; // These are end consumers
        }

        if (node.powerIn !== calculatedPowerIn || node.powerOut !== calculatedPowerOut) {
          node.powerIn = calculatedPowerIn;
          node.powerOut = calculatedPowerOut;
          changed = true;
        }
      }

      if (!changed) break;
      iteration++;
    }

    // Secondary pass to calculate specific PORT power levels (e.g. Branch out, splitter fractioning)
    activeNodes.forEach(node => {
      if (node.type === 'electrical_branch') {
        const branchVal = node.branchOutValue || 10;
        // Check how much power enters
        const available = Math.max(0, node.powerIn - 1);
        if (available > 0) {
          // If available power is less than branched amount, all available goes to branch
          const actualBranch = Math.min(available, branchVal);
          const actualPowerOut = Math.max(0, available - actualBranch);

          // We override output values based on ports
          node.powerOut = available; // total passed
        }
      } else if (node.type === 'splitter') {
        // Count active target connections
        const activePorts = Object.keys(node.targetOutputs).filter(p => node.targetOutputs[p] !== null).length;
        const available = Math.max(0, node.powerIn - 1);
        if (available > 0 && activePorts > 0) {
          const splitShare = Math.floor(available / activePorts);
          node.powerOut = splitShare; // Equal share per active port
        }
      }
    });

    // Check if the overall state has structurally changed to avoid infinite loop
    const stateStringBefore = JSON.stringify(components.map(c => ({ id: c.id, pin: c.powerIn, pout: c.powerOut })));
    const stateStringAfter = JSON.stringify(activeNodes.map(c => ({ id: c.id, pin: c.powerIn, pout: c.powerOut })));
    
    if (stateStringBefore !== stateStringAfter) {
      setComponents(activeNodes);
    }
  }, [components, timeOfDay, windSpeed]);

  return (
    <div className="space-y-6">
      {/* Simulation Master Environment HUD Controls */}
      <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] shadow-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />
        <div className="absolute right-0 top-0 w-24 h-full rust-hazard opacity-10 pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#2a2f3b] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#cd412b]/10 text-[#cd412b] p-2 border border-[#cd412b]/30">
              <Cpu size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-widest text-white uppercase font-mono">
                {lang === 'ru' ? '🔌 Интерактивный Симулятор Электрики Rust' : '🔌 Interactive Rust Electrical Simulator'}
              </h2>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                {lang === 'ru' 
                  ? 'Моделируйте схемы, соединяйте компоненты проводами и настраивайте питание вашей базы!' 
                  : 'Design electric schemes, route wires, configure power outputs, and test base mechanisms!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 border transition-colors cursor-pointer rounded-none ${
                isMuted 
                  ? 'border-gray-700 bg-gray-800/10 text-gray-500 hover:text-white' 
                  : 'border-[#2a2f3b] bg-[#1b1e26] text-amber-400 hover:bg-amber-500/10'
              }`}
              title={lang === 'ru' ? 'Вкл/Выкл Звук' : 'Toggle Audio'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <button
              onClick={resetSandbox}
              className="px-3 py-1.5 border border-[#cd412b]/50 bg-[#cd412b]/5 hover:bg-[#cd412b] text-[#cd412b] hover:text-white transition-all text-xs font-bold font-mono uppercase tracking-wider cursor-pointer"
            >
              <RotateCcw size={12} className="inline mr-1.5" />
              {lang === 'ru' ? 'Очистить симулятор' : 'Reset Sandbox'}
            </button>
          </div>
        </div>

        {/* Environmental Sliders: Solar and Wind controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Solar position slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Sun size={14} className="text-amber-400 animate-spin-slow" />
                {lang === 'ru' ? '🌞 ПОЛОЖЕНИЕ СОЛНЦА (ВРЕМЯ СУТОК)' : '🌞 POSITION OF THE SUN (TIME OF DAY)'}
              </span>
              <span className="text-[#cd412b] font-bold">
                {Math.floor(timeOfDay).toString().padStart(2, '0')}:00 {timeOfDay >= 6 && timeOfDay <= 18 ? '☀️' : '🌙'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-600 font-mono">00:00</span>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                className="flex-1 accent-[#cd412b] h-1.5 bg-[#0c0d10] border border-[#2a2f3b] cursor-pointer"
              />
              <span className="text-[10px] text-gray-600 font-mono">24:00</span>
            </div>
          </div>

          {/* Wind Speed slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Wind size={14} className="text-cyan-400" />
                {lang === 'ru' ? '💨 СИЛА ВЕТРА (ВЫСОТА ВЕТРЯКА)' : '💨 WIND TURBINE STRENGTH'}
              </span>
              <span className="text-[#cd412b] font-bold">{Math.round(windSpeed)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-600 font-mono">{lang === 'ru' ? 'Штиль' : 'Calm'}</span>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                className="flex-1 accent-[#cd412b] h-1.5 bg-[#0c0d10] border border-[#2a2f3b] cursor-pointer"
              />
              <span className="text-[10px] text-gray-600 font-mono">{lang === 'ru' ? 'Ураган' : 'Storm'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Presets Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest font-mono">
          {lang === 'ru' ? '📋 Готовые тактические схемы' : '📋 Pre-built Tactical Blueprints'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blueprints.map((bp) => (
            <div
              key={bp.id}
              onClick={() => applyBlueprint(bp.id)}
              className="bg-[#14171e]/90 p-4 border border-[#2a2f3b] hover:border-[#cd412b] transition-all cursor-pointer relative group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  {lang === 'ru' ? bp.nameRU : bp.nameEN}
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-sans font-medium">
                  {lang === 'ru' ? bp.descRU : bp.descEN}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-gray-500 pt-2 border-t border-gray-800/60">
                <span className="uppercase">{bp.components.length} components</span>
                <span className="text-[#cd412b] group-hover:underline flex items-center gap-1 font-bold">
                  {lang === 'ru' ? 'Применить' : 'Load preset'} <ArrowRight size={10} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sandbox Workspace Builder Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Palette block (Add Components) */}
        <div className="xl:col-span-3 space-y-4 bg-[#14171e]/90 p-5 border border-[#2a2f3b] flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#cd412b] uppercase tracking-widest font-mono border-b border-[#2a2f3b] pb-2">
              {lang === 'ru' ? '🛠️ Палитра приборов' : '🛠️ Component Library'}
            </h3>
            
            {/* Sources list */}
            <div className="space-y-2.5">
              <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                {lang === 'ru' ? 'Источники питания' : 'Power Sources'}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { type: 'solar_panel' as const, name: 'Solar Panel', nameRU: 'Солнечная панель', icon: <Sun size={12} className="text-emerald-400" /> },
                  { type: 'wind_turbine' as const, name: 'Wind Turbine', nameRU: 'Ветряная мельница', icon: <Wind size={12} className="text-cyan-400" /> },
                  { type: 'large_battery' as const, name: 'Large Battery', nameRU: 'Большой АКБ', icon: <Battery size={12} className="text-teal-400" /> },
                ].map(c => (
                  <button
                    key={c.type}
                    onClick={() => addComponent(c.type)}
                    className="flex items-center justify-between p-2.5 bg-[#0c0d10] border border-[#2a2f3b] hover:border-gray-500 transition-colors cursor-pointer text-xs font-mono text-left w-full text-gray-300 rounded-none group"
                  >
                    <span className="flex items-center gap-2">
                      {c.icon}
                      {lang === 'ru' ? c.nameRU : c.name}
                    </span>
                    <Plus size={12} className="text-gray-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>

            {/* Splitters & Logics list */}
            <div className="space-y-2.5 pt-2">
              <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                {lang === 'ru' ? 'Логика и разветвление' : 'Logic & Splitters'}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { type: 'electrical_branch' as const, name: 'Electrical Branch', nameRU: 'Электро-бранч', icon: <Cpu size={12} className="text-indigo-400" /> },
                  { type: 'switch' as const, name: 'Manual Switch', nameRU: 'Выключатель', icon: <ToggleRight size={12} className="text-amber-400" /> },
                  { type: 'splitter' as const, name: 'Splitter', nameRU: 'Разветвитель (3х)', icon: <Cpu size={12} className="text-purple-400" /> },
                  { type: 'blocker' as const, name: 'Blocker', nameRU: 'Блокиратор', icon: <Cpu size={12} className="text-rose-400" /> },
                ].map(c => (
                  <button
                    key={c.type}
                    onClick={() => addComponent(c.type)}
                    className="flex items-center justify-between p-2.5 bg-[#0c0d10] border border-[#2a2f3b] hover:border-gray-500 transition-colors cursor-pointer text-xs font-mono text-left w-full text-gray-300 rounded-none group"
                  >
                    <span className="flex items-center gap-2">
                      {c.icon}
                      {lang === 'ru' ? c.nameRU : c.name}
                    </span>
                    <Plus size={12} className="text-gray-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>

            {/* Consumers list */}
            <div className="space-y-2.5 pt-2">
              <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                {lang === 'ru' ? 'Потребители энергии' : 'Consumers'}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { type: 'auto_turret' as const, name: 'Auto Turret (10W)', nameRU: 'Авто-турель (10W)', icon: <Flame size={12} className="text-red-400" /> },
                  { type: 'sam_site' as const, name: 'SAM Air Defense (25W)', nameRU: 'ПВО установка (25W)', icon: <Flame size={12} className="text-orange-400" /> },
                  { type: 'ceiling_light' as const, name: 'Ceiling Light (2W)', nameRU: 'Светильник (2W)', icon: <Zap size={12} className="text-yellow-400" /> },
                ].map(c => (
                  <button
                    key={c.type}
                    onClick={() => addComponent(c.type)}
                    className="flex items-center justify-between p-2.5 bg-[#0c0d10] border border-[#2a2f3b] hover:border-gray-500 transition-colors cursor-pointer text-xs font-mono text-left w-full text-gray-300 rounded-none group"
                  >
                    <span className="flex items-center gap-2">
                      {c.icon}
                      {lang === 'ru' ? c.nameRU : c.name}
                    </span>
                    <Plus size={12} className="text-gray-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0c0d10] p-3 border border-[#2a2f3b] space-y-2 mt-4 text-[9.5px] font-sans text-gray-500 leading-normal">
            <span className="font-bold text-[#cd412b] block uppercase font-mono">⚠️ {lang === 'ru' ? 'ИНСТРУКЦИЯ К СХЕМЕ' : 'CONNECTION GUIDE'}</span>
            <p>
              {lang === 'ru' 
                ? '1. Выберите ВЫХОД (Output) прибора, нажав на него (он подсветится золотым).\n2. Нажмите на ВХОД (Input) другого прибора для подключения.'
                : '1. Click an OUTPUT port on any component (it will glow gold).\n2. Click any INPUT port on another component to wire them.'}
            </p>
          </div>
        </div>

        {/* Right Side: Active Workspace & Visual Simulator Nodes Grid */}
        <div className="xl:col-span-9 bg-black/40 border border-[#2a2f3b] p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2 border-b border-[#2a2f3b] pb-2.5">
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                {lang === 'ru' ? '🖥️ Активная схема на базе' : '🖥️ Active Base Electrical Grid'}
              </h3>
              <div className="flex gap-4 font-mono text-[10px] text-gray-500">
                <span>{lang === 'ru' ? 'ПРИБОРОВ:' : 'COMPONENTS:'} <strong className="text-white">{components.length}</strong></span>
                {selectedSource && (
                  <span className="text-amber-400 font-bold animate-pulse">
                    ⚡ {lang === 'ru' ? 'СОЕДИНЕНИЕ:' : 'WIRING:'} {selectedSource.id} ({selectedSource.port})
                  </span>
                )}
              </div>
            </div>

            {components.length === 0 ? (
              <div className="py-24 text-center space-y-4 border border-dashed border-gray-800">
                <Cpu className="mx-auto text-gray-700 animate-pulse" size={48} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">
                    {lang === 'ru' ? 'Схема пуста' : 'Sandbox Workspace is Empty'}
                  </p>
                  <p className="text-[10px] text-gray-600 font-sans max-w-sm mx-auto leading-relaxed">
                    {lang === 'ru' 
                      ? 'Выберите готовый шаблон вверху или добавьте приборы из левой палитры инструментов.' 
                      : 'Load an existing blueprint preset above or add clean components from the left palette library.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {components.map((c) => {
                    const compMeta = getComponentMeta(c.type);
                    const isPoweredOn = c.type === 'solar_panel' || c.type === 'wind_turbine'
                      ? c.powerOut > 0
                      : c.powerIn >= (c.type === 'auto_turret' ? 10 : c.type === 'sam_site' ? 25 : c.type === 'ceiling_light' ? 2 : 1) && 
                        (c.type !== 'switch' || c.switchActive);

                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={`p-4 border rounded-none relative flex flex-col justify-between overflow-hidden ${compMeta.color} ${
                          isPoweredOn ? 'border-[#cd412b]/50 bg-[#cd412b]/5 shadow-md shadow-[#cd412b]/5' : ''
                        }`}
                      >
                        {/* Tactical indicators */}
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-gray-500/25" />
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-gray-500/25" />
                        <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 bg-gray-500/25" />
                        <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-gray-500/25" />

                        {/* Top info row */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[8px] font-bold text-gray-500 font-mono tracking-wider uppercase">
                            ID: {c.id}
                          </span>
                          <button
                            onClick={() => removeComponent(c.id)}
                            className="text-gray-600 hover:text-[#cd412b] transition-colors p-0.5 cursor-pointer"
                            title={lang === 'ru' ? 'Удалить прибор' : 'Remove component'}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Content detail body */}
                        <div className="space-y-3 z-10">
                          <div className="flex items-center gap-2">
                            <ComponentIcon type={c.type} size={14} />
                            <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                              {lang === 'ru' ? c.nameRU : c.nameEN}
                            </h4>
                          </div>

                          {/* Dynamic components controls / status */}
                          {c.type === 'electrical_branch' && (
                            <div className="bg-[#0c0d10] p-1.5 border border-[#2a2f3b] space-y-1">
                              <div className="flex justify-between items-center text-[9px] font-mono">
                                <span className="text-gray-500">BRANCH OUT:</span>
                                <span className="text-indigo-400 font-bold">{c.branchOutValue}W</span>
                              </div>
                              <input
                                type="range"
                                min="2"
                                max="99"
                                value={c.branchOutValue || 10}
                                onChange={(e) => updateBranchValue(c.id, parseInt(e.target.value))}
                                className="w-full accent-indigo-500 h-1 bg-[#1b1e26] cursor-pointer"
                              />
                            </div>
                          )}

                          {c.type === 'switch' && (
                            <button
                              onClick={() => toggleSwitch(c.id)}
                              className={`w-full flex items-center justify-center gap-1.5 py-1 text-[10px] font-bold uppercase font-mono tracking-wider cursor-pointer border ${
                                c.switchActive
                                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                                  : 'bg-gray-800/20 border-gray-700/50 text-gray-500'
                              }`}
                            >
                              {c.switchActive ? (
                                <>
                                  <ToggleRight size={14} />
                                  {lang === 'ru' ? 'ВКЛЮЧЕН' : 'SWITCH ON'}
                                </>
                              ) : (
                                <>
                                  <ToggleLeft size={14} />
                                  {lang === 'ru' ? 'ВЫКЛЮЧЕН' : 'SWITCH OFF'}
                                </>
                              )}
                            </button>
                          )}

                          {c.type === 'large_battery' && (
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                                <span>BATTERY CHARGE</span>
                                <span className="text-teal-400 font-bold">{c.batteryCharge}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-900 w-full rounded-none overflow-hidden border border-gray-800">
                                <div 
                                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                                  style={{ width: `${c.batteryCharge || 0}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Simple active/inactive sensor visualizer */}
                          {c.type === 'auto_turret' && (
                            <div className={`p-1 text-center font-mono text-[9px] border ${
                              isPoweredOn 
                                ? 'bg-red-500/15 border-red-500/50 text-red-400 animate-pulse font-black' 
                                : 'bg-[#0c0d10] border-[#2a2f3b] text-gray-600'
                            }`}>
                              {isPoweredOn ? '⚠️ DEFENSE ONLINE (GUNS ARMED)' : '🔴 OFFLINE (NEED >= 10W)'}
                            </div>
                          )}

                          {c.type === 'sam_site' && (
                            <div className={`p-1 text-center font-mono text-[9px] border ${
                              isPoweredOn 
                                ? 'bg-orange-500/15 border-orange-500/50 text-orange-400 animate-pulse font-black' 
                                : 'bg-[#0c0d10] border-[#2a2f3b] text-gray-600'
                            }`}>
                              {isPoweredOn ? '🚀 SAM ONLINE (RADAR SPINNING)' : '🔴 OFFLINE (NEED >= 25W)'}
                            </div>
                          )}

                          {c.type === 'ceiling_light' && (
                            <div className={`p-1 text-center font-mono text-[9px] border ${
                              isPoweredOn 
                                ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-300 font-black' 
                                : 'bg-[#0c0d10] border-[#2a2f3b] text-gray-600'
                            }`}>
                              {isPoweredOn ? '💡 BASE ILLUMINATED (2W)' : '🔴 OFFLINE (NEED >= 2W)'}
                            </div>
                          )}

                          {/* Power levels diagnostics display */}
                          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono bg-black/40 p-1.5 border border-[#2a2f3b]/50">
                            <div>
                              <span className="text-gray-500 block uppercase">Power In</span>
                              <span className="text-white font-bold">{c.powerIn}W</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block uppercase">Power Out</span>
                              <span className="text-emerald-400 font-bold">{c.powerOut}W</span>
                            </div>
                          </div>
                        </div>

                        {/* Connection interface sockets block */}
                        <div className="mt-4 pt-3 border-t border-[#2a2f3b]/70 grid grid-cols-2 gap-2 z-10 text-[9px] font-mono">
                          {/* Sockets Inputs */}
                          <div className="space-y-1 border-r border-gray-800/40 pr-1">
                            <span className="text-[8px] text-gray-500 font-bold uppercase block">Inputs</span>
                            {compMeta.inputs.length === 0 ? (
                              <span className="text-gray-700 italic block text-[8px]">None</span>
                            ) : (
                              compMeta.inputs.map(port => {
                                const isTargeted = selectedSource !== null;
                                return (
                                  <button
                                    key={port}
                                    onClick={() => handlePortClick(c.id, port, 'input')}
                                    className={`w-full p-1 border text-left cursor-pointer transition-colors block text-[8.5px] truncate ${
                                      isTargeted 
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse font-black' 
                                        : 'bg-[#0c0d10] border-gray-800 text-gray-400 hover:border-gray-500'
                                    }`}
                                  >
                                    🔌 {port.toUpperCase()}
                                  </button>
                                );
                              })
                            )}
                          </div>

                          {/* Sockets Outputs */}
                          <div className="space-y-1 pl-1">
                            <span className="text-[8px] text-gray-500 font-bold uppercase block">Outputs</span>
                            {compMeta.outputs.length === 0 ? (
                              <span className="text-gray-700 italic block text-[8px]">None</span>
                            ) : (
                              compMeta.outputs.map(port => {
                                const target = c.targetOutputs[port];
                                const isSelected = selectedSource?.id === c.id && selectedSource.port === port;
                                return (
                                  <div key={port} className="space-y-1">
                                    <button
                                      onClick={() => handlePortClick(c.id, port, 'output')}
                                      className={`w-full p-1 border text-left cursor-pointer transition-colors block text-[8.5px] truncate ${
                                        isSelected 
                                          ? 'bg-amber-500 border-amber-400 text-black font-black' 
                                          : target 
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold' 
                                            : 'bg-[#0c0d10] border-gray-800 text-gray-400 hover:border-gray-500'
                                      }`}
                                    >
                                      ⚡ {port.toUpperCase()}
                                    </button>
                                    
                                    {target && (
                                      <div className="flex items-center justify-between bg-black/60 px-1 py-0.5 border border-gray-800/80 rounded-none text-[7.5px] text-gray-500">
                                        <span className="truncate flex items-center gap-0.5">
                                          ➔ <strong className="text-emerald-500">{target.targetId.split('_')[0]}</strong>
                                        </span>
                                        <button
                                          onClick={() => clearConnection(c.id, port)}
                                          className="text-gray-500 hover:text-rose-400 ml-1 font-bold font-mono transition-colors"
                                          title={lang === 'ru' ? 'Отсоединить кабель' : 'Disconnect'}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
