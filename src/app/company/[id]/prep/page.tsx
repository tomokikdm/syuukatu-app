"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function PrepPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [selfPR, setSelfPR] = useState("");
  const [motivation, setMotivation] = useState("");
  const [gakuchika, setGakuchika] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const loadData = async () => {
      const snap = await getDoc(doc(db, "users", uid, "companies", id));
      if (snap.exists()) {
        const data = snap.data();
        setCompanyName(data.name || "");
        setSelfPR(data.selfPR || "");
        setMotivation(data.motivation || "");
        setGakuchika(data.gakuchika || "");
      }
    };
    loadData();
  }, [uid, id]);

  const autoSave = (field: "selfPR" | "motivation" | "gakuchika", value: string) => {
    if (!uid) return;
    updateDoc(doc(db, "users", uid, "companies", id), { [field]: value });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-900 to-gray-900 text-white px-4 py-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* 戻るボタン */}
        <div className="text-left">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-blue-200 underline hover:text-blue-100"
          >
            ← 企業一覧ページに戻る
          </button>
        </div>


        {/* タイトル */}
        <header className="text-center">
          <h1 className="text-xl font-bold mb-4">
            {companyName
              ? `${companyName} に沿った 志望動機・自己PR・ガクチカ を完成させよう！`
              : "志望動機・自己PR・ガクチカエピソード"}
          </h1>
        </header>

        {/* 自己PR */}
        <section className="bg-[#1E293B] p-6 rounded-2xl shadow-md space-y-2">
          <h2 className="text-white font-semibold text-lg">自己PR</h2>
          <textarea
            className="w-full p-3 bg-[#334155] text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px]"
            value={selfPR}
            onChange={(e) => {
              setSelfPR(e.target.value);
              autoSave("selfPR", e.target.value);
            }}
            placeholder="この企業に伝えたいあなたの強みやエピソードを書いてください"
          />
        </section>

        {/* 志望動機 */}
        <section className="bg-[#1E293B] p-6 rounded-2xl shadow-md space-y-2">
          <h2 className="text-white font-semibold text-lg">志望動機</h2>
          <textarea
            className="w-full p-3 bg-[#334155] text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px]"
            value={motivation}
            onChange={(e) => {
              setMotivation(e.target.value);
              autoSave("motivation", e.target.value);
            }}
            placeholder="この企業を志望する理由や将来やりたいことを記入"
          />
        </section>

        {/* ガクチカ */}
        <section className="bg-[#1E293B] p-6 rounded-2xl shadow-md space-y-2">
          <h2 className="text-white font-semibold text-lg">ガクチカ</h2>
          <textarea
            className="w-full p-3 bg-[#334155] text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px]"
            value={gakuchika}
            onChange={(e) => {
              setGakuchika(e.target.value);
              autoSave("gakuchika", e.target.value);
            }}
            placeholder="この企業に合うガクチカエピソードを完成させよう"
          />
        </section>
      </div>
    </main>
  );
}
