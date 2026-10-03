import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import Layout from './pages/Layout'
import Landing from './pages/Landing'
import Library from './pages/Library'
import Play from './pages/Play'
import Pricing from './pages/Pricing'
import Panel from './pages/Panel'
import Profile from './pages/Profile'
import { Login, Signup } from './pages/AuthPages'
import Onboarding from './pages/Onboarding'
import FitTest from './pages/FitTest'
import FitResult from './pages/FitResult'
import { useAuth } from './core/auth'

function Root() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

/** Yalnızca giriş yapmış (ya da misafir) kullanıcılar için; aksi halde giriş ekranına yönlendirir. */
function Protected() {
  const current = useAuth((s) => s.current)
  const loc = useLocation()
  if (!current) return <Navigate to="/giris" replace state={{ from: loc.pathname }} />
  return <Outlet />
}
/** Girişliyken giriş/kayıt ekranlarına gerek yok. */
function GuestOnly() {
  const current = useAuth((s) => s.current)
  if (current && current !== 'guest') return <Navigate to="/panel" replace />
  return <Outlet />
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/oyunlar', element: <Library /> },
      { path: '/oyun/:id', element: <Play /> },
      { path: '/fiyat', element: <Pricing /> },
      { path: '/panel', element: <Panel /> },
      { path: '/baslangic', element: <Onboarding /> },
      { path: '/fit-test', element: <FitTest /> },
      { path: '/fit-test/sonuc', element: <FitResult /> },
      { element: <GuestOnly />, children: [{ path: '/giris', element: <Login /> }, { path: '/kayit', element: <Signup /> }] },
      { element: <Protected />, children: [{ path: '/profil', element: <Profile /> }] },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
