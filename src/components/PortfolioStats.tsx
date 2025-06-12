import React, { useEffect, useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { TestimonialsService } from '../services/testimonials';

export default function PortfolioStats() {
  const { supabase, loading: supabaseLoading, error: supabaseError } = useSupabase();
  const [stats, setStats] = useState<{ average: number; fiveStarPercentage: number } | null>(null);
  const [projectsCount, setProjectsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (supabase && !supabaseLoading) {
        setLoading(true);
        try {
          // Obtener estadísticas de testimonios
          const testimonialStats = await TestimonialsService.getTestimonialStatsWithClient(supabase);
          setStats({
            average: testimonialStats.average,
            fiveStarPercentage: testimonialStats.fiveStarPercentage,
          });

          // Obtener número de proyectos desde Supabase
          const { count, error } = await supabase
            .from('projects')
            .select('id', { count: 'exact', head: true });
          if (error) {
            throw error;
          }
          setProjectsCount(count ?? 0);
        } catch (err) {
          setProjectsCount(null);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchStats();
  }, [supabase, supabaseLoading]);

  if (supabaseLoading || loading) {
    return (
      <div className="flex justify-center items-center space-x-8 mt-12 animate-pulse opacity-70">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">...</div>
          <div className="text-sm text-gray-400">Proyectos</div>
        </div>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-purple-400 to-transparent"></div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">...</div>
          <div className="text-sm text-gray-400">Calificación</div>
        </div>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-pink-400 to-transparent"></div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-400">...</div>
          <div className="text-sm text-gray-400">Satisfacción</div>
        </div>
      </div>
    );
  }

  if (supabaseError) {
    return <div className="text-center text-red-400 mt-8">Error cargando estadísticas</div>;
  }

  return (
    <div className="flex justify-center items-center space-x-8 mt-12">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-400">{projectsCount ?? '-'}</div>
        <div className="text-sm text-gray-400">Proyectos</div>
      </div>
      <div className="w-px h-12 bg-gradient-to-b from-transparent via-purple-400 to-transparent"></div>
      <div className="text-center">
        <div className="text-3xl font-bold text-purple-400">{stats?.average ?? '-'}</div>
        <div className="text-sm text-gray-400">Calificación</div>
      </div>
      <div className="w-px h-12 bg-gradient-to-b from-transparent via-pink-400 to-transparent"></div>
      <div className="text-center">
        <div className="text-3xl font-bold text-pink-400">{stats?.fiveStarPercentage ?? '-'}%</div>
        <div className="text-sm text-gray-400">Satisfacción</div>
      </div>
    </div>
  );
} 