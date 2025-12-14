import React from 'react';
import Head from 'next/head';

const AuthLayout = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Head>
                <title>{title} | ChainCast IDS</title>
            </Head>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
                    {title}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/10 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-white/10">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
