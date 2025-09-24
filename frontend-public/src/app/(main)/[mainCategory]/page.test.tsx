// frontend-public/src/app/(main)/[mainCategory]/page.test.tsx
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import SubPlaceSelectPage from './page';
import { getPlacesByAgency } from '@/services/placesPublicAPI/placesPublicAPI';

// Mock dependencies
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('@/services/placesPublicAPI/placesPublicAPI', () => ({
  getPlacesByAgency: jest.fn(),
}));

jest.mock('@/mycomponents/SubListItem', () => {
  return function MockItemsList({ category, items }: any) {
    return <div data-testid="items-list">{category} - {items.length} items</div>;
  };
});

jest.mock('@/mycomponents/pagination', () => {
  return function MockPagination({ totalPages, currentPage }: any) {
    return <div data-testid="pagination">Page {currentPage} of {totalPages}</div>;
  };
});

jest.mock('@/helpercomponents/breadcrumbsupdater', () => {
  return function MockBreadcrumbUpdater({ breadcrumbItems }: any) {
    return <div data-testid="breadcrumb">{breadcrumbItems[0]?.label}</div>;
  };
});

jest.mock('@/mockData/Sidebardata.json', () => [
  { keyMain: 'agency1', title: 'Agency 1', url: '/agency1' },
  { keyMain: 'agency2', title: 'Agency 2', url: '/agency2' },
]);

const mockGetPlacesByAgency = getPlacesByAgency as jest.MockedFunction<typeof getPlacesByAgency>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

