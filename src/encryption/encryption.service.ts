import { Injectable, OnModuleInit } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService implements OnModuleInit {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 12;
  private readonly saltLength = 16;
  private readonly tagLength = 16;
  private masterKey: Buffer;

  async onModuleInit() {
    // Generate a secure master key if not exists
    // if (!process.env.MASTER_ENCRYPTION_KEY) {
    //   const generatedKey = crypto.randomBytes(32).toString('base64');
    //   console.log('Generated new MASTER_ENCRYPTION_KEY:', generatedKey);
    //   process.env.MASTER_ENCRYPTION_KEY = generatedKey;
    // }

    this.masterKey = Buffer.from(process.env.MASTER_ENCRYPTION_KEY, 'base64');
  }

  async encryptSecretKey(text: string): Promise<string> {
    const salt = crypto.randomBytes(this.saltLength);
    const iv = crypto.randomBytes(this.ivLength);

    const key = await this.deriveKey(salt);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv, {
      authTagLength: this.tagLength,
    });

    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();

    const combined = Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(encrypted, 'base64'),
    ]);

    return combined.toString('base64');
  }

  async decryptSecretKey(encryptedText: string): Promise<string> {
    try {
      const combined = Buffer.from(encryptedText, 'base64');

      // Use subarray instead of slice
      const salt = combined.subarray(0, this.saltLength);
      const iv = combined.subarray(
        this.saltLength,
        this.saltLength + this.ivLength,
      );
      const authTag = combined.subarray(
        this.saltLength + this.ivLength,
        this.saltLength + this.ivLength + this.tagLength,
      );
      const encrypted = combined.subarray(
        this.saltLength + this.ivLength + this.tagLength,
      );

      const key = await this.deriveKey(salt);
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv, {
        authTagLength: this.tagLength,
      });

      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString('utf8');
    } catch (error) {
      throw new Error('Failed to decrypt secret key');
    }
  }

  private async deriveKey(salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        this.masterKey,
        salt,
        100000,
        this.keyLength,
        'sha256',
        (err, key) => {
          if (err) reject(err);
          resolve(key);
        },
      );
    });
  }
}
