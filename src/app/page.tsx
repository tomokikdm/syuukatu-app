// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/dashboard'); // ログイン済みならダッシュボードへ
      } else {
        router.replace('/login'); // 未ログインならログインページへ
      }
    });

    return () => unsub();
  }, [router]);

  return null; // 表示せずリダイレクトのみ
}
