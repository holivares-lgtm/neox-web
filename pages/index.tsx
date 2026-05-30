import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Menu, X, Phone, Mail, MapPin,
  ArrowRight, CheckCircle, Zap, Shield, Globe,
  Database, Cloud, Code, Users, TrendingUp,
  ChevronRight, Award, ExternalLink
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'NX Frontier', href: '#frontier' },
  { label: 'IBM Partner', href: '#ibm' },
  { label: 'Salesforce', href: '#salesforce' },
  { label: 'Clientes', href: '#clientes' },
  { label: 'Contacto', href: '#contacto' },
]

const STATS = [
  { value: '12+', label: 'Años de experiencia', icon: Award },
  { value: '50+', label: 'Clientes activos', icon: Users },
  { value: '200+', label: 'Proyectos entregados', icon: CheckCircle },
  { value: '99%', label: 'Tasa de retención', icon: TrendingUp },
]

const SERVICES = [
  {
    icon: Users,
    title: 'Consultoría & Capacitación',
    tagline: 'Estrategia que transforma organizaciones',
    description: 'Llevamos su empresa al siguiente nivel con planificación TI, gestión de proyectos y arquitectura de soluciones diseñadas para escalar.',
    bullets: ['Planificación TI estratégica', 'Gestión de Proyectos PMO', 'Arquitectura de Soluciones', 'Capacitación especializada'],
    color: '#00D4FF',
  },
  {
    icon: Shield,
    title: 'Soporte Productivo',
    tagline: 'Continuidad operativa garantizada',
    description: 'Su operación nunca se detiene. Soporte especializado en plataformas IBM, Oracle, Linux y Cloud con SLAs definidos y escalamiento inmediato.',
    bullets: ['SLAs garantizados', 'Plataformas IBM & Oracle', 'Cloud Computing', 'Plan de recuperación de desastres'],
    color: '#0066FF',
  },
  {
    icon: TrendingUp,
    title: 'Soluciones de Negocio',
    tagline: 'Tecnología que impulsa resultados',
    description: 'Implementamos las soluciones más potentes del mercado para que sus procesos funcionen con excelencia: Power BI, SAP, Filenet, DataCap y más.',
    bullets: ['Power BI & Analytics', 'IBM Content Manager', 'ERP SAP', 'Automatización de procesos'],
    color: '#00D4FF',
  },
  {
    icon: Code,
    title: 'Desarrollo a la Medida',
    tagline: 'Software que se adapta a usted',
    description: 'Desarrollamos e integramos sistemas únicos para su negocio usando Java, Cloud APIs y conectores a AWS, GCP y Azure.',
    bullets: ['Desarrollo Java enterprise', 'Integraciones Cloud (AWS/GCP/Azure)', 'APIs & Microservicios', 'Outsourcing especializado'],
    color: '#0066FF',
  },
]

const IBM_CONTENT = [
  'IBM Case Foundation (ex Filenet)',
  'IBM Case Manager',
  'IBM Content Foundation',
  'IBM Content Manager',
  'IBM Content Manager OnDemand',
  'IBM Datacap',
  'IBM Content Navigator',
]

const IBM_CLOUD = [
  'IBM DataPower Gateway',
  'IBM API Connect',
  'IBM WebSphere Application Server',
  'IBM Integration Bus',
  'IBM InfoSphere DataStage',
  'IBM Power Systems',
  'IBM z/OS & LinuxONE',
]

const SALESFORCE_FEATURES = [
  { icon: Zap, title: 'Despliegue Eficiente', desc: 'Transport Management entre ambientes con cero fricciones y máxima trazabilidad.' },
  { icon: Shield, title: 'Mesa de Soporte SLA', desc: 'Sistema de tickets propio con niveles de servicio garantizados y atención en español.' },
  { icon: Globe, title: 'Servicio Flexible', desc: 'Bolsa de horas adaptable mes a mes según las necesidades reales de su organización.' },
  { icon: Code, title: 'Desarrollo Apex & Lightning', desc: 'Componentes y automatizaciones a medida que potencian la experiencia de sus equipos.' },
]

const CLIENTS = [
  'Santander', 'Transbank', 'Banco de Chile', 'Cencosud',
  'Entel', 'Codelco', 'Albemarle', 'Equans',
  'Elecmetal', 'Edenred', 'PetroAmazonas EP', 'Nexus',
  'Reybanpac', 'Voltera', 'FashionSpark',
]

