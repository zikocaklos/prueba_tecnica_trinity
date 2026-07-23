import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-12">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1D4ED8]"></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {}
