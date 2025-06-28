"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("ゲスト");
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || "ユーザー");
        setUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = onSnapshot(
      collection(db, "users", uid, "companies"),
      (snap) => {
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCompanies(list);
      }
    );
    return () => unsubscribe();
  }, [uid]);

  const handleAdd = async () => {
    if (!name.trim() || !uid) return;
    await addDoc(collection(db, "users", uid, "companies"), {
      name,
      ceo: "",
      industry: "",
      establishedYear: "",
      desireLevel: "",
      requiredSkills: "",
      salary: "",
      customFields: [],
    });
    setName("");
  };

  const handleDelete = async (id: string) => {
    if (!uid) return;
    const confirmed = window.confirm("この企業を本当に削除してもよろしいですか？");
    if (!confirmed) return;
    await deleteDoc(doc(db, "users", uid, "companies", id));
  };

  const handleEdit = async (id: string) => {
    if (!uid) return;
    const newName = prompt("新しい企業名を入力してください");
    if (!newName) return;
    await updateDoc(doc(db, "users", uid, "companies", id), { name: newName });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-900 to-gray-900 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* タイトル */}
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">あなたの企業一覧リスト</h1>
          <p className="text-sm text-gray-300">ようこそ、{userName}さん</p>
        </header>

        {/* 操作ガイドカード */}
        <section className="bg-[#1E293B] p-5 rounded-2xl shadow-md text-sm text-gray-300">
          <p className="mb-1 font-semibold text-white">📌 操作方法</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>企業名を入力して「企業を追加」で登録できます</li>
            <li>企業名をクリックすると詳細ページに移動します</li>
            <li>「編集」で名前変更、「削除」で企業を削除します</li>
          </ul>
        </section>

        {/* 企業追加フォーム */}
        <div className="flex gap-2 items-center">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="企業名を入力"
            className="flex-1 p-3 bg-[#334155] text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition"
          >
            企業を追加
          </button>
        </div>

        {/* 企業リスト */}
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-[#1E293B] p-4 rounded-2xl shadow flex justify-between items-center hover:shadow-lg transition"
            >
              <Link
                href={`/company/${company.id}`}
                className="text-lg text-blue-400 hover:underline font-semibold"
              >
                {company.name}
              </Link>
              <div className="space-x-3 text-sm">
                <button
                  onClick={() => handleEdit(company.id)}
                  className="text-green-400 hover:underline"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="text-red-400 hover:underline"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
