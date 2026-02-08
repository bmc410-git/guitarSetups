import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-setup-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputTextareaModule, ButtonModule, CardModule, CheckboxModule, PanelModule],
  styles: [
    `:host ::ng-deep .p-panel { border-radius: 10px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); }
:host ::ng-deep .p-panel .p-panel-header { background: #fafafa; font-weight: 600; padding: 0.6rem 1rem; }
:host ::ng-deep .p-panel .p-panel-content { padding: 0.6rem 1rem; }
.p-field, .field { display: flex; flex-direction: column; gap: 6px; }
.p-field input[pInputText], .field input[pInputText], textarea[pInputTextarea], .p-field textarea[pInputTextarea] {
  width: 100%; box-sizing: border-box; padding: 0.6rem; border-radius: 8px; border: 1px solid #dcdcdc; font-size: 0.95rem;
}
label { font-size: 0.92rem; color: #222; }
@media (max-width: 720px) {
  :host ::ng-deep .p-panel { border-radius: 6px; }
}
`] ,
  template: `
    <p-card>
      <form [formGroup]="form" (ngSubmit)="save()">
        <h2>{{ isEdit ? 'Edit Setup' : 'New Setup' }}</h2>

        <div class="p-field" style="width:100%">
          <label for="name">Name</label>
          <input id="name" pInputText formControlName="name" required />
        </div>

        <div class="p-field" style="width:100%">
          <label for="phone">Phone</label>
          <input id="phone" pInputText formControlName="phone" inputmode="tel" />
        </div>

        <div class="p-field" style="width:100%">
          <label for="notes">Notes / Tuning / Details</label>
          <textarea id="notes" pInputTextarea rows="4" formControlName="notes"></textarea>
        </div>

        <section style="margin-top:12px">
          <h3>Measurements</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <p-panel header="Received">
              <div style="display:grid;gap:12px;padding:8px 0">
                    <div class="field">
                      <label>Fretboard Radius</label>
                      <input pInputText [formControl]="getControl('measurements.fretboardRadius.received')" />
                    </div>
                <div class="field">
                  <label>High E string gauge</label>
                  <input pInputText [formControl]="getControl('measurements.highEStringGauge.received')" />
                </div>
                <div class="field">
                  <label>Low E string gauge</label>
                  <input pInputText [formControl]="getControl('measurements.lowEStringGauge.received')" />
                </div>
                <div class="field">
                  <label>Neck relief @ 8th</label>
                  <input pInputText [formControl]="getControl('measurements.neckRelief8th.received')" />
                </div>
                <div class="field">
                  <label>Low E action @12th</label>
                  <input pInputText [formControl]="getControl('measurements.lowEAction12th.received')" />
                </div>
                <div class="field">
                  <label>High E action @12th</label>
                  <input pInputText [formControl]="getControl('measurements.highEAction12th.received')" />
                </div>
              </div>
            </p-panel>

            <p-panel header="Initial / Completed">
              <div style="display:grid;gap:12px;padding:8px 0">
                <div class="field">
                  <label>Fretboard Radius</label>
                  <input pInputText [formControl]="getControl('measurements.fretboardRadius.initial')" />
                </div>
                <div class="field">
                  <label>High E string gauge</label>
                  <input pInputText [formControl]="getControl('measurements.highEStringGauge.initial')" />
                </div>
                <div class="field">
                  <label>Low E string gauge</label>
                  <input pInputText [formControl]="getControl('measurements.lowEStringGauge.initial')" />
                </div>
                <div class="field">
                  <label>Neck relief @ 8th</label>
                  <input pInputText [formControl]="getControl('measurements.neckRelief8th.initial')" />
                </div>
                <div class="field">
                  <label>Low E action @12th</label>
                  <input pInputText [formControl]="getControl('measurements.lowEAction12th.initial')" />
                </div>
                <div class="field">
                  <label>High E action @12th</label>
                  <input pInputText [formControl]="getControl('measurements.highEAction12th.initial')" />
                </div>
              </div>
            </p-panel>
          </div>
        </section>

        <section style="margin-top:12px">
          <h3>String Height at Saddles</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <p-panel header="Received">
              <div style="display:grid;gap:12px;padding:8px 0">
                <ng-container *ngFor="let s of stringNames">
                  <div class="field">
                    <label>{{s}}</label>
                    <input pInputText [formControl]="getControl('measurements.stringsAtSaddles.' + sKey(s) + '.received')" />
                  </div>
                </ng-container>
              </div>
            </p-panel>

            <p-panel header="Initial / Completed">
              <div style="display:grid;gap:12px;padding:8px 0">
                <ng-container *ngFor="let s of stringNames">
                  <div class="field">
                    <label>{{s}}</label>
                    <input pInputText [formControl]="getControl('measurements.stringsAtSaddles.' + sKey(s) + '.initial')" />
                  </div>
                </ng-container>
              </div>
            </p-panel>
          </div>
        </section>

        <section style="margin-top:12px">
          <h3>Fret & Condition Assessment</h3>
          <p-checkbox [formControl]="getControl('fretCondition.highFrets')" [binary]="true" label="High Frets"></p-checkbox>
          <div style="margin-top:8px">Affected Frets</div>
          <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:6px">
            <ng-container *ngFor="let n of frets">
              <p-checkbox [formControl]="getControl('fretCondition.affectedFrets.fret' + (n<10?('0'+n):n))" [binary]="true" [label]="(n < 10 ? '0' + n : ('' + n))"></p-checkbox>
            </ng-container>
          </div>
          <div style="margin-top:8px">
            <p-checkbox [formControl]="getControl('fretCondition.noticeableMarks')" [binary]="true" label="Noticeable Marks or Defects"></p-checkbox>
          </div>
          <div style="width:100%;margin-top:8px">
            <label>Marks / Defects Notes</label>
            <textarea pInputTextarea rows="3" [formControl]="getControl('fretCondition.marksNotes')"></textarea>
          </div>
        </section>

        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
          <button pButton type="button" class="p-button-outlined" (click)="cancel()">Cancel</button>
          <button pButton type="button" class="p-button-secondary" (click)="printPreview()">Print</button>
          <button pButton type="submit" class="p-button-success" [disabled]="form.invalid">Save</button>
        </div>
      </form>
    </p-card>
  `
})
export class SetupFormComponent implements OnInit {
  form: any;

