import { http, HttpResponse } from 'msw';

// เปลี่ยนตัวจับ URL ให้ตรงกับของจริงในโปรเจกต์คุณ
// - ถ้าเรียก backend ผ่าน path เช่น '/api/places' ใช้แบบนี้ได้เลย
// - ถ้าเรียกโดเมนภายนอก เช่น 'https://api.example.com/places' ให้เปลี่ยนเป็นโดเมนนั้น
const PATH = '*/places/by-agency/:agency'; // or '*/places/by-agency/:agency'

type Mode = 'success' | '500' | 'network';

export function makeHandlers(mode: Mode) {
    console.log(`🏭 Creating handlers for mode: ${mode}`);
    
    if (mode === '500') {
        return [
            http.get(PATH, ({ params }) => {
                console.log(`🔥 MSW: Returning 500 error for agency: ${params.agency}`);
                return HttpResponse.json(
                    { 
                        message: 'Internal Server Error',
                        error: 'Database connection failed',
                        statusCode: 500
                    }, 
                    { status: 500 }
                );
            }),
        ];
    }

    if (mode === 'network') {
        return [
            http.get(PATH, ({ params }) => {
                console.log(`🌐 MSW: Returning network error for agency: ${params.agency}`);
                return HttpResponse.error();
            }),
        ];
    }

    // success mode
    return [
        http.get(PATH, ({ params, request }) => {
            const agency = String(params.agency);
            const url = new URL(request.url);
            const page = url.searchParams.get('page') || '1';
            const limit = url.searchParams.get('limit') || '5';

            console.log(`✅ MSW: Returning success response for agency: ${agency}, page: ${page}, limit: ${limit}`);

            return HttpResponse.json(
                {
                    data: [
                        { 
                            id: 1, 
                            name: `Mock Place 1 for ${decodeURIComponent(agency)}`,
                            agency: agency,
                            description: 'This is a mocked place from MSW'
                        },
                        { 
                            id: 2, 
                            name: `Mock Place 2 for ${decodeURIComponent(agency)}`,
                            agency: agency,
                            description: 'This is another mocked place from MSW'
                        },
                    ],
                    meta: { 
                        lastPage: 3,
                        currentPage: parseInt(page),
                        perPage: parseInt(limit),
                        total: 6
                    },
                },
                { status: 200 }
            );
        }),
    ];
}