import {
  DelegateMovieProperties,
  DelegateMovieProviders,
  DelegateSeriesEpisodes,
  DelegateSeriesProperties,
  DelegateSeriesProviders,
} from '@/modules/providers/providers.service';
import { ProvidersRegistryService } from '@/modules/providers/services/registry.service';
import { DoramogoGetterService } from '@/providers/doramogo/services/getter.service';
import { DoramogoProcessorService } from '@/providers/doramogo/services/processor.service';
import { DoramogoMovieStreamsService } from '@/providers/doramogo/services/streams/movie.service';
import { DoramogoSeriesStreamsService } from '@/providers/doramogo/services/streams/series.service';
import { Injectable } from '@nestjs/common';
import { Audio, Provider, Quality } from '@prisma/client';

@Injectable()
export class DoramogoProvider extends ProvidersRegistryService {
  public readonly provider = Provider.DORAMOGO;

  public movies: DelegateMovieProperties[] = [];
  public series: DelegateSeriesProperties[] = [];

  public constructor(
    private readonly doramogoGetterService: DoramogoGetterService,
    private readonly doramogoProcessorService: DoramogoProcessorService,
    private readonly doramogoMovieStreamsService: DoramogoMovieStreamsService,
    private readonly doramogoSeriesStreamsService: DoramogoSeriesStreamsService,
  ) {
    super();
    this.register(this.provider);
  }

  public async fetchMovies(): Promise<DelegateMovieProviders[]> {
    return await this.doramogoGetterService.fetchMovies();
  }

  public async fetchSeries(): Promise<DelegateSeriesProviders[]> {
    return await this.doramogoGetterService.fetchSeries();
  }

  public async indexMovies(movies: DelegateMovieProviders[]): Promise<void> {
    const index = await this.doramogoProcessorService.indexMovies(movies);
    const save = await this.doramogoProcessorService.saveMovies(index);

    this.movies = save;
  }

  public async indexSeries(series: DelegateSeriesProviders[]): Promise<void> {
    const index = await this.doramogoProcessorService.indexSeries(series);
    const save = await this.doramogoProcessorService.saveSeries(index);

    this.series = save;
  }

  public async refreshMovieUrl(
    movie: DelegateMovieProperties,
    audio: Audio,
    quality: Quality,
  ): Promise<string> {
    return await this.doramogoMovieStreamsService.getStream(
      movie,
      audio,
      quality,
    );
  }

  public async refreshSeriesUrl(
    series: DelegateSeriesProperties,
    season: number,
    episode: number,
    audio: Audio,
  ): Promise<string> {
    return await this.doramogoSeriesStreamsService.getStream(
      series,
      season,
      episode,
      audio,
    );
  }

  public async getSeriesEpisodes(
    series: DelegateSeriesProperties,
  ): Promise<DelegateSeriesEpisodes[]> {
    const seasons =
      await this.doramogoSeriesStreamsService.getSeasons(series);
    const episodes: DelegateSeriesEpisodes[] = [];

    for (let i = 0; i < seasons.length; i++) {
      if (!seasons[i]) continue;
      for (let j = 0; j < seasons[i].length; j++) {
        if (!seasons[i][j]) continue;
        episodes.push({
          title: seasons[i][j].title,
          season: i,
          episode: j,
          tracks: seasons[i][j].tracks,
        });
      }
    }

    return episodes;
  }
}