const PARTNERS = [
  'IBM', 'Salesforce', 'Oracle', 'Microsoft',
  'Red Hat', 'Rackspace', 'Nexsys', 'Adistec',
]

const FRONTIER_SOURCES = [
  { label: 'DynamoDB & S3', sub: 'Amazon AWS' },
  { label: 'MongoDB Atlas', sub: 'Cloud & On-Prem' },
  { label: 'Cloud Firestore', sub: 'Google Firebase' },
  { label: 'IBM OnDemand', sub: 'Content Manager' },
  { label: 'IBM Filenet', sub: 'Content Foundation' },
  { label: 'IBM CM', sub: 'Content Manager' },
]

function AnimatedCounter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const numeric = parseInt(value.replace(/\D/g, ''))
    const suffix = value.replace(/[0-9]/g, '')
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * numeric) + suffix)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value, duration])

  return <span ref={ref}>{display}</span>
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function GridBg() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }}
    />
  )
}

function GlowOrb({ className, color }: { className: string; color: string }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ filter: 'blur(80px)', background: color }}
    />
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}
      style={{
        background: scrolled ? 'rgba(10,25,47,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)' }}>
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Space Mono' }}>NX</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Neox</span>
        </a>
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+56233403759" className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
            style={{ color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
            <Phone size={14} />{'+56 2 3340 3759'}
          </a>
          <a href="#contacto" className="text-sm font-semibold px-5 py-2 rounded-lg"
            style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', color: '#0A192F' }}>
            Hablemos
          </a>
        </div>
        <button className="lg:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden px-6 pb-6 mt-4" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block py-3 text-sm font-medium border-b"
                style={{ color: 'var(--text-muted)', borderColor: 'rgba(255,255,255,0.05)' }}>
                {l.label}
              </a>
            ))}
            <a href="#contacto" onClick={() => setOpen(false)}
              className="mt-4 block text-center text-sm font-semibold px-5 py-3 rounded-lg"
              style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', color: '#0A192F' }}>
              Hablemos
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 120])
  const words = ['Transformamos', 'su', 'empresa', 'con', 'tecnología', 'que', 'genera', 'resultados.']

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop: '80px' }}>
      <GridBg />
      <GlowOrb className="top-1/4 left-1/4 w-96 h-96 opacity-20" color="#00D4FF" />
      <GlowOrb className="bottom-1/4 right-1/4 w-80 h-80 opacity-15" color="#0066FF" />
      {[...Array(12)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
            background: i % 2 === 0 ? '#00D4FF' : '#0066FF',
            left: `${10 + (i * 7.5)}%`, top: `${10 + (i * 6.8) % 80}%`, opacity: 0.4 }}
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      <motion.div style={{ y }} className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--accent)' }}>
            <span className="w-2 h-2 rounded-full bg-current" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }} />
            Silver Business Partner de IBM · 12 años en el mercado
          </motion.div>
          <h1 className="font-bold leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', letterSpacing: '-0.03em' }}>
            {words.map((word, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-3"
                style={{ color: i >= 5 ? undefined : 'white',
                  ...(i >= 5 ? { background: 'linear-gradient(135deg,#00D4FF,#0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}) }}>
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            className="text-lg leading-relaxed mb-10 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            Somos el socio estratégico TI que empresas líderes en Chile y Latinoamérica eligen para reducir costos, escalar operaciones e integrar tecnología de clase mundial.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-4">
            <a href="#contacto" className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', color: '#0A192F', boxShadow: '0 8px 32px rgba(0,212,255,0.3)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,212,255,0.45)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,212,255,0.3)' }}>
              Solicitar diagnóstico gratuito
              <ArrowRight size={16} />
            </a>
            <a href="#servicios" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{ border: '1px solid rgba(0,212,255,0.3)', color: 'var(--text)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              Ver servicios <ChevronDown size={16} />
            </a>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: 'var(--text-muted)' }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ChevronDown size={18} /></motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Stats() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(0,212,255,0.05),rgba(0,102,255,0.05))', borderTop: '1px solid rgba(0,212,255,0.1)', borderBottom: '1px solid rgba(0,212,255,0.1)' }} />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.1} className="text-center">
              <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'Space Mono', color: 'var(--accent)' }}>
                <AnimatedCounter value={s.value} />
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  const [active, setActive] = useState(0)
  const s = SERVICES[active]

  return (
    <section id="servicios" className="relative py-28 overflow-hidden">
      <GridBg />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="mb-16">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--accent)', fontFamily: 'Space Mono' }}>// Servicios</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Todo lo que su empresa<br />
            <span style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>necesita para crecer</span>
          </h2>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            Cuatro pilares de servicio diseñados para cubrir el ciclo completo de transformación digital de su organización.
          </p>
        </FadeUp>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-3">
            {SERVICES.map((svc, i) => (
              <motion.button key={svc.title} onClick={() => setActive(i)} whileHover={{ x: 4 }}
                className="text-left p-5 rounded-2xl transition-all duration-300"
                style={{ background: active === i ? 'rgba(0,212,255,0.08)' : 'rgba(13,33,55,0.4)', border: `1px solid ${active === i ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.05)'}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: active === i ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)' }}>
                    <svc.icon size={18} style={{ color: active === i ? 'var(--accent)' : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: active === i ? 'white' : 'var(--text-muted)' }}>{svc.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: active === i ? 'var(--accent)' : 'transparent' }}>{svc.tagline}</div>
                  </div>
                  <ChevronRight size={16} className="ml-auto" style={{ color: active === i ? 'var(--accent)' : 'transparent' }} />
                </div>
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }} className="rounded-2xl p-8"
              style={{ background: 'rgba(13,33,55,0.7)', border: '1px solid rgba(0,212,255,0.15)', backdropFilter: 'blur(12px)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${s.color}22` }}>
                <s.icon size={26} style={{ color: s.color }} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--accent)' }}>{s.tagline}</p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{s.description}</p>
              <ul className="space-y-3">
                {s.bullets.map(b => (
                  <li key={b} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text)' }}>
                    <CheckCircle size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} /> {b}
                  </li>
                ))}
              </ul>
              <a href="#contacto" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                Solicitar este servicio <ArrowRight size={14} />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Frontier() {
  return (
    <section id="frontier" className="relative py-28 overflow-hidden">
      <GlowOrb className="top-0 right-0 w-[500px] h-[500px] opacity-10" color="#0066FF" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp className="order-2 lg:order-1">
            <div className="relative flex flex-col items-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle,rgba(0,212,255,0.15),transparent 70%)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
                <div className="w-32 h-32 rounded-2xl flex items-center justify-center relative z-10"
                  style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,102,255,0.2))', border: '1px solid rgba(0,212,255,0.4)' }}>
                  <div className="text-center">
                    <Database size={32} style={{ color: 'var(--accent)', margin: '0 auto 4px' }} />
                    <span className="text-xs font-bold tracking-widest block" style={{ color: 'var(--accent)', fontFamily: 'Space Mono' }}>NX</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>FRONTIER</span>
                  </div>
                </div>
                {[80, 110].map((r, ri) => (
                  <motion.div key={r} className="absolute rounded-full"
                    style={{ width: r * 2, height: r * 2, top: `calc(50% - ${r}px)`, left: `calc(50% - ${r}px)`, border: `1px solid rgba(0,212,255,${ri === 0 ? 0.25 : 0.12})` }}
                    animate={{ rotate: ri === 0 ? 360 : -360 }}
                    transition={{ duration: ri === 0 ? 20 : 30, repeat: Infinity, ease: 'linear' }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                {FRONTIER_SOURCES.map((src, i) => (
                  <motion.div key={src.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }} className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(0,212,255,0.12)' }}>
                    <div className="font-semibold text-white text-xs">{src.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{src.sub}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>
          <div className="order-1 lg:order-2">
            <FadeUp>
              <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--accent)', fontFamily: 'Space Mono' }}>// Producto propio</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
                NX Frontier<br />
                <span style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Reportes masivos</span><br />
                sin límites
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                El motor de generación de reportes más versátil del mercado. Procese millones de documentos en batch, desde cualquier fuente de datos, en todos los formatos que su negocio necesita.
              </p>
            </FadeUp>
            {[
              { icon: Zap, title: 'Multi-formato nativo', desc: 'PDF, PS, RTF, TXT, JSON, XML, PNG, JPG y más — sin configuración adicional.' },
              { icon: Database, title: 'Conector universal', desc: 'AWS, MongoDB, Firebase, IBM OnDemand, Filenet y Content Manager en una sola solución.' },
              { icon: Cloud, title: 'Cloud & OnPremise', desc: 'Docker, Kubernetes, Windows, Linux o AIX. Se adapta a su infraestructura actual.' },
              { icon: Shield, title: 'Control de acceso enterprise', desc: 'AWS Cognito, Firebase Auth o gestor propio con perfiles por usuario, grupo y fuente de datos.' },
            ].map((f, i) => (
              <FadeUp key={f.title} delay={0.15 + i * 0.08}>
                <div className="flex gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(0,212,255,0.1)' }}>
                    <f.icon size={17} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">{f.title}</div>
                    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
            <FadeUp delay={0.5}>
              <a href="#contacto" className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', color: '#0A192F' }}>
                Demo de NX Frontier <ArrowRight size={15} />
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}

function IBM() {
  const [tab, setTab] = useState<'content' | 'cloud'>('content')
  return (
    <section id="ibm" className="relative py-28 overflow-hidden">
      <GridBg />
      <GlowOrb className="bottom-0 left-0 w-96 h-96 opacity-10" color="#00D4FF" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeUp>
              <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--accent)', fontFamily: 'Space Mono' }}>// IBM Silver Partner</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
                Respaldo IBM<br />
                <span style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>certificado</span>
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                Como Silver Business Partner del programa IBM PartnerWorld, le ofrecemos acceso privilegiado a licenciamiento, implementaciones y soporte experto en toda la gama de productos IBM.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="p-6 rounded-2xl mb-8" style={{ background: 'rgba(13,33,55,0.7)', border: '1px solid rgba(0,212,255,0.15)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Award size={20} style={{ color: 'var(--accent)' }} />
                  <span className="font-semibold text-white">Lo que incluye nuestra alianza IBM</span>
                </div>
                {['Venta y renovación de licenciamiento', 'Instalaciones, upgrades y migraciones', 'Desarrollos e integraciones certificadas', 'Soporte y mejora continua'].map(item => (
                  <div key={item} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <CheckCircle size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
          <div>
            <FadeUp delay={0.1}>
              <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(0,212,255,0.1)' }}>
                {(['content', 'cloud'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                    style={{ background: tab === t ? 'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(0,102,255,0.15))' : 'transparent', color: tab === t ? 'white' : 'var(--text-muted)', border: tab === t ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent' }}>
                    {t === 'content' ? 'Content Manager' : 'Hybrid Cloud'}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 gap-2">
                  {(tab === 'content' ? IBM_CONTENT : IBM_CLOUD).map((item, i) => (
                    <motion.div key={item} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                      style={{ background: 'rgba(13,33,55,0.5)', border: '1px solid rgba(0,212,255,0.07)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.05)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(13,33,55,0.5)' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                      <span className="text-sm" style={{ color: 'var(--text)' }}>{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}

function Salesforce() {
  return (
    <section id="salesforce" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent,rgba(0,102,255,0.05),transparent)' }} />
      <GlowOrb className="top-1/2 right-0 w-96 h-96 opacity-10" color="#0066FF" />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--accent)', fontFamily: 'Space Mono' }}>// Partner Salesforce</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Maximice el retorno<br />
            <span style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>de su inversión en Salesforce</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Consultores certificados que dominan la plataforma de punta a punta. Desde implementación hasta soporte continuo, con un modelo de bolsa de horas que se ajusta a su ritmo de negocio.
          </p>
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SALESFORCE_FEATURES.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.1}>
              <div className="p-6 rounded-2xl h-full transition-all duration-300"
                style={{ background: 'rgba(13,33,55,0.6)', border: '1px solid rgba(0,212,255,0.1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,212,255,0.1)' }}>
                  <f.icon size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.3} className="text-center">
          <div className="inline-flex flex-wrap gap-3 justify-center p-6 rounded-2xl"
            style={{ background: 'rgba(13,33,55,0.5)', border: '1px solid rgba(0,212,255,0.12)' }}>
            {['Desarrollo Apex & Lightning', 'Automatización de Eventos', 'Pruebas Unitarias', 'Gestión de Requerimientos', 'Administración', 'Transport Management'].map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--text)', border: '1px solid rgba(0,212,255,0.2)' }}>
                {tag}
              </span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function Clients() {
  return (
    <section id="clientes" className="relative py-28 overflow-hidden">
      <GridBg />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--accent)', fontFamily: 'Space Mono' }}>// Clientes que confían en nosotros</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Las empresas más grandes<br />
            <span style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ya trabajan con Neox</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Bancos, telcos, mineras, retail y energía. Industrias distintas, el mismo estándar de excelencia.
          </p>
        </FadeUp>
        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {CLIENTS.map((c, i) => (
            <motion.div key={c} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }} whileHover={{ y: -2, borderColor: 'rgba(0,212,255,0.4)', color: 'white' }}
              className="px-5 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(13,33,55,0.7)', border: '1px solid rgba(0,212,255,0.12)', color: 'var(--text)' }}>
              {c}
            </motion.div>
          ))}
        </div>
        <FadeUp className="text-center">
          <div className="mb-6 text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
            Partners & Alianzas estratégicas
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map((p, i) => (
              <motion.div key={p} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }} whileHover={{ color: 'var(--accent)', borderColor: 'rgba(0,212,255,0.25)' }}
                className="px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(13,33,55,0.5)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)', fontFamily: 'Space Mono', letterSpacing: '0.05em' }}>
                {p}
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contacto" className="relative py-28 overflow-hidden">
      <GlowOrb className="bottom-0 right-1/4 w-96 h-96 opacity-15" color="#00D4FF" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--accent)', fontFamily: 'Space Mono' }}>// Hablemos</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
              ¿Listo para llevar<br />su empresa al<br />
              <span style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>siguiente nivel?</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
              Agenda una consultoría sin costo. Analizamos su situación actual y le mostramos exactamente cómo podemos ayudarle a reducir costos y mejorar eficiencia.
            </p>
            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Llámenos ahora', value: '+56 2 3340 3759', href: 'tel:+56233403759' },
                { icon: Mail, label: 'Escríbanos', value: 'contacto@neox.cl', href: 'mailto:contacto@neox.cl' },
                { icon: MapPin, label: 'Visítenos', value: 'Huérfanos 669, Of. 614, Santiago', href: '#' },
              ].map(c => (
                <a key={c.label} href={c.href} className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group"
                  style={{ background: 'rgba(13,33,55,0.5)', border: '1px solid rgba(0,212,255,0.1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.35)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.1)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,255,0.1)' }}>
                    <c.icon size={17} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{c.label}</div>
                    <div className="text-sm font-semibold text-white">{c.value}</div>
                  </div>
                  <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                </a>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="p-8 rounded-3xl" style={{ background: 'rgba(13,33,55,0.7)', border: '1px solid rgba(0,212,255,0.15)', backdropFilter: 'blur(12px)' }}>
              <h3 className="text-xl font-bold text-white mb-6">Solicitar diagnóstico gratuito</h3>
              <div className="space-y-4">
                {[
                  { label: 'Nombre completo', placeholder: 'Juan Pérez', type: 'text' },
                  { label: 'Empresa', placeholder: 'Mi Empresa S.A.', type: 'text' },
                  { label: 'Email corporativo', placeholder: 'juan@empresa.cl', type: 'email' },
                  { label: 'Teléfono', placeholder: '+56 9 xxxx xxxx', type: 'tel' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(0,212,255,0.15)', color: 'var(--text)' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; e.currentTarget.style.boxShadow = 'none' }} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>¿En qué podemos ayudarle?</label>
                  <select className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(0,212,255,0.15)', color: 'var(--text)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)' }}>
                    <option value="">Seleccionar servicio...</option>
                    <option>Consultoría & Capacitación</option>
                    <option>Soporte Productivo</option>
                    <option>Soluciones de Negocio</option>
                    <option>Desarrollo a la Medida</option>
                    <option>IBM Content Manager</option>
                    <option>IBM Hybrid Cloud</option>
                    <option>Salesforce</option>
                    <option>NX Frontier</option>
                  </select>
                </div>
                <button className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 mt-2"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)', color: '#0A192F' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,212,255,0.4)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                  Solicitar diagnóstico gratuito →
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative py-12 overflow-hidden" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00D4FF,#0066FF)' }}>
            <span className="text-white font-bold text-xs" style={{ fontFamily: 'Space Mono' }}>NX</span>
          </div>
          <span className="font-bold text-white">Neox</span>
          <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>Tecnologías de Información</span>
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
          © {new Date().getFullYear()} Neox · Huérfanos 669, Of. 614, Santiago de Chile
        </div>
        <div className="flex gap-4">
          {['Servicios', 'NX Frontier', 'Contacto'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`} className="text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div style={{ background: 'var(--primary)' }}>
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Frontier />
      <IBM />
      <Salesforce />
      <Clients />
      <Contact />
      <Footer />
    </div>
  )
}
