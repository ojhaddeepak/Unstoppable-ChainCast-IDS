import { useEffect, useState, useRef } from "react";
import Head from 'next/head';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FiActivity, FiAlertTriangle, FiShield, FiDatabase, FiTrendingUp, FiClock, FiCpu, FiGlobe, FiZap, FiTerminal, FiHelpCircle } from 'react-icons/fi';
import TerminalLog from '../components/TerminalLog';
import WeatherWidget from '../components/WeatherWidget';
import EnergyDashboard from '../components/EnergyDashboard';
import CorrelationChart from '../components/CorrelationChart';
import Footer from '../components/Footer';
import { ethers } from 'ethers';
import { useRouter } from "next/router";
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

// Constants
const DARK_BG = "bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-[#0f1022] dark:to-black";
const CARD_BG = "bg-white dark:bg-[#0f1022] backdrop-blur-md border border-gray-200 dark:border-green-900/30 shadow-xl";
const TEXT_PRIMARY = "text-gray-900 dark:text-white";
const TEXT_SECONDARY = "text-gray-600 dark:text-gray-400";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EF4444']; // Red added for DDoS

// Sub-components
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className={`${CARD_BG} p-6 rounded-lg border border-gray-700 hover:border-${color}-500 transition-all duration-300 group`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-xs font-mono mb-1 tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-white font-sans">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-colors`}>
        <Icon className={`h-6 w-6 text-${color}-500`} />
      </div>
    </div>
    {trend && (
      <div className={`mt-4 flex items-center text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
        {trend > 0 ? <FiTrendingUp className="mr-1" /> : <FiAlertTriangle className="mr-1" />}
        <span className="font-mono">{Math.abs(trend)}%</span>
        <span className="text-gray-600 ml-2 font-sans">vs last hour</span>
      </div>
    )}
  </div>
);

const AlertBanner = ({ message, type }) => (
  <div className={`mb-8 p-4 rounded border-l-4 ${type === 'danger' ? 'bg-red-900/20 border-red-500 text-red-200' : 'bg-yellow-900/20 border-yellow-500 text-yellow-200'} flex items-center animate-pulse`}>
    <FiAlertTriangle className="h-6 w-6 mr-3" />
    <span className="font-mono font-bold tracking-wide">{message}</span>
  </div>
);

export default function Home() {
  const router = useRouter();
  const { logout } = useAuth();

  // Existing State
  const [data, setData] = useState({
    metrics: { gasPrice: '0', blockNumber: 0, transactions: 0, networkHashrate: '0', avgBlockTime: '0', pendingTransactions: 0 },
    intrusion: false,
    weather: { congestion: 0, forecast: "Loading...", confidence: 0 },
    energy: null,
    historicalData: [],
    correlationData: [],
    attackTypes: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isAttacked, setIsAttacked] = useState(false);

  // Refs for accumulated data
  const historyRef = useRef([]);
  const correlationRef = useRef([]);

  // Helper: Log to terminal
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev.slice(-19), { timestamp, message, type }]);
  };

  // Helper: Generate Mock Data
  const generatePartialMockData = () => {
    const isCrisis = isAttacked;
    return {
      metrics: {
        gasPrice: (Math.random() * 10 + (isCrisis ? 150 : 20)).toFixed(1),
        blockNumber: (data.metrics.blockNumber || 18000000) + 1,
        transactions: Math.floor(Math.random() * 50) + (isCrisis ? 2000 : 50),
        networkHashrate: (500 + Math.random() * 10).toFixed(2),
        avgBlockTime: (12 + Math.random() * 0.5).toFixed(2),
        pendingTransactions: Math.floor(Math.random() * 200) + (isCrisis ? 5000 : 50)
      }
    };
  };

  // Helper: Fetch Data
  const fetchLiveBlockchainData = async () => {
    try {
      // Simulation mode
      const mock = generatePartialMockData();

      const newPoint = {
        name: new Date().toLocaleTimeString(),
        value: mock.metrics.transactions,
        gas: mock.metrics.gasPrice
      };

      const newHistory = [...historyRef.current.slice(-19), newPoint];
      historyRef.current = newHistory;

      const newCorrelation = [...correlationRef.current.slice(-19), {
        name: new Date().toLocaleTimeString(),
        petrol: 96.5 + (Math.random() * 2 - 1), // Mock petrol price variation
        gwei: parseFloat(mock.metrics.gasPrice)
      }];
      correlationRef.current = newCorrelation;

      setData(prev => ({
        ...prev,
        metrics: mock.metrics,
        historicalData: newHistory,
        correlationData: newCorrelation,
        weather: { congestion: isAttacked ? 0.9 : 0.2, forecast: isAttacked ? "HIGH CONGESTION" : "CLEAR", confidence: 0.95 },
        energy: {
          petrol: { current: 96.5, change: 1.2, history: Array(10).fill(0).map((_, i) => ({ name: i, value: 90 + Math.random() * 10 })) },
          diesel: { current: 89.3, change: -0.5, history: Array(10).fill(0).map((_, i) => ({ name: i, value: 85 + Math.random() * 8 })) },
          gas: { current: 75.0, change: 2.1, history: Array(10).fill(0).map((_, i) => ({ name: i, value: 70 + Math.random() * 15 })) }
        }, // Mock Indian prices
        attackTypes: [
          { name: 'DDoS', value: isAttacked ? 80 : 10 },
          { name: 'Sybil', value: 15 },
          { name: 'Replay', value: 5 },
          { name: 'Eclipse', value: 10 },
        ]
      }));

    } catch (e) {
      console.error("Data Fetch Error:", e);
    }
  };

  // Loading Screen removed to fix infinite load.
  // if (isLoading) { ... }

  // Main Effect: Initialization and Loop
  useEffect(() => {
    addLog("SYSTEM: INITIALIZING SENTINEL PROTOCOL...", "info");

    const init = async () => {
      // Simulate startup delay (reduced)
      await new Promise(r => setTimeout(r, 100));
      setIsLoading(false);
      addLog("SYSTEM: CONNECTED TO MAINNET (RPC: ANKR)", "success");
      addLog("SYSTEM: IDS ENGINE ONLINE", "success");
    };
    init();

    const interval = setInterval(() => {
      fetchLiveBlockchainData();
      // Random ambient logs
      if (Math.random() > 0.8) {
        const msgs = ["Scanning Mempool...", "Verifying Signatures...", "Syncing State Trie...", "Peers Connected: 42", "Gas Oracle Update..."];
        addLog("KERNEL: " + msgs[Math.floor(Math.random() * msgs.length)], "info");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isAttacked]);

  const handleSimulateAttack = () => {
    setIsAttacked(true);
    addLog("WARNING: SIMULATED ATTACK INITIATED", "warning");
    setData(prev => ({ ...prev, intrusion: true }));

    // Auto resolve after 10s
    setTimeout(() => {
      setIsAttacked(false);
      setData(prev => ({ ...prev, intrusion: false }));
      addLog("SYSTEM: THREAT NEUTRALIZED", "success");
    }, 10000);
  };

  return (
    <div className={`min-h-screen ${DARK_BG} text-gray-300 font-sans selection:bg-green-500 selection:text-black`}>
      <Head>
        <title>ChainCast-IDS | SENTINEL MODE</title>
        <meta name="description" content="Advanced Blockchain Security Monitor" />
      </Head>

      {/* Header */}
      <header className="bg-white/80 dark:bg-black/50 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-gray-800 p-2 rounded shadow-[0_0_10px_#00ff00aa] transition-colors">
              <FiShield className={`h-8 w-8 ${isAttacked ? 'text-red-500 animate-pulse' : 'text-green-600 dark:text-green-500'}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${TEXT_PRIMARY} tracking-widest uppercase font-mono`}>
                ChainCast<span className="text-green-600 dark:text-green-500">-IDS</span>
              </h1>
              <div className="flex items-center space-x-2">
                <p className={`text-xs ${TEXT_SECONDARY} font-mono tracking-[0.2em] uppercase`}>Sentinel v2.4.0</p>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">| SYSTEM: ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">


            {isAttacked ? (
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-mono font-bold animate-pulse shadow-[0_0_15px_#ff0000]">
                ⚠ THREAT DETECTED
              </button>
            ) : (
              <button
                onClick={handleSimulateAttack}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-green-600 dark:border-green-700 text-green-600 dark:text-green-400 px-6 py-2 rounded font-mono text-sm transition-all hover:shadow-[0_0_10px_#00ff00]"
              >
                <FiZap className="inline mr-2" />
                SIMULATE ATTACK
              </button>
            )}

            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-black/40 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-mono text-green-600 dark:text-green-400">NET_ON (RPC)</span>
            </div>

            <Link href="/energy-analytics" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-mono text-sm border border-purple-500 shadow-[0_0_10px_#a855f7] transition-all flex items-center">
              📊 ANALYTICS
            </Link>
            <Link href="/gas-booking" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-mono text-sm border border-blue-500 shadow-[0_0_10px_#0088ff] transition-all flex items-center">
              ⛽ BOOK GAS
            </Link>

            <ThemeToggle />

            <button
              onClick={logout}
              className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded font-mono text-sm border border-red-500/50 shadow-[0_0_10px_#ef4444] transition-all flex items-center"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Banner */}
        {data.intrusion && (
          <AlertBanner
            message="CRITICAL ALERT: NETWORK ANOMALY DETECTED. HIGH LATENCY & GAS SPIKES OBSERVED."
            type="danger"
          />
        )}

        <div className="grid grid-cols-12 gap-6">

          {/* Left Column - Stats & Charts (8 cols) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="GAS PRICE"
                value={`${data.metrics.gasPrice} Gwei`}
                icon={FiActivity}
                color="blue"
                trend={isAttacked ? 45 : 2.4}
              />
              <StatCard
                title="BLOCK #"
                value={`${data.metrics.blockNumber.toLocaleString()}`}
                icon={FiDatabase}
                color="green"
              />
              <StatCard
                title="HASHRATE"
                value={`${data.metrics.networkHashrate} TH/s`}
                icon={FiCpu}
                color="purple"
                trend={isAttacked ? -12 : 0.8}
              />
              <StatCard
                title="PENDING TX"
                value={`${data.metrics.pendingTransactions}`}
                icon={FiClock}
                color="yellow"
                trend={isAttacked ? 300 : -1.2}
              />
            </div>

            {/* Main Chain Activity Chart */}
            <div className={`${CARD_BG} p-6 rounded-lg border border-gray-700 relative overflow-hidden`}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-green-400 font-mono border-l-4 border-green-500 pl-3">NETWORK TRAFFIC ANALYSIS</h2>
                  <p className="text-xs text-gray-500 font-mono mt-1 ml-4 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                    Data Resolution: Block (~12s) • Live Mempool Est.
                  </p>
                </div>
                <div className="flex space-x-2 text-xs font-mono">
                  <span className="text-blue-400">● TX Volume</span>
                  <span className="text-yellow-400">● Gas Price</span>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.historicalData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ccff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00ccff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffff00" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ffff00" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888' }} />
                    <YAxis stroke="#666" tick={{ fill: '#888' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                      itemStyle={{ fontFamily: 'monospace' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#00ccff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    <Area type="monotone" dataKey="gas" stroke="#ffff00" strokeWidth={2} fillOpacity={1} fill="url(#colorGas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Energy Dashboard Section */}
            <EnergyDashboard
              petrolData={data.energy ? data.energy.petrol : null}
              dieselData={data.energy ? data.energy.diesel : null}
              gasData={data.energy ? data.energy.gas : null}
            />
          </div>

          {/* Right Column - Threats & Feed (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* Weather Widget (New) */}
            <div className="h-64">
              <WeatherWidget
                congestionLevel={data.weather.congestion}
                forecast={data.weather.forecast}
                confidence={data.weather.confidence}
              />
            </div>

            {/* Knowledge Base Card */}
            <div className="bg-[#0f1022] border border-green-900/50 rounded-xl p-4 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex items-center justify-between group hover:border-green-500/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_10px_#22c55e]">
                  <FiHelpCircle className="text-black text-2xl" />
                </div>
                <div>
                  <h3 className="text-green-400 font-bold font-mono tracking-wider text-sm">KNOWLEDGE BASE</h3>
                  <Link href="/faq" className="text-white text-sm font-mono flex items-center hover:text-green-300 transition-colors mt-1">
                    Read FAQs & Docs →
                  </Link>
                </div>
              </div>
            </div>

            {/* Threat Radar */}
            <div className={`${CARD_BG} p-6 rounded-lg border border-gray-700`}>
              <h2 className="text-lg font-bold text-green-400 font-mono mb-4 border-l-4 border-red-500 pl-3">THREAT VECTORS</h2>
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.attackTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.attackTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'DDoS' && isAttacked ? '#ff0000' : COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Correlation Chart (New) */}
            <CorrelationChart data={data.correlationData} />

            {/* Live Terminal */}
            <TerminalLog logs={logs} />

          </div>
        </div>

        {/* Global CSS override for scrollbar */}
        <style jsx global>{`
            body { 
                background: #000; 
            }
            .scrollbar-thin::-webkit-scrollbar {
                width: 6px;
            }
            .scrollbar-thin::-webkit-scrollbar-track {
                background: #000;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb {
                background-color: #064e3b;
                border-radius: 20px;
            }
        `}</style>
        <Footer />
      </main>
    </div>
  );
}
