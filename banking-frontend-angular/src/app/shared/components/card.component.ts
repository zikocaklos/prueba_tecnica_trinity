import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <section [ngClass]="className" class="rounded-2xl border border-brand-border bg-white p-6 shadow-soft">
      @if (title || description) {
        <div class="mb-6">
          @if (title) {
            <h2 class="text-lg font-semibold text-slate-950">{{ title }}</h2>
          }
          @if (description) {
            <p class="mt-2 text-sm leading-6 text-slate-500">{{ description }}</p>
          }
        </div>
      }
      <ng-content />
    </section>
  `,
})
export class CardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() className = '';
}