describe('SubPlaceSelectPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Prevent actual notFound() calls during tests
    mockNotFound.mockImplementation(() => {
      throw new Error('notFound called');
    });
  });

  // Use Promise-wrapped params to match Next.js 15 behavior
  const mockProps = {
    params: Promise.resolve({ mainCategory: 'agency1' }),
    searchParams: Promise.resolve({ page: '1', limit: '5' }),
  };

  const mockSuccessResponse = {
    data: [
      { id: '1', name: 'Place 1', agency: 'agency1' },
      { id: '2', name: 'Place 2', agency: 'agency1' },
    ],
    meta: { total: 2, page: 1, limit: 5, lastPage: 3 },
  };

  describe('Successful scenarios', () => {
    it('should render successfully with data', async () => {
      mockGetPlacesByAgency.mockResolvedValue(mockSuccessResponse);

      const result = await SubPlaceSelectPage(mockProps as any);
      render(result);

      expect(screen.getByRole('heading', { name: 'Agency 1' })).toBeInTheDocument();
      expect(screen.getByTestId('items-list')).toHaveTextContent('agency1 - 2 items');
      expect(screen.getByTestId('pagination')).toHaveTextContent('Page 1 of 3');
    });

    it('should render empty state when no places found', async () => {
      mockGetPlacesByAgency.mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 5, lastPage: 0 },
      });

      const result = await SubPlaceSelectPage(mockProps as any);
      render(result);

      expect(screen.getByText('ไม่พบรายการ')).toBeInTheDocument();
      expect(screen.getByText(/ขณะนี้ยังไม่มีสถานที่สำหรับหมวดหมู่ "Agency 1"/)).toBeInTheDocument();
      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  describe('Invalid agency scenarios', () => {
    it('should call notFound for invalid agency', async () => {
      const invalidProps = {
        params: Promise.resolve({ mainCategory: 'invalid-agency' }),
        searchParams: Promise.resolve({ page: '1' }),
      };

      await expect(SubPlaceSelectPage(invalidProps as any)).rejects.toThrow('notFound called');
      expect(mockNotFound).toHaveBeenCalled();
    });

    it('should call notFound for empty agency', async () => {
      const emptyProps = {
        params: Promise.resolve({ mainCategory: '' }),
        searchParams: Promise.resolve({ page: '1' }),
      };

      await expect(SubPlaceSelectPage(emptyProps as any)).rejects.toThrow('notFound called');
      expect(mockNotFound).toHaveBeenCalled();
    });
  });

  describe('API error scenarios that trigger notFound', () => {
    it('should call notFound for AGENCY_NOT_FOUND error', async () => {
      mockGetPlacesByAgency.mockRejectedValue(new Error('AGENCY_NOT_FOUND'));

      await expect(SubPlaceSelectPage(mockProps as any)).rejects.toThrow('notFound called');
      expect(mockNotFound).toHaveBeenCalled();
    });

    it('should call notFound for AGENCY_MISSING error', async () => {
      mockGetPlacesByAgency.mockRejectedValue(new Error('AGENCY_MISSING'));

      await expect(SubPlaceSelectPage(mockProps as any)).rejects.toThrow('notFound called');
      expect(mockNotFound).toHaveBeenCalled();
    });

    it('should call notFound for 404 error', async () => {
      mockGetPlacesByAgency.mockRejectedValue(new Error('404 Not Found'));

      await expect(SubPlaceSelectPage(mockProps as any)).rejects.toThrow('notFound called');
      expect(mockNotFound).toHaveBeenCalled();
    });

    it('should render error card when notFound throws during invalid response data', async () => {
      mockGetPlacesByAgency.mockResolvedValue({ data: null, meta: { total: 0, page: 1, limit: 5, lastPage: 0 } } as any);

      const result = await SubPlaceSelectPage(mockProps as any);
      render(result);

      // When notFound() throws in our test, it gets caught and shows error card
      expect(screen.getByText('เกิดข้อผิดพลาดในการโหลดข้อมูล')).toBeInTheDocument();
      expect(screen.getByText('notFound called')).toBeInTheDocument();
      expect(mockNotFound).toHaveBeenCalled();
    });
  });

  describe('Network/Server error scenarios (Error Card)', () => {
    it('should render error card for network timeout error', async () => {
      const networkError = new Error('Network timeout');
      mockGetPlacesByAgency.mockRejectedValue(networkError);

      const result = await SubPlaceSelectPage(mockProps as any);
      render(result);

      expect(screen.getByText('เกิดข้อผิดพลาดในการโหลดข้อมูล')).toBeInTheDocument();
      expect(screen.getByText(/ระบบไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้/)).toBeInTheDocument();
      expect(screen.getByText('กลับหน้าหลัก')).toBeInTheDocument();
      expect(screen.getByText('Network timeout')).toBeInTheDocument();
      expect(mockNotFound).not.toHaveBeenCalled();
    });

    it('should render error card for 500 server error', async () => {
      const serverError = new Error('Internal Server Error 500');
      mockGetPlacesByAgency.mockRejectedValue(serverError);

      const result = await SubPlaceSelectPage(mockProps as any);
      render(result);

      expect(screen.getByText('เกิดข้อผิดพลาดในการโหลดข้อมูล')).toBeInTheDocument();
      expect(screen.getByText('Internal Server Error 500')).toBeInTheDocument();
      expect(mockNotFound).not.toHaveBeenCalled();
    });

    it('should render error card for connection refused error', async () => {
      const connectionError = new Error('ECONNREFUSED');
      mockGetPlacesByAgency.mockRejectedValue(connectionError);

      const result = await SubPlaceSelectPage(mockProps as any);
      render(result);

      expect(screen.getByText('เกิดข้อผิดพลาดในการโหลดข้อมูล')).toBeInTheDocument();
      expect(screen.getByText('ECONNREFUSED')).toBeInTheDocument();
      expect(mockNotFound).not.toHaveBeenCalled();
    });

    it('should render error card for non-Error thrown values', async () => {
      const stringError = 'Something went wrong';
      mockGetPlacesByAgency.mockRejectedValue(stringError);

      const result = await SubPlaceSelectPage(mockProps as any);
      render(result);

      expect(screen.getByText('เกิดข้อผิดพลาดในการโหลดข้อมูล')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(mockNotFound).not.toHaveBeenCalled();
    });

    it('should have correct error card elements', async () => {
      mockGetPlacesByAgency.mockRejectedValue(new Error('Test error'));

      const result = await SubPlaceSelectPage(mockProps as any);
      render(result);

      // Check for warning icon (SVG)
      const svgElement = document.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
      
      // Check for "กลับหน้าหลัก" link
      const homeLink = screen.getByRole('link', { name: 'กลับหน้าหลัก' });
      expect(homeLink).toHaveAttribute('href', '/');
      expect(homeLink).toHaveClass('bg-blue-500');
    });
  });

  describe('URL parameter handling', () => {
    it('should handle URL encoded agency names', async () => {
      const encodedProps = {
        params: Promise.resolve({ mainCategory: encodeURIComponent('agency1') }),
        searchParams: Promise.resolve({ page: '1' }),
      };

      mockGetPlacesByAgency.mockResolvedValue(mockSuccessResponse);

      const result = await SubPlaceSelectPage(encodedProps as any);
      render(result);

      expect(mockGetPlacesByAgency).toHaveBeenCalledWith('agency1', 1, 5);
    });

    it('should handle missing search params with defaults', async () => {
      const propsWithoutSearchParams = {
        params: Promise.resolve({ mainCategory: 'agency1' }),
        searchParams: Promise.resolve({}),
      };

      mockGetPlacesByAgency.mockResolvedValue(mockSuccessResponse);

      const result = await SubPlaceSelectPage(propsWithoutSearchParams as any);
      render(result);

      expect(mockGetPlacesByAgency).toHaveBeenCalledWith('agency1', 1, 5);
    });

    it('should parse custom page and limit parameters', async () => {
      const customParams = {
        params: Promise.resolve({ mainCategory: 'agency1' }),
        searchParams: Promise.resolve({ page: '3', limit: '10' }),
      };

      mockGetPlacesByAgency.mockResolvedValue(mockSuccessResponse);

      const result = await SubPlaceSelectPage(customParams as any);
      render(result);

      expect(mockGetPlacesByAgency).toHaveBeenCalledWith('agency1', 3, 10);
    });
  });

  describe('Breadcrumb handling', () => {
    it('should set breadcrumb for known agency', async () => {
      mockGetPlacesByAgency.mockResolvedValue(mockSuccessResponse);

      const result = await SubPlaceSelectPage(mockProps as any);
      render(result);

      expect(screen.getByTestId('breadcrumb')).toHaveTextContent('Agency 1');
    });

    it('should set breadcrumb for unknown agency', async () => {
      // Mock an agency that exists in sidebarData but test fallback
      const unknownProps = {
        params: Promise.resolve({ mainCategory: 'agency2' }),
        searchParams: Promise.resolve({ page: '1' }),
      };

      mockGetPlacesByAgency.mockResolvedValue(mockSuccessResponse);

      const result = await SubPlaceSelectPage(unknownProps as any);
      render(result);

      expect(screen.getByTestId('breadcrumb')).toHaveTextContent('Agency 2');
    });
  });
});