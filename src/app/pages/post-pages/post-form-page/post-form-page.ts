import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

// material components
import { MatIconModule } from '@angular/material/icon';

// shared components
import { Navbar, Clock, Footer } from '../../../components';

// post service
import { PostService } from '../../../services/post.service';

// post components
import { PostForm, RecentPosts } from '../../../posts';

// can-deactivate guard
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';

@Component({
  selector: 'app-post-form-page',
  templateUrl: './post-form-page.html',
  styleUrl: './post-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Navbar,
    Clock,
    Footer,
    PostForm,
    RecentPosts,
    RouterModule,
    MatIconModule,
  ],
})
export class PostFormPage implements OnInit, CanComponentDeactivate {
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  public readonly isEditMode = signal(false);

  @ViewChild(PostForm) private postFormComponent!: PostForm;

  // asks the child component whether it has unsaved changes
  public hasUnsavedChanges(): boolean {
    return this.postFormComponent?.hasUnsavedChanges() ?? false;
  }

  // fetches the last 5 posts that were created
  public readonly recentPosts = toSignal(
    this.postService.getRecentlyCreatedPosts(),
    { initialValue: [] },
  );

  // check if the route is in edit mode when the component is initialized
  public ngOnInit(): void {
    this.isEditMode.set(this.route.snapshot.paramMap.has('id'));
  }
}
