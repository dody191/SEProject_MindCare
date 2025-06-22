import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Shield, Users, Clock, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast({
        title: "Berhasil login",
        description: "Selamat datang kembali!",
      });
      // Hapus state agar toast tidak muncul lagi saat refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        // Ambil nama user dari tabel users
        const { data: profile } = await supabase
          .from('users')
          .select('name')
          .eq('id', session.user.id)
          .single();
        setUserName(profile?.name || session.user.email);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserName(null);
    toast({
      title: "Berhasil logout",
      description: "Anda telah keluar dari akun.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-primary">MindCare</h1>
            </div>
            <div className="flex space-x-4">
              {loading ? null : userName ? (
                <>
                  <span className="font-semibold text-primary">Selamat datang, {userName}!</span>
                  <button
                    onClick={handleLogout}
                    className="ml-4 flex items-center text-gray-600 hover:text-primary font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-1" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Masuk</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Daftar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Kesehatan Mental
            <span className="text-primary block">Adalah Prioritas</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform terpercaya untuk mendampingi perjalanan kesehatan mental Anda dengan 
            dukungan psikolog profesional, jurnal harian, dan AI assistant yang siap membantu 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {userName ? (
              <Link to="/checkup">
                <Button size="lg" className="w-full sm:w-auto">
                  Cek Sekarang
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Mulai Sekarang - Gratis
                </Button>
              </Link>
            )}
            <Link to="/articles">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Baca Artikel
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Fitur Lengkap untuk Kesehatan Mental Anda
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan komprehensif untuk mendukung kesehatan mental Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/journal" className="block">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Jurnal Harian</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tulis refleksi dan catatan harian untuk memahami perasaan Anda lebih baik
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/counseling" className="block">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Konseling Online</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Chat dengan psikolog profesional berpengalaman melalui platform yang aman
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/articles" className="block">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Artikel & Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Akses ribuan artikel kesehatan mental yang ditulis oleh ahli terpercaya
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/chatbot" className="block">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Dapatkan tips harian dan afirmasi positif dari AI yang siap membantu 24/7
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {userName ? (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-primary mb-4">
              Selamat datang di MindCare, {userName}!
            </h3>
            <p className="text-gray-700 mb-4 text-lg">
              Terima kasih telah mempercayakan perjalanan kesehatan mental Anda bersama kami. Jangan ragu untuk mengeksplorasi fitur-fitur yang tersedia di MindCare.
            </p>
            <p className="text-gray-600 mb-8">
              Ingat, setiap langkah kecil adalah kemajuan. Semangat untuk terus menjaga kesehatan mental Anda!
            </p>
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Siap Memulai Perjalanan Kesehatan Mental Anda?
            </h3>
            <p className="text-gray-600 mb-8">
              Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat platform kami
            </p>
            <Link to="/register">
              <Button size="lg">Daftar Sekarang</Button>
            </Link>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-8 bg-yellow-50 border-t border-yellow-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="font-semibold text-yellow-800 mb-2">Penting untuk Diketahui</h4>
            <p className="text-sm text-yellow-700">
              Platform ini tidak menggantikan diagnosis atau pengobatan medis profesional. 
              Untuk kondisi darurat atau krisis psikologis berat, segera hubungi layanan darurat atau rumah sakit terdekat.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">MindCare</span>
          </div>
          <p className="text-gray-400">© 2024 MindCare. Semua hak dilindungi. Versi awal - Bahasa Indonesia.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
