import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// shared components
import { NavBar, Clock, Footer } from '../../../components';

// post components
import { PostGrid } from '../../../posts';

// import post service and interface
import { PostService } from '../../../services/post.service';
// import { Post } from '../../../types/post.interface';

@Component({
  selector: 'app-post-grid-page',
  templateUrl: './post-grid-page.html',
  styleUrl: './post-grid-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavBar, Clock, Footer, PostGrid],
})
export class PostGridPage {
  // inject services
  private postService = inject(PostService);
  private router = inject(Router);
}
