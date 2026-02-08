import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { db } from '../../main';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

export interface Setup {
  id?: string;
  name: string;
  createdAt?: any;
  updatedAt?: any;
  form: any;
  version?: number;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private collectionPath = 'setups';

  constructor() {}

  createSetup(setup: Partial<Setup>) {
    const col = collection(db, this.collectionPath);
    return addDoc(col, { ...setup, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  updateSetup(id: string, partial: Partial<Setup>) {
    const d = doc(db, this.collectionPath, id);
    return setDoc(d, { ...partial, updatedAt: serverTimestamp() }, { merge: true });
  }

  listSetups(): Observable<Setup[]> {
    return new Observable((observer) => {
      const q = query(collection(db, this.collectionPath), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Setup));
          observer.next(items);
        },
        (err) => observer.error(err)
      );
      return () => unsub();
    });
  }

  getSetup(id: string): Observable<Setup | null> {
    return new Observable((observer) => {
      const d = doc(db, this.collectionPath, id);
      const unsub = onSnapshot(
        d,
        (snap) => {
          if (!snap.exists()) {
            observer.next(null);
            return;
          }
          observer.next({ id: snap.id, ...snap.data() } as Setup);
        },
        (err) => observer.error(err)
      );
      return () => unsub();
    });
  }

  async deleteSetup(id: string) {
    const d = doc(db, this.collectionPath, id);
    return deleteDoc(d);
  }

  async fetchOnce(id: string) {
    const d = doc(db, this.collectionPath, id);
    const snap = await getDoc(d);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Setup;
  }
}
