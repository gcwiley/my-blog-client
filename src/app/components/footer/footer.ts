import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class Footer {
  public readonly version = VERSION.full;
  public readonly year = new Date().getFullYear();
}
