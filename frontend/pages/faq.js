import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiHelpCircle, FiShield, FiActivity, FiServer, FiGlobe } from 'react-icons/fi';

export default function FAQ() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f1022] to-black text-gray-100 font-sans selection:bg-green-500 selection:text-black">
            <Head>
                <title>Knowledge Base | ChainCast-IDS</title>
            </Head>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex items-center mb-10">
                    <Link href="/" className="mr-6 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 group">
                        <FiArrowLeft className="text-xl text-gray-400 group-hover:text-white transition-colors" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white font-mono tracking-tighter flex items-center">
                            <FiHelpCircle className="mr-3 text-green-500" />
                            KNOWLEDGE BASE
                        </h1>
                        <p className="text-gray-500 text-sm font-mono tracking-widest uppercase mt-2">Documentation & FAQs</p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="space-y-8">

                    {/* 1. App Helpfulness */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
                        <div className="flex items-start">
                            <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                                <FiGlobe className="text-blue-400 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-3 font-mono">What is ChainCast-IDS?</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    ChainCast-IDS is a real-time Intrusion Detection System (IDS) designed specifically for blockchain networks.
                                    It monitors network traffic, gas prices, and transaction volumes to detect anomalies that may indicate
                                    security threats or network congestion. It empowers administrators with actionable insights to maintain
                                    network integrity.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Simulation Attacks */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
                        <div className="flex items-start">
                            <div className="bg-red-500/20 p-3 rounded-lg mr-4">
                                <FiShield className="text-red-400 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-3 font-mono">What are Simulation Attacks?</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    The "Simulate Attack" feature in the dashboard mimics the traffic patterns of a coordinated network attack.
                                    This is strictly for testing and calibration purposes. It generates synthetic high-velocity transaction data
                                    to verify that the IDS detection algorithms correctly trigger alerts and visual warnings (e.g., changing weather
                                    status to "STORM").
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Transaction Volume & Gas Price */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
                        <div className="flex items-start">
                            <div className="bg-yellow-500/20 p-3 rounded-lg mr-4">
                                <FiActivity className="text-yellow-400 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-3 font-mono">Transaction Volume & Gas Price</h2>
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    These are key metrics for network health:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                                    <li><strong className="text-white">Transaction Volume:</strong> The number of transactions processed per block. Sudden spikes can indicate spam or DDoS.</li>
                                    <li><strong className="text-white">Gas Price (Gwei):</strong> The cost to execute a transaction. High congestion leads to skyrocketing gas prices, often making the network unusable for normal users.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 4. Network Traffic Analysis */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
                        <div className="flex items-start">
                            <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                                <FiServer className="text-purple-400 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-3 font-mono">Network Traffic Analysis</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Our system continuously analyzes the flow of data packets and transaction requests. By establishing a baseline
                                    of "normal" traffic, the IDS can statistically detect deviations. The dashboard visualizes this in real-time charts,
                                    allowing operators to spot trends like "flash crowds" or malicious bot activity instantly.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 5. Definition of DDoS Attacks */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
                        <div className="flex items-start">
                            <div className="bg-green-500/20 p-3 rounded-lg mr-4">
                                <FiActivity className="text-green-400 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-3 font-mono">What is a DDoS Attack?</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    A Distributed Denial of Service (DDoS) attack involves multiple compromised systems flooding the target
                                    (in this case, blockchain nodes or RPC endpoints) with overwhelming traffic. The goal is to exhaust resources
                                    and deny service to legitimate users. ChainCast-IDS detects the signature high-throughput patterns associated
                                    with these attacks.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-12 text-center border-t border-white/10 pt-8">
                    <p className="text-gray-500 text-sm font-mono">ChainCast-IDS Documentation v2.4.0</p>
                </div>
            </div>
        </div>
    );
}
