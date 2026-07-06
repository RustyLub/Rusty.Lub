import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Sprout, 
  Dna, 
  Sparkles, 
  Plus, 
  Trash2, 
  Settings, 
  HelpCircle, 
  Check, 
  RotateCcw, 
  BookOpen, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  Info,
  Camera,
  Video,
  Sliders,
  Volume2,
  VolumeX,
  Upload,
  Play,
  Square,
  Save,
  Eye,
  PlusCircle,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Definitions for genes
type GeneType = 'G' | 'Y' | 'H' | 'W' | 'X' | '-';

const GENE_INFO = {
  G: { label: 'Growth', labelRU: 'Рост', desc: 'Speeds up growth rate', descRU: 'Увеличивает скорость роста', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  Y: { label: 'Yield', labelRU: 'Урожай', desc: 'Increases harvest yield', descRU: 'Увеличивает объем урожая', color: 'bg-green-500/20 text-green-400 border-green-500/40' },
  H: { label: 'Hardiness', labelRU: 'Выносливость', desc: 'Tolerance to temperature/water', descRU: 'Увеличивает устойчивость к условиям', color: 'bg-teal-500/20 text-teal-400 border-teal-500/40' },
  W: { label: 'Water', labelRU: 'Жажда', desc: 'Increases water consumption (BAD)', descRU: 'Повышает потребление воды (ПЛОХО)', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
  X: { label: 'Empty', labelRU: 'Пусто', desc: 'Blank slot with no effect (BAD)', descRU: 'Пустой неактивный ген (ПЛОХО)', color: 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30' },
  '-': { label: 'Empty Slot', labelRU: 'Пусто', desc: 'No plant planted in this slot', descRU: 'Ген отсутствует', color: 'bg-black/40 text-zinc-600 border-zinc-800' }
};

interface SolverRecipe {
  neighbors: string[];
  deterministicCount: number; // number of slots that are deterministic (0 to 6)
  requiredCenter: string; // 6-letter required center seed genome (e.g. "??G??Y" where ? means any gene)
}

export default function RustBreeder({ lang }: { lang: 'ru' | 'en' }) {
  const [activeSubTab, setActiveSubTab] = useState<'sandbox' | 'solver' | 'scanner'>('sandbox');

  // --- SCANNER STATE ---
  const [scannerX, setScannerX] = useState<number>(43); // % of canvas width (default matches standard 16:9 Rust clone info position)
  const [scannerY, setScannerY] = useState<number>(75); // % of canvas height
  const [scannerW, setScannerW] = useState<number>(20); // % of canvas width
  const [scannerH, setScannerH] = useState<number>(4.8);  // % of canvas height
  const [scannerSpacing, setScannerSpacing] = useState<number>(3.3); // spacing %
  const [scannedGenome, setScannedGenome] = useState<string>('GGGYWW');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [captureMode, setCaptureMode] = useState<'screen' | 'camera'>('screen');
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<boolean>(true); // Start in demo mode so they immediately see it work!
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showScannerSettings, setShowScannerSettings] = useState<boolean>(false);
  const [detectedColors, setDetectedColors] = useState<string[]>(['green', 'green', 'green', 'green', 'red', 'red']);
  const [stabilityCounter, setStabilityCounter] = useState<number>(0);
  const [scannerMessage, setScannerMessage] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScannedRef = useRef<string>('');
  const lastScanTimeRef = useRef<number>(0);
  const lastSavedGenomeRef = useRef<string>('');

  // --- SANDBOX STATE ---
  // A planter box has 9 slots. Let's represent them as a 3x3 grid (indices 0 to 8).
  // Slot 4 (row 1, col 1) is the CENTER plant.
  // The others are neighboring plants.
  const [planterGenomes, setPlanterGenomes] = useState<(string | null)[]>([
    null, null, null,
    null, 'GGGGGG', null, // Default center to 6G
    null, null, null
  ]);
  const [editingSlot, setEditingSlot] = useState<number | null>(4);

  // --- SOLVER STATE ---
  const [availableClones, setAvailableClones] = useState<string[]>([
    'GGYYYY',
    'GYYYHH',
    'YYGGWW',
    'YGGHWW',
    'GGGHXX'
  ]);
  const [newCloneInput, setNewCloneInput] = useState('');
  const [targetGenome, setTargetGenome] = useState('GGGGYY');
  const [maxNeighbors, setMaxNeighbors] = useState<number>(4);

  // Presets for target genomes
  const PRESET_TARGETS = [
    { genome: 'GGGGYY', labelRU: 'Макс. Рост (4G-2Y)', labelEN: 'Max Growth (4G-2Y)' },
    { genome: 'YYYYGG', labelRU: 'Макс. Урожай (4Y-2G)', labelEN: 'Max Yield (4Y-2G)' },
    { genome: 'GGYYYY', labelRU: 'Сбалансировано (2G-4Y)', labelEN: 'Balanced (2G-4Y)' },
    { genome: 'GGGYWW', labelRU: 'Рост + Урожай (3G-1Y)', labelEN: 'Growth + Yield (3G-1Y)' }
  ];

  // Helper to validate genome format
  const isValidGenome = (genome: string) => {
    return /^[GYHWXgyhwx]{6}$/.test(genome);
  };

  const handleAddClone = () => {
    const cleaned = newCloneInput.toUpperCase().trim();
    if (!isValidGenome(cleaned)) {
      return;
    }
    if (availableClones.includes(cleaned)) {
      setNewCloneInput('');
      return;
    }
    setAvailableClones([...availableClones, cleaned]);
    setNewCloneInput('');
  };

  const handleDeleteClone = (index: number) => {
    setAvailableClones(availableClones.filter((_, i) => i !== index));
  };

  const handleResetClones = () => {
    setAvailableClones(['GGYYYY', 'GYYYHH', 'YYGGWW', 'YGGHWW', 'GGGHXX']);
  };

  // --- SCANNER UTILITIES & CORE ENGINE ---
  const playBeep = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch notification beep
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn('Audio feedback failed or was blocked by browser autoplay policy:', e);
    }
  };

  const startStreaming = async () => {
    setUploadedImage(null);
    setDemoMode(false);
    setScannerMessage('');
    setCaptureError(null);
    try {
      let stream: MediaStream;
      if (captureMode === 'camera') {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment'
          }
        });
      } else {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: 'window'
          }
        });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn("Video play interrupted", e));
      }
      setIsStreaming(true);
      setScannerMessage(
        captureMode === 'camera'
          ? (lang === 'ru' ? 'Камера запущена. Направьте на экран игры!' : 'Camera stream active. Point it at your game screen!')
          : (lang === 'ru' ? 'Захват экрана запущен. Выберите окно Rust!' : 'Screen capture active. Select your Rust game window!')
      );
      setTimeout(() => setScannerMessage(''), 4000);
    } catch (err: any) {
      console.error('Failed to get media stream', err);
      setDemoMode(true);
      
      const isIframe = window.self !== window.top;
      const technicalMsg = err?.message || err?.name || String(err);
      let errorMsg = '';
      
      if (isIframe) {
        errorMsg = lang === 'ru'
          ? `Браузер блокирует захват медиа внутри встроенного фрейма (${technicalMsg}). Пожалуйста, откройте приложение в отдельной вкладке по кнопке ниже!`
          : `Web browsers block media capture inside embedded preview frames (${technicalMsg}). Please open the app in a standalone browser tab using the button below to grant permissions!`;
      } else {
        if (captureMode === 'screen') {
          errorMsg = lang === 'ru'
            ? `Не удалось запустить захват экрана (${technicalMsg}). Убедитесь, что вы предоставили разрешения в всплывающем окне.`
            : `Screen capture failed (${technicalMsg}). Ensure you granted permissions in your web browser popup.`;
        } else {
          errorMsg = lang === 'ru'
            ? `Не удалось получить доступ к камере (${technicalMsg}). Проверьте настройки разрешений камеры в браузере.`
            : `Could not access the camera (${technicalMsg}). Check your browser or device camera permission settings.`;
        }
      }
      setCaptureError(errorMsg);
      setScannerMessage(lang === 'ru' ? 'Ошибка захвата. Запущен симулятор.' : 'Capture blocked. Loaded simulated Rust window.');
      setTimeout(() => setScannerMessage(''), 5000);
    }
  };

  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setDemoMode(true); // Return to interactive simulator
    setCaptureError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        stopStreaming();
        setDemoMode(false);
        setUploadedImage(event.target.result as string);
        setScannerMessage(lang === 'ru' ? 'Изображение загружено. Отрегулируйте рамку!' : 'Screenshot loaded. Move the bounding box over the genes!');
        setTimeout(() => setScannerMessage(''), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleManualToggleScannedGene = (slotIndex: number) => {
    const nextGeneMap: Record<string, string> = {
      'G': 'Y', 'Y': 'H', 'H': 'W', 'W': 'X', 'X': '-', '-': 'G'
    };
    const arr = scannedGenome.split('');
    const current = arr[slotIndex] || '-';
    arr[slotIndex] = nextGeneMap[current] || 'G';
    const updated = arr.join('');
    setScannedGenome(updated);
  };

  const handleSaveScannedClone = (genomeToSave: string) => {
    if (!isValidGenome(genomeToSave)) return;
    if (availableClones.includes(genomeToSave)) {
      setScannerMessage(lang === 'ru' ? `Клон ${genomeToSave} уже есть в базе` : `Clone ${genomeToSave} is already in database`);
      return;
    }
    setAvailableClones(prev => [...prev, genomeToSave]);
    setScannerMessage(lang === 'ru' ? `✅ Клон ${genomeToSave} сохранен в базу!` : `✅ Saved clone ${genomeToSave} to database!`);
    playBeep();
    setTimeout(() => setScannerMessage(''), 3000);
  };

  // Canvas Drawing & Color Recognition Loop
  useEffect(() => {
    if (activeSubTab !== 'scanner') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 450;

    let localAnimId: number;
    let img: HTMLImageElement | null = null;

    if (uploadedImage) {
      img = new Image();
      img.src = uploadedImage;
    }

    const scanFrame = () => {
      // 1. Draw source background
      if (isStreaming && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else if (uploadedImage && img && img.complete) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (demoMode) {
        // Render stylized Rust plant panel
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines to make it feel like a real screen
        ctx.strokeStyle = '#10141f';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Rust style info box
        ctx.fillStyle = '#141822';
        ctx.strokeStyle = '#272e3d';
        ctx.lineWidth = 2;
        ctx.fillRect(160, 60, 480, 260);
        ctx.strokeRect(160, 60, 480, 260);

        // Header
        ctx.fillStyle = '#cd412b';
        ctx.fillRect(160, 60, 480, 4);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(lang === 'ru' ? 'КЛОН: ДИКОЕ ВОЛОКНО (Hemp Clone)' : 'HEMP CLONE INFORMATION CARD', 180, 95);

        ctx.fillStyle = '#7c859c';
        ctx.font = '10px monospace';
        ctx.fillText('GENETICS SUMMARY & STRENGTHS:', 180, 120);

        // Draw progress bar mimicking UI
        ctx.fillStyle = '#222838';
        ctx.fillRect(180, 135, 200, 8);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(180, 135, 140, 8);
        ctx.fillStyle = '#7c859c';
        ctx.font = '9px monospace';
        ctx.fillText('GROWTH SPEED (85%)', 390, 142);

        // Drawing mock 6 genes at exact target locations matching standard Rust
        // scannerX = 43, scannerY = 75, scannerW = 20, scannerSpacing = 3.3
        const mockGenes = ['G', 'Y', 'G', 'Y', 'H', 'W'];
        for (let i = 0; i < 6; i++) {
          const slotX = Math.round((43 + i * 3.3) / 100 * canvas.width);
          const slotY = Math.round((75 + 4.8 / 2) / 100 * canvas.height);

          const isPositive = ['G', 'Y', 'H'].includes(mockGenes[i]);
          ctx.fillStyle = isPositive ? '#164d2d' : '#7f1d1d';
          ctx.strokeStyle = isPositive ? '#4ade80' : '#f87171';
          ctx.lineWidth = 1.5;
          ctx.fillRect(slotX - 10, slotY - 12, 20, 24);
          ctx.strokeRect(slotX - 10, slotY - 12, 20, 24);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(mockGenes[i], slotX, slotY);
        }
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';

        ctx.fillStyle = '#cd412b';
        ctx.font = 'bold 8.5px monospace';
        ctx.fillText(lang === 'ru' ? '▲ ИНТЕРАКТИВНЫЙ РЕЖИМ СИМУЛЯЦИИ RUST' : '▲ INTERACTIVE RUST SIMULATOR PANEL', 180, 280);
        ctx.fillStyle = '#525c74';
        ctx.fillText(lang === 'ru' ? 'Перемещайте ползунки ниже, чтобы идеально навести точки на гены.' : 'Move calibration sliders below to align circles on the green/red slots.', 180, 295);
      } else {
        ctx.fillStyle = '#06070a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4b5563';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(lang === 'ru' ? 'Нет изображения. Загрузите скриншот или начните захват экрана!' : 'No input active. Upload a screenshot or click Start Capture!', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'start';
      }

      // 2. Overlay Target Bounding Box
      const boxX = (scannerX / 100) * canvas.width;
      const boxY = (scannerY / 100) * canvas.height;
      const boxW = (scannerW / 100) * canvas.width;
      const boxH = (scannerH / 100) * canvas.height;

      ctx.strokeStyle = 'rgba(205, 65, 43, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);

      // Bounding box corners
      ctx.fillStyle = '#cd412b';
      // top-left
      ctx.fillRect(boxX - 2, boxY - 2, 8, 2);
      ctx.fillRect(boxX - 2, boxY - 2, 2, 8);
      // top-right
      ctx.fillRect(boxX + boxW - 6, boxY - 2, 8, 2);
      ctx.fillRect(boxX + boxW, boxY - 2, 2, 8);
      // bottom-left
      ctx.fillRect(boxX - 2, boxY + boxH, 8, 2);
      ctx.fillRect(boxX - 2, boxY + boxH - 6, 2, 8);
      // bottom-right
      ctx.fillRect(boxX + boxW - 6, boxY + boxH, 8, 2);
      ctx.fillRect(boxX + boxW, boxY + boxH - 6, 2, 8);

      const sampledGenes: string[] = [];
      const colorsList: string[] = [];

      // 3. Sample pixels at circles
      for (let i = 0; i < 6; i++) {
        const sampleX = Math.round((scannerX + i * scannerSpacing) / 100 * canvas.width);
        const sampleY = Math.round((scannerY + scannerH / 2) / 100 * canvas.height);

        let r = 0, g = 0, b = 0;
        try {
          const imgData = ctx.getImageData(sampleX, sampleY, 1, 1).data;
          r = imgData[0];
          g = imgData[1];
          b = imgData[2];
        } catch (e) {
          // offscreen safety
        }

        let cat = 'grey';
        let geneLetter = '-';

        // Green thresholds
        if (g > r + 15 && g > b + 15) {
          cat = 'green';
          // Fallback guess: standard hemp mock G-G-G-Y-H-W, let's map based on mock layout or assign 'G'
          geneLetter = (demoMode && i === 3) ? 'Y' : (demoMode && i === 4) ? 'H' : 'G';
        } 
        // Red thresholds
        else if (r > g + 25 && r > b + 25) {
          cat = 'red';
          geneLetter = 'W';
        } 
        // Grey empty / empty black
        else if (r < 75 && g < 75 && b < 75) {
          cat = 'grey';
          geneLetter = 'X';
        }

        colorsList.push(cat);
        sampledGenes.push(geneLetter);

        // Draw indicator circles on canvas
        ctx.beginPath();
        ctx.arc(sampleX, sampleY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = cat === 'green' ? '#4ade80' : cat === 'red' ? '#f87171' : '#64748b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px Courier, monospace';
        ctx.fillText(`${i + 1}`, sampleX - 2.5, sampleY - 9);
      }

      // Update state with newly analyzed values
      const currentDetected = sampledGenes.join('');
      setScannedGenome(currentDetected);
      setDetectedColors(colorsList);

      // Auto-save stability engine
      const timestamp = Date.now();
      if (currentDetected !== '------' && currentDetected !== 'XXXXXX') {
        if (currentDetected !== lastScannedRef.current) {
          lastScannedRef.current = currentDetected;
          lastScanTimeRef.current = timestamp;
          setStabilityCounter(0);
        } else {
          const duration = timestamp - lastScanTimeRef.current;
          const percentage = Math.min(100, Math.round((duration / 1200) * 100));
          setStabilityCounter(percentage);

          if (duration > 1200 && lastSavedGenomeRef.current !== currentDetected) {
            lastSavedGenomeRef.current = currentDetected;
            
            if (autoSave) {
              setAvailableClones(prev => {
                if (!prev.includes(currentDetected)) {
                  playBeep();
                  setScannerMessage(lang === 'ru' ? `✅ Автосохранение: клон ${currentDetected} добавлен в базу!` : `✅ Auto-saved clone ${currentDetected} to database!`);
                  setTimeout(() => setScannerMessage(''), 3500);
                  return [...prev, currentDetected];
                }
                return prev;
              });
            } else {
              playBeep();
            }
          }
        }
      }

      localAnimId = requestAnimationFrame(scanFrame);
    };

    localAnimId = requestAnimationFrame(scanFrame);

    return () => {
      cancelAnimationFrame(localAnimId);
    };
  }, [activeSubTab, scannerX, scannerY, scannerW, scannerH, scannerSpacing, isStreaming, uploadedImage, demoMode, autoSave, isMuted, lang]);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- CROSSBREEDING CALCULATION LOGIC ---
  const crossbreedMath = useMemo(() => {
    const centerGenome = planterGenomes[4] || '------';
    
    // Gather all valid active neighbor genomes (all slots except index 4)
    const neighbors: string[] = [];
    planterGenomes.forEach((g, idx) => {
      if (idx !== 4 && g && isValidGenome(g)) {
        neighbors.push(g);
      }
    });

    const resultGenome: string[] = [];
    const slotDetails: {
      slotIndex: number;
      weights: Record<string, number>;
      winner: string;
      winnerWeight: number;
      otherWeightsSum: number;
      mutated: boolean;
      finalGene: string;
    }[] = [];

    const geneTypes = ['G', 'Y', 'H', 'W', 'X'];
    const geneWeights: Record<string, number> = { G: 0.6, Y: 0.6, H: 0.6, W: 1.0, X: 1.0 };

    for (let slot = 0; slot < 6; slot++) {
      const weights: Record<string, number> = { G: 0, Y: 0, H: 0, W: 0, X: 0 };
      
      // Calculate neighbor sums
      neighbors.forEach(n => {
        const gene = n[slot].toUpperCase();
        if (weights[gene] !== undefined) {
          weights[gene] += geneWeights[gene];
        }
      });

      // Analyze winner
      let maxGene = '-';
      let maxWeight = 0;
      let totalWeightSum = 0;

      geneTypes.forEach(g => {
        totalWeightSum += weights[g];
        if (weights[g] > maxWeight) {
          maxWeight = weights[g];
          maxGene = g;
        }
      });

      const otherWeightsSum = totalWeightSum - maxWeight;
      const isMutated = maxWeight > otherWeightsSum && maxWeight > 0;
      const centerGene = centerGenome[slot] || '-';
      const finalGene = isMutated ? maxGene : centerGene;

      resultGenome.push(finalGene);

      slotDetails.push({
        slotIndex: slot + 1,
        weights,
        winner: maxGene,
        winnerWeight: maxWeight,
        otherWeightsSum,
        mutated: isMutated,
        finalGene
      });
    }

    return {
      outputGenome: resultGenome.join(''),
      slotDetails,
      hasNeighbors: neighbors.length > 0
    };
  }, [planterGenomes]);

  // --- SOLVER RECIPE COMPUTATION ---
  const recipes = useMemo(() => {
    if (!isValidGenome(targetGenome) || availableClones.length === 0) {
      return [];
    }

    const tUpper = targetGenome.toUpperCase();
    const solutions: SolverRecipe[] = [];

    // Combinations generator helper with replacements
    const generateCombinations = (pool: string[], size: number): string[][] => {
      const results: string[][] = [];
      const temp: string[] = [];
      
      const helper = (start: number) => {
        if (temp.length === size) {
          results.push([...temp]);
          return;
        }
        for (let i = start; i < pool.length; i++) {
          temp.push(pool[i]);
          helper(i); // Allow repetitions
          temp.pop();
        }
      };
      
      helper(0);
      return results;
    };

    const geneWeights: Record<string, number> = { G: 0.6, Y: 0.6, H: 0.6, W: 1.0, X: 1.0 };
    const geneTypes = ['G', 'Y', 'H', 'W', 'X'];

    // Try all combination sizes up to selected maxNeighbors (usually 2 to 4)
    for (let size = 2; size <= maxNeighbors; size++) {
      const combos = generateCombinations(availableClones, size);

      for (const combo of combos) {
        let possible = true;
        let deterministicCount = 0;
        const requiredCenterArr: string[] = [];

        // For each of the 6 slots, evaluate crossbreed outcome
        for (let slot = 0; slot < 6; slot++) {
          const weights: Record<string, number> = { G: 0, Y: 0, H: 0, W: 0, X: 0 };
          combo.forEach(c => {
            const gene = c[slot];
            weights[gene] += geneWeights[gene];
          });

          // Find winner
          let maxGene = '';
          let maxWeight = 0;
          let totalWeightSum = 0;

          geneTypes.forEach(g => {
            totalWeightSum += weights[g];
            if (weights[g] > maxWeight) {
              maxWeight = weights[g];
              maxGene = g;
            }
          });

          const otherWeightsSum = totalWeightSum - maxWeight;
          const isMutated = maxWeight > otherWeightsSum && maxWeight > 0;
          const targetGene = tUpper[slot];

          if (isMutated) {
            // If it mutates, it MUST mutate to our target gene
            if (maxGene !== targetGene) {
              possible = false;
              break;
            }
            deterministicCount++;
            requiredCenterArr.push('?'); // Any seed is ok here
          } else {
            // If it doesn't mutate, the center plant MUST have the target gene in this slot
            requiredCenterArr.push(targetGene);
          }
        }

        if (possible) {
          solutions.push({
            neighbors: combo,
            deterministicCount,
            requiredCenter: requiredCenterArr.join('')
          });
        }
      }
    }

    // Sort solutions: 
    // 1. Higher deterministic count (closer to "any center seed" is preferred)
    // 2. Fewer neighbors needed (saves clone space)
    return solutions.sort((a, b) => {
      if (b.deterministicCount !== a.deterministicCount) {
        return b.deterministicCount - a.deterministicCount;
      }
      return a.neighbors.length - b.neighbors.length;
    });
  }, [availableClones, targetGenome, maxNeighbors]);

  // Handle slot gene click for editor
  const handleSlotGeneEdit = (geneIndex: number, gene: string) => {
    if (editingSlot === null) return;
    const currentGenome = planterGenomes[editingSlot] || 'GGGGGG';
    const arr = currentGenome.split('');
    arr[geneIndex] = gene;
    const updated = arr.join('');

    const newGenomes = [...planterGenomes];
    newGenomes[editingSlot] = updated;
    setPlanterGenomes(newGenomes);
  };

  const handleClearPlanter = () => {
    setPlanterGenomes([
      null, null, null,
      null, 'GGGGGG', null,
      null, null, null
    ]);
    setEditingSlot(4);
  };

  const renderGeneLabel = (gene: string) => {
    const detail = GENE_INFO[gene as GeneType] || GENE_INFO['-'];
    return (
      <span className={`px-1.5 py-0.5 border text-[10px] font-black font-mono uppercase tracking-wider ${detail.color}`}>
        {gene}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl relative overflow-hidden">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-[#cd412b]/10 border border-[#cd412b]/30">
            <Sprout size={20} className="text-[#cd412b]" />
          </span>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              {lang === 'ru' ? 'СЕЛЕКЦИЯ РАСТЕНИЙ (GENETICS BREEDER)' : 'PLANT BREEDER & GENETICS SIMULATOR'}
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">
              {lang === 'ru' 
                ? 'Мощный симулятор скрещивания генов конопли, ягод и картофеля с калькулятором оптимальных рецептов' 
                : 'Advanced crossbreeding simulator & recipe solver for hemp, berries, and potatoes'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 border border-zinc-800 p-0.5 bg-black/40">
          <button
            onClick={() => setActiveSubTab('sandbox')}
            className={`px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
              activeSubTab === 'sandbox'
                ? 'bg-[#cd412b] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang === 'ru' ? 'Песочница' : 'Sandbox'}
          </button>
          <button
            onClick={() => setActiveSubTab('solver')}
            className={`px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
              activeSubTab === 'solver'
                ? 'bg-[#cd412b] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang === 'ru' ? 'Поиск рецептов' : 'Recipe Solver'}
          </button>
          <button
            onClick={() => setActiveSubTab('scanner')}
            className={`px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'scanner'
                ? 'bg-[#cd412b] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera size={12} className={activeSubTab === 'scanner' ? 'text-white' : 'text-[#cd412b]'} />
            <span>{lang === 'ru' ? 'Сканер [NEW!]' : 'Scanner [NEW!]'}</span>
          </button>
        </div>
      </div>

      {/* Main tab content */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'sandbox' ? (
          <motion.div
            key="sandbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Box: 3x3 planter and editor */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] relative overflow-hidden space-y-5">
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Settings size={14} className="text-[#cd412b]" />
                    <span>{lang === 'ru' ? 'ПЛАНТАТОР 3x3' : '3X3 PLANTER BOX GRID'}</span>
                  </h3>
                  <button
                    onClick={handleClearPlanter}
                    className="flex items-center gap-1 px-2 py-1 border border-zinc-800 hover:border-zinc-500 bg-black/20 hover:bg-black/40 text-zinc-400 hover:text-white text-[9px] font-bold uppercase tracking-wider font-mono cursor-pointer transition-all"
                  >
                    <RotateCcw size={10} />
                    <span>{lang === 'ru' ? 'Очистить' : 'Clear Planter'}</span>
                  </button>
                </div>

                {/* Planter Grid */}
                <div className="grid grid-cols-3 gap-3.5 max-w-md mx-auto aspect-square bg-[#0b0c0f] p-4 border border-zinc-800/80 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(#1b1e26_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                  
                  {planterGenomes.map((genome, idx) => {
                    const isCenter = idx === 4;
                    const isEditing = editingSlot === idx;
                    const hasPlant = genome !== null;

                    return (
                      <button
                        key={idx}
                        onClick={() => setEditingSlot(idx)}
                        className={`relative border p-2 flex flex-col justify-between items-center transition-all group aspect-square select-none cursor-pointer ${
                          isCenter
                            ? 'bg-[#cd412b]/5 border-[#cd412b]/40 hover:border-[#cd412b] shadow-[0_0_15px_rgba(205,65,43,0.05)]'
                            : hasPlant
                              ? 'bg-zinc-900/60 border-zinc-700/80 hover:border-zinc-500'
                              : 'bg-black/40 border-zinc-900 hover:border-zinc-700'
                        } ${isEditing ? 'ring-2 ring-[#cd412b]' : ''}`}
                      >
                        {/* Corner markers */}
                        <span className="absolute top-1 left-1.5 text-[8px] font-bold font-mono text-zinc-600">
                          {isCenter ? 'CENTER' : `SLOT ${idx < 4 ? idx + 1 : idx}`}
                        </span>

                        {isCenter && (
                          <span className="absolute -top-1.5 -right-1.5 bg-[#cd412b] text-white text-[7px] font-black font-mono px-1 border border-[#cd412b]">
                            {lang === 'ru' ? 'ЦЕНТР' : 'TARGET'}
                          </span>
                        )}

                        <div className="flex-1 flex flex-col justify-center items-center mt-3">
                          {hasPlant ? (
                            <div className="space-y-1.5 text-center">
                              {/* Icon plant */}
                              <Sprout size={16} className={isCenter ? 'text-[#cd412b]' : 'text-emerald-500'} />
                              
                              {/* Genome output */}
                              <div className="flex justify-center gap-0.5">
                                {genome.split('').map((g, gi) => (
                                  <span 
                                    key={gi} 
                                    className={`w-2 h-3.5 text-[8px] font-bold font-mono flex items-center justify-center border ${
                                      ['G', 'Y', 'H'].includes(g) 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                                    }`}
                                  >
                                    {g}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-700 uppercase font-black">
                              {lang === 'ru' ? 'Пусто' : 'Empty'}
                            </span>
                          )}
                        </div>

                        {/* Hover Quick Set Buttons for Empty slots */}
                        {!hasPlant && (
                          <span className="text-[7.5px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-black">
                            {lang === 'ru' ? '+ Посадить' : '+ Plant Seed'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Slot editor panel */}
                {editingSlot !== null && (
                  <div className="bg-[#1b1e26] p-4 border border-[#2a2f3b] space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <h4 className="text-[10px] font-black font-mono text-zinc-400 uppercase tracking-widest">
                        {editingSlot === 4 
                          ? (lang === 'ru' ? 'РЕКТИРОВАНИЕ ГЕНОМА ЦЕНТРА' : 'EDITING CENTER SEED GENOME')
                          : (lang === 'ru' ? `РЕДАКТИРОВАНИЕ СЛОТА ${editingSlot < 4 ? editingSlot + 1 : editingSlot}` : `EDITING PLANTER SLOT ${editingSlot < 4 ? editingSlot + 1 : editingSlot}`)}
                      </h4>

                      {editingSlot !== 4 && planterGenomes[editingSlot] !== null && (
                        <button
                          onClick={() => {
                            const newGenomes = [...planterGenomes];
                            newGenomes[editingSlot!] = null;
                            setPlanterGenomes(newGenomes);
                          }}
                          className="text-[9px] font-mono font-bold uppercase text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={10} />
                          <span>{lang === 'ru' ? 'Выкопать' : 'Dig up'}</span>
                        </button>
                      )}
                    </div>

                    {/* Quick initializer */}
                    {planterGenomes[editingSlot] === null ? (
                      <div className="text-center py-4 space-y-3">
                        <p className="text-[10px] text-zinc-500 font-mono uppercase">
                          {lang === 'ru' ? 'В этом слоте пусто. Посадите семечко для начала селекции' : 'This planter slot is currently empty. Plant a clone seed to crossbreed'}
                        </p>
                        <button
                          onClick={() => {
                            const newGenomes = [...planterGenomes];
                            newGenomes[editingSlot!] = 'GGGGGG';
                            setPlanterGenomes(newGenomes);
                          }}
                          className="px-3 py-1.5 bg-[#cd412b] hover:bg-[#b53420] text-white font-mono text-xs font-black uppercase tracking-wider cursor-pointer"
                        >
                          {lang === 'ru' ? 'Посадить Росток (GGGGGG)' : 'Plant Seed (GGGGGG)'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-center gap-2">
                          {(planterGenomes[editingSlot] || '------').split('').map((g, gi) => (
                            <div key={gi} className="flex flex-col items-center gap-1">
                              <span className="text-[8px] font-mono font-bold text-zinc-600">
                                S{gi + 1}
                              </span>
                              
                              <span className={`w-10 h-11 text-sm font-black font-mono flex items-center justify-center border shadow-md relative group select-none ${
                                ['G', 'Y', 'H'].includes(g) 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-emerald-500/5' 
                                  : 'bg-red-500/10 text-red-400 border-red-500/40 shadow-red-500/5'
                              }`}>
                                {g}
                              </span>

                              {/* Input options dropdown-like buttons */}
                              <div className="flex flex-col gap-0.5 mt-1">
                                {['G', 'Y', 'H', 'W', 'X'].map((geneOpt) => (
                                  <button
                                    key={geneOpt}
                                    onClick={() => handleSlotGeneEdit(gi, geneOpt)}
                                    className={`w-6 h-5 text-[9px] font-bold font-mono flex items-center justify-center border transition-all cursor-pointer ${
                                      g === geneOpt
                                        ? 'bg-[#cd412b] border-[#cd412b] text-white'
                                        : 'bg-black/50 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-white'
                                    }`}
                                  >
                                    {geneOpt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Box: Simulation Result and detailed math */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] relative overflow-hidden space-y-5 shadow-xl">
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#cd412b]" />

                <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-[#2a2f3b] pb-2 flex items-center gap-1.5 font-mono">
                  <Dna size={14} className="text-[#cd412b]" />
                  <span>{lang === 'ru' ? 'РЕЗУЛЬТАТ СКРЕЩИВАНИЯ' : 'CROSSBREEDING DIAGNOSTIC'}</span>
                </h3>

                {/* Simulated Output Display */}
                <div className="p-5 bg-zinc-900/90 border border-zinc-800 text-center space-y-3 relative overflow-hidden">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    {lang === 'ru' ? 'Ожидаемый генотип центрального куста:' : 'Predicted Center Bush Genome:'}
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    {crossbreedMath.outputGenome.split('').map((g, idx) => {
                      const isMutated = crossbreedMath.slotDetails[idx]?.mutated;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1.5">
                          <span className={`w-10 h-12 text-lg font-black font-mono flex items-center justify-center border shadow-xl relative ${
                            ['G', 'Y', 'H'].includes(g)
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/5'
                              : g === '-' 
                                ? 'bg-black/60 border-zinc-800 text-zinc-600'
                                : 'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/5'
                          }`}>
                            {g}
                            {isMutated && (
                              <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            )}
                          </span>
                          <span className="text-[7.5px] font-mono font-bold text-zinc-500 uppercase">
                            {isMutated ? (lang === 'ru' ? 'Мутация' : 'Mutated') : (lang === 'ru' ? 'Исходный' : 'Original')}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {!crossbreedMath.hasNeighbors && (
                    <div className="mt-3 text-[9px] font-mono text-zinc-500 bg-black/40 border border-zinc-800/60 py-2.5 px-3 uppercase tracking-wider flex items-center justify-center gap-1.5 leading-normal">
                      <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                      <span>
                        {lang === 'ru' 
                          ? 'Посадите семена в окружающие слоты 1-8 для симуляции скрещивания!' 
                          : 'Plant neighbor seeds around the center to see genetic crossbreeding!'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Step-by-Step Math parameters */}
                {crossbreedMath.hasNeighbors && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block border-b border-zinc-800/60 pb-1 flex items-center gap-1">
                      <Info size={11} className="text-[#cd412b]" />
                      <span>{lang === 'ru' ? 'ВЕСА И РАСЧЕТЫ ПО ГЕНАМ' : 'GENETIC WEIGHT CALCULATIONS'}</span>
                    </div>

                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {crossbreedMath.slotDetails.map((slot) => (
                        <div key={slot.slotIndex} className="p-2.5 bg-black/35 border border-[#2a2f3b] space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                            <span className="text-[#cd412b]">{lang === 'ru' ? `Слот ${slot.slotIndex}:` : `Slot ${slot.slotIndex}:`}</span>
                            {slot.mutated ? (
                              <span className="text-emerald-400 font-bold uppercase">{lang === 'ru' ? 'МУТАЦИЯ УСПЕШНА' : 'MUTATION SUCCESS'}</span>
                            ) : (
                              <span className="text-zinc-500 font-bold uppercase">{lang === 'ru' ? 'БЕЗ ИЗМЕНЕНИЙ (ТИП СЕМЕНИ)' : 'PRESERVES SEED'}</span>
                            )}
                          </div>

                          <div className="grid grid-cols-5 gap-1 font-mono">
                            {['G', 'Y', 'H', 'W', 'X'].map(g => {
                              const weight = slot.weights[g] || 0;
                              const isHighest = slot.winner === g && weight > 0;
                              return (
                                <div 
                                  key={g} 
                                  className={`p-1 border text-center transition-all ${
                                    isHighest 
                                      ? 'bg-zinc-800 border-[#cd412b]/60' 
                                      : 'bg-black/20 border-transparent'
                                  }`}
                                >
                                  <div className={`text-[9px] font-bold ${isHighest ? 'text-white' : 'text-zinc-500'}`}>{g}</div>
                                  <div className={`text-[8px] mt-0.5 font-bold ${isHighest ? 'text-amber-400' : 'text-zinc-600'}`}>
                                    {weight > 0 ? weight.toFixed(1) : '-'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {slot.mutated ? (
                            <div className="text-[8px] font-mono text-zinc-500 leading-normal">
                              {lang === 'ru' 
                                ? `Ген ${slot.winner} побеждает с весом ${slot.winnerWeight.toFixed(1)} против суммы остальных ${slot.otherWeightsSum.toFixed(1)}.` 
                                : `Gene ${slot.winner} dominates with weight ${slot.winnerWeight.toFixed(1)} vs other combined weight ${slot.otherWeightsSum.toFixed(1)}.`}
                            </div>
                          ) : (
                            <div className="text-[8px] font-mono text-zinc-500 leading-normal">
                              {lang === 'ru'
                                ? `Максимальный вес у гена ${slot.winner} равен ${slot.winnerWeight.toFixed(1)}, что не превышает сумму остальных ${slot.otherWeightsSum.toFixed(1)}. Мутация не происходит.`
                                : `Max weight ${slot.winnerWeight.toFixed(1)} of ${slot.winner} is not strictly greater than combined others ${slot.otherWeightsSum.toFixed(1)}. No mutation.`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : activeSubTab === 'solver' ? (
          <motion.div
            key="solver"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Clones database & targets inputs */}
            <div className="lg:col-span-5 space-y-6">
              {/* Target gene input */}
              <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] relative overflow-hidden space-y-4">
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                  <Flame size={14} className="text-[#cd412b]" />
                  <span>{lang === 'ru' ? 'ЖЕЛАЕМЫЙ ГЕНОТИП' : 'TARGET GENOME GOAL'}</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={targetGenome}
                      onChange={(e) => setTargetGenome(e.target.value.toUpperCase().trim())}
                      placeholder="GGGGYY"
                      className="flex-1 bg-[#0c0d10] border border-[#2a2f3b] py-2 px-3 font-mono text-sm text-white outline-none focus:border-[#cd412b]/50 text-center uppercase tracking-widest font-black"
                    />
                  </div>

                  {/* Validate Target label */}
                  {!isValidGenome(targetGenome) && (
                    <p className="text-[9px] text-red-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={10} />
                      {lang === 'ru' ? 'Введите ровно 6 букв (G, Y, H, W, X)' : 'Must be exactly 6 characters (G, Y, H, W, X)'}
                    </p>
                  )}

                  {/* Target presets */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase font-black">
                      {lang === 'ru' ? 'Популярные цели:' : 'Target Presets:'}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PRESET_TARGETS.map(p => (
                        <button
                          key={p.genome}
                          onClick={() => setTargetGenome(p.genome)}
                          className={`p-2 border font-mono text-[9.5px] font-bold text-left transition-all flex justify-between items-center cursor-pointer ${
                            targetGenome === p.genome
                              ? 'bg-[#cd412b]/10 border-[#cd412b] text-white'
                              : 'bg-[#1b1e26] border-[#2a2f3b] hover:border-zinc-700 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span>{lang === 'ru' ? p.labelRU : p.labelEN}</span>
                          <span className="font-mono font-black border border-black/40 px-1 bg-black/20 text-amber-500">{p.genome}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Neighbors slider/select */}
                  <div className="pt-2 border-t border-zinc-800/40 flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-500 text-[10px] uppercase font-black">{lang === 'ru' ? 'Максимум доноров:' : 'Max Neighbor Clones:'}</span>
                    <select
                      value={maxNeighbors}
                      onChange={(e) => setMaxNeighbors(parseInt(e.target.value) || 4)}
                      className="bg-[#0c0d10] border border-[#2a2f3b] p-1 text-white text-xs font-bold font-mono outline-none"
                    >
                      <option value={2}>2 {lang === 'ru' ? 'куста' : 'clones'}</option>
                      <option value={3}>3 {lang === 'ru' ? 'куста' : 'clones'}</option>
                      <option value={4}>4 {lang === 'ru' ? 'куста' : 'clones'}</option>
                      <option value={5}>5 {lang === 'ru' ? 'кустов' : 'clones'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Clones pool */}
              <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] relative overflow-hidden space-y-4">
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Dna size={14} className="text-[#cd412b]" />
                    <span>{lang === 'ru' ? 'БАЗА ВАШИХ КЛОНОВ' : 'YOUR AVAILABLE CLONES'}</span>
                  </h3>
                  <button
                    onClick={handleResetClones}
                    className="text-[9px] font-mono font-bold uppercase text-zinc-500 hover:text-white cursor-pointer"
                  >
                    {lang === 'ru' ? 'Сбросить' : 'Reset'}
                  </button>
                </div>

                {/* Add clone input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={newCloneInput}
                    onChange={(e) => setNewCloneInput(e.target.value.toUpperCase().trim())}
                    placeholder="GYYHWW"
                    className="flex-1 bg-[#0c0d10] border border-[#2a2f3b] py-2 px-3 font-mono text-xs text-white outline-none focus:border-[#cd412b]/50 uppercase tracking-widest text-center"
                  />
                  <button
                    onClick={handleAddClone}
                    disabled={!isValidGenome(newCloneInput)}
                    className="px-3 bg-[#cd412b] disabled:bg-zinc-800 text-white disabled:text-zinc-600 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>{lang === 'ru' ? 'Добавить' : 'Add'}</span>
                  </button>
                </div>

                {/* List of active clones */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {availableClones.length === 0 ? (
                    <div className="text-center py-6 text-[10px] text-zinc-600 uppercase font-black font-mono">
                      {lang === 'ru' ? 'Список клонов пуст' : 'No available clones listed'}
                    </div>
                  ) : (
                    availableClones.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-black/40 border border-[#2a2f3b] text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono text-zinc-600">#{idx + 1}</span>
                          <div className="flex gap-0.5">
                            {c.split('').map((g, gi) => (
                              <span 
                                key={gi} 
                                className={`w-3.5 h-4.5 text-[9px] font-black font-mono flex items-center justify-center border ${
                                  ['G', 'Y', 'H'].includes(g) 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                                    : 'bg-red-500/10 text-red-400 border-red-500/25'
                                }`}
                              >
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteClone(idx)}
                          className="text-zinc-600 hover:text-red-400 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Solver Results list */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] relative overflow-hidden space-y-4 shadow-xl flex flex-col h-full min-h-[500px]">
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#cd412b]" />

                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#cd412b] animate-pulse" />
                    <span>{lang === 'ru' ? `НАЙДЕНО РЕЦЕПТОВ: ${recipes.length}` : `FOUND MATCHING RECIPES: ${recipes.length}`}</span>
                  </h3>
                  <span className="text-[9px] font-mono font-black text-[#cd412b] uppercase bg-[#cd412b]/10 border border-[#cd412b]/30 px-1.5 py-0.5">
                    TARGET: {targetGenome}
                  </span>
                </div>

                {/* Recipes list rendering */}
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[550px] pr-1">
                  {recipes.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-16 text-center space-y-3">
                      <HelpCircle size={32} className="text-zinc-600" />
                      <div className="space-y-1">
                        <p className="text-xs font-mono font-black text-zinc-500 uppercase tracking-widest">
                          {lang === 'ru' ? 'РЕЦЕПТЫ НЕ НАЙДЕНЫ' : 'NO RECIPES SOLVED'}
                        </p>
                        <p className="text-[10px] text-zinc-600 font-mono max-w-sm mx-auto leading-normal uppercase">
                          {lang === 'ru' 
                            ? 'Попробуйте добавить больше разнообразных клонов в базу или снизить требования к цели.' 
                            : 'Try adding more distinct available clone genomes or lower your target requirements.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    recipes.map((r, idx) => {
                      const isGold = r.deterministicCount === 6;
                      return (
                        <div key={idx} className={`p-4 border transition-all ${
                          isGold 
                            ? 'bg-[#cd412b]/5 border-[#cd412b]/40 shadow-md shadow-[#cd412b]/5' 
                            : 'bg-zinc-900/40 border-zinc-800'
                        }`}>
                          {/* Recipe Header */}
                          <div className="flex justify-between items-start gap-2 border-b border-zinc-800/60 pb-2 mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-black font-mono px-1.5 py-0.5 border ${
                                  isGold ? 'bg-[#cd412b] text-white border-[#cd412b]' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                }`}>
                                  {isGold ? (lang === 'ru' ? 'ИДЕАЛЬНЫЙ РЕЦЕПТ 100%' : '100% PERFECT') : (lang === 'ru' ? 'ТРЕБУЕТСЯ ЦЕНТР' : 'SPECIFIC CENTER')}
                                </span>
                                <span className="text-xs font-mono font-bold text-white">
                                  {lang === 'ru' ? `Скрещивание ${r.neighbors.length} кустов` : `Breed using ${r.neighbors.length} bushes`}
                                </span>
                              </div>
                              <p className="text-[8.5px] font-mono text-zinc-500 mt-1 uppercase">
                                {isGold 
                                  ? (lang === 'ru' ? 'В центре можно посадить ЛЮБОЕ дикое семечко' : 'Plant ANY generic wild seed as the central plant')
                                  : (lang === 'ru' ? `Центральный росток должен иметь гены: ${r.requiredCenter}` : `Center seed must provide genes: ${r.requiredCenter}`)}
                              </p>
                            </div>

                            <span className="text-[10px] font-black font-mono text-zinc-500">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Planter Layout Diagram */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Layout Visual Box */}
                            <div className="md:col-span-5 flex justify-center">
                              <div className="grid grid-cols-3 gap-1 bg-[#0c0d10] p-2 border border-zinc-800 max-w-[120px]">
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((sIdx) => {
                                  const isCenter = sIdx === 4;
                                  
                                  // Map neighbor index to planter slots
                                  // Map neighbors list: let's distribute neighbors symmetrically around the center
                                  let label = '';
                                  let bgClass = 'bg-black/40 border-zinc-900';
                                  
                                  if (isCenter) {
                                    label = isGold ? 'ANY' : r.requiredCenter;
                                    bgClass = isGold ? 'bg-[#cd412b]/20 border-[#cd412b]/50 text-glow-red text-[#cd412b]' : 'bg-amber-500/10 border-amber-500/50 text-amber-500';
                                  } else {
                                    // Symmetrically map neighbors list (length from 2 to 5)
                                    // Neighbor index is assigned to orthogonals first
                                    const neighborSlots = [1, 3, 5, 7, 0, 2, 6, 8]; // mapped without 4
                                    const nIdx = neighborSlots.indexOf(sIdx);
                                    if (nIdx !== -1 && nIdx < r.neighbors.length) {
                                      label = `N${nIdx + 1}`;
                                      bgClass = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400';
                                    }
                                  }

                                  return (
                                    <div 
                                      key={sIdx} 
                                      className={`w-8 h-8 border flex items-center justify-center text-[7.5px] font-black font-mono uppercase tracking-tighter ${bgClass}`}
                                      title={label}
                                    >
                                      {isCenter ? (isGold ? '*' : 'CTR') : label || '-'}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Genotypes specification */}
                            <div className="md:col-span-7 space-y-2">
                              <div className="text-[9px] font-mono text-zinc-500 uppercase font-black">
                                {lang === 'ru' ? 'ЧТО КУДА САЖАТЬ:' : 'PLANTING DIRECTORY:'}
                              </div>
                              <div className="space-y-1.5 font-mono text-[10.5px]">
                                {/* Neighbors genomes */}
                                {r.neighbors.map((n, ni) => (
                                  <div key={ni} className="flex items-center gap-2">
                                    <span className="text-emerald-400 text-[9px] font-black">N{ni+1}:</span>
                                    <div className="flex gap-0.5">
                                      {n.split('').map((g, gi) => (
                                        <span 
                                          key={gi} 
                                          className={`w-3 h-4 text-[8px] font-black font-mono flex items-center justify-center border ${
                                            ['G', 'Y', 'H'].includes(g) 
                                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                                          }`}
                                        >
                                          {g}
                                        </span>
                                      ))}
                                    </div>
                                    <span className="text-[8px] text-zinc-500 uppercase">({lang === 'ru' ? 'Донор' : 'Donor'})</span>
                                  </div>
                                ))}

                                {/* Central genome requirement */}
                                <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/60 mt-1">
                                  <span className="text-amber-500 text-[9px] font-black">CTR:</span>
                                  <div className="flex gap-0.5">
                                    {(isGold ? '??????' : r.requiredCenter).split('').map((g, gi) => (
                                      <span 
                                        key={gi} 
                                        className={`w-3 h-4 text-[8px] font-black font-mono flex items-center justify-center border ${
                                          g === '?'
                                            ? 'bg-zinc-800 text-zinc-500 border-zinc-700/50'
                                            : ['G', 'Y', 'H'].includes(g) 
                                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}
                                      >
                                        {g}
                                      </span>
                                    ))}
                                  </div>
                                  <span className="text-[8px] text-zinc-500 uppercase">({lang === 'ru' ? 'Центр' : 'Center'})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Educational sidebar footer */}
                <div className="text-[9px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-3 leading-normal space-y-1">
                  <div className="font-black text-zinc-400 uppercase">{lang === 'ru' ? 'ИНСТРУКЦИЯ ПО ВЫРАЩИВАНИЮ:' : 'HOW TO BREED SEEDS IN GAME:'}</div>
                  <ol className="list-decimal pl-3 space-y-1 uppercase text-zinc-600">
                    <li>{lang === 'ru' ? 'Вырастите доноров (N1, N2...) до стадии КЛОНОВ (или снимите клоны).' : 'Grow your donor plants (N1, N2...) and make clones of them.'}</li>
                    <li>{lang === 'ru' ? 'Посадите доноров по периметру плантатора.' : 'Plant the donor clones along the planter edges as shown.'}</li>
                    <li>{lang === 'ru' ? 'Когда доноры вырастут до стадии Sapling/Crossbreeding, посадите центральное семечко.' : 'Wait for donors to reach Sapling phase, then plant the target center seed.'}</li>
                    <li>{lang === 'ru' ? 'Центральный куст впитает гены соседей и мутирует в идеальный целевой куст!' : 'The center seed crossbreeds and mutates into your perfect custom genome!'}</li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Live camera stream and controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] relative overflow-hidden space-y-5">
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Video size={14} className="text-[#cd412b] animate-pulse" />
                    <span>{lang === 'ru' ? 'ОБЪЕКТИВ СКАНИРОВАНИЯ RUST' : 'RUST SCANNING VIEWFINDER'}</span>
                  </h3>
                  
                  {demoMode && (
                    <span className="text-[8px] font-black font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800 px-2 py-0.5 uppercase tracking-widest animate-pulse">
                      {lang === 'ru' ? 'РЕЖИМ СИМУЛЯТОРА ACTIVE' : 'DEMO MODE ACTIVE'}
                    </span>
                  )}
                  {isStreaming && (
                    <span className="text-[8px] font-black font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 uppercase tracking-widest animate-pulse">
                      {lang === 'ru' ? 'СТРИМ АКТИВЕН (REC)' : 'STREAMING LIVE (REC)'}
                    </span>
                  )}
                </div>

                {/* Capture Mode Selectors & standalone fallback link */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 bg-black/20 p-2.5 border border-zinc-800/60">
                  <div className="flex gap-2 font-mono text-[10.5px]">
                    <button
                      onClick={() => {
                        stopStreaming();
                        setCaptureMode('screen');
                      }}
                      className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                        captureMode === 'screen'
                          ? 'bg-[#cd412b] text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <Video size={12} />
                      <span>{lang === 'ru' ? 'Захват экрана' : 'Screen Share'}</span>
                    </button>
                    <button
                      onClick={() => {
                        stopStreaming();
                        setCaptureMode('camera');
                      }}
                      className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                        captureMode === 'camera'
                          ? 'bg-[#cd412b] text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <Camera size={12} />
                      <span>{lang === 'ru' ? 'Веб-камера / OBS' : 'Camera / OBS'}</span>
                    </button>
                  </div>

                  {/* Standalone New Tab Button */}
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-cyan-400 font-mono text-[10.5px] font-bold uppercase transition-all shrink-0"
                    title={lang === 'ru' ? 'Открыть в новой вкладке' : 'Open standalone view'}
                  >
                    <Eye size={12} />
                    <span>{lang === 'ru' ? 'В отдельной вкладке ↗' : 'In Standalone Tab ↗'}</span>
                  </a>
                </div>

                {/* Error Banner / Notice */}
                {captureError && (
                  <div className="bg-red-950/40 border border-red-500/30 p-3.5 space-y-2.5 font-mono">
                    <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>{lang === 'ru' ? 'Ошибка получения сигнала' : 'STREAM ACQUISITION ERROR'}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed uppercase">
                      {captureError}
                    </p>
                    
                    <div className="pt-2 border-t border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-[9.5px] text-zinc-400 uppercase leading-normal">
                        {lang === 'ru' 
                          ? '💡 Кликните кнопку справа, чтобы открыть приложение отдельно и обойти ограничения браузера!' 
                          : '💡 Click the button to the right to open standalone and bypass browser frame limits!'}
                      </span>
                      <a
                        href={window.location.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-[#cd412b] hover:bg-[#b53420] text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shrink-0"
                      >
                        <Eye size={13} />
                        <span>{lang === 'ru' ? 'Открыть в новой вкладке' : 'Open standalone app'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Main Viewfinder Canvas Container */}
                <div className="relative bg-[#08090d] border border-zinc-800/80 p-1.5 aspect-[16/9] flex items-center justify-center overflow-hidden group select-none">
                  {/* Background grid dots for high tech feeling */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
                  
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full object-contain relative z-10"
                  />
                  
                  {/* Invisible video element to receive getDisplayMedia stream */}
                  <video 
                    ref={videoRef} 
                    className="hidden" 
                    playsInline 
                    muted 
                  />

                  {/* Top-Right watermark inside viewport */}
                  <div className="absolute top-4 right-4 bg-black/60 border border-zinc-800/80 px-2 py-1 font-mono text-[8px] text-zinc-500 uppercase tracking-widest z-20 pointer-events-none">
                    GEN-SCAN // V2.4-PRO
                  </div>

                  {/* Central status notification overlays */}
                  {scannerMessage && (
                    <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 border border-[#cd412b]/40 py-2 px-3 text-[10px] font-mono text-white tracking-wide uppercase flex items-center gap-2 shadow-2xl z-30 animate-bounce">
                      <span className="w-2 h-2 rounded-full bg-[#cd412b] animate-ping shrink-0" />
                      <span>{scannerMessage}</span>
                    </div>
                  )}
                </div>

                {/* Primary Action Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {isStreaming ? (
                    <button
                      onClick={stopStreaming}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors border border-red-500/30"
                    >
                      <Square size={13} />
                      <span>{lang === 'ru' ? 'Остановить стрим' : 'Stop Capture'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={startStreaming}
                      className="px-4 py-2.5 bg-[#cd412b] hover:bg-[#b53420] text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-[#cd412b]/10"
                    >
                      <Play size={13} />
                      <span>{lang === 'ru' ? 'Запустить захват' : 'Start Capture'}</span>
                    </button>
                  )}

                  {/* Upload button wrapper */}
                  <label className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all">
                    <Upload size={13} />
                    <span>{lang === 'ru' ? 'Загрузить скрин' : 'Upload Image'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>

                  {/* Simulator mode selector */}
                  <button
                    onClick={() => {
                      stopStreaming();
                      setUploadedImage(null);
                      setDemoMode(true);
                      setScannerMessage(lang === 'ru' ? 'Запущен симулятор интерфейса' : 'Demonstration mode loaded');
                      setTimeout(() => setScannerMessage(''), 3000);
                    }}
                    className={`px-4 py-2.5 border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      demoMode && !isStreaming && !uploadedImage
                        ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-400'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <Sliders size={13} />
                    <span>{lang === 'ru' ? 'Демо-режим' : 'Demo Simulator'}</span>
                  </button>
                </div>

                {/* Expandable calibration drawer */}
                <div className="border border-zinc-800/80 bg-[#10131a] p-4">
                  <button
                    onClick={() => setShowScannerSettings(!showScannerSettings)}
                    className="w-full flex justify-between items-center text-left text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Settings size={13} className="text-[#cd412b]" />
                      <span>{lang === 'ru' ? 'РЕГУЛИРОВКА РАМКИ СКАНИРОВАНИЯ (GEAR)' : 'CALIBRATE REGIONS & MARGINS'}</span>
                    </span>
                    <ChevronRight size={14} className={`transform transition-transform ${showScannerSettings ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showScannerSettings && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-4 pt-4 mt-3 border-t border-zinc-800/60"
                      >
                        <p className="text-[9px] text-zinc-500 uppercase leading-relaxed max-w-xl font-mono">
                          {lang === 'ru' 
                            ? 'Сдвигайте ползунки, пока 6 круглых индикаторов на экране не окажутся точно по центру букв G-Y-H-W-X на карточке растения в игре.' 
                            : 'Drag sliders to align the 6 sampling dots perfectly inside each letter box on your in-game plant information panel.'}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Slider X */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-mono text-[10px] text-zinc-400">
                              <span>{lang === 'ru' ? 'Позиция X (Сдвиг)' : 'Horizontal Offset (X)'}</span>
                              <span className="text-[#cd412b] font-bold">{scannerX}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              step="0.5"
                              value={scannerX} 
                              onChange={(e) => setScannerX(parseFloat(e.target.value))}
                              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#cd412b]"
                            />
                          </div>

                          {/* Slider Y */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-mono text-[10px] text-zinc-400">
                              <span>{lang === 'ru' ? 'Позиция Y (Высота)' : 'Vertical Offset (Y)'}</span>
                              <span className="text-[#cd412b] font-bold">{scannerY}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              step="0.5"
                              value={scannerY} 
                              onChange={(e) => setScannerY(parseFloat(e.target.value))}
                              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#cd412b]"
                            />
                          </div>

                          {/* Slider Width */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-mono text-[10px] text-zinc-400">
                              <span>{lang === 'ru' ? 'Ширина рамки (Box Width)' : 'Scanner Target Width (W)'}</span>
                              <span className="text-[#cd412b] font-bold">{scannerW}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="5" 
                              max="50" 
                              step="0.1"
                              value={scannerW} 
                              onChange={(e) => setScannerW(parseFloat(e.target.value))}
                              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#cd412b]"
                            />
                          </div>

                          {/* Slider Spacing */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-mono text-[10px] text-zinc-400">
                              <span>{lang === 'ru' ? 'Шаг между точками (Spacing)' : 'Slot Point Spacing'}</span>
                              <span className="text-[#cd412b] font-bold">{scannerSpacing}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="8" 
                              step="0.05"
                              value={scannerSpacing} 
                              onChange={(e) => setScannerSpacing(parseFloat(e.target.value))}
                              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#cd412b]"
                            />
                          </div>
                        </div>

                        {/* Presets Row */}
                        <div className="pt-2 border-t border-zinc-800/40 space-y-1.5">
                          <div className="text-[9px] font-mono text-zinc-500 uppercase font-black">
                            {lang === 'ru' ? 'Быстрые профили калибровки:' : 'Resolution Calibration Presets:'}
                          </div>
                          <div className="flex flex-wrap gap-2 font-mono">
                            <button
                              onClick={() => {
                                setScannerX(43);
                                setScannerY(75);
                                setScannerW(20);
                                setScannerSpacing(3.3);
                              }}
                              className="px-2.5 py-1 text-[9px] font-bold border border-zinc-800 hover:border-zinc-600 bg-black/40 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              1080p Standard (Rust HUD)
                            </button>
                            <button
                              onClick={() => {
                                setScannerX(45.5);
                                setScannerY(72.5);
                                setScannerW(18);
                                setScannerSpacing(3.05);
                              }}
                              className="px-2.5 py-1 text-[9px] font-bold border border-zinc-800 hover:border-zinc-600 bg-black/40 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              1440p High Resolution
                            </button>
                            <button
                              onClick={() => {
                                setScannerX(35);
                                setScannerY(50);
                                setScannerW(30);
                                setScannerSpacing(5.0);
                              }}
                              className="px-2.5 py-1 text-[9px] font-bold border border-zinc-800 hover:border-zinc-600 bg-black/40 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              Centered Slot Crop
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Column: Scanned Results, Calibration adjustments */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] relative overflow-hidden space-y-5 shadow-xl">
                <div className="rust-bracket-tl" />
                <div className="rust-bracket-tr" />
                <div className="rust-bracket-bl" />
                <div className="rust-bracket-br" />

                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#cd412b]" />

                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2a2f3b] pb-2.5 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#cd412b]" />
                    <span>{lang === 'ru' ? 'ДИАГНОСТИКА СКАНИРОВАНИЯ' : 'RECOGNIZED GENOTYPE'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-white cursor-pointer transition-colors"
                      title={isMuted ? "Unmute scanner beep" : "Mute scanner beep"}
                    >
                      {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-emerald-400" />}
                    </button>
                  </div>
                </h3>

                {/* Big Genome digital display board */}
                <div className="bg-black/40 border border-zinc-900 p-4 rounded-none space-y-3">
                  <div className="text-center">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block mb-2.5">
                      {lang === 'ru' ? 'АВТОМАТИЧЕСКИ РАСПОЗНАННЫЙ КОД:' : 'DETECTED ACTIVE CLONE CHROMOSOME:'}
                    </span>

                    <div className="flex justify-center gap-1.5">
                      {scannedGenome.split('').map((g, idx) => {
                        const colClass = detectedColors[idx] === 'green'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-md shadow-emerald-500/5'
                          : detectedColors[idx] === 'red'
                            ? 'bg-red-500/10 text-red-400 border-red-500/40 shadow-md shadow-red-500/5'
                            : 'bg-zinc-800/40 text-zinc-500 border-zinc-800';

                        return (
                          <button
                            key={idx}
                            onClick={() => handleManualToggleScannedGene(idx)}
                            className={`w-11 h-14 text-lg font-black font-mono border flex flex-col justify-center items-center transition-all cursor-pointer hover:border-[#cd412b] relative group`}
                            title={lang === 'ru' ? 'Нажмите чтобы изменить вручную' : 'Click to toggle manually'}
                          >
                            <span>{g}</span>
                            <span className="absolute bottom-0.5 text-[6.5px] font-mono text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-black">
                              SET
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[8.5px] text-zinc-500 font-mono mt-3 uppercase">
                      {lang === 'ru' 
                        ? '💡 Если какой-то ген считался неверно, кликните по нему, чтобы быстро изменить вручную!' 
                        : '💡 Click any letter above to cycle & correct manually if pixel align is slightly off!'}
                    </p>
                  </div>

                  {/* Recognition Stability / Counter bar */}
                  {scannedGenome !== '------' && scannedGenome !== 'XXXXXX' && (
                    <div className="space-y-1 pt-2 border-t border-zinc-900">
                      <div className="flex justify-between text-[8px] font-mono text-zinc-500 uppercase">
                        <span>{lang === 'ru' ? 'Стабилизация сигнала:' : 'Signal Lock-in Stability:'}</span>
                        <span className={stabilityCounter === 100 ? 'text-emerald-400 font-black' : 'text-amber-500'}>
                          {stabilityCounter}% {stabilityCounter === 100 && ' LOCKED'}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${stabilityCounter === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                          style={{ width: `${stabilityCounter}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls & Sync buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleSaveScannedClone(scannedGenome)}
                    disabled={!isValidGenome(scannedGenome)}
                    className="w-full px-4 py-2.5 bg-zinc-900 hover:bg-[#cd412b]/15 border border-[#cd412b]/30 hover:border-[#cd412b] disabled:border-zinc-800 text-[#cd412b] disabled:text-zinc-600 font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all disabled:pointer-events-none"
                  >
                    <Save size={13} />
                    <span>{lang === 'ru' ? 'Сохранить клон в базу' : 'Save scanned clone to solver'}</span>
                  </button>

                  {/* Auto-save toggle checkbox */}
                  <label className="flex items-center gap-2.5 p-3 bg-black/20 border border-zinc-900 hover:border-zinc-800 transition-colors cursor-pointer text-xs font-mono select-none">
                    <input 
                      type="checkbox" 
                      checked={autoSave} 
                      onChange={(e) => setAutoSave(e.target.checked)}
                      className="rounded border-zinc-800 text-[#cd412b] focus:ring-[#cd412b] h-3.5 w-3.5 cursor-pointer accent-[#cd412b]" 
                    />
                    <div className="flex-1">
                      <div className="text-[10px] text-white font-bold uppercase">{lang === 'ru' ? 'Авто-добавление в базу' : 'Auto-save stable scans'}</div>
                      <div className="text-[8.5px] text-zinc-500 uppercase leading-normal mt-0.5">
                        {lang === 'ru' 
                          ? 'Автоматически добавляет клон в поиск рецептов после 1.2с стабильного фокуса' 
                          : 'Adds clone directly to solver list as soon as signal remains locked for 1.2 seconds'}
                      </div>
                    </div>
                  </label>
                </div>

                {/* Scan Requirements Info Panel */}
                <div className="bg-black/30 border border-zinc-900 p-4 space-y-3 leading-normal">
                  <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-black flex items-center gap-1">
                    <BookOpen size={11} className="text-[#cd412b]" />
                    <span>{lang === 'ru' ? 'ТРЕБОВАНИЯ ДЛЯ СКАНИРОВАНИЯ В RUST:' : 'RUST SCANNER PREREQUISITES:'}</span>
                  </div>

                  <ul className="space-y-2 font-mono text-[9.5px] text-zinc-500 uppercase list-none">
                    <li className="flex gap-1.5 items-start">
                      <span className="text-[#cd412b] font-bold shrink-0">✔</span>
                      <span>
                        {lang === 'ru' 
                          ? 'Браузеры: Chrome, Edge или Firefox (Safari и мобильные не поддерживают захват окон).' 
                          : 'Supported Browsers: Chrome, Edge, or Firefox (Mobile/Safari block screen capture API).'}
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-[#cd412b] font-bold shrink-0">✔</span>
                      <span>
                        {lang === 'ru' 
                          ? 'Разрешение игры: Полный экран (Fullscreen, 16:9 соотношение).' 
                          : 'Screen Mode: Fullscreen aspect ratio (16:9 resolutions).'}
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-[#cd412b] font-bold shrink-0">✔</span>
                      <span>
                        {lang === 'ru' 
                          ? 'Масштаб интерфейса (HUD Scale): 1.00 в настройках Rust.' 
                          : 'User Interface Scale: 1.00 in Rust screen settings.'}
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <span className="text-[#cd412b] font-bold shrink-0">✔</span>
                      <span>
                        {lang === 'ru' 
                          ? 'Важно: Отключите инфо владельца командой: inventory.show_item_ownership false в консоли.' 
                          : 'Ownership displays: Disable item owners by typing inventory.show_item_ownership false in F1 console.'}
                      </span>
                    </li>
                    <li className="flex gap-1.5 items-start font-black text-zinc-400">
                      <span className="text-[#cd412b] shrink-0">✔</span>
                      <span>
                        {lang === 'ru' 
                          ? 'Режим HDR: Windows HDR должен быть ВЫКЛЮЧЕН (для верного распознавания цветов).' 
                          : 'Windows HDR: Must be disabled (HDR distorts background pixel colors).'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
