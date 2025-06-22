import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

type ChatMessage = {
  role: "user" | "ai";
  content: string;
  image?: string;
};

const GeminiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Halo! Saya akan membantu anda untuk memahami kesehatan mental. Kirimkan pertanyaan, diagnosa, atau gambar untuk saya analisis." }
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input && !image) return;
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input, image: image ? URL.createObjectURL(image) : undefined }
    ]);
    try {
      let aiResponse = "";
      if (image) {
        aiResponse = "Saat ini hanya pertanyaan berbasis teks yang didukung.";
      } else {
        // Kirim ke backend Express
        const res = await fetch("/api/ai-checkup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input })
        });
        const data = await res.json();
        aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada jawaban dari AI.";
      }
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: aiResponse }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Gagal mendapatkan jawaban dari AI: " + (err.message || err) }
      ]);
    }
    setInput("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(false);
  };

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-2">
      <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col min-h-[600px] max-h-[90vh]">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-primary drop-shadow">AI Assistant</h1>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 pb-24 min-h-0" style={{scrollBehavior: 'smooth'}}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-lg px-4 py-2 mb-2 max-w-[80%] whitespace-pre-line ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                  {msg.image && (
                    <img src={msg.image} alt="User upload" className="mb-2 max-w-xs rounded" />
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* ... tombol aksi cepat ... */}
          </div>
        </div>
        <div className="w-full border-t pt-4 bg-white rounded-b-2xl">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              type="text"
              placeholder="Ketik pesan atau diagnosa..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={e => setImage(e.target.files?.[0] || null)}
              disabled={isLoading}
              className="block"
            />
            <Button type="submit" className="rounded-full px-4 py-2">
              {isLoading ? "Mengirim..." : "Kirim"}
            </Button>
          </form>
          <div className="mt-2 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-900 text-sm">
            <b>Penting untuk Diingat</b>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>AI Assistant ini tidak menggantikan konsultasi dengan psikolog profesional</li>
              <li>Untuk masalah serius atau krisis psikologis, segera hubungi profesional</li>
              <li>Informasi yang diberikan bersifat umum dan edukatif</li>
              <li>Jika membutuhkan konsultasi mendalam, gunakan fitur Konseling Online</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat; 