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
  styleUrls: ['./setup-form.component.scss'],
  template: `
    <p-card>
      <form [formGroup]="form" (ngSubmit)="save()">
        <h2>{{ isEdit ? 'Edit Setup' : 'New Setup' }}</h2>

        <div class="p-field" style="width:100%">
          <label for="name">Name</label>
          <input id="name" pInputText formControlName="name" required />
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
          <div class="p-field">
            <label for="manufacturer">Manufacturer</label>
            <input id="manufacturer" pInputText formControlName="manufacturer" />
          </div>
          <div class="p-field">
            <label for="model">Model</label>
            <input id="model" pInputText formControlName="model" />
          </div>
          <div class="p-field">
            <label for="color">Color / Finish</label>
            <input id="color" pInputText formControlName="color" />
          </div>
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

            <p-panel header="Outgoing">
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

            <p-panel header="Outgoing">
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
      manufacturer: [''],
      model: [''],
      color: [''],
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
        // Support both legacy documents that stored the form under `form` and
        // newer documents that store fields at the top level.
        const payload = (s as any).form ? (s as any).form : s;
        // Remove Firestore meta fields if present
        const { id, createdAt, updatedAt, version, ...clean } = payload;
        this.form.patchValue({
          name: clean.name ?? s.name ?? '',
          manufacturer: clean.manufacturer ?? '',
          model: clean.model ?? '',
          color: clean.color ?? '',
          phone: clean.phone ?? (s as any).phone ?? '',
          notes: clean.notes ?? ''
        });
        // patch the nested measurement & fretCondition groups if present
        if (clean.measurements) {
          this.form.get('measurements')?.patchValue(clean.measurements);
        }
        if (clean.fretCondition) {
          this.form.get('fretCondition')?.patchValue(clean.fretCondition);
        }
      });
    }
  }

  async save() {
    const val = this.form.value;
    // Persist the form as a top-level document to match the JSON shape you provided.
    // The form value already contains name, phone, notes, measurements, fretCondition.
    const payload: any = { ...val };
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
    // Try to open a new window/tab and write the printable HTML. Many browsers
    // block popups — if window.open returns null, fall back to an iframe-based
    // approach which tends to work better on mobile/Safari.
    let w: Window | null = null;
    try {
      w = window.open('', '_blank');
    } catch (e) {
      w = null;
    }

    if (w) {
      try {
        w.document.open();
        w.document.write(html);
        w.document.close();
      } catch (e) {
        console.warn('Could not write to new window, falling back to iframe', e);
      }

      const doPrint = () => {
        try {
          w && w.focus();
          w && w.print();
        } catch (err) {
          console.error('Print in popup failed', err);
        }
      };

      // Some browsers don't reliably fire onload for programmatically written windows,
      // so call print after a short delay as a fallback.
      w.onload = doPrint;
      setTimeout(doPrint, 700);
      return;
    }

    // Popup was blocked — create a hidden iframe, write the HTML there and print.
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = (iframe.contentWindow || iframe.contentDocument) as any;
      const idoc = doc.document || iframe.contentDocument;
      idoc.open();
      idoc.write(html);
      idoc.close();

      const doIframePrint = () => {
        try {
          (iframe.contentWindow as Window).focus();
          (iframe.contentWindow as any).print();
        } catch (err) {
          console.error('Iframe print failed', err);
          alert('Print failed. Please try using your browser\'s Print command.');
        } finally {
          // remove iframe after a short delay to ensure print started
          setTimeout(() => {
            try { document.body.removeChild(iframe); } catch (_) {}
          }, 1000);
        }
      };

      setTimeout(doIframePrint, 700);
      return;
    } catch (err) {
      console.error('Print fallback failed', err);
      alert('Unable to open print preview. Please use your browser\'s Print command.');
    }
  }

  private buildPrintableHtml(val: any) {
  const esc = (s: any) => (s === null || s === undefined ? '' : String(s));

  // Table rows for measurements
  const measurements = val.measurements || {};
  const measurementRows = [
    { label: 'Fretboard Radius', key: 'fretboardRadius' },
    { label: 'High E String Gauge', key: 'highEStringGauge' },
    { label: 'Low E String Gauge', key: 'lowEStringGauge' },
    { label: 'Neck Relief @8th', key: 'neckRelief8th' },
    { label: 'Low E Action @12th', key: 'lowEAction12th' },
    { label: 'High E Action @12th', key: 'highEAction12th' }
  ].map(m => `
    <tr>
      <td>${m.label}</td>
      <td>${esc(measurements[m.key]?.received)}</td>
      <td>${esc(measurements[m.key]?.initial)}</td>
    </tr>
  `).join('');

  // Table rows for string heights
  const strings = measurements.stringsAtSaddles || {};
  const stringRows = this.stringNames.map(s => {
    const key = this.sKey(s);
    return `
      <tr>
        <td>${s}</td>
        <td>${esc(strings[key]?.received)}</td>
        <td>${esc(strings[key]?.initial)}</td>
      </tr>
    `;
  }).join('');

  // Frets affected
  const affected = val.fretCondition?.affectedFrets || {};
  const affectedList = Object.keys(affected)
    .filter(k => affected[k])
    .map(k => k.replace('fret', '').replace(/^0+/, ''))
    .join(', ') || 'None';

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Setup Summary - ${esc(val.name)}</title>
      <style>
        @page { margin: 20mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial; color:#222; margin:0; padding:0; }
        .container { max-width: 800px; margin: auto; padding: 12mm; }
        h1 { font-size: 20px; margin-bottom: 8px; }
        h2 { font-size: 16px; margin: 12px 0 6px 0; border-bottom: 1px solid #ccc; padding-bottom:2px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align:left; }
        th { background: #f2f2f2; }
        .section { margin-bottom: 16px; }
        .footer { font-size: 12px; color:#555; margin-top: 20px; }
      </style>
    </head>
    <body>
  <div class="container">
  <h1>McCoy Guitars Setup</h1>
  <div style="margin-bottom:6px"><strong>Name:</strong> ${esc(val.name)} &nbsp;&nbsp; <strong>Phone:</strong> ${esc(val.phone)}</div>
  <div style="margin-bottom:10px"><strong>Manufacturer:</strong> ${esc(val.manufacturer)} &nbsp;&nbsp; <strong>Model:</strong> ${esc(val.model)} &nbsp;&nbsp; <strong>Color:</strong> ${esc(val.color)}</div>

        <div class="section">
          <h2>Measurements</h2>
          <table>
            <thead>
              <tr><th>Measurement</th><th>Received</th><th>Outgoing</th></tr>
            </thead>
            <tbody>${measurementRows}</tbody>
          </table>
        </div>

        <div class="section">
          <h2>String Height at Saddles</h2>
          <table>
            <thead>
              <tr><th>String</th><th>Received</th><th>Outgoing</th></tr>
            </thead>
            <tbody>${stringRows}</tbody>
          </table>
        </div>

        <div class="section">
          <h2>Fret Condition</h2>
          <table>
            <tr><td>High Frets</td><td>${val.fretCondition?.highFrets ? 'Yes' : 'No'}</td></tr>
            <tr><td>Affected Frets</td><td>${affectedList}</td></tr>
            <tr><td>Marks / Notes</td><td>${esc(val.fretCondition?.marksNotes)}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Notes / Tuning / Details</h2>
          <div>${esc(val.notes)}</div>
        </div>

        <div class="footer">Printed: ${new Date().toLocaleString()}</div>
      </div>
    </body>
  </html>`;
}


  cancel() {
    this.router.navigate(['/']);
  }
}
