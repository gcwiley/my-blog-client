import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription, interval } from 'rxjs';

// angular material
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.html',
  styleUrl: './clock.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatToolbarModule, MatChipsModule],
})
export class Clock implements OnInit, OnDestroy {
  public currentTime = signal(new Date())
  private timeSubscription: Subscription | null = null;

  // define time zones in an array
  public readonly timeZones = [
    { label: 'Local', offset: '' },
    { label: 'Zulu', offset: 'UTC' },
    { label: 'Tel Aviv', offset: 'Asia/Jerusalem' },
    { label: 'Kyiv', offset: 'Europe/Kyiv' },
  ];

  // set up the clock update interval of 1 second
  public ngOnInit(): void {
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime.set(new Date())
    });
  }

  // clean up the subscription when the component is destroyed
  public ngOnDestroy(): void {
    this.timeSubscription?.unsubscribe();
  }
}
