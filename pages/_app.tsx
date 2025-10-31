import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from '../components/Navbar'
import { AuthContextProvider, useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import ProtectedRoute from '../components/ProtectedRoute'
import { useEffect } from 'react'
import Footer from '../components/footer';

const noAuthRequired = ['/', '/about', '/login', '/signup', '/PasswordResetForm', '/resultsPage'] //THIS IS WHERE YOU WHITELIST PAGES
function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { user } = useAuth()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = document.getElementById('globalLoader');
      if (loader)
        loader.style.display = 'none';
      
      // Add/remove logged-in class to body
      if (user) {
        document.body.classList.add('logged-in');
      } else {
        document.body.classList.remove('logged-in');
      }
    }
  }, [user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {!['/login', '/signup'].includes(router.pathname) && <Navbar />}
        <main style={{ flex: 1, overflow: 'visible' }}>
          {noAuthRequired.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </main>
        {!['/login', '/signup', '/PasswordResetForm'].includes(router.pathname) && <Footer />}
    </div>
  )
}

function MyApp(props: AppProps) {
  return (
    <AuthContextProvider>
      <AppContent {...props} />
    </AuthContextProvider>
  )
}

export default MyApp
