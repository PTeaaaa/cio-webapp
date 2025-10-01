"use client"; // สำคัญมาก! ต้องใส่ไว้บนสุดเสมอ

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Infinite = ({ size = 256, ...props }) => (
    <svg
        height={size}
        width={size}
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <title>Loading...</title>
        <path
            d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
            fill="none"
            stroke="currentColor"
            strokeDasharray="205.271142578125 51.317785644531256"
            strokeLinecap="round"
            strokeWidth="10"
            style={{
                transform: 'scale(0.8)',
                transformOrigin: '50px 50px',
            }}
        >
            <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="0;256.58892822265625"
            />
        </path>
    </svg>
);

function LoadingComponent() {
    return (
        <div className="flex flex-col items-center">
            <Infinite className="text-green-500" />
            <h1 className="text-2xl text-black dark:text-white -mt-10">Verifying authentication...</h1>
        </div>
    );
}

export default function AuthCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { oauthLogin, isLoading } = useAuth();
    const [error, setError] = useState("");
    const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

    useEffect(() => {
        const code = searchParams?.get('code');

        if (code && !isProcessingOAuth) {
            console.log("OAuth Authorization Code received:", code);
            setIsProcessingOAuth(true);
            setError(""); // Clear any existing errors

            // Handle OAuth callback
            const handleOAuthCallback = async () => {
                try {
                    // Clean up URL first to prevent re-processing
                    const url = new URL(window.location.href);
                    url.searchParams.delete('code');
                    window.history.replaceState({}, '', url.toString()); // Remarkkkkkkkkkkkkkkk

                    const success = await oauthLogin(code);
                    if (success) {
                        // Login successful - redirect will be handled by oauthLogin
                        console.log("OAuth login successful");
                    } else {
                        setError("OAuth การเข้าสู่ระบบล้มเหลว");
                        setIsProcessingOAuth(false);
                        // Redirect back to signin page with error
                        setTimeout(() => {
                            router.replace('/signin?error=oauth_failed');
                        }, 2000);
                    }
                } catch (error) {
                    console.error("OAuth callback error:", error);
                    setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย OAuth");
                    setIsProcessingOAuth(false);
                    // Redirect back to signin page with error
                    setTimeout(() => {
                        router.replace('/signin?error=oauth_error');
                    }, 2000);
                }
            };

            handleOAuthCallback();
        } else if (!code) {
            // กรณีที่ไม่มี code ส่งกลับมา (อาจเกิดข้อผิดพลาด)
            console.error("No authorization code received");
            setError("ไม่พบรหัสการยืนยันตัวตน");
            setTimeout(() => {
                router.replace('/signin?error=no_code');
            }, 2000);
        }
    }, [searchParams, oauthLogin, isProcessingOAuth, router]);

    // Show error message if there's an error
    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
                <div className="text-4xl text-red-500">
                    {error}
                </div>
                <div className="text-lg text-black dark:text-white">
                    กำลังเปลี่ยนเส้นทางกลับไปหน้าเข้าสู่ระบบ...
                </div>
            </div>
        );
    }

    // ระหว่างที่ Logic ใน useEffect กำลังทำงาน ให้แสดงหน้า Loading
    return <LoadingComponent />;
}