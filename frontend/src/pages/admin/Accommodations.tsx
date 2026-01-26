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
import { Pencil, Trash2, Star, CheckCircle } from 'lucide-react';
import { accommodationsApi, destinationsApi, type Accommodation, type Destination } from '@/lib/api';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

const listingTypes = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'lodge', label: 'Lodge' },
  { value: 'guesthouse', label: 'Pousada' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'apartment', label: 'Apartamento' },
];

export default function AdminAccommodations() {
  const [items, setItems] = useState<Accommodation[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Accommodation | null>(null);
  const [deletingItem, setDeletingItem] = useState<Accommodation | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    destination_id: '',
    listing_type: 'hotel' as Accommodation['listing_type'],
    short_description: '',
    description: '',
    address: '',
    image_url: '',
    amenities: '',
    bedrooms: '',
    bathrooms: '',
    max_guests: '',
    price_per_night: '',
    currency: 'USD',
    latitude: '',
    longitude: '',
    is_featured: false,
    is_verified: false,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [accResponse, destResponse] = await Promise.all([
        accommodationsApi.list({
          page: currentPage,
          per_page: 10,
          search: debouncedSearch || undefined,
        }),
        destinationsApi.list({ per_page: 100 }),
      ]);
      
      if (accResponse.success) {
        setItems(accResponse.data);
        setTotalPages(accResponse.meta?.last_page || 1);
      }
      if (destResponse.success) {
        setDestinations(destResponse.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar hospedagens');
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
      listing_type: 'hotel',
      short_description: '',
      description: '',
      address: '',
      image_url: '',
      amenities: '',
      bedrooms: '',
      bathrooms: '',
      max_guests: '',
      price_per_night: '',
      currency: 'USD',
      latitude: '',
      longitude: '',
      is_featured: false,
      is_verified: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Accommodation) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      destination_id: item.destination_id || '',
      listing_type: item.listing_type,
      short_description: item.short_description || '',
      description: item.description || '',
      address: item.address || '',
      image_url: item.image_url || '',
      amenities: item.amenities?.join(', ') || '',
      bedrooms: item.bedrooms?.toString() || '',
      bathrooms: item.bathrooms?.toString() || '',
      max_guests: item.max_guests?.toString() || '',
      price_per_night: item.price_per_night.toString(),
      currency: item.currency || 'USD',
      latitude: item.latitude?.toString() || '',
      longitude: item.longitude?.toString() || '',
      is_featured: item.is_featured,
      is_verified: item.is_verified,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (item: Accommodation) => {
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
    if (!formData.name || !formData.slug || !formData.price_per_night) {
      toast.error('Nome, slug e preço são obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        destination_id: formData.destination_id || null,
        listing_type: formData.listing_type,
        short_description: formData.short_description || null,
        description: formData.description || null,
        address: formData.address || null,
        image_url: formData.image_url || null,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        max_guests: formData.max_guests ? parseInt(formData.max_guests) : null,
        price_per_night: parseFloat(formData.price_per_night),
        currency: formData.currency,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        is_featured: formData.is_featured,
        is_verified: formData.is_verified,
      };

      if (editingItem) {
        await accommodationsApi.update(editingItem.id, payload);
        toast.success('Hospedagem atualizada com sucesso');
      } else {
        await accommodationsApi.create(payload);
        toast.success('Hospedagem criada com sucesso');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Erro ao salvar hospedagem');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    
    setIsSaving(true);
    try {
      await accommodationsApi.delete(deletingItem.id);
      toast.success('Hospedagem excluída com sucesso');
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir hospedagem');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Imagem',
      render: (item: Accommodation) => (
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
      key: 'listing_type',
      label: 'Tipo',
      render: (item: Accommodation) => (
        <Badge variant="outline">{listingTypes.find(t => t.value === item.listing_type)?.label}</Badge>
      ),
    },
    {
      key: 'price',
      label: 'Preço/Noite',
      render: (item: Accommodation) => (
        <span className="font-medium">{item.currency} {item.price_per_night}</span>
      ),
    },
    {
      key: 'rating',
      label: 'Avaliação',
      render: (item: Accommodation) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-kamba-gold fill-current" />
          <span>{item.rating?.toFixed(1) || '0.0'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Accommodation) => (
        <div className="flex gap-1">
          {item.is_verified && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {item.is_featured && (
            <Badge className="bg-kamba-gold/20 text-kamba-gold text-xs">Destaque</Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Hospedagens</h1>
          <p className="text-muted-foreground">Gerencie hotéis, pousadas e apartamentos</p>
        </div>

        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar hospedagens..."
          onAdd={openCreateDialog}
          addLabel="Nova Hospedagem"
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
            <DialogTitle>{editingItem ? 'Editar Hospedagem' : 'Nova Hospedagem'}</DialogTitle>
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
                <Label>Tipo</Label>
                <Select
                  value={formData.listing_type}
                  onValueChange={(value: Accommodation['listing_type']) => 
                    setFormData({ ...formData, listing_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {listingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
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
              <Label htmlFor="amenities">Comodidades (separadas por vírgula)</Label>
              <Input
                id="amenities"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="WiFi, Piscina, Estacionamento, Restaurante"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_guests">Máx. Hóspedes</Label>
                <Input
                  id="max_guests"
                  type="number"
                  value={formData.max_guests}
                  onChange={(e) => setFormData({ ...formData, max_guests: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_per_night">Preço/Noite *</Label>
                <Input
                  id="price_per_night"
                  type="number"
                  step="0.01"
                  value={formData.price_per_night}
                  onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                />
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

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Destaque</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_verified"
                  checked={formData.is_verified}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
                />
                <Label htmlFor="is_verified">Verificado</Label>
              </div>
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
