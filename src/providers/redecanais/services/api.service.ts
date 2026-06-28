import { PROVIDER_URL } from '@/providers/redecanais/constants/url';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';

@Injectable()
export class RedeCanaisApiService {
  public readonly http = axios.create({
    baseURL: PROVIDER_URL,
    headers: {
      referer: PROVIDER_URL,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      ciphers: 'ALL',
    }),
  });

  public constructor() {}
}
