import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// shared components
import { NavBar, Clock, Footer } from '../../../components';

// post components
import { PostDescription, PostDetails } from '../../../posts';

// post service and interface
import { PostService } from '../../../services/post.service';
// import { Post } from '../../../types/post.interface';

@Component({
  selector: 'app-post-details-page',
  templateUrl: './post-details-page.html',
  styleUrl: './post-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavBar, Clock, Footer, PostDescription, PostDetails],
})
export class PostDetailsPage {
  // inject dependencies
  private postService = inject(PostService);
  private router = inject(Router);
}
