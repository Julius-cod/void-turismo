import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { experiencesApi, BACKEND_URL } from '@/lib/api'; // ajusta o path se precisar
import type { Experience } from '@/lib/api';

export default function ExperienceDetail() {
  const { slug } = useParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchExperience = async () => {
      try {
        setLoading(true);
        const res = await experiencesApi.get(slug);
        setExperience(res.data);
      } catch (err: any) {
        setError('Erro ao carregar experiência');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-wide">
          {loading && <p>A carregar...</p>}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && experience && (
            <>
              <h1 className="font-serif text-4xl font-bold mb-4">
                {experience.name}
              </h1>

              {experience.image_url && (
                <img
                  src={experience.image_url ? `${BACKEND_URL}${experience.image_url}` : undefined}
                  alt={experience.name}
                  className="w-full max-h-[500px] object-cover rounded-xl mb-6"
                />
              )}

              <p className="text-muted-foreground mb-4">
                {experience.short_description}
              </p>

              <p className="mb-6">
                {experience.description}
              </p>

              <div className="flex gap-6 text-sm">
                <span>💰 {experience.price} {experience.currency}</span>
                {experience.duration_hours && (
                  <span>⏱ {experience.duration_hours}h</span>
                )}
                {experience.max_participants && (
                  <span>👥 máx {experience.max_participants}</span>
                )}
                <span>⭐ {experience.rating} ({experience.review_count})</span>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
