import { BreadcrumbItem } from '@/types';

// Mapping สำหรับแปลง category slug เป็นชื่อที่อ่านง่าย
const categoryMapping: { [key: string]: string } = {
  'Department': 'กรม',
  'subplace_select': 'สถานที่', // เพิ่มการ mapping สำหรับ segment หลัก
  'people_select': 'บุคคล',
  'infopage': 'รายละเอียด',
  // เพิ่มหมวดหมู่อื่นๆ ที่คุณมี
};

// ฟังก์ชันสำหรับแปลง URL Segment ให้เป็น Breadcrumb Item
export const mapUrlToBreadcrumbItem = async (
  segment: string,
  fullPath: string,
): Promise<BreadcrumbItem | null> => {
  // ตรวจสอบว่า segment นั้นๆ เป็น dynamic parameter (UUID) หรือไม่
  // โดยตรวจสอบความยาวหรือรูปแบบของ string
  const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  if (isUuid(segment)) {
    // ถ้าเป็น UUID ให้เรียก API เพื่อดึงชื่อจริง
    try {
      // ตรวจสอบว่า UUID นี้เป็นของอะไร (คน, สถานที่)
      // จากตัวอย่าง URL, เราจะใช้ `fullPath` เพื่อดูว่า UUID นี้เกี่ยวกับอะไร
      if (fullPath.includes('/people_select')) {
        // ตัวอย่าง: ดึงชื่อสถานที่จาก UUID
        const response = await fetch(`/api/places/${segment}`);
        const data = await response.json();
        // เราสามารถดึงข้อมูลปีมาใช้ได้เลยจากตรงนี้หาก API คืนค่ามา
        // ตัวอย่าง: ถ้า API คืนค่า { name: 'สำนักงานปลัดกระทรวงสาธารณสุข', year: '2567' }
        return { label: data.name, href: fullPath };
      } else if (fullPath.includes('/infopage')) {
        // ตัวอย่าง: ดึงปีจากข้อมูลคน
        const response = await fetch(`/api/people/${segment}`);
        const data = await response.json();
        // สมมติว่า API คืนค่า { name: 'ชื่อคน', year: '2567' }
        return { label: `ปี ${data.year}`, href: fullPath };
      }
    } catch (error) {
      console.error(`Error fetching data for UUID: ${segment}`, error);
      return { label: segment, href: fullPath }; // Fallback to raw UUID
    }
  }

  // ถ้าไม่ใช่ UUID ให้ใช้ mapping object
  const label = categoryMapping[segment] || segment;
  return { label, href: fullPath };
};
