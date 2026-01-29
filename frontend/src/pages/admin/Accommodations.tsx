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
import { accommodationsApi, BACKEND_URL, destinationsApi, type Accommodation, type Destination } from '@/lib/api';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/ApiAuthContext';
import { TestApi } from '@/components/TestApi';

const listingTypes = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'lodge', label: 'Lodge' },
  { value: 'guesthouse', label: 'Pousada' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'apartment', label: 'Apartamento' },
];

export default function AdminAccommodations() {
  const { user, isLoading, isAdmin } = useAuth();

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Accommodation | null>(null);
  const [deletingItem, setDeletingItem] = useState<Accommodation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  interface AccommodationsResponse {
    data: Accommodation[];
    meta?: { last_page: number };
    success: boolean;
  }

  const fetchAccommodations = async () => {
    setLoading(true);
    try {
      const response: AccommodationsResponse = await accommodationsApi.list({
        page: currentPage,
        per_page: 10,
        search: debouncedSearch || undefined,
      });
      if (response.success) {
        setAccommodations(response.data);
        setTotalPages(response.meta?.last_page || 1);
      }
    } catch {
      toast.error('Erro ao carregar hospedagens');
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await destinationsApi.list({ per_page: 100 });
      if (response.success) {
        setDestinations(response.data);
      }
    } catch {
      console.error('Erro ao carregar destinos');
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) return;
    fetchAccommodations();
    fetchDestinations();
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
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Accommodation) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      destination_id: item.destination_id?.toString() || '',
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
    setSelectedFile(null);
    setPreviewUrl(item.image_url ? `${BACKEND_URL}${item.image_url}` : null);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (item: Accommodation) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

 const handleSave = async () => {
  console.log('🎬 === HANDLE SAVE INICIADO ===');
  
  // Validação básica
  if (!formData.name || !formData.slug || !formData.price_per_night) {
    console.error('❌ Validação falhou: Nome, slug ou preço faltando');
    toast.error('Nome, slug e preço são obrigatórios');
    return;
  }
  
  console.log('✅ Validação passou');
  console.log('📝 Dados do formulário:', formData);

  setIsSaving(true);

  try {
    // Construir payload EXATAMENTE como deve ser
    const payload: any = {
      name: formData.name,
      slug: formData.slug,
      destination_id: formData.destination_id || '', // string vazia, não null
      listing_type: formData.listing_type,
      price_per_night: formData.price_per_night,
      currency: formData.currency || 'USD',
      short_description: formData.short_description || '',
      description: formData.description || '',
      address: formData.address || '',
      amenities: formData.amenities ? 
        formData.amenities.split(',').map((a: string) => a.trim()) : 
        [],
      bedrooms: formData.bedrooms || '',
      bathrooms: formData.bathrooms || '',
      max_guests: formData.max_guests || '',
      latitude: formData.latitude || '',
      longitude: formData.longitude || '',
      is_featured: formData.is_featured,
      is_verified: formData.is_verified,
    };

    console.log('📦 Payload construído:', payload);

    // Adicionar arquivo de imagem se existir
    const fileInput = document.getElementById('image_file') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      console.log('🖼️  Arquivo encontrado:', fileInput.files[0].name);
      payload.image_file = fileInput.files[0];
    } else {
      console.log('📷 Nenhum arquivo de imagem selecionado');
    }

    console.log('🚀 Chamando API...');
    
    let response;
    if (editingItem) {
      console.log('✏️  Modo: EDITAR (update)');
      response = await accommodationsApi.update(editingItem.id, payload);
      toast.success('Hospedagem atualizada com sucesso');
    } else {
      console.log('🆕 Modo: CRIAR (create)');
      response = await accommodationsApi.create(payload);
      toast.success('Hospedagem criada com sucesso');
    }

    console.log('✅ Resposta da API:', response);
    
    setIsDialogOpen(false);
    fetchAccommodations();
    
  } catch (error) {
    console.error('💣 ERRO em handleSave:', error);
    toast.error('Erro ao salvar hospedagem');
  } finally {
    setIsSaving(false);
    console.log('🏁 === HANDLE SAVE FINALIZADO ===\n\n');
  }
};

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsSaving(true);
    try {
      await accommodationsApi.delete(deletingItem.id);
      toast.success('Hospedagem excluída com sucesso');
      setIsDeleteDialogOpen(false);
      fetchAccommodations();
    } catch {
      toast.error('Erro ao excluir hospedagem');
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
      render: (item: Accommodation) => (
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
          {item.image_url ? (
            <img
              src={item.image_url ? `${BACKEND_URL}${item.image_url}` : undefined}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Sem foto</div>
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
      render: (item: Accommodation) => {
        const ratingNumber = Number(item.rating);
        return (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-kamba-gold fill-current" />
            <span>{!isNaN(ratingNumber) ? ratingNumber.toFixed(1) : '0.0'}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Accommodation) => (
        <div className="flex gap-1">
          {item.is_verified && <CheckCircle className="w-4 h-4 text-green-500" />}
          {item.is_featured && <Badge className="bg-kamba-gold/20 text-kamba-gold text-xs">Destaque</Badge>}
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
          data={accommodations}
          isLoading={loading}
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

        {/* Dialogs de criar/editar */}
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
                        <SelectItem key={dest.id} value={dest.id.toString()}>
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
                      <SelectValue placeholder="Selecione o tipo" />
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
                <Label htmlFor="image_file">Imagem (arquivo)</Label>
                <Input
                  id="image_file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  disabled={isSaving}
                />
                {previewUrl && (
                  <div className="w-32 h-20 rounded-lg overflow-hidden mt-2 border">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving || isUploading}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving || isUploading}>
                {isUploading ? 'Enviando imagem...' : isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de delete */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p>
              Tem certeza que deseja excluir a hospedagem <strong>{deletingItem?.name}</strong>? Esta ação não pode ser
              desfeita.
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
      </div>


 
    </AdminLayout>
  );
}