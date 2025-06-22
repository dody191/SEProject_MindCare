import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Calendar, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Counseling = () => {
  const [selectedPsychologist, setSelectedPsychologist] = useState<number | null>(null);

  const psychologists = [
    {
      id: 1,
      name: "Dr. Sarah Putri, M.Psi",
      specialization: "Kecemasan & Stres",
      experience: "8 tahun",
      rating: 4.9,
      reviews: 145,
      price: "Rp 150.000/sesi",
      availability: "Senin-Jumat, 09:00-17:00",
      photo: "/placeholder.svg",
      description: "Spesialis dalam menangani kecemasan, stres, dan gangguan mood. Berpengalaman dalam terapi kognitif-behavioral."
    },
    {
      id: 2,
      name: "Prof. Ahmad Wijaya, Ph.D",
      specialization: "Depresi & Self-Esteem",
      experience: "12 tahun",
      rating: 4.8,
      reviews: 203,
      price: "Rp 200.000/sesi",
      availability: "Selasa-Sabtu, 10:00-16:00",
      photo: "/placeholder.svg",
      description: "Profesor psikologi klinis dengan keahlian dalam menangani depresi, trauma, dan membangun kepercayaan diri."
    },
    {
      id: 3,
      name: "Dr. Lisa Maharani, M.Psi",
      specialization: "Burnout & Work-Life Balance",
      experience: "6 tahun",
      rating: 4.7,
      reviews: 98,
      price: "Rp 175.000/sesi",
      availability: "Senin-Kamis, 13:00-19:00",
      photo: "/placeholder.svg",
      description: "Ahli dalam menangani burnout, stres kerja, dan membantu mencapai keseimbangan hidup yang sehat."
    }
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-2xl font-bold text-primary">Konseling Online</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Pilih Psikolog</h2>
          <p className="text-gray-600">Konsultasi dengan psikolog profesional yang berpengalaman</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {psychologists.map((psychologist) => (
            <Card key={psychologist.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {psychologist.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{psychologist.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {psychologist.specialization}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{psychologist.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pengalaman:</span>
                  <span className="font-medium">{psychologist.experience}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{psychologist.rating}</span>
                    <span className="text-muted-foreground ml-1">({psychologist.reviews} ulasan)</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{psychologist.availability}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">{psychologist.price}</span>
                  <Button 
                    onClick={() => setSelectedPsychologist(psychologist.id)}
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Pilih
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPsychologist && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Jadwalkan Konsultasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Pilih Tanggal:</h4>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    return (
                      <Button
                        key={i}
                        variant="outline"
                        className="p-3 h-auto flex flex-col"
                      >
                        <span className="text-xs text-muted-foreground">
                          {date.toLocaleDateString('id-ID', { weekday: 'short' })}
                        </span>
                        <span className="font-medium">
                          {date.getDate()}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Pilih Waktu:</h4>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="text-sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">
                  Konfirmasi Jadwal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPsychologist(null)}
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Informasi Penting</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Konsultasi dilakukan melalui chat terenkripsi yang aman</li>
            <li>• Sesi berlangsung selama 50 menit</li>
            <li>• Pembayaran dapat dilakukan setelah konfirmasi jadwal</li>
            <li>• Pembatalan dapat dilakukan hingga 24 jam sebelum sesi</li>
            <li>• Untuk kondisi darurat, hubungi layanan kesehatan terdekat</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Counseling;
