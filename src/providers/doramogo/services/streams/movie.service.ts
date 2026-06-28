import { PrismaService } from '@/modules/prisma/prisma.service';
import { DelegateMovieProperties } from '@/modules/providers/providers.service';
import { DoramogoApiService } from '@/providers/doramogo/services/api.service';
import { Injectable } from '@nestjs/common';
import { Audio, Quality } from '@prisma/client';
import * as cheerio from 'cheerio';

@Injectable()
export class DoramogoMovieStreamsService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly apiService: DoramogoApiService,
  ) {}

  public async getStream(
    movie: DelegateMovieProperties,
    audio: Audio,
    quality: Quality,
  ): Promise<string> {
    const stream = await this.prismaService.movieStream.findFirst({
      where: {
        movieId: movie.id,
        audio,
        quality,
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
        await this.prismaService.movieStream.update({
          where: { id: stream.id },
          data: {
            accessUrl: source,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours cache
          },
        });
        return source;
      }
    } catch (e) {}

    return null;
  }
}
