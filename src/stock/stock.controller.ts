import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { StockService } from './stock.service';
import { UnitStatus } from 'src/blood-unit/blood-unit.model';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  // All units of a hospital
  @Get('hospitals/:hospitalId')
  getHospitalStock(@Param('hospitalId') hospitalId: number) {
    return this.stockService.getHospitalStock(hospitalId);
  }

  // Filter by blood type
  @Get('hospitals/:hospitalId/type/:bloodType')
  getByType(
    @Param('hospitalId') hospitalId: number,
    @Param('bloodType') bloodType: string,
  ) {
    return this.stockService.getByType(hospitalId, bloodType);
  }

  // Filter by status
  @Get('hospitals/:hospitalId/status/:status')
  getByStatus(
    @Param('hospitalId') hospitalId: number,
    @Param('status') status: UnitStatus,
  ) {
    return this.stockService.getByStatus(hospitalId, status);
  }

  // Specific unit
  @Get('units/:id')
  getUnit(@Param('id') id: number) {
    return this.stockService.getUnit(id);
  }

  // Update status after medical testing
  @Patch('units/:id/status')
  updateUnitStatus(
    @Param('id') id: number,
    @Body('status') status: UnitStatus,
  ) {
    return this.stockService.updateUnitStatus(id, status);
  }
}
