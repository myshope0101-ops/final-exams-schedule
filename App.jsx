import { useState, useRef, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

// ── Firebase config ── Replace with your own from Firebase Console ──────────
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = "azzazygala9@gmail.com";
const DEFAULT_TEMPLATE_DOC = "default_template";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ── Default subjects data ────────────────────────────────────────────────────
const DEFAULT_SUBJECTS = [
  {
    id: "beslenme",
    title: "Beslenme İlkeleri",
    color: "#4a7c59",
    lightColor: "#eef6f1",
    items: [
      { id: "b1", label: "İz Elementleri II", defaultChecked: true },
      { id: "b2", label: "Vitaminler I" },
      { id: "b3", label: "Vitamin (E–K)" },
      { id: "b4", label: "Vitaminler II" },
      { id: "b5", label: "Enerji" },
      { id: "b6", label: "Alkol" },
      { id: "b7", label: "İçecekler" },
      { id: "b8", label: "Hormonlar" },
      { id: "b9", label: "Kuru Yemişler" },
      { id: "b10", label: "Kurubaklagiller" },
      { id: "b11", label: "Sebze ve Meyveler" },
    ],
  },
  {
    id: "anatomi",
    title: "Genel Anatomi",
    color: "#c8844a",
    lightColor: "#fdf4ec",
    items: [
      { id: "a1", label: "Eklemler" },
      { id: "a2", label: "Kas Sistemi" },
      { id: "a3", label: "Solunum Sistemi" },
      { id: "a4", label: "Dolaşım Sistemi" },
    ],
  },
  {
    id: "kimya",
    title: "Organik Kimya",
    color: "#5a7ab8",
    lightColor: "#eef2fb",
    items: [
      { id: "k1", label: "OK 4" },
      { id: "k2", label: "OK 5" },
      { id: "k3", label: "OK 6" },
      { id: "k4", label: "OK 7" },
    ],
  },
  {
    id: "fizyoloji",
    title: "Genel Fizyoloji",
    color: "#9b5ea8",
    lightColor: "#f5eef8",
    items: [
      { id: "f1", label: "Kan Fizyolojisi" },
      { id: "f2", label: "Kan Grupları" },
      { id: "f3", label: "Solunum 1" },
      { id: "f4", label: "Solunum 2" },
      { id: "f5", label: "Sindirim 1" },
      { id: "f6", label: "Sindirim 2" },
      { id: "f7", label: "Sindirim 3" },
      { id: "f8", label: "Özofagus" },
      { id: "f9", label: "Sindirim 4" },
    ],
  },
  {
    id: "biyofizik",
    title: "Biyofizik",
    color: "#3d8fa0",
    lightColor: "#edf6f8",
    items: [
      { id: "by1", label: "Kas Kasılma" },
      { id: "by2", label: "Solunum Dinamiği" },
      { id: "by3", label: "Moleküler" },
      { id: "by4", label: "Canlı Yapıda Moleküller" },
      { id: "by5", label: "Elektrik Akımının Doku Etkisi" },
      { id: "by6", label: "Termodinamik Yasalar" },
    ],
  },
  {
    id: "mutfak",
    title: "Türk Mutfağı",
    color: "#b85c6e",
    lightColor: "#fceef1",
    items: [
      { id: "m1", label: "Asya Kıtası 1" },
      { id: "m2", label: "Asya Kıtası 2" },
      { id: "m3", label: "Avrupa Kıtası 1" },
      { id: "m4", label: "Avrupa Kıtası 2" },
      { id: "m5", label: "Amerika Kıtası" },
    ],
  },
  {
    id: "iletisim",
    title: "İletişim Becerileri",
    color: "#7a7a2a",
    lightColor: "#f5f5e8",
    items: [
      { id: "i1", label: "Terapötik İletişim" },
      { id: "i2", label: "Özel Durumlarda İletişim" },
      { id: "i3", label: "Yaşam Sonu Dönemlerinde İletişim" },
      { id: "i4", label: "Çeşitlilikte İletişim" },
      { id: "i5", label: "Yeme Bozukluklarında İletişim" },
    ],
  },
];

function initChecked(subjects) {
  const s = {};
  subjects.forEach((sub) =>
    sub.items.forEach((item) => {
      s[item.id] = item.defaultChecked || false;
    })
  );
  return s;
}

// ── Checkbox ─────────────────────────────────────────────────────────────────
function Checkbox({ checked, color }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
      border: checked ? "none" : "2px solid #ccc",
      background: checked ? color : "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.18s", boxShadow: checked ? `0 0 0 3px ${color}22` : "none",
    }}>
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ── Subject Card ──────────────────────────────────────────────────────────────
function SubjectCard({ subject, checked, onToggle }) {
  const done = subject.items.filter((i) => checked[i.id]).length;
  const total = subject.items.length;
  const pct = total ? (done / total) * 100 : 0;

  return (
    <div style={{
      background: "#fffdf7", border: "1.5px solid #e0d8c8",
      borderRadius: 18, padding: "20px 20px 14px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
        <div style={{ width: 13, height: 13, borderRadius: "50%", background: subject.color, flexShrink: 0 }} />
        <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: "1.05rem", color: subject.color }}>
          {subject.title}
        </span>
        <span style={{ marginLeft: "auto", fontSize: "0.76rem", color: "#999", fontWeight: 500 }}>
          {done}/{total}
        </span>
      </div>
      <div style={{ height: 4, background: "#e8e0d0", borderRadius: 99, marginBottom: 12, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: subject.color, borderRadius: 99, transition: "width 0.3s ease" }} />
      </div>
      {subject.items.map((item) => {
        const isChecked = checked[item.id];
        return (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 8px", borderRadius: 9, cursor: "pointer",
              background: isChecked ? subject.lightColor : "transparent",
              border: isChecked ? `1px solid ${subject.color}44` : "1px solid transparent",
              marginBottom: 3, transition: "all 0.15s",
            }}
          >
            <Checkbox checked={isChecked} color={subject.color} />
            <span style={{
              fontSize: "0.875rem", color: isChecked ? subject.color : "#2a2217",
              textDecoration: isChecked ? "line-through" : "none",
              opacity: isChecked ? 0.7 : 1, transition: "all 0.15s", lineHeight: 1.35,
            }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Notes Card ────────────────────────────────────────────────────────────────
function NotesCard({ notes, onNotesChange, customItems, onCustomToggle, onCustomLabelChange }) {
  return (
    <div style={{
      background: "#fffdf7", border: "1.5px dashed #c8bfaa",
      borderRadius: 18, padding: "20px 20px 18px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <span style={{ fontSize: "1.1rem" }}>📝</span>
        <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: "1.05rem", color: "#555" }}>Notes</span>
      </div>
      <div style={{ marginBottom: 14 }}>
        {customItems.map((item, idx) => (
          <div key={idx} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "6px 8px", borderRadius: 9,
            background: item.checked ? "#f0f5f0" : "transparent",
            border: item.checked ? "1px solid #a8d18a" : "1px solid transparent",
            marginBottom: 4, transition: "all 0.15s",
          }}>
            <div onClick={() => onCustomToggle(idx)} style={{ cursor: "pointer", flexShrink: 0 }}>
              <Checkbox checked={item.checked} color="#4a7c59" />
            </div>
            <input
              value={item.label}
              onChange={(e) => onCustomLabelChange(idx, e.target.value)}
              placeholder={`Not ${idx + 1}...`}
              style={{
                flex: 1, border: "none", background: "transparent",
                fontSize: "0.875rem", color: item.checked ? "#3a6b22" : "#2a2217",
                textDecoration: item.checked ? "line-through" : "none",
                outline: "none", fontFamily: "inherit",
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1.5px solid #e8e0d0", margin: "2px 0 14px" }} />
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Buraya serbest notlarını yazabilirsin..."
        style={{
          width: "100%", minHeight: 120, boxSizing: "border-box",
          border: "1.5px solid #e0d8c8", borderRadius: 10,
          padding: "10px 12px", fontFamily: "inherit",
          fontSize: "0.875rem", color: "#2a2217",
          background: "#faf7f0", resize: "vertical", outline: "none", lineHeight: 1.6,
        }}
        onFocus={(e) => (e.target.style.borderColor = "#4a7c59")}
        onBlur={(e) => (e.target.style.borderColor = "#e0d8c8")}
      />
    </div>
  );
}

// ── Admin Panel ───────────────────────────────────────────────────────────────
function AdminPanel({ subjects, onSave, onClose }) {
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(subjects)));
  const [saving, setSaving] = useState(false);
  const [activeSubject, setActiveSubject] = useState(0);

  const updateSubjectField = (idx, field, val) => {
    setDraft((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  const updateItem = (sIdx, iIdx, field, val) => {
    setDraft((prev) => prev.map((s, i) => {
      if (i !== sIdx) return s;
      return { ...s, items: s.items.map((item, j) => j === iIdx ? { ...item, [field]: val } : item) };
    }));
  };

  const addItem = (sIdx) => {
    const newId = `custom_${Date.now()}`;
    setDraft((prev) => prev.map((s, i) => i !== sIdx ? s : {
      ...s, items: [...s.items, { id: newId, label: "Yeni Konu" }]
    }));
  };

  const removeItem = (sIdx, iIdx) => {
    setDraft((prev) => prev.map((s, i) => i !== sIdx ? s : {
      ...s, items: s.items.filter((_, j) => j !== iIdx)
    }));
  };

  const addSubject = () => {
    const newId = `subject_${Date.now()}`;
    setDraft((prev) => [...prev, {
      id: newId, title: "Yeni Ders",
      color: "#888888", lightColor: "#f5f5f5", items: []
    }]);
    setActiveSubject(draft.length);
  };

  const removeSubject = (idx) => {
    if (!window.confirm("Bu dersi silmek istediğine emin misin?")) return;
    setDraft((prev) => prev.filter((_, i) => i !== idx));
    setActiveSubject(Math.max(0, idx - 1));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    onClose();
  };

  const sub = draft[activeSubject] || draft[0];
  const subIdx = draft.indexOf(sub);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#fffdf7", borderRadius: 20, width: "100%", maxWidth: 720,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1.5px solid #e8e0d0", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.3rem" }}>⚙️</span>
          <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: "1.15rem", color: "#2a2217" }}>
            Admin Paneli
          </span>
          <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "#b85c6e", background: "#fceef1", padding: "3px 10px", borderRadius: 99 }}>
            Sadece sen görebilirsin
          </span>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Subject list sidebar */}
          <div style={{ width: 190, borderRight: "1.5px solid #e8e0d0", overflowY: "auto", padding: "12px 0" }}>
            {draft.map((s, i) => (
              <div
                key={s.id}
                onClick={() => setActiveSubject(i)}
                style={{
                  padding: "9px 16px", cursor: "pointer", fontSize: "0.83rem",
                  fontWeight: i === activeSubject ? 700 : 400,
                  color: i === activeSubject ? s.color : "#555",
                  background: i === activeSubject ? s.lightColor : "transparent",
                  borderLeft: i === activeSubject ? `3px solid ${s.color}` : "3px solid transparent",
                  transition: "all 0.12s",
                }}
              >
                {s.title}
              </div>
            ))}
            <div
              onClick={addSubject}
              style={{
                padding: "9px 16px", cursor: "pointer", fontSize: "0.83rem",
                color: "#4a7c59", borderLeft: "3px solid transparent",
              }}
            >
              + Ders Ekle
            </div>
          </div>

          {/* Editor */}
          {sub && (
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: "0.78rem", color: "#888", display: "block", marginBottom: 4 }}>Ders Adı</label>
                <input
                  value={sub.title}
                  onChange={(e) => updateSubjectField(subIdx, "title", e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box", border: "1.5px solid #e0d8c8",
                    borderRadius: 9, padding: "8px 12px", fontFamily: "inherit",
                    fontSize: "0.9rem", outline: "none", background: "#faf7f0",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.78rem", color: "#888", display: "block", marginBottom: 4 }}>Ana Renk</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="color" value={sub.color}
                      onChange={(e) => updateSubjectField(subIdx, "color", e.target.value)}
                      style={{ width: 40, height: 36, border: "none", borderRadius: 8, cursor: "pointer", padding: 2 }}
                    />
                    <input value={sub.color}
                      onChange={(e) => updateSubjectField(subIdx, "color", e.target.value)}
                      style={{
                        flex: 1, border: "1.5px solid #e0d8c8", borderRadius: 9,
                        padding: "8px 10px", fontSize: "0.85rem", outline: "none",
                        background: "#faf7f0", fontFamily: "monospace",
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.78rem", color: "#888", display: "block", marginBottom: 4 }}>Arka Plan Rengi</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="color" value={sub.lightColor}
                      onChange={(e) => updateSubjectField(subIdx, "lightColor", e.target.value)}
                      style={{ width: 40, height: 36, border: "none", borderRadius: 8, cursor: "pointer", padding: 2 }}
                    />
                    <input value={sub.lightColor}
                      onChange={(e) => updateSubjectField(subIdx, "lightColor", e.target.value)}
                      style={{
                        flex: 1, border: "1.5px solid #e0d8c8", borderRadius: 9,
                        padding: "8px 10px", fontSize: "0.85rem", outline: "none",
                        background: "#faf7f0", fontFamily: "monospace",
                      }}
                    />
                  </div>
                </div>
              </div>

              <label style={{ fontSize: "0.78rem", color: "#888", display: "block", marginBottom: 8 }}>Konular</label>
              {sub.items.map((item, iIdx) => (
                <div key={item.id} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                  <input
                    value={item.label}
                    onChange={(e) => updateItem(subIdx, iIdx, "label", e.target.value)}
                    style={{
                      flex: 1, border: "1.5px solid #e0d8c8", borderRadius: 8,
                      padding: "7px 10px", fontFamily: "inherit",
                      fontSize: "0.85rem", outline: "none", background: "#faf7f0",
                    }}
                  />
                  <button
                    onClick={() => removeItem(subIdx, iIdx)}
                    style={{
                      background: "#fceef1", border: "none", borderRadius: 7,
                      color: "#b85c6e", cursor: "pointer", padding: "7px 10px", fontSize: "0.8rem",
                    }}
                  >✕</button>
                </div>
              ))}
              <button
                onClick={() => addItem(subIdx)}
                style={{
                  marginTop: 6, background: "#eef6f1", border: "1.5px dashed #4a7c59",
                  borderRadius: 9, color: "#4a7c59", cursor: "pointer",
                  padding: "7px 14px", fontSize: "0.83rem", width: "100%",
                }}
              >+ Konu Ekle</button>

              <button
                onClick={() => removeSubject(subIdx)}
                style={{
                  marginTop: 14, background: "transparent", border: "1.5px solid #e8e0d0",
                  borderRadius: 9, color: "#b85c6e", cursor: "pointer",
                  padding: "7px 14px", fontSize: "0.83rem",
                }}
              >🗑 Bu Dersi Sil</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1.5px solid #e8e0d0", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: "transparent", border: "1.5px solid #d4c9b0",
            borderRadius: 99, padding: "8px 20px", fontSize: "0.85rem",
            color: "#8a7d68", cursor: "pointer",
          }}>İptal</button>
          <button onClick={handleSave} disabled={saving} style={{
            background: saving ? "#aaa" : "#4a7c59", border: "none",
            borderRadius: 99, padding: "8px 24px", fontSize: "0.85rem",
            color: "white", cursor: saving ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}>
            {saving ? "Kaydediliyor..." : "💾 Kaydet & Yayınla"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [checked, setChecked] = useState(() => initChecked(DEFAULT_SUBJECTS));
  const [notes, setNotes] = useState("");
  const [customItems, setCustomItems] = useState(
    Array.from({ length: 5 }, () => ({ label: "", checked: false }))
  );
  const [confetti, setConfetti] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const prevPct = useRef(0);

  const isAdmin = user?.email === ADMIN_EMAIL;

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Load default template (subjects) from Firestore
  useEffect(() => {
    const ref = doc(db, "templates", DEFAULT_TEMPLATE_DOC);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.subjects) setSubjects(data.subjects);
      }
    });
    return unsub;
  }, []);

  // Load user progress when logged in
  useEffect(() => {
    if (!user) { setDataLoaded(false); return; }
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.checked) setChecked(data.checked);
        if (data.notes !== undefined) setNotes(data.notes);
        if (data.customItems) setCustomItems(data.customItems);
      } else {
        // First time — init from subjects default
        setChecked(initChecked(subjects));
      }
      setDataLoaded(true);
    });
    return unsub;
  }, [user]);

  // Save user progress (debounced)
  const saveTimer = useRef(null);
  const saveProgress = (newChecked, newNotes, newCustom) => {
    if (!user) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setDoc(doc(db, "users", user.uid), {
        checked: newChecked,
        notes: newNotes,
        customItems: newCustom,
        updatedAt: new Date().toISOString(),
      });
    }, 800);
  };

  const allItems = subjects.flatMap((s) => s.items);
  const total = allItems.length;
  const done = allItems.filter((i) => checked[i.id]).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  useEffect(() => {
    if (pct === 100 && prevPct.current < 100) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3500);
    }
    prevPct.current = pct;
  }, [pct]);

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    saveProgress(next, notes, customItems);
  };

  const handleNotesChange = (val) => {
    setNotes(val);
    saveProgress(checked, val, customItems);
  };

  const toggleCustom = (idx) => {
    const next = customItems.map((it, i) => i === idx ? { ...it, checked: !it.checked } : it);
    setCustomItems(next);
    saveProgress(checked, notes, next);
  };

  const updateCustomLabel = (idx, val) => {
    const next = customItems.map((it, i) => i === idx ? { ...it, label: val } : it);
    setCustomItems(next);
    saveProgress(checked, notes, next);
  };

  const resetAll = () => {
    if (!window.confirm("Tüm ilerlemeyi sıfırlamak istediğine emin misin?")) return;
    const fresh = initChecked(subjects);
    const freshCustom = Array.from({ length: 5 }, () => ({ label: "", checked: false }));
    setChecked(fresh);
    setNotes("");
    setCustomItems(freshCustom);
    saveProgress(fresh, "", freshCustom);
  };

  const handleSignIn = () => signInWithPopup(auth, provider);
  const handleSignOut = () => { signOut(auth); setDataLoaded(false); };

  const handleAdminSave = async (newSubjects) => {
    await setDoc(doc(db, "templates", DEFAULT_TEMPLATE_DOC), { subjects: newSubjects });
    setSubjects(newSubjects);
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#8a7d68", fontFamily: "Georgia,serif", fontSize: "1.1rem" }}>Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", padding: "28px 16px 60px", fontFamily: "'Segoe UI', Georgia, sans-serif", position: "relative" }}>

      {confetti && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
          🎉🎊✨🎓🎉
        </div>
      )}

      {showAdmin && (
        <AdminPanel
          subjects={subjects}
          onSave={handleAdminSave}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* Auth bar */}
      <div style={{ maxWidth: 1100, margin: "0 auto 10px", display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "center" }}>
        {user ? (
          <>
            {isAdmin && (
              <button
                onClick={() => setShowAdmin(true)}
                style={{
                  background: "#fceef1", border: "1.5px solid #b85c6e", borderRadius: 99,
                  padding: "5px 14px", fontSize: "0.78rem", color: "#b85c6e",
                  cursor: "pointer", fontWeight: 600,
                }}
              >⚙️ Admin Paneli</button>
            )}
            <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #e0d8c8" }} />
            <span style={{ fontSize: "0.8rem", color: "#8a7d68" }}>{user.displayName}</span>
            <button
              onClick={handleSignOut}
              style={{
                background: "transparent", border: "1.5px solid #d4c9b0", borderRadius: 99,
                padding: "5px 14px", fontSize: "0.78rem", color: "#8a7d68", cursor: "pointer",
              }}
            >Çıkış</button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            style={{
              background: "white", border: "1.5px solid #d4c9b0", borderRadius: 99,
              padding: "7px 18px", fontSize: "0.82rem", color: "#2a2217",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></svg>
            Google ile Giriş Yap
          </button>
        )}
      </div>

      {/* Not signed in banner */}
      {!user && (
        <div style={{
          maxWidth: 1100, margin: "0 auto 18px",
          background: "#fff8ec", border: "1.5px solid #f0d898",
          borderRadius: 12, padding: "10px 18px",
          fontSize: "0.83rem", color: "#7a5c00",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          💡 İlerlemenin kaydedilmesi için Google hesabınla giriş yapmanı öneririz.
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32, maxWidth: 600, margin: "0 auto 32px" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 700, color: "#2a2217", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          📚 Ders Çalışma Planım
        </div>
        <div style={{ color: "#8a7d68", fontSize: "0.92rem", marginTop: 7 }}>
          Konuları işaretleyerek ilerlemeyi takip et
          {user && dataLoaded && <span style={{ color: "#4a7c59", marginLeft: 6 }}>· ☁️ Otomatik kaydediliyor</span>}
        </div>

        <div style={{ margin: "16px auto 0", maxWidth: 400 }}>
          <div style={{ background: "#d4c9b0", borderRadius: 99, height: 10, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: pct + "%",
              background: pct === 100 ? "linear-gradient(90deg,#4a7c59,#7ac059)" : "linear-gradient(90deg,#4a7c59,#5a7ab8)",
              borderRadius: 99, transition: "width 0.45s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ color: "#8a7d68", fontSize: "0.8rem" }}>{done} / {total} tamamlandı</span>
            <span style={{ color: pct === 100 ? "#4a7c59" : "#8a7d68", fontSize: "0.8rem", fontWeight: pct === 100 ? 700 : 400 }}>
              {pct === 100 ? "🎉 Tebrikler!" : `%${pct}`}
            </span>
          </div>
        </div>

        {user && (
          <button
            onClick={resetAll}
            style={{
              marginTop: 12, background: "transparent", border: "1.5px solid #d4c9b0",
              borderRadius: 99, padding: "5px 16px", fontSize: "0.78rem", color: "#8a7d68", cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.target.style.background = "#fff"; e.target.style.borderColor = "#b85c6e"; e.target.style.color = "#b85c6e"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "#d4c9b0"; e.target.style.color = "#8a7d68"; }}
          >↺ Sıfırla</button>
        )}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
        gap: 18, maxWidth: 1100, margin: "0 auto",
      }}>
        {subjects.map((sub) => (
          <SubjectCard key={sub.id} subject={sub} checked={checked} onToggle={user ? toggle : () => {}} />
        ))}
        {user && (
          <NotesCard
            notes={notes}
            onNotesChange={handleNotesChange}
            customItems={customItems}
            onCustomToggle={toggleCustom}
            onCustomLabelChange={updateCustomLabel}
          />
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 40, color: "#b0a898", fontSize: "0.78rem" }}>
        Toplam {subjects.length} ders · {total} konu
      </div>
    </div>
  );
}
