import { NlpModule } from '@/modules/nlp/nlp.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { TmdbModule } from '@/modules/tmdb/tmdb.module';
import { DoramogoProvider } from '@/providers/doramogo/doramogo.provider';
import { DoramogoApiService } from '@/providers/doramogo/services/api.service';
import { DoramogoGetterService } from '@/providers/doramogo/services/getter.service';
import { DoramogoProcessorService } from '@/providers/doramogo/services/processor.service';
import { DoramogoMovieStreamsService } from '@/providers/doramogo/services/streams/movie.service';
import { DoramogoSeriesStreamsService } from '@/providers/doramogo/services/streams/series.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, NlpModule, TmdbModule],
  providers: [
    DoramogoProvider,
    DoramogoApiService,
    DoramogoGetterService,
    DoramogoProcessorService,
    DoramogoMovieStreamsService,
    DoramogoSeriesStreamsService,
  ],
  exports: [],
})
export class DoramogoModule {}
