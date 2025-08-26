import { Test, TestingModule } from '@nestjs/testing';
import { SidebarItemsController } from './sidebar-items.controller';

describe('SidebarItemsController', () => {
  let controller: SidebarItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SidebarItemsController],
    }).compile();

    controller = module.get<SidebarItemsController>(SidebarItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
