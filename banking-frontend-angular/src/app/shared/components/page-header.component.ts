import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="space-y-6 rounded-2xl border border-brand-border bg-white p-6 shadow-soft">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          @if (eyebrow) {
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{{ eyebrow }}</p>
          }
          <h1 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{{ title }}</h1>
          @if (description) {
            <p class="mt-3 text-sm leading-7 text-slate-500">{{ description }}</p>
          }
        </div>
        @if (actions) {
          <div class="flex flex-wrap items-center gap-3">
            <ng-content select="[actions]" />
          </div>
        }
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() description = '';
  @Input() actions = false;
}
