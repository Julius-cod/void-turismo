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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Star, Clock } from 'lucide-react';
import { experiencesApi, destinationsApi, type Experience, type Destination } from '@/lib/api';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

const categories = [
  { value: 'city_tour', label: 'City Tour' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'beach', label: 'Praia' },
  { value: 'nature', label: 'Natureza' },
  { value: 'food', label: 'Gastronomia' },
  { value: 'adventure', label: 'Aventura' },
];

export default function AdminExperiences() {
  const [items, setItems] = useState<Experience[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [deletingItem, setDeletingItem] = useState<Experience | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    destination_id: '',
    category: 'city_tour' as Experience['category'],
    short_description: '',
    description: '',
    image_url: '',
    includes: '',
    duration_hours: '',
    max_participants: '',
    meeting_point: '',
    price: '',
    currency: 'USD',
    latitude: '',
    longitude: '',
    is_featured: false,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [expResponse, destResponse] = await Promise.all([
        experiencesApi.list({
          page: currentPage,
          per_page: 10,
          search: debouncedSearch || undefined,
        }),
        destinationsApi.list({ per_page: 100 }),
      ]);
      
      if (expResponse.success) {
        setItems(expResponse.data);
        setTotalPages(expResponse.meta?.last_page || 1);
      }
      if (destResponse.success) {
        setDestinations(destResponse.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar experiências');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearch]);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      slug: '',
      destination_id: '',
      category: 'city_tour',
      short_description: '',
      description: '',
      image_url: '',
      includes: '',
      duration_hours: '',
      max_participants: '',
      meeting_point: '',
      price: '',
      currency: 'USD',
      latitude: '',
      longitude: '',
      is_featured: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Experience) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      destination_id: item.destination_id || '',
      category: item.category,
      short_description: item.short_description || '',
      description: item.description || '',
      image_url: item.image_url || '',
      includes: item.includes?.join(', ') || '',
      duration_hours: item.duration_hours?.toString() || '',
      max_participants: item.max_participants?.toString() || '',
      meeting_point: item.meeting_point || '',
      price: item.price.toString(),
      currency: item.currency || 'USD',
      latitude: item.latitude?.toString() || '',
      longitude: item.longitude?.toString() || '',
      is_featured: item.is_featured,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (item: Experience) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug || !formData.price) {
      toast.error('Nome, slug e preço são obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        destination_id: formData.destination_id || null,
        category: formData.category,
        short_description: formData.short_description || null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        includes: formData.includes ? formData.includes.split(',').map(a => a.trim()) : null,
        duration_hours: formData.duration_hours ? parseFloat(formData.duration_hours) : null,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        meeting_point: formData.meeting_point || null,
        price: parseFloat(formData.price),
        currency: formData.currency,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        is_featured: formData.is_featured,
      };

      if (editingItem) {
        await experiencesApi.update(editingItem.id, payload);
        toast.success('Experiência atualizada com sucesso');
      } else {
        await experiencesApi.create(payload);
        toast.success('Experiência criada com sucesso');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Erro ao salvar experiência');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    
    setIsSaving(true);
    try {
      await experiencesApi.delete(deletingItem.id);
      toast.success('Experiência excluída com sucesso');
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir experiência');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Imagem',
      render: (item: Experience) => (
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              Sem foto
            </div>
          )}
        </div>
      ),
    },
    { key: 'name', label: 'Nome' },
    {
      key: 'category',
      label: 'Categoria',
      render: (item: Experience) => (
        <Badge variant="outline">{categories.find(c => c.value === item.category)?.label}</Badge>
      ),
    },
    {
      key: 'duration',
      label: 'Duração',
      render: (item: Experience) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{item.duration_hours || '-'}h</span>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Preço',
      render: (item: Experience) => (
        <span className="font-medium">{item.currency} {item.price}</span>
      ),
    },
    {
      key: 'rating',
      label: 'Avaliação',
      render: (item: Experience) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-kamba-gold fill-current" />
          <span>{item.rating?.toFixed(1) || '0.0'}</span>
        </div>
      ),
    },
    {
      key: 'is_featured',
      label: 'Destaque',
      render: (item: Experience) =>
        item.is_featured ? (
          <Badge className="bg-kamba-gold/20 text-kamba-gold">Destaque</Badge>
        ) : null,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Experiências</h1>
          <p className="text-muted-foreground">Gerencie tours, passeios e atividades</p>
        </div>

        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar experiências..."
          onAdd={openCreateDialog}
          addLabel="Nova Experiência"
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Experiência' : 'Nova Experiência'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingItem ? formData.slug : generateSlug(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Destino</Label>
                <Select
                  value={formData.destination_id}
                  onValueChange={(value) => setFormData({ ...formData, destination_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest.id} value={dest.id}>
                        {dest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: Experience['category']) => 
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Descrição curta</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição completa</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL da imagem</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="includes">O que inclui (separado por vírgula)</Label>
              <Input
                id="includes"
                value={formData.includes}
                onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                placeholder="Transporte, Guia, Almoço, Entrada"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_point">Ponto de encontro</Label>
              <Input
                id="meeting_point"
                value={formData.meeting_point}
                onChange={(e) => setFormData({ ...formData, meeting_point: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_hours">Duração (h)</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  step="0.5"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_participants">Máx. Participantes</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Moeda</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="AOA">AOA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Marcar como destaque</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir <strong>{deletingItem?.name}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
