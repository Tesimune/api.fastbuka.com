import { HttpException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { randomBytes } from 'crypto';
import StellarTomlResolver from "@stellar/stellar-sdk";

@Injectable()
export class PaymentService {
  private generateRandomToken(length: number): string {
    return randomBytes(length).toString('hex').slice(0, length);
  }

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const axios = require('axios');
      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref: this.generateRandomToken(45),
          amount: '7500',
          currency: 'NGN',
          redirect_url: 'https://fastbuka.com',
          customer: {
            email: 'noreply@fastbuka.com',
            name: 'FastBuka Developers',
            phonenumber: '09012345678'
          },
          customizations: {
            title: 'FastBuka'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response;
      return {
        status: 200,
        success: true,
        message: 'Please load the hosted link',
        data: {
          link: response.data.data.link
        }
      };
    } catch (err) {
      return err;
      throw new HttpException({
        status: 500,
        success: false,
        message: err.response.data.message
      }, 500)
    }
  }





  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
