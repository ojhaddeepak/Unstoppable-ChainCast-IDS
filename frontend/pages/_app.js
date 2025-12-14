import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useRouter } from 'next/router';
import '../styles/globals.css';

// Components
import ProtectedRoute from '../components/ProtectedRoute';
import GuestRoute from '../components/GuestRoute';

// Pages that don't require authentication
const publicPages = ['/login', '/signup', '/forgot-password', '/reset-password/[token]'];

function Layout({ children, isPublic }) {
  const router = useRouter();
  const isActive = (path) => router.pathname === path;

  if (isPublic) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  if (router.pathname === '/' || router.pathname === '/energy-analytics' || router.pathname === '/gas-booking' || router.pathname === '/faq') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="ml-2 text-xl font-bold text-gray-900">ChainCast-IDS</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <ThemeProvider>
          <Layout isPublic={isPublicPage}>
            {isPublicPage ? (
              <GuestRoute>
                <Component {...pageProps} />
              </GuestRoute>
            ) : (
              <ProtectedRoute>
                <Component {...pageProps} />
              </ProtectedRoute>
            )}
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;
