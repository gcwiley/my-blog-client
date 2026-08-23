import {
  ChangeDetectionStrategy,
  Component,
  model,
} from '@angular/core';
import { RouterModule } from '@angular/router';

// angular material imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SortDirection } from '@angular/material/sort';

// types for post view mode and sort field 
// defines the possible view modes and sort fields for posts
export type PostViewMode = 'grid' | 'table';
export type PostSortField = 'createdAt' | 'title' | 'date';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTooltipModule,
  ],
})
export class Toolbar {
  // reactive state for toolbar controls 
  public viewMode = model<PostViewMode>('grid'); // current view mode of the posts 
  public sortField = model<PostSortField>('createdAt'); // current field by which posts are sorted
  public sortOrder = model<SortDirection>('desc'); // current sort order of the posts
}
