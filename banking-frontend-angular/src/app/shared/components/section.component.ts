import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [NgClass],
  template: `
    <section [ngClass]="className" class="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      @if (title || description) {
        <div class="mb-6">
          @if (title) {
            <h2 class="text-lg font-semibold text-slate-950">{{ title }}</h2>
          }
          @if (description) {
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ description }}</p>
          }
        </div>
      }
      <ng-content />
    </section>
  `,
})
export class SectionComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() className = '';
}
