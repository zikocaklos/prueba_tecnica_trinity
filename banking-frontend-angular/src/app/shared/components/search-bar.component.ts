import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="relative block w-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input
        type="text"
        [value]="value"
        (input)="onChange.emit($any($event.target).value)"
        [placeholder]="placeholder"
        [attr.aria-label]="ariaLabel"
        class="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1D4ED8] focus:bg-white"
      />
    </label>
  `,
})
export class SearchBarComponent {
  @Input() value = '';
  @Input() placeholder = 'Buscar...';
  @Input() ariaLabel = 'Buscar';
  @Output() onChange = new EventEmitter<string>();
}
