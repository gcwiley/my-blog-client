import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

// material components
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// post service
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-count',
  templateUrl: './post-count.html',
  styleUrl: './post-count.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatTooltipModule],
})
export class PostCount {
  private readonly postService = inject(PostService);

  // optional input override; if not provided, fetches automatically from PostService
  public readonly countInput = input<number | null>(null);

  // reactive fetched count from PostService
  private readonly fetchedCount = toSignal(this.postService.getPostsCount(), {
    initialValue: 0,
  })

  // effective count resolving input or fetched value
  public readonly count = computed(() => {
    const inputVal = this.countInput();
    return inputVal !== null ? inputVal : (this.fetchedCount() ?? 0);
  });

  // pluralization label
  public readonly label = computed(() => {
    return this.count() === 1 ? 'Post' : 'Posts'
  })
}
