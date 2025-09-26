"use client";

export default function OtherErrorCard({ errorMessage }: { errorMessage: string }) {
    return (
      <div className="flex flex-col pt-[30px] pb-[90px] items-center ">
        <div className="h-fit bg-white rounded-2xl shadow-xl/30 font-prompt lg:p-10 w-[80%]">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</h1>
            <p className="text-gray-600 text-center max-w-md mb-4">
              ระบบไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง
            </p>
            <a
              href="/"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors no-underline"
            >
              กลับหน้าหลัก
            </a>
            <div className="flex flex-col px-4">
              <div className="text-center text-xs text-gray-700 mt-4 bg-gray-300 p-2 rounded overflow-auto max-w-full">
                <strong>Error Details:</strong> {errorMessage}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}