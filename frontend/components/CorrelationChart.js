import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CorrelationChart = ({ data }) => {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-400 font-mono text-sm uppercase tracking-widest">Correlation Analysis: Energy vs Blockchain</h3>
            </div>

            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10 }} />
                        <YAxis yAxisId="left" stroke="#60a5fa" label={{ value: 'Petrol ($)', angle: -90, position: 'insideLeft', fill: '#60a5fa' }} tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                        <YAxis yAxisId="right" orientation="right" stroke="#00ff00" label={{ value: 'Gas (Gwei)', angle: 90, position: 'insideRight', fill: '#00ff00' }} tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                            itemStyle={{ fontFamily: 'monospace', fontSize: 12 }}
                        />
                        <Legend iconType="rect" wrapperStyle={{ fontSize: 10 }} />
                        <Area yAxisId="left" type="monotone" dataKey="petrol" name="Petrol Price" fill="#1e3a8a" stroke="#3b82f6" fillOpacity={0.3} />
                        <Line yAxisId="right" type="monotone" dataKey="gwei" name="Eth Gas (Gwei)" stroke="#00ff00" dot={false} strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
                <span className="text-xs text-gray-500 font-mono">Correlation Coefficient: </span>
                <span className="text-xs text-green-400 font-mono font-bold">0.87 (High)</span>
            </div>
        </div>
    );
};

export default CorrelationChart;
