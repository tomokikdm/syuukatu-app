"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function CompanyPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [uid, setUid] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);
  const [customFields, setCustomFields] = useState<{ label: string; value: string }[]>([]);
  const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "users", uid, "companies", id), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setCompany(data);
        setCustomFields(data.customFields || []);
      }
    });
    return () => unsub();
  }, [uid]);

  const handleChange = (key: string, value: string) => {
    const updated = { ...company, [key]: value };
    setCompany(updated);
    if (uid) {
      updateDoc(doc(db, "users", uid, "companies", id), updated);
    }
  };

  const updateField = (index: number, key: "label" | "value", value: string) => {
    const updated = [...customFields];
    updated[index][key] = value;
    setCustomFields(updated);
    if (uid) {
      updateDoc(doc(db, "users", uid, "companies", id), {
        ...company,
        customFields: updated,
      });
    }
  };

  const handleAddField = () => {
    const updated = [...customFields, { label: "", value: "" }];
    setCustomFields(updated);
    if (uid) {
      updateDoc(doc(db, "users", uid, "companies", id), {
        ...company,
        customFields: updated,
      });
    }
  };

  const handleDeleteField = (index: number) => {
    const confirmed = window.confirm("この項目を削除してもよろしいですか？");
    if (!confirmed) return;
    const updated = [...customFields];
    updated.splice(index, 1);
    setCustomFields(updated);
    if (uid) {
      updateDoc(doc(db, "users", uid, "companies", id), {
        ...company,
        customFields: updated,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-900 to-gray-900 text-white px-4 py-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-left">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-blue-200 underline hover:text-blue-100"
          >
            ← 企業一覧ページに戻る
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center">
          {company?.name ? `${company.name} に関する情報を集めて整理・保管しよう！` : "企業情報"}
        </h1>

        <div className="text-center">
          <button
            onClick={handleAddField}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-blue-600 hover:scale-[1.02] transition"
          >
            ＋ 項目を追加
          </button>
        </div>

        <div className="space-y-4">
          {[{ key: "ceo", label: "社長名", value: company?.ceo || "" }, { key: "industry", label: "業界", value: company?.industry || "" }].map((item) => (
            <div key={item.key} className="bg-[#1c1c2e] p-4 rounded-xl shadow-md space-y-2">
              <p className="text-sm text-gray-300 font-semibold">{item.label}</p>
              <textarea
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder={`${item.label}を入力してください`}
                className="w-full p-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
              />
            </div>
          ))}

          {customFields.map((field, i) => (
            <div key={i} className="bg-[#1c1c2e] p-4 rounded-xl shadow-md relative space-y-2">
              <div className="absolute top-3 right-4 space-x-3 text-sm">
                <button
                  onClick={() => setEditingLabelIndex(editingLabelIndex === i ? null : i)}
                  className="text-blue-300 hover:underline"
                >
                  {editingLabelIndex === i ? "完了" : "編集"}
                </button>
                <button
                  onClick={() => handleDeleteField(i)}
                  className="text-red-400 hover:underline"
                >
                  削除
                </button>
              </div>
              {editingLabelIndex === i ? (
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="項目名を設定して”完了”を押しましょう"
                  value={field.label}
                  onChange={(e) => updateField(i, "label", e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-300 font-semibold">
                  {field.label || "未設定（右の”編集”から設定）"}
                </p>
              )}
              <textarea
                className="w-full p-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none"
                placeholder={field.label ? `${field.label}を入力してください` : "内容を入力してください"}
                value={field.value}
                onChange={(e) => updateField(i, "value", e.target.value)}
                rows={1}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
