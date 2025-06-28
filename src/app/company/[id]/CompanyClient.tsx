'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function CompanyClient({ id }: { id: string }) {
  const [company, setCompany] = useState<any>(null);
  const [uid, setUid] = useState<string | null>(null);

  // 🔑 ユーザーの取得
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return () => unsub();
  }, []);

  // 🔄 Firestoreから企業データをリアルタイム取得
  useEffect(() => {
    if (!uid) return;

    const unsub = onSnapshot(doc(db, 'users', uid, 'companies', id), (snap) => {
      if (snap.exists()) {
        setCompany(snap.data());
      } else {
        console.log('No such document!');
      }
    });

    return () => unsub();
  }, [id, uid]);

  if (!company) {
    return <p className="text-gray-400">読み込み中...</p>;
  }


}
