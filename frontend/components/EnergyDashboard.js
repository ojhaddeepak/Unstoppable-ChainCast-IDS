import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const MiniChart = ({ data, color, name, value, change }) => (
    <div className="bg-black/20 rounded-lg p-4 border border-white/5">
        <div className="flex justify-between items-start mb-2">
            <div>
                <p className="text-gray-500 text-xs uppercase font-mono">{name}</p>
                <p className={`text-xl font-bold text-${color}-400`}>${value}</p>
            </div>
            <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                {Math.abs(change)}%
            </div>
        </div>
        <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`grad${name}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color === 'yellow' ? '#facc15' : color === 'blue' ? '#60a5fa' : '#f87171'} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color === 'yellow' ? '#facc15' : color === 'blue' ? '#60a5fa' : '#f87171'} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={color === 'yellow' ? '#facc15' : color === 'blue' ? '#60a5fa' : '#f87171'} strokeWidth={2} fill={`url(#grad${name})`} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const EnergyDashboard = ({ petrolData, dieselData, gasData }) => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                <h3 className="text-gray-400 font-mono text-sm uppercase tracking-widest">Global Energy Market</h3>
                <span className="text-xs text-green-400 font-mono animate-pulse">● LIVE FEED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {petrolData && <MiniChart data={petrolData.history} color="blue" name="Petrol (Crude)" value={petrolData.current} change={petrolData.change} />}
                {dieselData && <MiniChart data={dieselData.history} color="yellow" name="Diesel Idx" value={dieselData.current} change={dieselData.change} />}
                {gasData && <MiniChart data={gasData.history} color="red" name="Natural Gas" value={gasData.current} change={gasData.change} />}
            </div>

            <div className="mt-4 bg-gray-900/30 p-3 rounded border border-gray-700/50">
                <p className="text-xs text-gray-500 font-mono">&gt; ANALYTICS_BOT: Energy markets showing unusual volatility. Correlation with gas prices increasing.</p>
            </div>
        </div>
    );
};

export default EnergyDashboard;
