import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBloodInventoryDto } from './dto/create-blood-inventory.dto';
import { UpdateBloodInventoryDto } from './dto/update-blood-inventory.dto';
import { BloodInventory } from './models/blood-inventory.model';
import { BloodType } from 'src/blood-types/models/blood-type.model';

@Injectable()
export class BloodInventoryService {
  constructor(
    @InjectModel(BloodInventory)
    private readonly inventoryModel: typeof BloodInventory,
    @InjectModel(BloodType)
    private readonly bloodTypeModel: typeof BloodType,

  ) { }

  async create(dto: CreateBloodInventoryDto) {
    const bloodType = await this.bloodTypeModel.findOne({
      where: { type: dto.bloodType },
    });

    if (!bloodType) {
      throw new NotFoundException(`Blood type "${dto.bloodType}" not found`);
    }

    const existing = await this.inventoryModel.findOne({
      where: { bloodTypeId: bloodType.id },
    });

    if (existing) {
      throw new ConflictException(`Inventory for "${dto.bloodType}" already exists`);
    }

    return this.inventoryModel.create({
      bloodTypeId: bloodType.id,
      quantity: dto.quantity,
    });
  }

  async findAll() {
    return this.inventoryModel.findAll({ include: [BloodType] });
  }

  async findByType(bloodType: string) {
    const type = await this.bloodTypeModel.findOne({ where: { type: bloodType } });
    if (!type) throw new NotFoundException(`Blood type "${bloodType}" not found`);

    const inventory = await this.inventoryModel.findOne({
      where: { bloodTypeId: type.id },
      include: [BloodType],
    });

    if (!inventory) throw new NotFoundException(`No inventory for "${bloodType}"`);

    return inventory;
  }

  async update(bloodType: string, dto: UpdateBloodInventoryDto) {
    const inventory = await this.findByType(bloodType);
    inventory.quantity = dto.quantity;
    return inventory.save();
  }

  async remove(bloodType: string) {
    const inventory = await this.bloodTypeModel.findOne({ where: { type: bloodType } }  );

    if (!inventory) {
      throw new NotFoundException(`No inventory for "${bloodType}"`);
    }

    await inventory.destroy();
    return { message: `Inventory for "${bloodType}" has been removed.` };
  }
}