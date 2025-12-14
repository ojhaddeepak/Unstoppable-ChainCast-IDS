import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiCheckCircle, FiAlertCircle, FiCreditCard, FiTruck, FiZap } from 'react-icons/fi';
import Footer from '../components/Footer';

const GAS_PRICES = {
    LPG: 950, // Per Cylinder
    CNG: 85,  // Per Kg
    PNG: 54   // Per Unit
};

export default function GasBooking() {
    const [gasType, setGasType] = useState('LPG');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed'
    const [txHash, setTxHash] = useState(null);

    const price = GAS_PRICES[gasType] * quantity;

    // Load Razorpay Script Optimally
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        setLoading(true);

        if (!window.Razorpay) {
            alert('Payment gateway loading... please wait a moment and try again.');
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
            const orderData = await fetch(`${apiUrl}/gas/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: price })
            }).then((t) => t.json());

            if (!orderData || !orderData.id) {
                throw new Error("Failed to create order");
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_MOCK_KEY_FOR_DEMO",
                amount: orderData.amount,
                currency: "INR",
                name: "ChainCast Energy",
                description: `Gas Booking: ${gasType} x ${quantity}`,
                order_id: orderData.id,
                handler: async function (response) {
                    // 2. Verify Payment
                    try {
                        const verifyData = await fetch(`${apiUrl}/gas/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                order_id: response.razorpay_order_id,
                                payment_id: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                bookingDetails: { gasType, quantity, amount: price }
                            })
                        }).then((t) => t.json());

                        if (verifyData.success) {
                            setPaymentStatus('success');
                            setTxHash(verifyData.txHash);
                        } else {
                            setPaymentStatus('failed');
                            alert(verifyData.message || "Payment Verification Failed");
                        }
                    } catch (err) {
                        console.error("Verification Error", err);
                        setPaymentStatus('failed');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: "ChainCast User",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: { color: "#8b5cf6" }, // Violet theme
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment Start Error", error);
            alert("Could not initiate payment. Server might be offline.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-gray-100 font-sans selection:bg-purple-500 selection:text-white">
            <Head>
                <title>Book Gas | ChainCast</title>
            </Head>

            <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[90vh]">

                {/* Background Blobs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                <div className="relative backdrop-filter backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg transition-all duration-300 hover:shadow-purple-500/20">

                    <div className="p-6 border-b border-white/5 bg-gradient-to-r from-transparent via-white/5 to-transparent">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 font-mono flex items-center justify-center tracking-tighter">
                            <FiZap className="mr-3 text-yellow-400 animate-pulse" />
                            ENERGY PORTAL
                        </h1>
                        <p className="text-center text-xs text-blue-200/70 mt-2 font-mono tracking-widest uppercase">Decentralized Gas Booking</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {paymentStatus === 'success' ? (
                            <div className="text-center space-y-6 animate-pulse-once">
                                <div className="inline-block p-4 rounded-full bg-green-500/20 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                    <FiCheckCircle size={60} className="text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
                                    <p className="text-gray-300">Your gas booking is confirmed.</p>
                                </div>

                                <div className="bg-black/40 p-5 rounded-xl border border-dashed border-green-500/30 text-left relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                                    <p className="text-[10px] text-green-400 font-mono mb-2 uppercase tracking-wide">Blockchain Transaction Hash</p>
                                    <p className="font-mono text-xs text-blue-200 break-all leading-relaxed hover:text-white transition-colors cursor-pointer" title="Click to Copy">
                                        {txHash}
                                    </p>
                                </div>

                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-xl font-mono transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-blue-200/80 uppercase tracking-widest text-xs">Select Fuel Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['LPG', 'CNG', 'PNG'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setGasType(type)}
                                                className={`p-4 rounded-xl border font-mono font-bold transition-all duration-300 relative overflow-hidden group ${gasType === type
                                                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                                    : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                <span className="relative z-10">{type}</span>
                                                {gasType === type && <div className="absolute inset-0 bg-cyan-400/10 blur-md"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-blue-200/80 uppercase tracking-widest text-xs">
                                        Quantity <span className="text-gray-500 font-normal lowercase">({gasType === 'LPG' ? 'cylinders' : 'units'})</span>
                                    </label>
                                    <div className="flex items-center justify-between bg-black/30 rounded-xl p-2 border border-white/5">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 rounded-lg bg-white/5 text-white font-bold text-2xl hover:bg-white/10 transition-colors flex items-center justify-center hover:text-cyan-400"
                                        >-</button>
                                        <span className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-12 rounded-lg bg-white/5 text-white font-bold text-2xl hover:bg-white/10 transition-colors flex items-center justify-center hover:text-cyan-400"
                                        >+</button>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6 mt-8">
                                    <div className="flex justify-between items-end mb-8">
                                        <span className="text-blue-200/60 font-mono text-xs">TOTAL ESTIMATE</span>
                                        <div className="text-right">
                                            <span className="text-4xl font-bold text-white font-mono tracking-tighter">₹ {price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl font-bold font-mono text-lg shadow-lg transition-all duration-300 flex justify-center items-center group relative overflow-hidden ${loading
                                            ? 'bg-gray-700 cursor-wait opacity-80'
                                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/50'
                                            }`}
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                PROCESSING...
                                            </span>
                                        ) : (
                                            <>
                                                <FiCreditCard className="mr-3 group-hover:scale-110 transition-transform" />
                                                PAY NO W
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-6 flex justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                        {/* Brand icons could go here */}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <Footer />
            </div>

            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    );
}

