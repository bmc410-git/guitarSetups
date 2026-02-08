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
  template: `
    <section>
      <div class="p-d-flex p-jc-between p-ai-center p-mb-3">
        <h2>Saved Setups</h2>
        <button pButton type="button" label="New Setup" icon="pi pi-plus" class="p-button-sm" (click)="createNew()"></button>
      </div>

      <ng-container *ngIf="(setups$ | async) as setups">
        <div *ngFor="let s of setups" class="p-card p-mb-2 p-p-3" (click)="open(s)" style="cursor:pointer">
          <div class="p-d-flex p-jc-between p-ai-center">
            <div>
              <div style="font-weight:600">{{ s.name }}</div>
              <div style="font-size:12px;color:rgba(0,0,0,0.6)">Saved {{ s.createdAt?.toDate ? s.createdAt.toDate() : '' }}</div>
            </div>
            <div class="p-d-flex p-ai-center">
              <button pButton type="button" icon="pi pi-pencil" class="p-button-text p-button-plain p-mr-2" (click)="edit($event, s)"></button>
              <button pButton type="button" icon="pi pi-trash" class="p-button-text p-button-plain" (click)="remove($event, s)"></button>
            </div>
          </div>
        </div>
        <p *ngIf="setups.length === 0">No setups yet — create one.</p>
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
}
