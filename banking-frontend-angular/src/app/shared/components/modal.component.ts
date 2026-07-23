import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (open) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
        <div class="absolute inset-0" (click)="onClose.emit()"></div>
        <div [ngClass]="sizeClass" class="relative w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-25px_rgba(15,23,42,0.45)] sm:p-8">
          <button
            type="button"
            (click)="onClose.emit()"
            class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          @if (title) {
            <h3 class="pr-10 text-xl font-semibold text-slate-950">{{ title }}</h3>
          }
          <div class="mt-6">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() onClose = new EventEmitter<void>();

  get sizeClass(): string {
    const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };
    return sizes[this.size];
  }
}
