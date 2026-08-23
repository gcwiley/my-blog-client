import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

// angular material
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// post service
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-count',
  templateUrl: './post-count.html',
  styleUrl: './post-count.scss',
  imports: [MatIconModule, MatTooltipModule],
})
export class PostCount {
  private readonly postService = inject(PostService);

  // fix this!
}
