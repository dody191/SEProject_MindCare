import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          toast({
            title: "Login berhasil",
            description: "Selamat datang kembali!",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Login gagal",
          description: "Terjadi kesalahan saat login. Silakan coba lagi.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Memproses login...</h2>
        <p className="text-muted-foreground">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
};

export default AuthCallback; 