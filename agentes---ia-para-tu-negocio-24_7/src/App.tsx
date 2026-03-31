/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Brain, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Globe, 
  Megaphone, 
  DollarSign, 
  Menu, 
  X,
  ChevronDown,
  ChevronUp,
  Layout,
  Repeat,
  Monitor,
  AlertCircle,
  Lightbulb,
  Workflow,
  Cpu,
  HelpCircle,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Cómo funciona', href: '#como-funciona' },
    { name: 'Casos de uso', href: '#casos-de-uso' },
    { name: 'Precios', href: '#precios' },
    { name: 'Blog', href: '#' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-whatsapp flex items-center justify-center rounded-lg">
            <Cpu className="text-white" size={18} />
          </div>
          <span className="font-extrabold text-xl tracking-tighter uppercase">Agentes</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-whatsapp transition-colors">
              {link.name}
            </a>
          ))}
          <button className="bg-whatsapp hover:bg-whatsapp-dark text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-whatsapp/20">
            Empezar
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden flex flex-col p-6 gap-4 border-b border-gray-100"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-wider text-gray-800">
                {link.name}
              </a>
            ))}
            <button className="bg-whatsapp text-white py-4 rounded-xl font-bold text-lg">
              Empezar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 py-6">
      <button 
        className="w-full flex justify-between items-center text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-gray-900 uppercase tracking-tight text-sm group-hover:text-whatsapp transition-colors">{question}</span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-whatsapp text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
          <ChevronDown size={14} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-gray-500 text-sm pb-2 pt-6 leading-relaxed max-w-2xl">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-whatsapp/30 grid-pattern">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-24 px-6 overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-whatsapp/5 text-whatsapp px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest mb-8 technical-border"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-whatsapp opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-whatsapp"></span>
            </span>
            Disponible ahora
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-8"
          >
            IA QUE TRABAJA <br />
            <span className="text-whatsapp">POR TU NEGOCIO</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Automatiza tareas, atiende clientes y ejecuta procesos directamente desde WhatsApp. 
            Sin fricción, sin demoras, sin errores.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <button className="group bg-whatsapp hover:bg-whatsapp-dark text-white px-12 py-5 rounded-lg font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-whatsapp/20 flex items-center gap-3">
              Quiero mi agente
              <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" size={18} />
            </button>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              <ShieldCheck size={14} className="text-whatsapp" />
              Setup rápido • Resultados inmediatos
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- PROBLEMA SECTION --- */}
      <section className="py-32 px-6 bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="text-red-500" size={16} />
                <span className="text-red-500 font-bold uppercase tracking-widest text-[10px]">Ineficiencia Operativa</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-8 tracking-tight leading-tight">Tu negocio pierde capital en tareas que no escalan</h2>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                El trabajo manual y la falta de respuesta inmediata son los principales frenos para el crecimiento de cualquier empresa moderna.
              </p>
              <div className="grid gap-4">
                {[
                  "Clientes sin respuesta en tiempo real",
                  "Procesos manuales que consumen horas",
                  "Sistemas desactualizados o mal mantenidos",
                  "Saturación por carga operativa básica"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-6 h-6 bg-red-50 text-red-500 rounded-md flex items-center justify-center shrink-0">
                      <X size={14} />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-1 technical-border rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <div className="mono-label">Métrica de pérdida</div>
                    <TrendingDown className="text-red-500" size={20} />
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        className="h-full bg-red-500"
                      />
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '60%' }}
                        className="h-full bg-red-400"
                      />
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '45%' }}
                        className="h-full bg-red-300"
                      />
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="text-3xl font-black text-gray-900">-$2,400<span className="text-sm font-medium text-gray-400 ml-2">/mes promedio</span></div>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOLUCIÓN SECTION --- */}
      <section className="py-32 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lightbulb className="text-whatsapp" size={16} />
            <span className="text-whatsapp font-bold uppercase tracking-widest text-[10px]">La Solución</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight">Un empleado digital que ejecuta por ti</h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-20 leading-relaxed">
            Tu agente de IA no solo responde — trabaja activamente en tu negocio. 
            Integración total con <span className="font-bold text-whatsapp">WhatsApp</span> para una operación sin fricciones.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <MessageSquare />, title: "Atención al cliente automatizada", desc: "Soporte nivel 1 sin intervención humana." },
              { icon: <Workflow />, title: "Ejecución de flujos lógicos", desc: "Toma decisiones basadas en tus reglas de negocio." },
              { icon: <Layout />, title: "Sistemas y presencia digital", desc: "Mantenimiento activo de tu infraestructura." },
              { icon: <Repeat />, title: "Integración de ecosistemas", desc: "Conecta tus herramientas favoritas en un solo flujo." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl technical-border hover:shadow-xl hover:border-whatsapp/30 transition-all group text-left">
                <div className="w-10 h-10 bg-gray-50 technical-border text-whatsapp rounded-lg flex items-center justify-center mb-6 group-hover:bg-whatsapp group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-tight">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENEFICIOS SECTION --- */}
      <section className="py-32 px-6 bg-gray-900 text-white border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-end mb-24">
            <div>
              <div className="mono-label text-whatsapp mb-6">Resultados de alto impacto</div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-tight">Más eficiencia. Menos costo. <br />Más crecimiento.</h2>
            </div>
            <div className="text-gray-400 text-lg leading-relaxed max-w-md">
              Desbloquea el potencial de tu equipo eliminando las tareas repetitivas que consumen el 70% de su tiempo productivo.
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Clock />, title: "Disponibilidad 24/7", desc: "Respuesta instantánea en cualquier zona horaria, sin pausas." },
              { icon: <TrendingDown />, title: "Optimización de costos", desc: "Escala tu operación sin aumentar proporcionalmente tu nómina." },
              { icon: <TrendingUp />, title: "Conversión acelerada", desc: "Seguimiento preciso que convierte leads en clientes reales." },
              { icon: <Brain />, title: "Operación centralizada", desc: "Toda la inteligencia de tu negocio en un canal familiar." }
            ].map((benefit, i) => (
              <div key={i} className="space-y-6">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-whatsapp border border-white/10">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CASOS DE USO SECTION --- */}
      <section id="casos-de-uso" className="py-32 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Workflow className="text-whatsapp" size={16} />
                <span className="text-whatsapp font-bold uppercase tracking-widest text-[10px]">Casos de Uso</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Capacidades de ejecución real</h2>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-whatsapp transition-colors flex items-center gap-2">
              Ver documentación <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
            {[
              { icon: <MessageSquare />, title: "Atención al cliente", desc: "Gestión de tickets, resolución de dudas y cierre de ventas asistido.", tag: "Soporte" },
              { icon: <Repeat />, title: "Automatización de procesos", desc: "Sincronización de datos, reportes automáticos y facturación recurrente.", tag: "Operaciones" },
              { icon: <Globe />, title: "Infraestructura digital", desc: "Despliegue de landing pages y mantenimiento de sistemas internos.", tag: "Tech" },
              { icon: <Megaphone />, title: "Generación de contenido", desc: "Creación de copys, diseño de assets y gestión de publicaciones.", tag: "Marketing" },
              { icon: <DollarSign />, title: "Ventas y CRM", desc: "Calificación de leads y actualización automática de embudos.", tag: "Sales" },
              { icon: <Monitor />, title: "Monitoreo de sistemas", desc: "Detección proactiva de fallos y autorecuperación de servicios.", tag: "DevOps" }
            ].map((useCase, i) => (
              <div key={i} className="p-10 bg-white border border-gray-100 hover:bg-gray-50 transition-colors group">
                <div className="flex justify-between items-start mb-8">
                  <div className="text-whatsapp group-hover:scale-110 transition-transform">{useCase.icon}</div>
                  <div className="mono-label">{useCase.tag}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-tight">{useCase.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CÓMO FUNCIONA SECTION --- */}
      <section id="como-funciona" className="py-32 px-6 bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Workflow className="text-whatsapp" size={16} />
              <span className="text-whatsapp font-bold uppercase tracking-widest text-[10px]">Implementación</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Despliegue ágil en tres etapas</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              { step: "01", title: "Análisis de procesos", desc: "Identificamos los cuellos de botella y las tareas candidatas a automatización." },
              { step: "02", title: "Configuración técnica", desc: "Adaptamos el agente a tu stack tecnológico y reglas de negocio específicas." },
              { step: "03", title: "Ejecución operativa", desc: "El agente comienza a operar vía WhatsApp, integrándose en tu flujo diario." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl technical-border relative">
                <div className="mono-label text-whatsapp mb-6">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CAPACIDADES SECTION --- */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-3xl p-12 md:p-20 text-white relative overflow-hidden border border-white/5">
          <div className="relative z-10">
            <div className="mono-label text-whatsapp mb-8">Especificaciones técnicas</div>
            <h2 className="text-3xl md:text-4xl font-black mb-12 tracking-tight uppercase">Más que un asistente: Un ejecutor</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Desarrollo de microservicios y sistemas",
                "Integración profunda vía API REST/Webhooks",
                "Automatización de flujos de trabajo internos",
                "Generación multimodal de activos digitales",
                "Análisis predictivo y toma de acciones",
                "Control de infraestructura y servicios"
              ].map((cap, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-whatsapp/20 rounded flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-whatsapp" size={12} />
                  </div>
                  <span className="text-gray-300 font-medium text-sm">{cap}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/10">
              <p className="text-lg font-mono text-whatsapp uppercase tracking-widest">Ejecución de nivel empresarial</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-whatsapp/10 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* --- PRECIOS SECTION --- */}
      <section id="precios" className="py-32 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-6">
              <DollarSign className="text-whatsapp" size={16} />
              <span className="text-whatsapp font-bold uppercase tracking-widest text-[10px]">Inversión</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Planes de escalabilidad</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan 1 */}
            <div className="bg-white p-12 rounded-3xl technical-border hover:shadow-2xl transition-all">
              <div className="mono-label mb-4">Entry Level</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Agente Compartido</h3>
              <p className="text-gray-400 mb-8 text-sm font-medium">Validación y automatización inicial</p>
              <div className="mb-10">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">$300</span>
                <span className="text-gray-400 font-bold ml-2">/MES</span>
                <p className="mono-label mt-2">~S/1,140</p>
              </div>
              <ul className="space-y-4 mb-12">
                {["Acceso a motor de IA", "Flujos de trabajo estándar", "Integraciones vía Zapier/Make", "Soporte técnico prioritario"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <CheckCircle2 className="text-whatsapp" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-lg bg-gray-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                Seleccionar Plan
              </button>
            </div>

            {/* Plan 2 */}
            <div className="bg-whatsapp p-12 rounded-3xl text-white shadow-2xl shadow-whatsapp/20 relative overflow-hidden">
              <div className="absolute top-8 right-8 bg-white/20 text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
                Enterprise
              </div>
              <div className="mono-label text-white/60 mb-4">High Performance</div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Agente Dedicado</h3>
              <p className="text-white/80 mb-8 text-sm font-medium">Infraestructura exclusiva para escalado</p>
              <div className="mb-10">
                <span className="text-5xl font-black tracking-tighter">$500</span>
                <span className="text-white/60 font-bold ml-2">/MES</span>
                <p className="mono-label text-white/40 mt-2">~S/1,900</p>
              </div>
              <ul className="space-y-4 mb-12">
                {["Instancia de IA dedicada", "Automatizaciones de alta complejidad", "Desarrollo de integraciones custom", "SLA de respuesta garantizado"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-white/90">
                    <CheckCircle2 className="text-white" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-lg bg-white text-whatsapp font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-xl">
                Seleccionar Plan
              </button>
            </div>
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16">
            {["Dominio .com", "Hosting VPS", "Monitoreo 24/7", "WhatsApp API", "Discord Access"].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <ShieldCheck className="text-whatsapp" size={14} />
                <span className="mono-label">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FORMULARIO SECTION --- */}
      <section className="py-32 px-6 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="text-whatsapp" size={16} />
              <span className="text-whatsapp font-bold uppercase tracking-widest text-[10px]">Contacto</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-8 tracking-tight uppercase">Inicia la transformación</h2>
            <p className="text-gray-500 mb-12 leading-relaxed">
              Completa el formulario para recibir una propuesta técnica adaptada a las necesidades específicas de tu operación.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white technical-border rounded-lg flex items-center justify-center text-whatsapp">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Tiempo de respuesta</div>
                  <div className="text-sm font-bold text-gray-900">Menos de 24 horas</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl technical-border shadow-2xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="mono-label ml-1">Nombre del negocio</label>
                <input type="text" placeholder="Corporación X" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:ring-1 focus:ring-whatsapp focus:bg-white transition-all text-sm outline-none" />
              </div>
              <div className="space-y-2">
                <label className="mono-label ml-1">Áreas de optimización</label>
                <textarea placeholder="Describa los procesos a automatizar..." rows={3} className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:ring-1 focus:ring-whatsapp focus:bg-white transition-all text-sm outline-none resize-none"></textarea>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="mono-label ml-1">Email corporativo</label>
                  <input type="email" placeholder="admin@empresa.com" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:ring-1 focus:ring-whatsapp focus:bg-white transition-all text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="mono-label ml-1">WhatsApp de contacto</label>
                  <input type="tel" placeholder="+51 999 999 999" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:ring-1 focus:ring-whatsapp focus:bg-white transition-all text-sm outline-none" />
                </div>
              </div>
              <button className="w-full py-5 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-whatsapp/20 transition-all">
                Enviar Solicitud
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-6">
              <HelpCircle className="text-whatsapp" size={16} />
              <span className="text-whatsapp font-bold uppercase tracking-widest text-[10px]">FAQ</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Consultas técnicas</h2>
          </div>

          <div className="technical-border rounded-3xl p-8 bg-white">
            <FAQItem 
              question="¿Requiere infraestructura propia?" 
              answer="No. Nosotros gestionamos el despliegue en servidores VPS dedicados de alta disponibilidad, asegurando que tu agente esté operativo el 99.9% del tiempo." 
            />
            <FAQItem 
              question="¿Es compatible con mi stack actual?" 
              answer="Sí. El agente se integra mediante webhooks y APIs estándar con la mayoría de CRMs, ERPs y herramientas de gestión del mercado." 
            />
            <FAQItem 
              question="¿Cuál es el tiempo de despliegue?" 
              answer="El tiempo promedio de configuración y entrenamiento es de 5 a 7 días hábiles, dependiendo de la complejidad de los flujos de trabajo." 
            />
            <FAQItem 
              question="¿Cómo se garantiza la seguridad?" 
              answer="Implementamos protocolos de cifrado de extremo a extremo y cumplimos con estándares de privacidad para asegurar que la información de tu negocio esté protegida." 
            />
          </div>
        </div>
      </section>

      {/* --- CTA FINAL SECTION --- */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-3xl p-16 md:p-24 text-center text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase leading-none">Escala tu operación <br /><span className="text-whatsapp">sin límites</span></h2>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-xl mx-auto font-medium">
              Deja de gestionar tareas. Empieza a liderar el crecimiento de tu negocio.
            </p>
            <button className="bg-whatsapp text-white px-12 py-6 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-whatsapp-dark transition-all shadow-2xl shadow-whatsapp/30">
              Activar mi agente ahora
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full grid-pattern opacity-10"></div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 px-6 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-whatsapp flex items-center justify-center rounded">
                <Cpu className="text-white" size={12} />
              </div>
              <span className="font-extrabold text-lg tracking-tighter uppercase">Agentes</span>
            </div>
            <div className="mono-label">by Luminari Agency © 2026</div>
          </div>

          <div className="flex gap-10">
            <a href="#" className="mono-label hover:text-whatsapp transition-colors">Privacidad</a>
            <a href="#" className="mono-label hover:text-whatsapp transition-colors">Términos</a>
            <a href="#" className="mono-label hover:text-whatsapp transition-colors">Blog</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
