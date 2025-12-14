import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FuelPriceChart = ({ data }) => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl h-96">
            <h3 className="text-xl font-bold text-white mb-4 font-mono">
                <span className="text-blue-400">⚡</span> HISTORICAL PRICE TRENDS (5 YR)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="year" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ fontFamily: 'monospace' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="petrol" stroke="#3b82f6" strokeWidth={3} name="Petrol (₹)" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="diesel" stroke="#eab308" strokeWidth={3} name="Diesel (₹)" />
                    <Line type="monotone" dataKey="gas" stroke="#22c55e" strokeWidth={3} name="Natural Gas ($)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FuelPriceChart;
