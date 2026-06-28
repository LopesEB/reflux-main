import {
  DelegateMovieProviders,
  DelegateSeriesProviders,
} from '@/modules/providers/providers.service';
import { MOVIES_URL, SERIES_URL } from '@/providers/doramogo/constants/url';
import { DoramogoApiService } from '@/providers/doramogo/services/api.service';
import { Injectable } from '@nestjs/common';
import { Audio, Quality } from '@prisma/client';
import * as cheerio from 'cheerio';

@Injectable()
export class DoramogoGetterService {
  public constructor(private readonly apiService: DoramogoApiService) {}

  public async fetchMovies(): Promise<DelegateMovieProviders[]> {
    try {
      const { data } = await this.apiService.http.get(MOVIES_URL);
      const $ = cheerio.load(data);
      const movies: DelegateMovieProviders[] = [];

      $('.episode-card').each((_, el) => {
        const img = $(el).find('img').first();
        const a = $(el).find('a').first();
        const href = a.attr('href');
        const title = img.attr('alt') || a.text().trim();
        
        if (href && title && href.includes('/series/')) {
          movies.push({
            url: href,
            title: title.replace(' (Legendado)', '').replace(' (Dublado)', '').trim(),
            audio: title.toLowerCase().includes('dublado') ? Audio.DUBBED : Audio.SUBTITLED,
            quality: Quality.UNKNOWN,
          });
        }
      });

      return movies;
    } catch (e) {
      return [];
    }
  }

  public async fetchSeries(): Promise<DelegateSeriesProviders[]> {
    try {
      const { data } = await this.apiService.http.get(SERIES_URL);
      const $ = cheerio.load(data);
      const series: DelegateSeriesProviders[] = [];

      $('.episode-card').each((_, el) => {
        const img = $(el).find('img').first();
        const a = $(el).find('a').first();
        const href = a.attr('href');
        const title = img.attr('alt') || a.text().trim();
        
        if (href && title && href.includes('/series/')) {
          series.push({
            url: href,
            title: title.replace(' (Legendado)', '').replace(' (Dublado)', '').trim(),
          });
        }
      });

      return series;
    } catch (e) {
      return [];
    }
  }
}
