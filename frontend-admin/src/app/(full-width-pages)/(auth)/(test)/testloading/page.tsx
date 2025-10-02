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

export default function TestLoadingPage() {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center">
                <Infinite className="text-green-500" />
                <h1 className="text-2xl text-black dark:text-white -mt-10">Verifying authentication...</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
                <div className="text-4xl text-red-500">
                    error
                </div>
                <div className="text-lg text-black dark:text-white">
                    กำลังเปลี่ยนเส้นทางกลับไปหน้าเข้าสู่ระบบ...
                </div>
            </div>
        </div>
    );
}