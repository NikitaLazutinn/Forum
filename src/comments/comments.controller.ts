import {
  Controller
} from '@nestjs/common';
import { CommentService } from './comments.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}


}
