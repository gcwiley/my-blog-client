import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

// shared components
import {
  Navbar,
  Clock,
  Calendar,
  Hero,
  Toolbar,
  Footer,
} from '../../components/index';

// post service
import { PostService } from '../../services/post.service';

// post components
import { PostGrid, RecentPosts } from '../../posts';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  imports: [
    Navbar,
    Calendar,
    Clock,
    Toolbar,
    Footer,
    Hero,
    PostGrid,
    RecentPosts,
  ],
})
export class Homepage {
  private readonly postService = inject(PostService);

  // fetches the last 5 posts that were created
  public readonly recentPosts = toSignal(
    this.postService.getRecentlyCreatedPosts(),
    { initialValue: [] },
  )
}
