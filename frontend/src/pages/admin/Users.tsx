import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, Shield } from 'lucide-react';
import { usersApi, type User } from '@/lib/api';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/ApiAuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const roleColors: Record<string, string> = {
  user: 'bg-gray-100 text-gray-800',
  moderator: 'bg-blue-100 text-blue-800',
  admin: 'bg-purple-100 text-purple-800',
};

const roleLabels: Record<string, string> = {
  user: 'Usuário',
  moderator: 'Moderador',
  admin: 'Admin',
};

type UserWithBookings = User & { bookings_count?: number };

export default function AdminUsers() {
  const { user: currentUser, isLoading: authLoading, isAdmin } = useAuth();

  const [users, setUsers] = useState<UserWithBookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<UserWithBookings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const debouncedSearch = useDebounce(search, 300);

  interface UsersResponse {
    data: UserWithBookings[];
    meta?: { last_page: number };
    success: boolean;
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: currentPage,
        per_page: 10,
        search: debouncedSearch || undefined,
      };
      
      if (roleFilter && roleFilter !== 'all') {
        params.role = roleFilter;
      }
      
      const response: UsersResponse = await usersApi.list(params);
      
      if (response.success) {
        setUsers(response.data);
        setTotalPages(response.meta?.last_page || 1);
      }
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    fetchUsers();
  }, [currentPage, debouncedSearch, roleFilter, currentUser, isAdmin]);

  if (authLoading || !isAdmin)
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg text-muted-foreground">
        Carregando...
      </div>
    );

  const openDeleteDialog = (item: UserWithBookings) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleRoleChange = async (id: string, role: User['role']) => {
    // Não permitir alterar role do próprio usuário para não-admin
    if (currentUser?.id === id && role !== 'admin') {
      toast.error('Não é possível remover seu próprio acesso de admin');
      return;
    }

    setIsSaving(true);
    try {
      await usersApi.updateRole(id, role);
      toast.success('Role atualizada com sucesso');
      fetchUsers();
    } catch (error) {
      toast.error('Erro ao atualizar role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    
    // Não permitir deletar a si mesmo
    if (currentUser?.id === deletingItem.id) {
      toast.error('Não é possível excluir sua própria conta');
      setIsDeleteDialogOpen(false);
      return;
    }
    
    // Não permitir deletar outros admins
    if (deletingItem.role === 'admin') {
      toast.error('Não é possível excluir outros administradores');
      setIsDeleteDialogOpen(false);
      return;
    }
    
    setIsSaving(true);
    try {
      await usersApi.delete(deletingItem.id);
      toast.success('Usuário excluído com sucesso');
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Erro ao excluir usuário');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const columns = [
    {
      key: 'avatar',
      label: '',
      render: (item: UserWithBookings) => (
        <Avatar className="w-8 h-8">
          <AvatarImage src={item.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {getInitials(item.full_name)}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: 'name',
      label: 'Nome',
      render: (item: UserWithBookings) => (
        <div>
          <p className="font-medium">{item.full_name || 'Sem nome'}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (item: UserWithBookings) => (
        <Select
          value={item.role}
          onValueChange={(value: User['role']) => handleRoleChange(item.id, value)}
          disabled={isSaving || currentUser?.id === item.id}
        >
          <SelectTrigger className="w-32 h-8 px-2">
            <div className="w-full flex items-center gap-2">
              <Badge className={roleColors[item.role]}>
                {roleLabels[item.role]}
              </Badge>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Usuário</SelectItem>
            <SelectItem value="moderator">Moderador</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'bookings',
      label: 'Reservas',
      render: (item: UserWithBookings) => item.bookings_count || 0,
    },
    {
      key: 'created_at',
      label: 'Cadastro',
      render: (item: UserWithBookings) => (
        <span className="text-sm">
          {format(new Date(item.created_at), 'dd/MM/yyyy', { locale: ptBR })}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários da plataforma</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os roles</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="moderator">Moderador</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={users}
          isLoading={loading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por nome ou email..."
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          actions={(item) => (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => openDeleteDialog(item)}
              disabled={item.role === 'admin' || currentUser?.id === item.id}
              title={
                currentUser?.id === item.id 
                  ? "Não é possível excluir sua própria conta" 
                  : item.role === 'admin' 
                  ? "Não é possível excluir outros administradores" 
                  : "Excluir usuário"
              }
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          {deletingItem && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={deletingItem.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(deletingItem.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{deletingItem.full_name || 'Sem nome'}</p>
                    <p className="text-sm text-muted-foreground">{deletingItem.email}</p>
                    <Badge className={roleColors[deletingItem.role]}>
                      {roleLabels[deletingItem.role]}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Reservas: {deletingItem.bookings_count || 0}
                </p>
                
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ Esta ação não pode ser desfeita e irá remover todas as reservas associadas.
                </p>
              </div>
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSaving}>
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