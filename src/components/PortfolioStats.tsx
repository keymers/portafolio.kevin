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
    <div className="w-full flex justify-center mt-12 px-4">
      <div className="bg-secondary/30 backdrop-blur-sm rounded-xl border border-accent/30 px-3 sm:px-6 py-3 w-full max-w-3xl">
        <div className="w-full flex items-center justify-center divide-x divide-accent/20 max-[453px]:divide-none">
          <div className="flex-1 basis-1/3 min-w-0 text-center whitespace-nowrap px-3 max-[453px]:px-2 max-[390px]:px-1">
            <div className="text-xl sm:text-2xl md:text-3xl max-[453px]:text-lg max-[390px]:text-base max-[375px]:text-sm font-bold tracking-tight text-blue-400">{projectsCount ?? '-'}</div>
            <div className="text-[12px] sm:text-sm max-[453px]:text-[11px] max-[390px]:text-[10px] max-[375px]:text-[9.5px] text-gray-400 leading-tight">Proyectos</div>
          </div>
          <div className="flex-1 basis-1/3 min-w-0 text-center whitespace-nowrap px-3 max-[453px]:px-2 max-[390px]:px-1">
            <div className="text-xl sm:text-2xl md:text-3xl max-[453px]:text-lg max-[390px]:text-base max-[375px]:text-sm font-bold tracking-tight text-purple-400">{stats?.average ?? '-'}</div>
            <div className="text-[12px] sm:text-sm max-[453px]:text-[11px] max-[390px]:text-[10px] max-[375px]:text-[9.5px] text-gray-400 leading-tight">Calificación</div>
          </div>
          <div className="flex-1 basis-1/3 min-w-0 text-center whitespace-nowrap px-3 max-[453px]:px-2 max-[390px]:px-1">
            <div className="text-xl sm:text-2xl md:text-3xl max-[453px]:text-lg max-[390px]:text-base max-[375px]:text-sm font-bold tracking-tight text-pink-400">{stats?.fiveStarPercentage ?? '-'}%</div>
            <div className="text-[12px] sm:text-sm max-[453px]:text-[11px] max-[390px]:text-[10px] max-[375px]:text-[9.5px] text-gray-400 leading-tight">Satisfacción</div>
          </div>
        </div>
      </div>
    </div>
  );
} 