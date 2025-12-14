import { FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiSend, FiHelpCircle } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="w-full mt-16 py-12 border-t border-gray-800 bg-black/40 backdrop-blur-md">
            <div className="container mx-auto px-4 lg:px-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Contact Info Cards */}
                    <div className="space-y-6">
                        {/* Email Card */}
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center shadow-lg hover:border-gray-700 transition-colors group">
                            <div className="bg-blue-500/10 p-4 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
                                <FiMail size={24} />
                            </div>
                            <div className="ml-6">
                                <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Email</h4>
                                <p className="text-gray-200 font-mono text-lg">ojhad5907@gmail.com</p>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center shadow-lg hover:border-gray-700 transition-colors group">
                            <div className="bg-green-500/10 p-4 rounded-full text-green-400 group-hover:scale-110 transition-transform">
                                <FiPhone size={24} />
                            </div>
                            <div className="ml-6">
                                <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Phone</h4>
                                <p className="text-gray-200 font-mono text-lg">+91 7009922682</p>
                            </div>
                        </div>

                        {/* FAQ / Knowledge Base Card (Replaces Location) */}
                        <a href="/faq" className="bg-gray-900 border border-green-900/30 p-6 rounded-xl flex items-center shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:border-green-500 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all group cursor-pointer block">
                            <div className="bg-green-500/10 p-4 rounded-full text-green-400 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
                                <FiHelpCircle size={24} />
                            </div>
                            <div className="ml-6">
                                <h4 className="text-green-400 text-sm font-bold uppercase tracking-wider mb-1 group-hover:text-green-300">Knowledge Base</h4>
                                <p className="text-gray-200 font-mono text-lg">Read FAQs & Docs &rarr;</p>
                            </div>
                        </a>

                        {/* Social Connect */}
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl text-center shadow-lg h-32 flex flex-col justify-center">
                            <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">Connect With Me</h4>
                            <div className="flex justify-center space-x-6">
                                <a href="#" className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"><FiGithub size={20} /></a>
                                <a href="#" className="p-2 bg-gray-800 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600 transition-all"><FiLinkedin size={20} /></a>
                                <a href="#" className="p-2 bg-gray-800 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-600 transition-all"><FiTwitter size={20} /></a>
                                <a href="#" className="p-2 bg-gray-800 rounded-lg text-pink-400 hover:text-white hover:bg-pink-600 transition-all"><FiInstagram size={20} /></a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Message Form */}
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Send Me a Message</h3>
                            <p className="text-gray-500 text-sm">I'll get back to you as soon as possible</p>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Divyansh Ojha"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Your Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="contact@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Your Message</label>
                                <textarea
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
                                    placeholder="Hello, I'd like to discuss..."
                                ></textarea>
                            </div>

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] shadow-lg shadow-blue-600/20"
                            >
                                <span>Send Message</span>
                                <FiSend />
                            </button>
                        </form>
                    </div>

                </div>

                <div className="mt-16 text-center border-t border-gray-800 pt-8">
                    <p className="text-xs text-gray-600 font-mono">
                        © {new Date().getFullYear()} ChainCast IDS. Designed with React & Tailwind.
                        <span className="mx-2 text-gray-800">|</span>
                        <a href="/faq" className="text-gray-500 hover:text-green-400 transition-colors">FAQ & Knowledge Base</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
