import { Controller } from '@nestjs/common';
import { LiklesService } from './likes.service';

@Controller('comment')
export class LiklesController {
  constructor(private readonly commentService: LiklesService) {}
}
