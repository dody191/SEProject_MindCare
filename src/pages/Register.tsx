import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    phone: "",
    purpose: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak cocok",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            age: formData.age ? parseInt(formData.age) : null,
            gender: formData.gender || null,
            phone: formData.phone || null,
            purpose: formData.purpose || null,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create the user profile in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              name: formData.name,
              email: formData.email,
              age: formData.age ? parseInt(formData.age) : null,
              gender: formData.gender || null,
              phone: formData.phone || null,
              purpose: formData.purpose || null,
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError, JSON.stringify(profileError));
          if (String(profileError.code) === '23505' || (profileError.message && profileError.message.toLowerCase().includes('duplicate key'))) {
            toast({
              title: "Registrasi gagal",
              description: "Email sudah terdaftar. Silakan gunakan email lain atau login jika sudah memiliki akun.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          throw new Error('Gagal membuat profil pengguna');
        }

        toast({
          title: "Registrasi berhasil",
          description: "Silakan cek email Anda untuk verifikasi",
        });

        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error, JSON.stringify(error));
      let errorMessage = "Terjadi kesalahan saat mendaftar";
      
      const msg = error?.message?.toLowerCase() || "";
      if (
        msg.includes("already registered") ||
        msg.includes("already exists") ||
        msg.includes("user already registered") ||
        msg.includes("user already exists") ||
        (error?.status === 400 && msg.includes("user"))
      ) {
        errorMessage = "Email sudah terdaftar. Silakan gunakan email lain atau login jika sudah memiliki akun.";
      } else if (msg.includes("password")) {
        errorMessage = "Password harus minimal 6 karakter";
      } else if (msg.includes("invalid email")) {
        errorMessage = "Format email tidak valid";
      }
      
      toast({
        title: "Registrasi gagal",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">MindCare</CardTitle>
          <p className="text-muted-foreground">Buat akun baru</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
                disabled={isLoading}
              />
            </div>

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
                placeholder="Masukkan kata sandi (minimal 6 karakter)"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Konfirmasi kata sandi"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="age">Usia</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Masukkan usia"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Input
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Masukkan jenis kelamin"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Masukkan nomor telepon"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="purpose">Tujuan Bergabung</Label>
              <Input
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Masukkan tujuan bergabung"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Daftar"}
            </Button>
          </form>

          <Separator className="my-4" />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
