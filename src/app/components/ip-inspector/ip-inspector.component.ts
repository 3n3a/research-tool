import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DrawerModule } from 'primeng/drawer';
import { IpService } from '../../services/ip/ip.service';
import { IpAddr } from '../../types/ip-addr';
import { ErrorDisplayComponent } from '../error-display/error-display.component';
import { IpInfoComponent } from '../ip-info/ip-info.component';

/**
 * Looks up an ip address in place, so a dns answer can be inspected without
 * leaving the page it was found on.
 */
@Component({
  selector: 'comp-ip-inspector',
  imports: [DrawerModule, RouterLink, IpInfoComponent, ErrorDisplayComponent],
  templateUrl: './ip-inspector.component.html',
  styleUrl: './ip-inspector.component.scss',
})
export class IpInspectorComponent {
  readonly ip = input<string | null>(null);
  readonly closed = output<void>();

  readonly info = signal<IpAddr | undefined>(undefined);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  constructor(private ipService: IpService) {
    effect(() => {
      const ip = this.ip();

      this.info.set(undefined);
      this.errorMessage.set(null);
      this.isLoading.set(!!ip);
      if (!ip) {
        return;
      }

      untracked(() =>
        this.ipService.queryIpInfo(ip).subscribe({
          next: (info) => {
            // A newer address may have been requested in the meantime.
            if (this.ip() !== ip) {
              return;
            }
            this.info.set(info);
            this.isLoading.set(false);
          },
          error: (error) => {
            if (this.ip() !== ip) {
              return;
            }
            this.isLoading.set(false);
            this.errorMessage.set((error as Error).message);
          },
        }),
      );
    });
  }

  onVisibleChange(visible: boolean) {
    if (!visible) {
      this.closed.emit();
    }
  }
}