  isEdit = false;
  id: string | null = null;
  stringNames = ['Low E', 'A', 'D', 'G', 'B', 'High E'];
  frets = Array.from({ length: 24 }).map((_, i) => i + 1);

  constructor(private fb: FormBuilder, private fs: FirestoreService, private route: ActivatedRoute, private router: Router) {
    // initialize the reactive form with nested groups (each measurement has received and initial values)
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      notes: [''],
      measurements: this.fb.group({
        fretboardRadius: this.fb.group({ received: [''], initial: [''] }),
        highEStringGauge: this.fb.group({ received: [''], initial: [''] }),
        lowEStringGauge: this.fb.group({ received: [''], initial: [''] }),
        neckRelief8th: this.fb.group({ received: [''], initial: [''] }),
        lowEAction12th: this.fb.group({ received: [''], initial: [''] }),
        highEAction12th: this.fb.group({ received: [''], initial: [''] }),
        stringsAtSaddles: this.fb.group({
          lowE: this.fb.group({ received: [''], initial: [''] }),
          A: this.fb.group({ received: [''], initial: [''] }),
          D: this.fb.group({ received: [''], initial: [''] }),
          G: this.fb.group({ received: [''], initial: [''] }),
          B: this.fb.group({ received: [''], initial: [''] }),
          highE: this.fb.group({ received: [''], initial: [''] })
        })
      }),
      fretCondition: this.fb.group({
        highFrets: [false],
        affectedFrets: this.fb.group(
          // create controls fret01..fret24
          (() => {
            const obj: any = {};
            for (let i = 0; i < 24; i++) {
              const n = i + 1;
              const key = 'fret' + (n < 10 ? '0' + n : n);
              obj[key] = [false];
            }
            return obj;
          })()
        ),
        noticeableMarks: [false],
        marksNotes: ['']
      })
    });
  }

  sKey(s: string) {
    if (s === 'Low E') return 'lowE';
    if (s === 'High E') return 'highE';
    return s;
  }

  // helper to fetch nested controls by path
  getControl(path: string) {
    return this.form.get(path);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.fs.getSetup(this.id).subscribe((s) => {
        if (!s) return;
        // patch the full form payload if present
        if (s.form) {
          this.form.patchValue(s.form);
        }
        // ensure top-level name/phone are patched as well
  this.form.patchValue({ name: s.name ?? '', phone: (s as any).phone ?? '' });
      });
    }
  }

  async save() {
    const val = this.form.value;
    // store the complete form object under `form`, keep name/phone/top-level fields
    const payload: any = { name: val.name ?? '', phone: val.phone ?? '', form: val };
    if (this.id) {
      await this.fs.updateSetup(this.id, payload);
    } else {
      await this.fs.createSetup(payload);
    }
    this.router.navigate(['/']);
  }

  // Build a printable HTML representation of the form and open the browser print preview
  printPreview() {
    const val = this.form.value;
    const html = this.buildPrintableHtml(val);
    const w = window.open('', '_blank', 'noopener');
    if (!w) {
      // fallback: print current window
      window.print();
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Wait for resources/styles to load then call print
    w.onload = () => {
      try {
        w.focus();
        w.print();
      } catch (e) {
        console.error('Print failed', e);
      }
    };
  }

  private buildPrintableHtml(val: any) {
    const esc = (s: any) => (s === null || s === undefined ? '' : String(s));
    const measurementRow = (label: string, recv: any, init: any) => `
      <tr>
        <td style="padding:6px;border:1px solid #eee">${label}</td>
        <td style="padding:6px;border:1px solid #eee">${esc(recv)}</td>
        <td style="padding:6px;border:1px solid #eee">${esc(init)}</td>
      </tr>`;

    const measurements = val.measurements || {};
    const rows = [
      measurementRow('Fretboard Radius', measurements.fretboardRadius?.received, measurements.fretboardRadius?.initial),
      measurementRow('High E gauge', measurements.highEStringGauge?.received, measurements.highEStringGauge?.initial),
      measurementRow('Low E gauge', measurements.lowEStringGauge?.received, measurements.lowEStringGauge?.initial),
      measurementRow('Neck relief @8th', measurements.neckRelief8th?.received, measurements.neckRelief8th?.initial),
      measurementRow('Low E action @12th', measurements.lowEAction12th?.received, measurements.lowEAction12th?.initial),
      measurementRow('High E action @12th', measurements.highEAction12th?.received, measurements.highEAction12th?.initial),
    ].join('\n');

    const strings = measurements.stringsAtSaddles || {};
    const stringRows = this.stringNames.map((s: string) => {
      const key = this.sKey(s);
      return `
        <tr>
          <td style="padding:6px;border:1px solid #eee">${s}</td>
          <td style="padding:6px;border:1px solid #eee">${esc(strings[key]?.received)}</td>
          <td style="padding:6px;border:1px solid #eee">${esc(strings[key]?.initial)}</td>
        </tr>`;
    }).join('\n');

    // Frets affected list
    const affected = val.fretCondition?.affectedFrets || {};
    const affectedList = Object.keys(affected).filter(k => affected[k]).map(k => k.replace('fret', '').replace(/^0+/, '')).join(', ') || 'None';

    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Print Setup - ${esc(val.name)}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial; color:#222; padding:20px }
            h1 { font-size:18px; margin-bottom:8px }
            table { border-collapse: collapse; width:100%; margin-bottom:12px }
            th, td { text-align:left }
            .section { margin-bottom: 14px }
            .meta { margin-bottom: 8px }
          </style>
        </head>
        <body>
          <h1>McCoy Guitars Setup</h1>
          <div class="meta"><strong>Name:</strong> ${esc(val.name)} &nbsp;&nbsp; <strong>Phone:</strong> ${esc(val.phone)}</div>
          <div class="section">
            <h3>Measurements</h3>
            <table>
              <thead><tr><th style="padding:6px;border:1px solid #eee">Measurement</th><th style="padding:6px;border:1px solid #eee">Received</th><th style="padding:6px;border:1px solid #eee">Initial / Completed</th></tr></thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>String Height at Saddles</h3>
            <table>
              <thead><tr><th style="padding:6px;border:1px solid #eee">String</th><th style="padding:6px;border:1px solid #eee">Received</th><th style="padding:6px;border:1px solid #eee">Initial / Completed</th></tr></thead>
              <tbody>
                ${stringRows}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Fret Condition</h3>
            <div><strong>High Frets:</strong> ${val.fretCondition?.highFrets ? 'Yes' : 'No'}</div>
            <div><strong>Affected Frets:</strong> ${affectedList}</div>
            <div style="margin-top:8px"><strong>Marks/Notes:</strong><div>${esc(val.fretCondition?.marksNotes)}</div></div>
          </div>

          <div class="section">
            <h3>Notes / Tuning / Details</h3>
            <div>${esc(val.notes)}</div>
          </div>
        </body>
      </html>`;

    return html;
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
