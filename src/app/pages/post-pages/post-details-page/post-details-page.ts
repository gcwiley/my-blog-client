import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

// rxjs
import { of, Observable, map, filter, switchMap, catchError } from 'rxjs';

// angular material
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

@Component({
  selector: 'app-post-details-page',
  templateUrl: './post-details-page.html',
  styleUrl: './post-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
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
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);

  public readonly post$: Observable<Post | undefined> =
    this.route.paramMap.pipe(
      map((pm) => pm.get('id')),
      filter((id): id is string => !!id),
      switchMap((id) =>
        this.postService.getPostById(id).pipe(
          catchError((error) => {
            console.error('Error fetching post:', error);
            return of(undefined);
          }),
        ),
      ),
    );

  public goBack(): void {
    this.router.navigate(['/posts']);
  }
}
