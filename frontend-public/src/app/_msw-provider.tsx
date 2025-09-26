'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ALLOWED = new Set(['success', '500', 'network']);

export default function MSWProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<'success' | '500' | 'network'>('success');
    const [isReady, setIsReady] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        // เปิดใช้งานเฉพาะตอนตั้งค่า ENV นี้
        if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') {
            setIsReady(true);
            return;
        }

        let worker: any;
        let setMockMode: any;

        const initMSW = async () => {
            try {
                const { worker: w, setMockMode: s } = await import('@/mocks/browser');
                worker = w;
                setMockMode = s;

                // เริ่ม worker ครั้งแรก
                await worker.start({ 
                    onUnhandledRequest: 'bypass',
                    serviceWorker: {
                        url: '/mockServiceWorker.js'
                    }
                });

                console.log('🚀 MSW Worker started successfully');

                // อ่าน mode จาก query หรือ localStorage
                const mockParam = searchParams.get('mock');
                const storedMode = localStorage.getItem('msw:mode');
                const q = mockParam || storedMode || 'success';

                const nextMode = (ALLOWED.has(q) ? (q as any) : 'success') as typeof mode;
                
                console.log('🎯 Setting initial MSW mode to:', nextMode);
                setMockMode(nextMode);
                setMode(nextMode);
                localStorage.setItem('msw:mode', nextMode);
                
                setIsReady(true);
            } catch (error) {
                console.error('❌ Failed to initialize MSW:', error);
                setIsReady(true);
            }
        };

        initMSW();

        // Listen for URL changes to update mock mode
        const handleModeChange = () => {
            if (!worker || !setMockMode) return;

            const newMockParam = new URLSearchParams(window.location.search).get('mock');
            if (newMockParam && ALLOWED.has(newMockParam)) {
                const newMode = newMockParam as typeof mode;
                console.log('🔄 URL changed, updating MSW mode to:', newMode);
                setMockMode(newMode);
                setMode(newMode);
                localStorage.setItem('msw:mode', newMode);
            }
        };

        window.addEventListener('popstate', handleModeChange);
        
        return () => {
            window.removeEventListener('popstate', handleModeChange);
        };
    }, [searchParams]);

    // Update mode when searchParams change
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled' || !isReady) return;

        const mockParam = searchParams.get('mock');
        if (mockParam && ALLOWED.has(mockParam) && mockParam !== mode) {
            const newMode = mockParam as typeof mode;
            console.log('🔄 SearchParams changed, updating MSW mode to:', newMode);
            
            import('@/mocks/browser').then(({ setMockMode }) => {
                setMockMode(newMode);
                setMode(newMode);
                localStorage.setItem('msw:mode', newMode);
            });
        }
    }, [searchParams, mode, isReady]);

    // Show loading state while MSW is initializing
    if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' && !isReady) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Initializing MSW...</p>
                </div>
            </div>
        );
    }

    // ป้ายมุมจอเล็ก ๆ บอกโหมดปัจจุบัน (ช่วยให้รู้ว่าเรากำลัง mock อยู่)
    return (
        <>
            {process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' && (
                <div style={{
                    position: 'fixed', bottom: 8, right: 8, padding: '6px 10px',
                    background: mode === 'success' ? '#10b981' : mode === '500' ? '#ef4444' : '#f59e0b', 
                    color: '#fff', fontSize: 12, borderRadius: 8, opacity: .9, zIndex: 9999,
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    MSW: {mode}
                </div>
            )}
            {children}
        </>
    );
}
