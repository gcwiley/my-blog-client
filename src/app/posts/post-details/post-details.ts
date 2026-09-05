import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

// material components
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// post interface
import { Post } from '../../types/post.interface'

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.html',
  styleUrl: './post-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatListModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class PostDetails {
  public readonly post = input.required<Post>();
}
