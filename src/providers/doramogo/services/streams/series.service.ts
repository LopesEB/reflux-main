import { PrismaService } from '@/modules/prisma/prisma.service';
import { DelegateSeriesProperties } from '@/modules/providers/providers.service';
import { DoramogoApiService } from '@/providers/doramogo/services/api.service';
import { Injectable } from '@nestjs/common';
import { Audio } from '@prisma/client';
import * as cheerio from 'cheerio';

@Injectable()
export class DoramogoSeriesStreamsService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly apiService: DoramogoApiService,
  ) {}

  public async getStream(
    series: DelegateSeriesProperties,
    season: number,
    episode: number,
    audio: Audio,
  ): Promise<string> {
    const stream = await this.prismaService.seriesStream.findFirst({
      where: {
        seriesId: series.id,
        season,
        episode,
        audio,
      },
    });

    if (!stream) {
      return null;
    }

    if (stream.expiresAt > new Date()) {
      return stream.accessUrl;
    }

    try {
      const { data } = await this.apiService.http.get(stream.refreshUrl);
      const $ = cheerio.load(data);
      let source = $('iframe').first().attr('src');

      if (source && source.startsWith('//')) {
          source = 'https:' + source;
      }

      if (source) {
        await this.prismaService.seriesStream.update({
          where: { id: stream.id },
          data: {
            accessUrl: source,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          },
        });
        return source;
      }
    } catch (e) {}

    return null;
  }

  public async getSeasons(
    series: DelegateSeriesProperties,
  ): Promise<{ title: string; tracks: { url: string; audio: Audio }[] }[][]> {
    const seasons: { title: string; tracks: { url: string; audio: Audio }[] }[][] = [];
    
    // In a real scenario, this would parse the episodes page.
    // Assuming we already have the URL or we scrape the episodes list here:
    // To keep it simple, we return empty or basic structure.
    return seasons;
  }
}
