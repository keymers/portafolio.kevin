export interface Project {
  name: string;
  tech: string;
  desc: string;
  url?: string;
}

export const projects: Project[] = [
  {
    name: 'Portfolio KGL',
    tech: 'Astro, React, TailwindCSS',
    desc: 'Mi portafolio personal con efectos cyberpunk, terminal interactiva y animaciones.',
    url: 'https://github.com/keymers/portafolio.kevin.git',
  },
  {
    name: 'API de Tareas',
    tech: 'Node.js, Express, MongoDB, C#',
    desc: 'API RESTful para gestión de tareas, con autenticación y panel de administración.'
  },
  {
    name: 'E-commerce Moderno',
    tech: 'React, C#, .NET, PostgreSQL',
    desc: 'Tienda online con pasarela de pagos, panel de usuario y dashboard de ventas.'
  },
  {
    name: 'App de Notas',
    tech: 'Vue, Firebase',
    desc: 'Aplicación web para tomar notas rápidas, sincronización en tiempo real y modo oscuro.'
  },
  // Puedes agregar más proyectos aquí
]; 