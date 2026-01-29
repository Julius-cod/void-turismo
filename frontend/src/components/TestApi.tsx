import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TestApi() {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem('token');

  const log = (message: string) => {
    setResults(prev => prev + '\n' + message);
    console.log(message);
  };

  const clearLog = () => setResults('');

  const checkToken = () => {
    const token = localStorage.getItem('token');
    log(token ? `✅ Token: ${token.substring(0, 30)}...` : '❌ Sem token');
  };

  const testAdminPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/accommodations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: `Hotel Test ${Date.now()}`,
          slug: `hotel-test-${Date.now()}`,
          listing_type: 'hotel',
          price_per_night: '150.00',
          currency: 'USD',
        }),
      });

      const text = await res.text();
      log(`POST Status: ${res.status}`);
      log(`Response: ${text}`);
    } catch (error: any) {
      log(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testPublicGet = async () => {
    try {
      const res = await fetch(`${API_BASE}/accommodations`);
      const data = await res.json();
      log(`✅ GET Status: ${res.status}`);
      log(`Total: ${data.data?.length || 0}`);
    } catch (error: any) {
      log(`❌ Erro: ${error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Testes API Accommodations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={checkToken} variant="outline">
            Verificar Token
          </Button>
          <Button onClick={testPublicGet} variant="outline">
            Testar GET Público
          </Button>
          <Button onClick={testAdminPost} disabled={loading}>
            {loading ? 'Testando...' : 'Testar POST Admin'}
          </Button>
          <Button onClick={clearLog} variant="destructive">
            Limpar Log
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Resultados:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {results || 'Clique em um teste para ver resultados...'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}