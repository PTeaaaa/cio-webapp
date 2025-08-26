import { Test, TestingModule } from '@nestjs/testing';
import { SidebarItemsService } from './sidebar-items.service';

describe('SidebarItemsService', () => {
  let service: SidebarItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SidebarItemsService],
    }).compile();

    service = module.get<SidebarItemsService>(SidebarItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
