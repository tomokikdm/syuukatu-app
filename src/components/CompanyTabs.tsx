'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: '企業分析', href: (id: string) => `/company/${id}` },
  { label: '面接対策', href: (id: string) => `/company/${id}/interview` },
  { label: '自己PRなど', href: (id: string) => `/company/${id}/prep` },
];

export default function CompanyTabs({ id }: { id: string }) {
  const pathname = usePathname();
  const [companyName, setCompanyName] = useState('企業');

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, 'users', 'YOUR_UID', 'companies', id));
      if (snap.exists()) {
        setCompanyName(snap.data().name || '企業');
      }
    };
    fetch();
  }, [id]);

  return (
    <>
      <nav className="text-sm text-gray-400 mb-3">
        <Link href="/dashboard" className="underline hover:text-blue-400">企業一覧</Link>
        <span className="mx-1">&gt;</span>
        <span>{companyName}</span>
      </nav>

      <div className="flex gap-6 mb-1 border-b pb-2 items-end">
        {tabs.map((tab) => {
          const href = tab.href(id);
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`pb-1 transition-colors hover:text-blue-300 ${isActive ? 'font-bold text-blue-300 border-b-2 border-blue-300' : 'text-white'}`}
            >
              {tab.label}
            </Link>
          );
        })}
        <span className="text-sm text-gray-400 ml-4 relative -top-1">👈３つのページに飛べます</span>
      </div>
    </>
  );
}
