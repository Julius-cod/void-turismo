import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/ApiAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await authApi.updateProfile({
        full_name: fullName,
      });

      if (response.success) {
        await refreshUser();

        toast({
          title: 'Success',
          description: 'Profile updated successfully!',
        });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-wide max-w-2xl">
          <h1 className="font-serif text-3xl font-bold mb-8">My Profile</h1>

          <div className="bg-card rounded-2xl p-8 shadow-card">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-xl">
                  {user?.full_name || 'User'}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={user?.email || ''}
                  className="mt-2"
                  disabled
                />
              </div>

              <Button
                className="btn-gradient"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
