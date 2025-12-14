import React from 'react';
import { FiSun, FiCloud, FiCloudLightning, FiWind } from 'react-icons/fi';

const WeatherWidget = ({ congestionLevel, forecast, confidence }) => {
    // congestionLevel: 0-100 (0 = Safe, 100 = Critical)

    const getWeatherState = (level) => {
        if (level < 30) return { icon: FiSun, label: "STABLE", color: "text-green-400", desc: "Clear skies. Low transaction friction." };
        if (level < 70) return { icon: FiCloud, label: "MODERATE", color: "text-yellow-400", desc: "Cloudy. Expect minor delays." };
        return { icon: FiCloudLightning, label: "STORM WARNING", color: "text-red-500", desc: "Heavy congestion. High gas fees imminent." };
    };

    const state = getWeatherState(congestionLevel);
    const Icon = state.icon;

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-xl h-full">
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon size={120} className={state.color} />
            </div>

            <h3 className="text-gray-400 font-mono text-sm uppercase tracking-widest mb-4 z-10">Blockchain Weather</h3>

            <div className={`text-6xl mb-4 ${state.color} animate-pulse z-10`}>
                <Icon />
            </div>

            <div className={`text-2xl font-bold ${state.color} font-mono z-10`}>{state.label}</div>

            <p className="text-gray-500 text-center mt-2 text-sm max-w-[80%] z-10">{state.desc}</p>

            <div className="mt-6 w-full grid grid-cols-2 gap-4 border-t border-gray-700 pt-4 z-10">
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase">Forecast (1h)</div>
                    <div className="font-mono text-blue-400">{forecast}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase">Confidence</div>
                    <div className="font-mono text-purple-400">{confidence}%</div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
