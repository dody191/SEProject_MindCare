import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type ChatMessage = {
  role: "user" | "ai";
  content: string;
};

const CheckupGemini = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Halo! Saya akan membantu anda untuk memahami kesehatan mental anda. Kirimkan pertanyaan atau diagnosa untuk saya analisis." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input) return;
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input }
    ]);
    try {
      // Kirim ke backend Express
      const res = await fetch("/api/ai-checkup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada jawaban dari AI.";
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
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <Card className="w-full max-w-2xl min-h-[600px] flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary">Cek Sekarang Kesehatan Mental Anda</CardTitle>
          <p className="text-muted-foreground">Kirim pertanyaan atau diagnosa dan dapatkan jawaban disini.</p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 mb-2 max-w-[80%] whitespace-pre-line ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </CardContent>
        <form onSubmit={handleSend} className="flex gap-2 p-4 border-t bg-white">
          <Input
            type="text"
            placeholder="Ketik pesan atau diagnosa..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input}>
            {isLoading ? "Mengirim..." : "Kirim"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CheckupGemini; 