import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center text-slate-600">
      <p class="text-lg font-semibold text-slate-900">{{ title }}</p>
      @if (description) {
        <p class="mt-2 text-sm leading-6">{{ description }}</p>
      }
      @if (action) {
        <div class="mt-6 flex justify-center">
          <ng-content select="[action]" />
        </div>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() action = false;
}
