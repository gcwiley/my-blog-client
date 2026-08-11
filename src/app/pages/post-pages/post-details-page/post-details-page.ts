import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// angular material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

// shared components
import { Navbar, Clock, Footer } from '../../../components';

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
  ],
})
export class PostDetailsPage {
  private readonly router = inject(Router);

  public goBack(): void {
    this.router.navigate(['/posts']);
  }
}
