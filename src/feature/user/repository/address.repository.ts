import { EntityRepository, Repository } from 'typeorm';
import { Address } from '../../../entities/address.entity';
import { addressInfo } from '../interface/addressInfo';

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> {
  async createAddress(addressInfo: addressInfo): Promise<Address> {
    const { postCode, prefecture, city, address1 } = addressInfo;
    const address = this.create({
      postCode,
      prefecture,
      city,
      address1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await this.save(address);
    return address;
  }
}
