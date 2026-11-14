import React, { useEffect, useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { TestimonialsService } from '../services/testimonials';

/**
 * Estadísticas del portafolio.
 *
 * Se muestran siempre cifras reales (nunca "..." ni un mensaje de error):
 * los valores base son los del sitio y, si Supabase responde, se actualizan.
 */
export default function PortfolioStats() {
  const { supabase, loading: supabaseLoading } = useSupabase();
  const [projectsCount, setProjectsCount] = useState(3);
  const [average, setAverage] = useState(5);
  const [satisfaction, setSatisfaction] = useState(100);

  useEffect(() => {
    if (!supabase || supabaseLoading) return;

    let cancelled = false;

    async function fetchStats() {
      try {
        const stats = await TestimonialsService.getTestimonialStatsWithClient(supabase!);
        if (cancelled) return;
        if (stats.total > 0) {
          setAverage(Number(stats.average.toFixed(1)));
          setSatisfaction(Math.round(stats.fiveStarPercentage));
        }

        const { count, error } = await supabase!
          .from('projects')
          .select('id', { count: 'exact', head: true });
        if (!error && !cancelled && typeof count === 'number' && count > 0) {
          setProjectsCount(count);
        }
      } catch (err) {
        // Silencioso: los valores base ya están en pantalla.
        console.error('No se pudieron actualizar las estadísticas:', err);
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [supabase, supabaseLoading]);

  return (
    <div className="w-full flex justify-center mt-12 px-4">
      <div className="px-3 sm:px-6 py-3 w-full max-w-3xl">
        <div className="w-full flex items-center justify-center divide-x divide-slate-700/70 max-[453px]:divide-none">
          <div className="flex-1 basis-1/3 min-w-0 text-center whitespace-nowrap px-3 max-[453px]:px-2 max-[390px]:px-1">
            <div className="text-xl sm:text-2xl md:text-3xl max-[453px]:text-lg max-[390px]:text-base max-[375px]:text-sm font-bold tracking-tight text-white">
              {projectsCount}+
            </div>
            <div className="text-[12px] sm:text-sm max-[453px]:text-[11px] max-[390px]:text-[10px] max-[375px]:text-[9.5px] text-gray-400 leading-tight">
              Proyectos
            </div>
          </div>
          <div className="flex-1 basis-1/3 min-w-0 text-center whitespace-nowrap px-3 max-[453px]:px-2 max-[390px]:px-1">
            <div className="text-xl sm:text-2xl md:text-3xl max-[453px]:text-lg max-[390px]:text-base max-[375px]:text-sm font-bold tracking-tight text-white">
              {average.toFixed(1)}
            </div>
            <div className="text-[12px] sm:text-sm max-[453px]:text-[11px] max-[390px]:text-[10px] max-[375px]:text-[9.5px] text-gray-400 leading-tight">
              Calificación
            </div>
          </div>
          <div className="flex-1 basis-1/3 min-w-0 text-center whitespace-nowrap px-3 max-[453px]:px-2 max-[390px]:px-1">
            <div className="text-xl sm:text-2xl md:text-3xl max-[453px]:text-lg max-[390px]:text-base max-[375px]:text-sm font-bold tracking-tight text-white">
              {satisfaction}%
            </div>
            <div className="text-[12px] sm:text-sm max-[453px]:text-[11px] max-[390px]:text-[10px] max-[375px]:text-[9.5px] text-gray-400 leading-tight">
              Satisfacción
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
