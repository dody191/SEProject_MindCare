import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Send, User, X } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Halo! Saya adalah AI Assistant untuk kesehatan mental. Silakan tanya seputar kesehatan mental.",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (session) {
        setIsLoggedIn(true);
        // navigate("/dashboard"); // opsional, jika ingin redirect otomatis
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      console.error("Connection check error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Login dengan email dan password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Coba ambil profil user
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          
          // Jika profil tidak ditemukan, buat profil baru
          if (profileError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: authData.user.id,
                  email: authData.user.email,
                  name: authData.user.email?.split('@')[0] || 'User',
                }
              ]);

            if (insertError) {
              console.error('Profile creation error:', insertError);
              throw new Error('Gagal membuat profil pengguna');
            }
          } else {
            throw new Error('Gagal mengambil data profil');
          }
        }

        toast({
          title: "Login berhasil",
          description: "Selamat datang kembali!",
        });

        setIsLoggedIn(true);
        navigate("/", { state: { loginSuccess: true } });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Terjadi kesalahan saat login";
      
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email belum diverifikasi. Silakan cek email Anda";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email atau password salah";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Tidak dapat terhubung ke server. Silakan coba lagi";
      }
      
      toast({
        title: "Login gagal",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Login Google gagal",
        description: "Tidak dapat terhubung dengan Google. Silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  // Chatbot logic (mental health only)
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
  function isMentalHealthQuestion(msg) {
    const keywords = ["sedih", "cemas", "stres", "tips", "afirmasi", "mental", "emosi", "perasaan", "psikolog", "kesehatan jiwa", "depresi", "cemas", "tertekan", "down", "khawatir", "motivasi", "dukungan", "kesehatan mental"];
    return keywords.some(k => msg.toLowerCase().includes(k));
  }
  const generateResponse = (message) => {
    if (!isMentalHealthQuestion(message)) {
      return "Maaf, chatbot ini hanya dapat menjawab pertanyaan seputar kesehatan mental. Silakan tanyakan hal terkait kesehatan mental.";
    }
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
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = {
      id: chatMessages.length + 1,
      text: chatInput,
      sender: "user",
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        text: generateResponse(chatInput),
        sender: "bot",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 800);
    setChatInput("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">MindCare</CardTitle>
          <p className="text-muted-foreground">Masuk ke akun Anda</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan kata sandi"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Atau masuk dengan
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Daftar di sini
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Lupa kata sandi?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Floating Chatbot Button & Popup (only after login) */}
      {isLoggedIn && (
        <>
          <button
            className="fixed bottom-8 right-8 z-50 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90"
            onClick={() => setShowChatbot(true)}
            aria-label="Buka Chatbot"
          >
            <Bot className="h-6 w-6" />
          </button>
          {showChatbot && (
            <div className="fixed bottom-24 right-8 z-50 w-80 bg-white rounded-xl shadow-2xl border flex flex-col">
              <div className="flex items-center justify-between p-3 border-b">
                <span className="font-bold text-primary flex items-center"><Bot className="h-5 w-5 mr-2" />Chatbot Kesehatan Mental</span>
                <button onClick={() => setShowChatbot(false)}><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{maxHeight: 320}}>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-2 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
                      {msg.text}
                      <div className="text-[10px] opacity-60 mt-1 text-right">{msg.timestamp.toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} className="flex border-t p-2 gap-2">
                <Input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Tanya seputar kesehatan mental..."
                  className="flex-1"
                />
                <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Login;
