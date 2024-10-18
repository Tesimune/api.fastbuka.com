import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  index(): string {
    return 'Welcome to Fast Buka';
  }

  health(): string {
    return 'Welcome to Fast Buka, Application running.';
  }

  home(): string {
    return 'This will be returning the home page data';
  }
}
