import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// material components
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-tags',
  templateUrl: './post-tags.html',
  styleUrl: './post-tags.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChipsModule, MatIconModule],
})
export class PostTags {
  @Input() tags: string[] = [];
}
