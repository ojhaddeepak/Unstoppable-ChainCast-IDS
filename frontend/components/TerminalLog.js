import React, { useEffect, useRef } from 'react';
import { FiTerminal } from 'react-icons/fi';

const TerminalLog = ({ logs }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black border border-green-500 rounded-lg p-4 font-mono text-xs md:text-sm h-64 overflow-hidden flex flex-col shadow-[0_0_10px_rgba(0,255,0,0.2)]">
      <div className="flex items-center text-green-400 mb-2 border-b border-green-800 pb-2">
        <FiTerminal className="mr-2" />
        <span className="font-bold">SYSTEM_LOG // MONITORING_ACTIVE</span>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black space-y-1"
      >
        {logs.length === 0 && (
          <div className="text-gray-600 italic">No events detected...</div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="flex">
            <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
            <span className={`${log.type === 'danger' ? 'text-red-500 font-bold animate-pulse' :
              log.type === 'warning' ? 'text-yellow-400' :
                'text-green-300'
              }`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalLog;
