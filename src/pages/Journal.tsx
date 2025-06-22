import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeft, Plus, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Journal = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "2024-01-10",
      title: "Hari yang Menyenangkan",
      content: "Hari ini saya merasa bahagia karena bisa menyelesaikan pekerjaan dengan baik...",
      gratitude: "Bersyukur atas dukungan keluarga"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    gratitude: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi penyimpanan akan ditambahkan setelah Supabase terhubung
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...newEntry
    };
    setEntries([entry, ...entries]);
    setNewEntry({ title: "", content: "", gratitude: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 relative">
            <Link to="/" className="z-10 mt-4">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/90 text-primary rounded-full shadow-md border border-gray-200 hover:bg-blue-50 hover:scale-105 transition-all duration-150"
                style={{ minWidth: 0 }}
              >
                <Home size={20} />
                <span className="font-medium">Beranda</span>
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-primary mx-auto">Jurnal Harian</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Catatan Harian Saya</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Catatan
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Catatan Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Judul Catatan</Label>
                  <Input
                    id="title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                    placeholder="Masukkan judul catatan"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Catatan Harian</Label>
                  <Textarea
                    id="content"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                    placeholder="Ceritakan bagaimana hari Anda..."
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gratitude">Apa yang Anda syukuri hari ini?</Label>
                  <Textarea
                    id="gratitude"
                    value={newEntry.gratitude}
                    onChange={(e) => setNewEntry({...newEntry, gratitude: e.target.value})}
                    placeholder="Tuliskan hal-hal yang Anda syukuri..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Simpan Catatan</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{entry.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(entry.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Catatan Harian:</h4>
                  <p className="text-gray-700">{entry.content}</p>
                </div>
                {entry.gratitude && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Rasa Syukur:</h4>
                    <p className="text-gray-700 italic">"{entry.gratitude}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {entries.length === 0 && !showForm && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Belum ada catatan harian. Mulai menulis catatan pertama Anda!
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Buat Catatan Pertama
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Journal;
