import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Accommodation, type Experience, bookingsApi } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Accommodation | Experience;
  type: 'accommodation' | 'experience';
}

export function BookingModal({ open, onOpenChange, item, type }: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  const [formData, setFormData] = useState({
    guests: 1,
    check_in: '',
    check_out: '',
    booking_date: '',
    booking_time: '10:00',
    special_requests: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        guests: 1,
        check_in: '',
        check_out: '',
        booking_date: '',
        booking_time: '10:00',
        special_requests: '',
      });
      setAvailability(null);
    }
  }, [open, item]);

  const calculateTotal = () => {
    let basePrice = type === 'accommodation' 
      ? (item as Accommodation).price_per_night 
      : (item as Experience).price;
    
    basePrice = Number(basePrice) || 0;
    
    if (type === 'accommodation' && formData.check_in && formData.check_out) {
      const checkIn = new Date(formData.check_in);
      const checkOut = new Date(formData.check_out);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return basePrice * nights * formData.guests;
    }
    
    return basePrice * formData.guests;
  };

  const checkAvailability = async () => {
  if (type === 'accommodation' && (!formData.check_in || !formData.check_out)) {
    toast.error('Selecione as datas de check-in e check-out');
    return;
  }
  
  if (type === 'experience' && !formData.booking_date) {
    toast.error('Selecione a data da experiência');
    return;
  }

  setCheckingAvailability(true);
  setAvailability(null); // Reset availability
  
  try {
    const payload: any = {
      guests: formData.guests,
    };
    
    if (type === 'accommodation') {
      payload.accommodation_id = item.id;
      payload.check_in = formData.check_in;
      payload.check_out = formData.check_out;
    } else {
      payload.experience_id = item.id;
      
      // Valida e formata a data
      if (formData.booking_date) {
        const date = new Date(formData.booking_date);
        if (isNaN(date.getTime())) {
          toast.error('Data inválida');
          return;
        }
        
        // Formata como YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        payload.booking_date = `${year}-${month}-${day}`;
        
        console.log('📅 Data formatada para API:', payload.booking_date);
      }
    }
    
    console.log('📤 Enviando para API:', payload);
    const response = await bookingsApi.checkAvailability(payload);
    console.log('📥 Resposta da API completa:', response);
    
    if (response && response.success !== false) {
      // Verificação segura para a estrutura da resposta
      let available = false;
      let message = 'Disponibilidade verificada';
      
      if (response.data && typeof response.data.available !== 'undefined') {
        // Estrutura: { success: true, data: { available: boolean, ... } }
        available = response.data.available;
        message = response.data.message || message;
      } else if (typeof response.available !== 'undefined') {
        // Estrutura: { success: true, available: boolean, ... }
        available = response.available;
        message = response.message || message;
      } else {
        console.warn('⚠️ Estrutura de resposta inesperada:', response);
      }
      
      setAvailability(available);
      
      if (!available) {
        toast.error(message || 'Não disponível para as datas selecionadas');
      } else {
        toast.success(message || 'Disponível para reserva!');
      }
    } else {
      const errorMsg = response?.message || 'Erro ao verificar disponibilidade';
      toast.error(errorMsg);
    }
  } catch (error: any) {
    console.error('❌ Erro detalhado:', error);
    const errorMsg = error.message || 'Erro ao verificar disponibilidade';
    toast.error(errorMsg);
  } finally {
    setCheckingAvailability(false);
  }
};

  const handleBooking = async () => {
    if (!availability) {
      toast.error('Verifique a disponibilidade primeiro');
      return;
    }

    setLoading(true);
    
    try {
      const payload: any = {
        guests: formData.guests,
        special_requests: formData.special_requests || undefined,
      };
      
      if (type === 'accommodation') {
        payload.accommodation_id = item.id;
        payload.check_in = formData.check_in;
        payload.check_out = formData.check_out;
      } else {
        payload.experience_id = item.id;
        payload.booking_date = formData.booking_date;
        if (formData.booking_time) payload.booking_time = formData.booking_time;
      }
      
      const response = await bookingsApi.createBooking(payload);
      
      if (response.success) {
        toast.success('Reserva realizada com sucesso!');
        onOpenChange(false);
        // Redirecionar para página de reservas
        window.location.href = '/my-bookings';
      }
    } catch (error) {
      toast.error('Erro ao realizar reserva');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculateTotal();
  const currency = type === 'accommodation' 
    ? (item as Accommodation).currency 
    : (item as Experience).currency;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reservar {item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Formulário */}
          <div className="space-y-4">
            {type === 'accommodation' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="check_in">Check-in</Label>
                    <Input
                      id="check_in"
                      type="date"
                      value={formData.check_in}
                      onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="check_out">Check-out</Label>
                    <Input
                      id="check_out"
                      type="date"
                      value={formData.check_out}
                      onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                      min={formData.check_in || format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="booking_date">Data</Label>
                <Input
                  id="booking_date"
                  type="date"
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            )}
            
            {type === 'experience' && (
              <div className="space-y-2">
                <Label htmlFor="booking_time">Horário</Label>
                <Select
                  value={formData.booking_time}
                  onValueChange={(value) => setFormData({ ...formData, booking_time: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="guests">Hóspedes</Label>
              <Select
                value={formData.guests.toString()}
                onValueChange={(value) => setFormData({ ...formData, guests: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'hóspede' : 'hóspedes'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="special_requests">Pedidos especiais (opcional)</Label>
              <Textarea
                id="special_requests"
                value={formData.special_requests}
                onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                placeholder="Alergias, necessidades especiais, etc."
                rows={3}
              />
            </div>
          </div>
          
          {/* Total e Disponibilidade */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total estimado:</span>
              <span className="text-2xl font-bold">
                {currency} {totalPrice.toFixed(2)}
              </span>
            </div>
            
            {type === 'accommodation' && formData.check_in && formData.check_out && (
              <div className="text-sm text-muted-foreground">
                {Math.ceil(
                  (new Date(formData.check_out).getTime() - new Date(formData.check_in).getTime()) / 
                  (1000 * 60 * 60 * 24)
                )} noites × {formData.guests} hóspedes
              </div>
            )}
            
            {availability !== null && (
              <div className={`text-sm font-medium ${availability ? 'text-green-600' : 'text-red-600'}`}>
                {availability ? '✅ Disponível' : '❌ Indisponível'}
              </div>
            )}
          </div>
          
          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => checkAvailability()}
              disabled={checkingAvailability || loading}
              className="flex-1"
            >
              {checkingAvailability ? 'Verificando...' : 'Verificar disponibilidade'}
            </Button>
            
            <Button
              onClick={handleBooking}
              disabled={!availability || loading || checkingAvailability}
              className="flex-1"
            >
              {loading ? 'Processando...' : 'Confirmar Reserva'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}