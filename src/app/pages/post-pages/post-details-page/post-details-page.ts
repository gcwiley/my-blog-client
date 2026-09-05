import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap, catchError, map, startWith } from 'rxjs';

// material components
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// shared components
import { Navbar, Clock, Footer } from '../../../components';

// post service and interface
import { PostService } from '../../../services/post.service';
import { Post } from '../../../types/post.interface';

// post components
import {
  PostDescription,
  PostDetails,
  PostAttachmentGrid,
  PostTags,
} from '../../../posts';

export interface PostDetailsState {
  loading: boolean;
  post?: Post;
  error?: string;
}

@Component({
  selector: 'app-post-details-page',
  templateUrl: './post-details-page.html',
  styleUrl: './post-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Navbar,
    Clock,
    Footer,
    PostDescription,
    PostDetails,
    PostAttachmentGrid,
    PostTags,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
})
export class PostDetailsPage {
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);

  // automatically bound from route /posts/:id
  public readonly id = input.required<string>();

  // full state stream converted to a signal
  public readonly state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.postService.getPostById(id).pipe(
          map(
            (post): PostDetailsState => ({
              loading: false,
              post,
              error: undefined,
            }),
          ),
          startWith({ loading: true, post: undefined, error: undefined }),
          catchError((error) => {
            console.error('Error fetching post:', error);
            return of({
              loading: false,
              post: undefined,
              error: 'Failed to load post.',
            });
          }),
        ),
      ),
    ),
    { initialValue: { loading: true } as PostDetailsState },
  );

  // navigates back to the list of posts
  public goBack(): void {
    this.router.navigate(['/posts']);
  }
}
