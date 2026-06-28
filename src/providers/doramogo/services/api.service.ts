import { PROVIDER_URL } from '@/providers/doramogo/constants/url';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import * as crypto from 'crypto';

@Injectable()
export class DoramogoApiService {
  public readonly http = axios.create({
    baseURL: PROVIDER_URL,
    headers: {
      referer: PROVIDER_URL,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
  });

  public constructor() {}
}
