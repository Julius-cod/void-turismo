import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Star } from 'lucide-react';
import { destinationsApi, type Destination } from '@/lib/api';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/ApiAuthContext';


export default function AdminDestinations() {
  const { user, isLoading, isAdmin } = useAuth();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Destination | null>(null);
  const [deletingItem, setDeletingItem] = useState<Destination | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    region: '',
    short_description: '',
    description: '',
    image_url: '',
    latitude: '',
    longitude: '',
    is_featured: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await destinationsApi.list({
        page: currentPage,
        per_page: 10,
        search: debouncedSearch || undefined,
      });
      if (response.success) {
        setDestinations(response.data);
        setTotalPages(response.meta?.last_page || 1);
      }
    } catch (error) {
      toast.error('Erro ao carregar destinos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) return;
    fetchData();
  }, [currentPage, debouncedSearch, user, isAdmin]);

  if (isLoading || !isAdmin)
  return (
    <div className="flex justify-center items-center h-[60vh] text-lg text-muted-foreground">
      Carregando...
    </div>
  );


  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      slug: '',
      region: '',
      short_description: '',
      description: '',
      image_url: '',
      latitude: '',
      longitude: '',
      is_featured: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Destination) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      region: item.region || '',
      short_description: item.short_description || '',
      description: item.description || '',
      image_url: item.image_url || '',
      latitude: item.latitude?.toString() || '',
      longitude: item.longitude?.toString() || '',
      is_featured: item.is_featured,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (item: Destination) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast.error('Nome e slug são obrigatórios');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      if (editingItem) {
        await destinationsApi.update(editingItem.id, payload);
        toast.success('Destino atualizado com sucesso');
      } else {
        await destinationsApi.create(payload);
        toast.success('Destino criado com sucesso');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Erro ao salvar destino');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsSaving(true);
    try {
      await destinationsApi.delete(deletingItem.id);
      toast.success('Destino excluído com sucesso');
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir destino');
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const columns = [
    {
      key: 'image',
      label: 'Imagem',
      render: (item: Destination) => (
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Sem foto</div>
          )}
        </div>
      ),
    },
    { key: 'name', label: 'Nome' },
    { key: 'region', label: 'Região' },
    {
      key: 'rating',
      label: 'Avaliação',
      render: (item: Destination) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-kamba-gold fill-current" />
          <span>{item.rating?.toFixed(1) || '0.0'}</span>
        </div>
      ),
    },
    {
      key: 'is_featured',
      label: 'Destaque',
      render: (item: Destination) =>
        item.is_featured ? <Badge className="bg-kamba-gold/20 text-kamba-gold">Destaque</Badge> : null,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Destinos</h1>
          <p className="text-muted-foreground">Gerencie os destinos disponíveis na plataforma</p>
        </div>

        <DataTable
          columns={columns}
          data={destinations}
          isLoading={loading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar destinos..."
          onAdd={openCreateDialog}
          addLabel="Novo Destino"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          actions={(item) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      </div>

      {/* Dialogs de criar/editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Destino' : 'Novo Destino'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Campos do form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingItem ? formData.slug : generateSlug(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Região</Label>
              <Input id="region" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_description">Descrição curta</Label>
              <Input id="short_description" value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição completa</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">URL da imagem</Label>
              <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" type="number" step="0.0000001" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" type="number" step="0.0000001" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
              <Label htmlFor="is_featured">Marcar como destaque</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de delete */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir o destino <strong>{deletingItem?.name}</strong>? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>{isSaving ? 'Excluindo...' : 'Excluir'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
