import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FirestoreService, Setup } from '../services/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-setup-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  styles: [
    `:host { display:block; padding:12px; }
    .toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px }
    .list-card { display:flex; align-items:center; justify-content:space-between; padding:12px; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.04); cursor:pointer; transition:box-shadow .12s ease, transform .06s ease; }
    .list-card:hover { box-shadow:0 6px 18px rgba(0,0,0,0.08); transform:translateY(-2px); }
    .meta { color:rgba(0,0,0,0.65); font-size:13px }
    .actions button { margin-left:8px }
    .summary { font-size:13px; color:#333; margin-top:6px }
    .small { font-size:12px; color:rgba(0,0,0,0.55) }
    `
  ],
  template: `
    <section>
      <div class="toolbar">
        <div>
          <h2 style="margin:0">Saved Setups</h2>
          <div class="small">Recent guitar setups and repair notes</div>
        </div>
        <div>
          <button pButton type="button" label="New Setup" icon="pi pi-plus" class="p-button-sm" (click)="createNew()"></button>
        </div>
      </div>

      <ng-container *ngIf="(setups$ | async) as setups">
        <div *ngIf="setups.length === 0" class="small">No setups yet — create one.</div>

        <div style="display:grid;gap:8px;margin-top:8px">
          <div *ngFor="let s of setups" (click)="open(s)" class="list-card">
            <div style="flex:1;">
              <div style="display:flex;align-items:center;gap:12px">
                <div style="width:44px;height:44px;border-radius:6px;background:#f7f7f9;display:flex;align-items:center;justify-content:center;font-weight:700;color:#ef6c00">MG</div>
                <div>
                  <div style="font-weight:700">{{ s.name || '—' }}</div>
                  <div class="meta">{{ (s.createdAt?.toDate && s.createdAt.toDate()) ? (s.createdAt.toDate() | date:'medium') : '' }}</div>
                  <div class="small">{{ makeModel(s) }}</div>
                </div>
              </div>
              <div class="summary">{{ summary(s) }}</div>
            </div>

            <div class="actions" style="display:flex;align-items:center">
              <button pButton type="button" icon="pi pi-pencil" class="p-button-text p-button-plain" (click)="edit($event, s)"></button>
              <button pButton type="button" icon="pi pi-trash" class="p-button-text p-button-plain" (click)="remove($event, s)"></button>
            </div>
          </div>
        </div>
      </ng-container>
    </section>
  `
})
export class SetupListComponent {
  setups$: Observable<Setup[]>;

  constructor(private fs: FirestoreService, private router: Router) {
    this.setups$ = this.fs.listSetups();
  }

  createNew() {
    this.router.navigate(['/new']);
  }

  open(s: Setup) {
    if (!s.id) return;
    this.router.navigate(['/setup', s.id]);
  }

  edit(e: Event, s: Setup) {
    e.stopPropagation();
    if (!s.id) return;
    this.router.navigate(['/setup', s.id]);
  }

  async remove(e: Event, s: Setup) {
    e.stopPropagation();
    if (!s.id) return;
    if (!confirm('Delete this setup?')) return;
    await this.fs.deleteSetup(s.id);
  }

  // Create a short one-line summary to show in the list card
  summary(s: Setup) {
    try {
      const form = (s as any).form ? (s as any).form : s;
      const m = form.measurements || {};
      const fr = m.fretboardRadius?.received || m.fretboardRadius?.initial || '';
      const lowE = m.lowEAction12th?.received || m.lowEAction12th?.initial || m.stringsAtSaddles?.lowE?.received || '';
      const note = (form.notes || '').split('\n')[0] || '';
      const parts = [] as string[];
      const title = [form.manufacturer, form.model].filter(Boolean).join(' ');
      if (title) parts.unshift(title);
      if (fr) parts.push(`Radius: ${fr}`);
      if (lowE) parts.push(`LowE: ${lowE}`);
      if (note) parts.push(note.length > 40 ? note.slice(0, 40) + '…' : note);
      return parts.join(' • ');
    } catch (e) {
      return '';
    }
  }

  makeModel(s: Setup) {
    try {
      const form = (s as any).form ? (s as any).form : s;
      const parts = [form.manufacturer, form.model, form.color].filter(Boolean);
      return parts.join(' — ');
    } catch (e) {
      return '';
    }
  }
}
