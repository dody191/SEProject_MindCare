import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { Link } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Saya adalah AI Assistant untuk kesehatan mental. Saya di sini untuk memberikan tips harian dan afirmasi positif. Bagaimana perasaan Anda hari ini?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const dailyTips = [
    "Cobalah teknik pernapasan 4-7-8: Tarik napas selama 4 detik, tahan 7 detik, hembuskan 8 detik.",
    "Luangkan 5 menit untuk menulis 3 hal yang Anda syukuri hari ini.",
    "Lakukan peregangan ringan untuk mengurangi ketegangan di tubuh.",
    "Dengarkan musik yang menenangkan selama 10 menit.",
    "Jalan kaki selama 15 menit di luar ruangan untuk vitamin D alami."
  ];

  const affirmations = [
    "Anda lebih kuat dari yang Anda pikirkan.",
    "Setiap hari adalah kesempatan baru untuk tumbuh.",
    "Anda layak mendapatkan kebahagiaan dan kedamaian.",
    "Perasaan ini akan berlalu, dan Anda akan melewatinya.",
    "Anda sudah melakukan yang terbaik dengan kemampuan yang Anda miliki."
  ];

  const responses = {
    "sedih": "Saya memahami Anda sedang merasa sedih. Perasaan ini normal dan akan berlalu. Cobalah untuk menarik napas dalam-dalam dan ingatlah bahwa Anda tidak sendirian.",
    "cemas": "Kecemasan bisa sangat mengganggu. Cobalah teknik grounding 5-4-3-2-1: Sebutkan 5 hal yang bisa Anda lihat, 4 hal yang bisa Anda sentuh, 3 hal yang bisa Anda dengar, 2 hal yang bisa Anda cium, dan 1 hal yang bisa Anda rasakan.",
    "stres": "Stres adalah respons alami tubuh. Cobalah untuk mengidentifikasi sumber stres dan ambil istirahat sejenak. Pernapasan dalam bisa membantu menenangkan sistem saraf Anda.",
    "tips": dailyTips[Math.floor(Math.random() * dailyTips.length)],
    "afirmasi": affirmations[Math.floor(Math.random() * affirmations.length)]
  };

  const generateResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("sedih") || lowerMessage.includes("down")) {
      return responses.sedih;
    } else if (lowerMessage.includes("cemas") || lowerMessage.includes("khawatir")) {
      return responses.cemas;
    } else if (lowerMessage.includes("stres") || lowerMessage.includes("tertekan")) {
      return responses.stres;
    } else if (lowerMessage.includes("tips") || lowerMessage.includes("saran")) {
      return responses.tips;
    } else if (lowerMessage.includes("afirmasi") || lowerMessage.includes("motivasi")) {
      return responses.afirmasi;
    } else {
      return "Terima kasih telah berbagi. Saya di sini untuk mendengarkan. Apakah ada yang spesifik ingin Anda bicarakan? Saya bisa memberikan tips atau afirmasi positif.";
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user" as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateResponse(inputMessage),
        sender: "bot" as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage("");
  };

  const quickActions = [
    { label: "Tips Hari Ini", message: "Berikan saya tips untuk hari ini" },
    { label: "Afirmasi Positif", message: "Saya butuh afirmasi positif" },
    { label: "Merasa Cemas", message: "Saya merasa cemas" },
    { label: "Merasa Stres", message: "Saya sedang stres" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-primary">AI Assistant</h1>
            </div>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Box Penting untuk Diingat */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Penting untuk Diingat</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• AI Assistant ini tidak menggantikan konsultasi dengan psikolog profesional</li>
            <li>• Untuk masalah serius atau krisis psikologis, segera hubungi profesional</li>
            <li>• Informasi yang diberikan bersifat umum dan edukatif</li>
            <li>• Jika membutuhkan konsultasi mendalam, gunakan fitur Konseling Online</li>
          </ul>
        </div>

        <Card className="h-[600px] flex flex-col mt-8 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              Chat dengan AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col bg-white">
            {/* Container scroll */}
            <div className="flex-1 overflow-y-auto mb-4 pr-1 flex flex-col bg-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div
                    className={`
                      inline-block
                      max-w-[80%]
                      rounded-2xl
                      p-3
                      shadow
                      ${message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                      }
                    `}
                    style={{
                      wordBreak: 'break-word',
                      borderTopLeftRadius: message.sender === 'bot' ? '1.5rem' : '0.75rem',
                      borderTopRightRadius: message.sender === 'user' ? '1.5rem' : '0.75rem',
                      borderBottomLeftRadius: '1.5rem',
                      borderBottomRightRadius: '1.5rem',
                    }}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                      {message.sender === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                      <div>
                        <p className="text-sm break-words">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Aksi Cepat */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Aksi Cepat:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(action.message)}
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Input chat */}
            <form onSubmit={handleSendMessage} className="flex space-x-2 mt-auto">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ketik pesan Anda..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chatbot;
