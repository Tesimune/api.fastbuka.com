import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from 'src/auth/dto/update-auth.dto';
import * as bcrypt from 'bcryptjs';
import {
  StrKey,
  Horizon,
} from '@stellar/stellar-sdk';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly middlewareService: MiddlewareService,
    private readonly storageService: StorageService,
    private readonly encryptionService: EncryptionService,
  ) {}

  /**
   *
   * @param token
   * @returns
   */
  async profile(token: string) {
    const auth = await this.middlewareService.decodeToken(token);

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
        network: null,
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

    const testnetServer = new Horizon.Server(
      'https://horizon-testnet.stellar.org',
    );
    const mainnetServer = new Horizon.Server('https://horizon.stellar.org');

    try {
      // Try testnet first
      await testnetServer.accounts().accountId(walletAddress).call();
      return {
        isValid: true,
        message: 'Valid wallet on testnet',
        network: 'testnet',
        server: testnetServer,
      };
    } catch (testnetError) {
      try {
        // If not on testnet, try mainnet
        await mainnetServer.accounts().accountId(walletAddress).call();
        return {
          isValid: true,
          message: 'Valid wallet on mainnet',
          network: 'mainnet',
          server: mainnetServer,
        };
      } catch (mainnetError) {
        // Account doesn't exist on either network
        return {
          isValid: false,
          message: 'Wallet not found on any network',
          network: null,
        };
      }
    }
  }

  // private validateSecretKey(secretKey: string): boolean {
  //   try {
  //     // Validate secret key format
  //     if (!StrKey.isValidEd25519SecretSeed(secretKey)) {
  //       return false;
  //     }
  //     // Try to create a keypair from the secret key
  //     Keypair.fromSecret(secretKey);
  //     return true;
  //   } catch (error) {
  //     console.error('Secret key validation error:', error);
  //     return false;
  //   }
  // }

  // private async checkAndAddTrustLine(
  //   walletAddress: string,
  //   secretKey: string,
  //   assetInfo: typeof ASSETS.NGNC | typeof ASSETS.USDC,
  //   server: Horizon.Server,
  //   network: string,
  //   existingBalances: AssetBalance[]
  // ) {
  //   try {
  //     // Validate secret key first
  //     if (!this.validateSecretKey(secretKey)) {
  //       throw new Error('Invalid secret key format');
  //     }

  //     // Create the asset
  //     const asset = new Asset(assetInfo.code, assetInfo.issuer);
  //     console.log('Created asset:', {
  //       code: asset.getCode(),
  //       issuer: asset.getIssuer()
  //     });

  //     // Check if trust line already exists
  //     const existingTrustLine = existingBalances.find(
  //       (balance: AssetBalance) =>
  //         balance.asset_code === assetInfo.code &&
  //         balance.asset_issuer === assetInfo.issuer
  //     );

  //     if (existingTrustLine) {
  //       return {
  //         success: true,
  //         message: `Trust line for ${assetInfo.code} already exists`,
  //         status: 'existing'
  //       };
  //     }

  //     // Load account
  //     const account = await server.loadAccount(walletAddress);
  //     console.log('Loaded account:', walletAddress);

  //     // Create the transaction
  //     const fee = await server.fetchBaseFee();
  //     console.log('Fetched base fee:', fee);

  //     const transaction = new TransactionBuilder(
  //       account,
  //       {
  //         fee: fee.toString(),
  //         networkPassphrase: network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET
  //       }
  //     )
  //     .addOperation(Operation.changeTrust({
  //       asset,
  //       source: walletAddress
  //     }))
  //     .setTimeout(180)
  //     .build();

  //     console.log('Built transaction');

  //     // Sign the transaction
  //     const sourceKeypair = Keypair.fromSecret(secretKey);
  //     transaction.sign(sourceKeypair);
  //     console.log('Signed transaction');

  //     // Submit the transaction
  //     const response = await server.submitTransaction(transaction);
  //     console.log('Transaction response:', response);

  //     if (response.successful) {
  //       return {
  //         success: true,
  //         message: `Trust line for ${assetInfo.code} added successfully`,
  //         status: 'added'
  //       };
  //     } else {
  //       throw new Error(`Transaction failed: ${JSON.stringify(response.result_xdr)}`);
  //     }

  //   } catch (error) {
  //     console.error(`Trust line error for ${assetInfo.code}:`, {
  //       error: error.message,
  //       stack: error.stack,
  //       extras: error.response?.data?.extras
  //     });

  //     return {
  //       success: false,
  //       message: `Failed to process trust line for ${assetInfo.code}: ${error.message}`,
  //       status: 'failed',
  //       details: error.response?.data?.extras || {}
  //     };
  //   }
  // }



  /**
   * Main wallet function that combines all steps
   */
  async wallet(token: string) {
    try {
      // Get profile data which includes both wallet address and secret key
      const profileResponse = await this.profile(token);
      const walletAddress = profileResponse.data.user.walletAddress;
      const secretKey = profileResponse.data.user.secretKey;
        

      if (!walletAddress || !secretKey) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Wallet address or secret key not found',
          },
          400,
        );
      }

      const validation = await this.validateWallet(walletAddress);
      if (!validation.isValid || !validation.server) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: validation.message,
          },
          400,
        );
      }
      // Get initial balances
      const currentBalances = await this.getAssetBalances(
        walletAddress,
        validation.server,
      );

      return {
        status: 200,
        success: true,
        message: 'Wallet details retrieved successfully',
        data: {
          wallet: {
            address: walletAddress,
            secretKey: secretKey,
            network: validation.network,
            balances: currentBalances,
          },
        },
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
  private async getAssetBalances(
    walletAddress: string,
    server: Horizon.Server,
  ) {
    try {
      const account = await server.accounts().accountId(walletAddress).call();
      // return all the tokens associated with the address
      return account.balances;
    } catch (error) {
      if (error.response?.status === 404) {
        return [
          {
            asset_type: 'native',
            balance: '0',
            buying_liabilities: '0',
            selling_liabilities: '0',
          },
        ];
      }
      throw error;
    }
  }

  /**
   * Decrypt Service
   * @param token
   * @returns
   */

  async decrypt(token: string) {
    try {
      // Get auth data using the same pattern as profile method
      const auth = await this.middlewareService.decodeToken(token);

      if (!auth || !auth.uuid) {
        throw new UnauthorizedException({
          status: 401,
          success: false,
          message: 'Invalid token',
        });
      }

      // Get user data using the same pattern as profile method
      const user = await this.databaseService.user.findUnique({
        where: { uuid: auth.uuid },
        select: { secretKey: true },
      });

      if (!user || !user.secretKey) {
        throw new UnauthorizedException({
          status: 404,
          success: false,
          message: 'Secret key not found',
        });
      }

      // Decrypt the secret key
      const decryptedKey = await this.encryptionService.decryptSecretKey(
        user.secretKey,
      );

      return {
        status: 200,
        success: true,
        message: 'Secret key decrypted successfully',
        data: {
          secretKey: decryptedKey,
        },
      };
    } catch (error) {
      console.error('Decrypt error:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException({
        status: 401,
        success: false,
        message: error.message || 'Decryption failed',
      });
    }
  }

  /**
   *
   * @param token
   * @param updateUserDto
   * @returns
   */
  async update(
    token: string,
    updateUserDto: UpdateUserDto,
    profile: Express.Multer.File,
  ) {
    const auth = await this.middlewareService.decodeToken(token);

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

    const existingProfile = await this.databaseService.userProfile.findUnique({
      where: { user_uuid: auth.uuid },
    });

    let profile_url: string;

    if (profile instanceof File) {
      profile_url = await this.storageService.bucket(
        token,
        'user_profile',
        profile,
      );
    } else {
      profile_url = existingProfile?.profile || null;
    }

    await this.databaseService.userProfile.update({
      where: {
        user_uuid: auth.uuid,
      },
      data: {
        profile: profile_url,
        ...(updateUserDto as any),
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Profile updated successfully',
    };
  }

  /**
   *
   * @param token
   * @returns
   */
  async deactivate(token: string, password: string) {
    const auth = await this.middlewareService.decodeToken(token);
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
    const auth = await this.middlewareService.decodeToken(token);

    if (!password) {
      throw new UnauthorizedException('Password is required');
    }

    if (!(await bcrypt.compare(password, auth.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    await this.databaseService.personalAccessToken
      .deleteMany({
        where: {
          user_uuid: auth.uuid,
        },
      })
      .catch(() => {});

    await this.databaseService.user
      .update({
        where: {
          uuid: auth.uuid,
        },
        data: {
          status: 'delete',
        },
      })
      .catch(() => {});

    await this.databaseService.cart
      .deleteMany({
        where: {
          user_uuid: auth.uuid,
        },
      })
      .catch(() => {});

    await this.databaseService.order
      .deleteMany({
        where: {
          user_uuid: auth.uuid,
        },
      })
      .catch(() => {});

    await this.databaseService.vendor
      .deleteMany({
        where: {
          user_uuid: auth.uuid,
        },
      })
      .catch(() => {});

    await this.databaseService.storage
      .deleteMany({
        where: {
          user_uuid: auth.uuid,
        },
      })
      .catch(() => {});

    await this.databaseService.userProfile
      .delete({
        where: {
          user_uuid: auth.uuid,
        },
      })
      .catch(() => {});

    await this.databaseService.user
      .delete({
        where: {
          uuid: auth.uuid,
        },
      })
      .catch(() => {});

    return {
      status: 200,
      success: true,
      message:
        'Account and all associated data have been successfully deleted.',
    };
  }
}
