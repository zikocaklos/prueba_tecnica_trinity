import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="classes" class="inline-flex rounded-full px-3 py-1 text-xs font-semibold">
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: 'success' | 'warning' | 'danger' | 'info' | 'default' = 'default';

  get classes(): string {
    const map: Record<string, string> = {
      success: 'bg-emerald-100 text-emerald-800',
      warning: 'bg-amber-100 text-amber-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-sky-100 text-sky-800',
      default: 'bg-slate-100 text-slate-800',
    };
    return map[this.variant];
  }
}
