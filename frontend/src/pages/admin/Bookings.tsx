import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';
import { bookingsApi, type Booking } from '@/lib/api';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Concluída',
};

export default function AdminBookings() {
  const [items, setItems] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Booking | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const debouncedSearch = useDebounce(search, 300);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await bookingsApi.listAll({
        page: currentPage,
        per_page: 10,
        status: statusFilter || undefined,
      });
      
      if (response.success) {
        setItems(response.data);
        setTotalPages(response.meta?.last_page || 1);
      }
    } catch (error) {
      toast.error('Erro ao carregar reservas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearch, statusFilter]);

  const openDetailDialog = (item: Booking) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    setIsSaving(true);
    try {
      await bookingsApi.updateStatus(id, status);
      toast.success('Status atualizado com sucesso');
      fetchData();
      if (selectedItem?.id === id) {
        setSelectedItem({ ...selectedItem, status });
      }
    } catch (error) {
      toast.error('Erro ao atualizar status');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (item: Booking) => (
        <span className="font-mono text-xs">{item.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (item: Booking) => (
        <Badge variant="outline">
          {item.accommodation_id ? 'Hospedagem' : 'Experiência'}
        </Badge>
      ),
    },
    {
      key: 'item',
      label: 'Item',
      render: (item: Booking) => (
        <span>{item.accommodation?.name || item.experience?.name || '-'}</span>
      ),
    },
    {
      key: 'dates',
      label: 'Datas',
      render: (item: Booking) => (
        <div className="text-sm">
          {item.check_in && item.check_out ? (
            <>
              {formatDate(item.check_in)} - {formatDate(item.check_out)}
            </>
          ) : (
            formatDate(item.booking_date)
          )}
        </div>
      ),
    },
    {
      key: 'guests',
      label: 'Hóspedes',
      render: (item: Booking) => item.guests,
    },
    {
      key: 'total',
      label: 'Total',
      render: (item: Booking) => (
        <span className="font-medium">{item.currency} {item.total_price}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Booking) => (
        <Badge className={statusColors[item.status]}>
          {statusLabels[item.status]}
        </Badge>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Reservas</h1>
          <p className="text-muted-foreground">Gerencie todas as reservas da plataforma</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar reservas..."
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          actions={(item) => (
            <Button variant="ghost" size="icon" onClick={() => openDetailDialog(item)}>
              <Eye className="w-4 h-4" />
            </Button>
          )}
        />
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ID</p>
                  <p className="font-mono">{selectedItem.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className={statusColors[selectedItem.status]}>
                    {statusLabels[selectedItem.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <p>{selectedItem.accommodation_id ? 'Hospedagem' : 'Experiência'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Item</p>
                  <p>{selectedItem.accommodation?.name || selectedItem.experience?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-in</p>
                  <p>{formatDate(selectedItem.check_in)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-out</p>
                  <p>{formatDate(selectedItem.check_out)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hóspedes</p>
                  <p>{selectedItem.guests}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold">{selectedItem.currency} {selectedItem.total_price}</p>
                </div>
              </div>

              {selectedItem.special_requests && (
                <div>
                  <p className="text-muted-foreground text-sm">Pedidos especiais</p>
                  <p className="text-sm bg-muted p-2 rounded">{selectedItem.special_requests}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Alterar status</p>
                <Select
                  value={selectedItem.status}
                  onValueChange={(value: Booking['status']) => handleStatusChange(selectedItem.id, value)}
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
