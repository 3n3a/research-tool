import { Component, computed, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { DynamicFormComponent } from "../../components/dynamic-form/dynamic-form.component";
import { ErrorDisplayComponent } from "../../components/error-display/error-display.component";
import { QuestionBase } from '../../types/question-base';
import { TextboxQuestion } from '../../types/question-textbox';
import { IpService } from '../../services/ip/ip.service';
import { Router, RouterLink } from '@angular/router';
import { IpAddr } from '../../types/ip-addr';
import { IpForm } from '../../types/ip-form';
import { CardModule } from 'primeng/card';
import { IpInfoComponent } from '../../components/ip-info/ip-info.component';

@Component({
  selector: 'pages-ip',
  imports: [
    DynamicFormComponent,
    ErrorDisplayComponent,
    IpInfoComponent,
    CardModule,
    RouterLink,
  ],
  templateUrl: './ip.component.html',
  styleUrl: './ip.component.scss'
})
export class IpComponent implements OnInit {
  qQuery = signal<string | undefined>(undefined)

  @Input()
  set query(query: string) {
    this.qQuery.set(query);
  }

  questions: Signal<QuestionBase<string>[]> = computed(() => [
    new TextboxQuestion({
      key: 'query',
      label: 'IP-Adress',
      required: true, 
      order: 1,
      value: this.qQuery(),
    }),
  ])

  ipAnswer: WritableSignal<IpAddr | undefined> = signal(undefined);
  ipAnswersLoading: WritableSignal<boolean> = signal(false);

  errorMessage = signal<string | null>(null);

  constructor(private ipService: IpService, private router: Router) {}

  /**
   * Fall back to the visitor's own address, but only when none was asked for.
   * Has to be ngOnInit: the router binds `query` after construction, so a
   * constructor check would always look empty and overwrite the requested
   * address, breaking every link into this page.
   */
  ngOnInit() {
    if (this.qQuery()) {
      return;
    }

    this.ipService.currentIp().subscribe({
      next: (currentIp: string) => {
        // Setting the question is enough, the form submits a complete query.
        this.qQuery.set(currentIp.trim());
      },
      error: (error) => {
        this.errorMessage.set((error as Error).message)
      }
    })
  }

  onSubmit(payload: IpForm) {
    this.ipAnswersLoading.set(true);
    
    this.qQuery.set(payload.query);

    this.router.navigate([], {
      queryParams: {
        query: this.qQuery(),
      },
      queryParamsHandling: 'replace',
    });

    this.ipService
      .queryIpInfo(payload.query)
      .subscribe({
        next: (ipAnswer) => {
          this.ipAnswer.set(ipAnswer);
          this.ipAnswersLoading.set(false);
          this.errorMessage.set(null);
        },
        error: (error) => {
          this.ipAnswersLoading.set(false);
          this.errorMessage.set((error as Error).message)
        }
      })
  }
}
