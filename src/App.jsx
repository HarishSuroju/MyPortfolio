import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import PasswordRecoveryModal from './components/PasswordRecoveryModal.jsx';
import PublicSite from './PublicSite.jsx';

// The admin is code-split so visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

const Loading = () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-100" role="status">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: { background: '#363636', color: '#fff' },
                        }}
                    />
                    <PasswordRecoveryModal />
                    <Routes>
                        <Route
                            path="/admin/*"
                            element={
                                <Suspense fallback={<Loading />}>
                                    <AdminApp />
                                </Suspense>
                            }
                        />
                        <Route path="*" element={<PublicSite />} />
                    </Routes>
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
