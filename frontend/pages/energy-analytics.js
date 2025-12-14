import Head from 'next/head';
import { FiTrendingUp, FiInfo, FiArrowLeft } from 'react-icons/fi';
import FuelPriceChart from '../components/FuelPriceChart';
import { fuelPrices } from '../data/fuelPrices';
import Link from 'next/link';

export default function EnergyAnalytics() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f1022] to-black text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
            <Head>
                <title>Energy Analytics | ChainCast-IDS</title>
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10">
                            <FiArrowLeft className="text-xl" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-mono tracking-tighter">
                                ENERGY ANALYTICS
                            </h1>
                            <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">Macro-Economic Context Module</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Chart Section (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <FuelPriceChart data={fuelPrices} />

                        <div className="bg-blue-900/10 border border-blue-500/30 rounded-xl p-4 flex items-start space-x-3">
                            <FiInfo className="text-blue-400 mt-1 flex-shrink-0" />
                            <p className="text-sm text-blue-200/80 leading-relaxed font-mono">
                                Data shown is historical average fuel price data (India) for analysis and correlation purposes.
                            </p>
                        </div>
                    </div>

                    {/* Context Panel (1/3 width) */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl h-fit">
                        <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-purple-500 pl-3 font-mono">
                            MARKET CORRELATION
                        </h3>

                        <div className="space-y-6 text-gray-300">
                            <p className="leading-relaxed text-sm">
                                This module adds macro-economic context. Fuel prices reflect real-world energy stress, which we correlate with blockchain gas volatility to study systemic demand patterns.
                            </p>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                    <span className="text-xs text-gray-400 uppercase font-mono">Petrol Volatility</span>
                                    <span className="text-red-400 font-bold font-mono">+12.4%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                    <span className="text-xs text-gray-400 uppercase font-mono">Correlation Score</span>
                                    <span className="text-green-400 font-bold font-mono">0.85 (High)</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-gray-500 italic">
                                    "Rising energy costs historically precede increased validation costs in PoW networks."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
