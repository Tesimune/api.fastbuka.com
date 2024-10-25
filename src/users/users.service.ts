import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from 'src/auth/dto/update-auth.dto';
import * as bcrypt from 'bcryptjs';
import { StrKey, Horizon } from '@stellar/stellar-sdk';


interface AssetBalance {
  asset_type: String;
  asset_code?: String;
  asset_issuer?: String;
  balance: String;
}


@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly MiddlewareService: MiddlewareService,
  ) {}

  /**
   *
   * @param token
   * @returns
   */
  async profile(token: string) {
    const auth = await this.MiddlewareService.decodeToken(token);

    const user = await this.databaseService.user.findUnique({
      where: { uuid: auth.uuid },
      include: {
        profile: true,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Profile',
      data: {
        user,
      },
    };
  }


  /**
   *
   * 
   * validateWallet and network
   */
private async validateWallet(walletAddress: string | null) {
  if (!walletAddress) {
    return {
      isValid: false,
      message: 'Wallet not initialized',
      network: null
    };
  }

  if (!StrKey.isValidEd25519PublicKey(walletAddress)) {
    throw new HttpException(
      {
        status: 400,
        success: false,
        message: 'Invalid wallet address',
      },
      400,
    );
  }

  const testnetServer = new Horizon.Server('https://horizon-testnet.stellar.org');
  const mainnetServer = new Horizon.Server('https://horizon.stellar.org');

  try {
    // Try testnet first
    await testnetServer.accounts().accountId(walletAddress).call();
    return {
      isValid: true,
      message: 'Valid wallet on testnet',
      network: 'testnet',
      server: testnetServer
    };
  } catch (testnetError) {
    try {
      // If not on testnet, try mainnet
      await mainnetServer.accounts().accountId(walletAddress).call();
      return {
        isValid: true,
        message: 'Valid wallet on mainnet',
        network: 'mainnet',
        server: mainnetServer
      };
    } catch (mainnetError) {
      // Account doesn't exist on either network
      return {
        isValid: false,
        message: 'Wallet not found on any network',
        network: null
      };
    }
  }
}


/**
   * Main wallet function that combines all steps
   */
async wallet(token: string) {
  try {
    // Get profile data which includes both wallet address and secret key
    const profileResponse = await this.profile(token);
    const walletAddress = profileResponse.data.user.walletAddress;
    const secretKey = profileResponse.data.user.secretKey;

    const validation = await this.validateWallet(walletAddress);
    if (!validation.isValid) {
      return {
        status: 200,
        success: true,
        message: validation.message,
        data: {
          wallet: {
            address: walletAddress,
            secretKey: secretKey,
            network: validation.network,
            balances: []
          }
        }
      };
    }

    const balances = await this.getAssetBalances(walletAddress, validation.server);

    return {
      status: 200,
      success: true,
      message: validation.message,
      data: {
        wallet: {
          address: walletAddress,
          secretKey: secretKey,
          network: validation.network,
          balances
        }
      }
    };

  } catch (error) {
    throw new HttpException(
      {
        status: error.status || 500,
        success: false,
        message: error.message || 'Error fetching wallet details',
      },
      error.status || 500,
    );
  }
}


/**
 * Fetch asset balances from Stellar network
 */
private async getAssetBalances(walletAddress: string, server: Horizon.Server) {
  try {
    const account = await server.accounts().accountId(walletAddress).call();
    // return all the tokens associated with the address
    return account.balances;
  } catch (error) {
    if (error.response?.status === 404) {
      return [{
        asset_type: 'native',
        balance: '0',
        buying_liabilities: '0',
        selling_liabilities: '0'
      }];
    }
    throw error;
  }
}


  /**
   *
   * @param token
   * @param updateUserDto
   * @returns
   */
  async update(token: string, updateUserDto: UpdateUserDto) {
    const auth = await this.MiddlewareService.decodeToken(token);
    if (updateUserDto.email !== auth.email) {
      const account = await this.databaseService.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (account) {
        throw new HttpException(
          {
            status: 401,
            success: false,
            message: 'Email address is already in use',
          },
          401,
        );
      }
      await this.databaseService.user.update({
        where: {
          uuid: auth.uuid,
        },
        data: {
          email: updateUserDto.email,
          email_verified: false,
        },
      });
    }
    await this.databaseService.userProfile.update({
      where: {
        user_uuid: auth.uuid,
      },
      data: {
        ...updateUserDto,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Profile updated',
    };
  }

  /**
   *
   * @param token
   * @returns
   */
  async deactivate(token: string, password: string) {
    const auth = await this.MiddlewareService.decodeToken(token);
    if (!(await bcrypt.compare(password, auth.password))) {
      throw new HttpException(
        {
          status: 401,
          success: false,
          message: 'Invalid password',
        },
        401,
      );
    }
    await this.databaseService.user.update({
      where: {
        uuid: auth.uuid,
      },
      data: {
        status: 'deactived',
      },
    });

    await this.databaseService.personalAccessToken.delete({
      where: { token },
    });

    return {
      status: 200,
      success: true,
      message: 'Acount deactived',
    };
  }

  /**
   *
   * @param body
   * @returns
   */
  async activate(body: ResetPasswordDto) {
    const user = await this.databaseService.passwordResetTokens.findFirst({
      where: {
        user_uuid: body.uuid,
        email: body.email,
        token: body.code,
      },
    });
    if (!user) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Invalid token',
        },
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(body.new_password, 10);
    await this.databaseService.user.update({
      where: {
        uuid: user.user_uuid,
      },
      data: {
        status: 'actived',
        password: hashedPassword,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Acount deactived',
    };
  }

  /**
   *
   * @param token
   * @returns
   */
  async remove(token: string, password: string) {
    const auth = await this.MiddlewareService.decodeToken(token);
    if (!(await bcrypt.compare(password, auth.password))) {
      throw new HttpException(
        {
          status: 401,
          success: false,
          message: 'Invalid password',
        },
        401,
      );
    }
    await this.databaseService.user.update({
      where: {
        uuid: auth.uuid,
      },
      data: {
        status: 'delete',
      },
    });

    await this.databaseService.personalAccessToken.delete({
      where: { token },
    });

    return {
      status: 200,
      success: true,
      message: 'Delete request sent, account will be deleted 30 days',
    };
  }
}
