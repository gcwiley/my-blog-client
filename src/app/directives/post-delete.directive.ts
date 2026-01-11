import {
  Directive,
  HostListener,
  output,
  input,
  inject,
  DestroyRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap, catchError, finalize, EMPTY } from 'rxjs';

// angular material
import { MatSnackBar } from '@angular/material/snack-bar';

// post service
import { PostService } from '../services/post.service';

import {
  CustomConfirmDialog,
  CustomConfirmDialogService,
} from '../services/custom-confirm-dialog.service';

@Directive({
  selector: '[appPostDelete]',
})
export class PostDeleteDirective {
  public id = input.required<string>({ alias: 'appPostDelete' });

  public deleted = output<string>();

  private postService = inject(PostService);
  private confirm = inject(CustomConfirmDialogService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  private isDeleting = signal(false); // signal state
  private readonly snackBarDuration = 5000;

  @HostListener('click')
  public onClick(): void {
    if (this.isDeleting()) return; // read signal
    this.isDeleting.set(true); // set signal

    this.confirm
      .openCustomConfirmDialog(CustomConfirmDialog.Delete)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((confirmed) => !!confirmed),
        switchMap(() => this.postService.deletePostById(this.id())),
        catchError((error) => {
          console.error('Error deleting post:', error);
          this.snackBar.open('Unable to delete post.', 'Close', {
            duration: this.snackBarDuration,
          });
          return EMPTY;
        }),
        finalize(() => this.isDeleting.set(false)), // reset signal
      )
      .subscribe(() => {
        this.deleted.emit(this.id());
        this.snackBar.open('Post successfully deleted.', 'Close', {
          duration: this.snackBarDuration,
        });
      });
  }
}
