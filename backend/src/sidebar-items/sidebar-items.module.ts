import { Module } from '@nestjs/common';
import { SidebarItemsController } from './sidebar-items.controller';
import { SidebarItemsService } from './sidebar-items.service';

@Module({
  controllers: [SidebarItemsController],
  providers: [SidebarItemsService]
})
export class SidebarItemsModule {}
