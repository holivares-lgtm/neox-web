import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Menu, X, Phone, Mail, MapPin,
  ArrowRight, CheckCircle, Zap, Shield, Globe,
  Database, Cloud, Code, Users, TrendingUp,
  ChevronRight, Award, ExternalLink
} from 'lucide-react'

// ─── Brand Logo SVG ──────────────────────────────────────────────────────────
// NEOX wordmark where the O is a gear+circle — based on real brand identity
function NeoxLogo({ size = 'md', white = false }: { size?: 'sm'|'md'|'lg'; white?: boolean }) {
  const scales = { sm: 0.55, md: 0.85, lg: 1.3 }
  const s = scales[size]
  const blue = white ? '#ffffff' : '#0969AC'
  const blueLight = white ? '#ffffffcc' : '#1a8fd1'

  return (
    <svg
      viewBox="0 0 280 72"
      width={280 * s}
      height={72 * s}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* N */}
      <text x="0" y="58" fontFamily="'Sora','Arial Black',sans-serif" fontWeight="800"
        fontSize="62" fill={blue} letterSpacing="-2">N</text>
      {/* E */}
      <text x="48" y="58" fontFamily="'Sora','Arial Black',sans-serif" fontWeight="800"
        fontSize="62" fill={blue} letterSpacing="-2">E</text>

      {/* O = gear circle — positioned where O would be (around x=108) */}
      <g transform="translate(108, 36)">
        {/* Outer ring */}
        <circle cx="0" cy="0" r="28" fill="none" stroke={blue} strokeWidth="4"/>
        {/* Gear teeth - 8 teeth as rectangles radiating out */}
        <g fill={blue}>
          <rect x="-5" y="-36" width="10" height="10" rx="2"/>
          <rect x="-5" y="26" width="10" height="10" rx="2"/>
          <rect x="-36" y="-5" width="10" height="10" rx="2"/>
          <rect x="26" y="-5" width="10" height="10" rx="2"/>
          <rect x="14" y="-34" width="10" height="10" rx="2" transform="rotate(45 19 -29)"/>
          <rect x="-24" y="-34" width="10" height="10" rx="2" transform="rotate(-45 -19 -29)"/>
          <rect x="14" y="24" width="10" height="10" rx="2" transform="rotate(-45 19 29)"/>
          <rect x="-24" y="24" width="10" height="10" rx="2" transform="rotate(45 -19 29)"/>
        </g>
        {/* Inner circle (hollow O center) */}
        <circle cx="0" cy="0" r="14" fill="none" stroke={blue} strokeWidth="4"/>
      </g>

      {/* X */}
      <text x="156" y="58" fontFamily="'Sora','Arial Black',sans-serif" fontWeight="800"
        fontSize="62" fill={blue} letterSpacing="-2">X</text>
    </svg>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'NX Frontier', href: '#frontier' },
  { label: 'IBM Partner', href: '#ibm' },
  { label: 'Salesforce', href: '#salesforce' },
  { label: 'Clientes', href: '#clientes' },
  { label: 'Contacto', href: '#contacto' },
]

const STATS = [
  { value: '12+', label: 'Años de experiencia' },
  { value: '50+', label: 'Clientes activos' },
  { value: '200+', label: 'Proyectos entregados' },
  { value: '99%', label: 'Tasa de retención' },
]

const SERVICES = [
  {
    icon: Users,
    title: 'Consultoría & Capacitación',
    tagline: 'Estrategia que transforma organizaciones',
    description: 'Llevamos su empresa al siguiente nivel con planificación TI, gestión de proyectos y arquitectura de soluciones diseñadas para escalar.',
    bullets: ['Planificación TI estratégica', 'Gestión de Proyectos PMO', 'Arquitectura de Soluciones', 'Capacitación especializada'],
  },
  {
    icon: Shield,
    title: 'Soporte Productivo',
    tagline: 'Continuidad operativa garantizada',
    description: 'Su operación nunca se detiene. Soporte especializado en plataformas IBM, Oracle, Linux y Cloud con SLAs definidos y escalamiento inmediato.',
    bullets: ['SLAs garantizados', 'Plataformas IBM & Oracle', 'Cloud Computing', 'Plan de recuperación de desastres'],
  },
  {
    icon: TrendingUp,
    title: 'Soluciones de Negocio',
    tagline: 'Tecnología que impulsa resultados',
    description: 'Implementamos las soluciones más potentes del mercado para que sus procesos funcionen con excelencia: Power BI, SAP, Filenet, DataCap y más.',
    bullets: ['Power BI & Analytics', 'IBM Content Manager', 'ERP SAP', 'Automatización de procesos'],
  },
  {
    icon: Code,
    title: 'Desarrollo a la Medida',
    tagline: 'Software que se adapta a usted',
    description: 'Desarrollamos e integramos sistemas únicos para su negocio usando Java, Cloud APIs y conectores a AWS, GCP y Azure.',
    bullets: ['Desarrollo Java enterprise', 'Integraciones Cloud (AWS/GCP/Azure)', 'APIs & Microservicios', 'Outsourcing especializado'],
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

const PARTNERS = ['IBM', 'Salesforce', 'Oracle', 'Microsoft', 'Red Hat', 'Rackspace', 'Nexsys', 'Adistec']

const FRONTIER_SOURCES = [
  { label: 'DynamoDB & S3', sub: 'Amazon AWS' },
  { label: 'MongoDB Atlas', sub: 'Cloud & On-Prem' },
  { label: 'Cloud Firestore', sub: 'Google Firebase' },
  { label: 'IBM OnDemand', sub: 'Content Manager' },
  { label: 'IBM Filenet', sub: 'Content Foundation' },
  { label: 'IBM CM', sub: 'Content Manager' },
]

// ─── Utilities ───────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  )
}

function AnimatedCounter({ value, duration = 1800 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState(value)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || started) return
    setStarted(true)
    const numeric = parseInt(value.replace(/\D/g, ''))
    const suffix = value.replace(/[0-9]/g, '')
    setDisplay('0' + suffix)
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.floor(e * numeric) + suffix)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, started, value, duration])
  return <span ref={ref}>{display}</span>
}

function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
      style={{ backgroundImage: `linear-gradient(rgba(9,105,172,1) 1px, transparent 1px),linear-gradient(90deg,rgba(9,105,172,1) 1px,transparent 1px)`, backgroundSize: '56px 56px' }} />
  )
}

function Glow({ className, size = 400, opacity = 0.12 }: { className: string; size?: number; opacity?: number }) {
  return (
    <div className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ width: size, height: size, background: 'radial-gradient(circle, #0969AC, transparent 70%)', filter: 'blur(60px)', opacity }} />
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}
      style={{ background: scrolled ? 'rgba(5,12,22,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(9,105,172,0.15)' : 'none' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#"><NeoxLogo size="sm" white /></a>
        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1a8fd1' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+56233403759" className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all"
            style={{ color: '#1a8fd1', border: '1px solid rgba(9,105,172,0.35)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(9,105,172,0.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
            <Phone size={13} /> +56 2 3340 3759
          </a>
          <a href="#contacto" className="text-sm font-bold px-5 py-2.5 rounded-lg transition-all"
            style={{ background: 'var(--neox-blue)', color: 'white' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--neox-blue-light)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--neox-blue)' }}>
            Hablemos →
          </a>
        </div>
        <button className="lg:hidden" style={{ color: 'var(--text)' }} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden px-6 pb-6 mt-3" style={{ borderTop: '1px solid rgba(9,105,172,0.15)', background: 'rgba(5,12,22,0.98)' }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block py-3 text-sm font-medium border-b" style={{ color: 'var(--text-muted)', borderColor: 'rgba(9,105,172,0.1)' }}>
                {l.label}
              </a>
            ))}
            <a href="#contacto" onClick={() => setOpen(false)} className="mt-4 block text-center text-sm font-bold px-5 py-3 rounded-lg"
              style={{ background: 'var(--neox-blue)', color: 'white' }}>
              Hablemos →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 600], [0, 140])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop: '90px' }}>
      <GridLines />
      <Glow className="-top-32 -left-32" size={600} opacity={0.1} />
      <Glow className="top-1/3 right-0" size={500} opacity={0.08} />

      {/* Animated gear in background */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ right: '-80px' }}
      >
        <svg viewBox="0 0 400 400" width="500" height="500">
          <circle cx="200" cy="200" r="140" fill="none" stroke="#0969AC" strokeWidth="8"/>
          <circle cx="200" cy="200" r="70" fill="none" stroke="#0969AC" strokeWidth="8"/>
          {[0,45,90,135,180,225,270,315].map(angle => {
            const rad = (angle * Math.PI) / 180
            const x = 200 + Math.cos(rad) * 155
            const y = 200 + Math.sin(rad) * 155
            return <rect key={angle} x={x - 10} y={y - 16} width="20" height="32" rx="4" fill="#0969AC"
              transform={`rotate(${angle} ${x} ${y})`} />
          })}
        </svg>
      </motion.div>

      <motion.div style={{ y: yParallax }} className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Big logo in hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-10">
          <NeoxLogo size="lg" white />
        </motion.div>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium"
          style={{ background: 'rgba(9,105,172,0.12)', border: '1px solid rgba(9,105,172,0.3)', color: '#1a8fd1' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: '#1a8fd1', boxShadow: '0 0 6px #1a8fd1' }} />
          Silver Business Partner IBM · 12 años transformando empresas
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7 }}
          className="font-bold text-white leading-tight mb-6"
          style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', letterSpacing: '-0.03em', maxWidth: '800px' }}>
          Transformamos su empresa con{' '}
          <span style={{ color: '#1a8fd1' }}>tecnología que genera resultados.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          className="text-lg leading-relaxed mb-10 max-w-xl" style={{ color: 'var(--text-muted)' }}>
          Somos el socio estratégico TI que empresas líderes en Chile y Latinoamérica eligen para reducir costos, escalar operaciones e integrar tecnología de clase mundial.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
          className="flex flex-wrap gap-4">
          <a href="#contacto"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm text-white transition-all duration-300"
            style={{ background: 'var(--neox-blue)', boxShadow: '0 6px 28px rgba(9,105,172,0.45)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 36px rgba(9,105,172,0.6)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(9,105,172,0.45)' }}>
            Solicitar diagnóstico gratuito <ArrowRight size={16} />
          </a>
          <a href="#servicios"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
            style={{ border: '1px solid rgba(9,105,172,0.35)', color: 'var(--text)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(9,105,172,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(9,105,172,0.6)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(9,105,172,0.35)' }}>
            Ver servicios <ChevronDown size={16} />
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ color: 'var(--text-muted)' }}>
          <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'monospace' }}>scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Stats ───────────────────────────────────────────────────────────────────
function Stats() {
  return (
    <section className="relative py-14 overflow-hidden"
      style={{ background: 'rgba(9,105,172,0.06)', borderTop: '1px solid rgba(9,105,172,0.12)', borderBottom: '1px solid rgba(9,105,172,0.12)' }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.1} className="text-center">
            <div className="text-4xl font-bold mb-1" style={{ color: '#1a8fd1', fontFamily: 'monospace' }}>
              <AnimatedCounter value={s.value} />
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

// ─── Services ────────────────────────────────────────────────────────────────
function Services() {
  const [active, setActive] = useState(0)
  const s = SERVICES[active]
  return (
    <section id="servicios" className="relative py-28 overflow-hidden">
      <GridLines />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="mb-16">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: '#1a8fd1', fontFamily: 'monospace' }}>// Servicios</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Todo lo que su empresa<br />
            <span style={{ color: '#1a8fd1' }}>necesita para crecer</span>
          </h2>
          <p className="text-lg max-w-xl" style={{ color: 'var(--text-muted)' }}>
            Cuatro pilares de servicio para cubrir el ciclo completo de transformación digital de su organización.
          </p>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-3">
            {SERVICES.map((svc, i) => (
              <motion.button key={svc.title} onClick={() => setActive(i)} whileHover={{ x: 4 }}
                className="text-left p-5 rounded-2xl transition-all duration-300"
                style={{ background: active === i ? 'rgba(9,105,172,0.12)' : 'rgba(12,24,40,0.6)', border: `1px solid ${active === i ? 'rgba(9,105,172,0.45)' : 'rgba(9,105,172,0.1)'}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: active === i ? 'rgba(9,105,172,0.2)' : 'rgba(255,255,255,0.04)' }}>
                    <svc.icon size={18} style={{ color: active === i ? '#1a8fd1' : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: active === i ? 'white' : 'var(--text-muted)' }}>{svc.title}</div>
                    {active === i && <div className="text-xs mt-0.5" style={{ color: '#1a8fd1' }}>{svc.tagline}</div>}
                  </div>
                  {active === i && <ChevronRight size={15} className="ml-auto" style={{ color: '#1a8fd1' }} />}
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} className="rounded-2xl p-8"
              style={{ background: 'rgba(12,24,40,0.8)', border: '1px solid rgba(9,105,172,0.18)', backdropFilter: 'blur(12px)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(9,105,172,0.15)' }}>
                <s.icon size={26} style={{ color: '#1a8fd1' }} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm font-medium mb-4" style={{ color: '#1a8fd1' }}>{s.tagline}</p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{s.description}</p>
              <ul className="space-y-3 mb-8">
                {s.bullets.map(b => (
                  <li key={b} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text)' }}>
                    <CheckCircle size={14} style={{ color: '#1a8fd1', flexShrink: 0 }} />{b}
                  </li>
                ))}
              </ul>
              <a href="#contacto" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#1a8fd1' }}>
                Solicitar este servicio <ArrowRight size={14} />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ─── NX Frontier ─────────────────────────────────────────────────────────────
function Frontier() {
  return (
    <section id="frontier" className="relative py-28 overflow-hidden" style={{ background: 'rgba(9,105,172,0.04)' }}>
      <Glow className="top-0 right-0" size={500} opacity={0.08} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <FadeUp className="order-2 lg:order-1">
            <div className="relative flex flex-col items-center">
              {/* Center hub */}
              <div className="relative w-56 h-56 flex items-center justify-center mx-auto">
                <div className="absolute inset-0 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #0969AC, transparent 70%)' }} />
                {/* Spinning outer ring */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px dashed rgba(9,105,172,0.35)' }} />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute rounded-full"
                  style={{ width: '75%', height: '75%', border: '1px solid rgba(9,105,172,0.2)' }} />
                {/* Hub */}
                <div className="relative z-10 w-28 h-28 rounded-2xl flex flex-col items-center justify-center"
                  style={{ background: 'rgba(9,105,172,0.15)', border: '1px solid rgba(9,105,172,0.4)' }}>
                  <Database size={28} style={{ color: '#1a8fd1', marginBottom: 4 }} />
                  <span className="text-xs font-bold" style={{ color: '#1a8fd1', fontFamily: 'monospace' }}>NX</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>FRONTIER</span>
                </div>
              </div>
              {/* Source cards */}
              <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-sm">
                {FRONTIER_SOURCES.map((src, i) => (
                  <motion.div key={src.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: 'rgba(12,24,40,0.9)', border: '1px solid rgba(9,105,172,0.15)' }}>
                    <div className="font-semibold text-white text-xs">{src.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{src.sub}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <FadeUp>
              <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: '#1a8fd1', fontFamily: 'monospace' }}>// Producto propio</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
                NX Frontier<br /><span style={{ color: '#1a8fd1' }}>Reportes masivos</span><br />sin límites
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                El motor de generación de reportes más versátil del mercado. Procese millones de documentos en batch, desde cualquier fuente de datos, en todos los formatos que su negocio necesita.
              </p>
            </FadeUp>
            {[
              { icon: Zap, t: 'Multi-formato nativo', d: 'PDF, PS, RTF, TXT, JSON, XML, PNG, JPG y más — sin configuración adicional.' },
              { icon: Database, t: 'Conector universal', d: 'AWS, MongoDB, Firebase, IBM OnDemand, Filenet y Content Manager en una sola solución.' },
              { icon: Cloud, t: 'Cloud & OnPremise', d: 'Docker, Kubernetes, Windows, Linux o AIX. Se adapta a su infraestructura actual.' },
              { icon: Shield, t: 'Control de acceso enterprise', d: 'AWS Cognito, Firebase Auth o gestor propio con perfiles por usuario, grupo y fuente.' },
            ].map((f, i) => (
              <FadeUp key={f.t} delay={0.12 + i * 0.08}>
                <div className="flex gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(9,105,172,0.12)' }}>
                    <f.icon size={17} style={{ color: '#1a8fd1' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">{f.t}</div>
                    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.d}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
            <FadeUp delay={0.5}>
              <a href="#contacto" className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl font-bold text-sm text-white"
                style={{ background: 'var(--neox-blue)', boxShadow: '0 4px 20px rgba(9,105,172,0.4)' }}>
                Demo de NX Frontier <ArrowRight size={15} />
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── IBM ─────────────────────────────────────────────────────────────────────
function IBM() {
  const [tab, setTab] = useState<'content'|'cloud'>('content')
  return (
    <section id="ibm" className="relative py-28 overflow-hidden">
      <GridLines />
      <Glow className="bottom-0 left-0" size={400} opacity={0.08} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeUp>
              <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: '#1a8fd1', fontFamily: 'monospace' }}>// IBM Silver Partner</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
                Respaldo IBM<br /><span style={{ color: '#1a8fd1' }}>certificado</span>
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                Como Silver Business Partner del programa IBM PartnerWorld, le ofrecemos acceso privilegiado a licenciamiento, implementaciones y soporte experto en toda la gama de productos IBM.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(12,24,40,0.8)', border: '1px solid rgba(9,105,172,0.18)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <Award size={20} style={{ color: '#1a8fd1' }} />
                  <span className="font-semibold text-white">Nuestra alianza IBM incluye</span>
                </div>
                {['Venta y renovación de licenciamiento', 'Instalaciones, upgrades y migraciones', 'Desarrollos e integraciones certificadas', 'Soporte y mejora continua'].map(item => (
                  <div key={item} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(9,105,172,0.08)' }}>
                    <CheckCircle size={14} style={{ color: '#1a8fd1', flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
          <div>
            <FadeUp delay={0.1}>
              <div className="flex rounded-xl p-1 mb-5"
                style={{ background: 'rgba(12,24,40,0.8)', border: '1px solid rgba(9,105,172,0.12)' }}>
                {(['content','cloud'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                    style={{ background: tab === t ? 'rgba(9,105,172,0.2)' : 'transparent', color: tab === t ? 'white' : 'var(--text-muted)', border: tab === t ? '1px solid rgba(9,105,172,0.4)' : '1px solid transparent' }}>
                    {t === 'content' ? 'Content Manager' : 'Hybrid Cloud'}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }} className="grid gap-2">
                  {(tab === 'content' ? IBM_CONTENT : IBM_CLOUD).map((item, i) => (
                    <motion.div key={item} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                      style={{ background: 'rgba(12,24,40,0.6)', border: '1px solid rgba(9,105,172,0.08)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(9,105,172,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(9,105,172,0.07)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(9,105,172,0.08)'; (e.currentTarget as HTMLElement).style.background = 'rgba(12,24,40,0.6)' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#1a8fd1' }} />
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

// ─── Salesforce ───────────────────────────────────────────────────────────────
function Salesforce() {
  return (
    <section id="salesforce" className="relative py-28 overflow-hidden" style={{ background: 'rgba(9,105,172,0.04)' }}>
      <Glow className="top-1/2 right-0" size={400} opacity={0.07} />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: '#1a8fd1', fontFamily: 'monospace' }}>// Partner Salesforce</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Maximice el retorno<br /><span style={{ color: '#1a8fd1' }}>de su inversión en Salesforce</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Consultores certificados de punta a punta. Desde implementación hasta soporte continuo, con un modelo de bolsa de horas que se ajusta a su ritmo.
          </p>
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {SALESFORCE_FEATURES.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.1}>
              <div className="p-6 rounded-2xl h-full transition-all duration-300"
                style={{ background: 'rgba(12,24,40,0.7)', border: '1px solid rgba(9,105,172,0.1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(9,105,172,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(9,105,172,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(9,105,172,0.12)' }}>
                  <f.icon size={19} style={{ color: '#1a8fd1' }} />
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.3} className="text-center">
          <div className="inline-flex flex-wrap gap-2 justify-center p-5 rounded-2xl"
            style={{ background: 'rgba(12,24,40,0.6)', border: '1px solid rgba(9,105,172,0.12)' }}>
            {['Desarrollo Apex & Lightning', 'Automatización de Eventos', 'Pruebas Unitarias', 'Gestión de Requerimientos', 'Administración', 'Transport Management'].map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(9,105,172,0.1)', color: 'var(--text)', border: '1px solid rgba(9,105,172,0.2)' }}>
                {tag}
              </span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Clients ─────────────────────────────────────────────────────────────────
function Clients() {
  return (
    <section id="clientes" className="relative py-28 overflow-hidden">
      <GridLines />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: '#1a8fd1', fontFamily: 'monospace' }}>// Clientes</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Las empresas más grandes<br /><span style={{ color: '#1a8fd1' }}>ya trabajan con Neox</span>
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            Bancos, telcos, mineras, retail y energía. Industrias distintas, el mismo estándar de excelencia.
          </p>
        </FadeUp>
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {CLIENTS.map((c, i) => (
            <motion.div key={c} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }} whileHover={{ y: -2, borderColor: 'rgba(9,105,172,0.5)', color: 'white' }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: 'rgba(12,24,40,0.8)', border: '1px solid rgba(9,105,172,0.12)', color: 'var(--text)' }}>
              {c}
            </motion.div>
          ))}
        </div>
        <FadeUp className="text-center">
          <div className="mb-5 text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Partners & Alianzas estratégicas
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {PARTNERS.map((p, i) => (
              <motion.div key={p} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }} whileHover={{ color: '#1a8fd1', borderColor: 'rgba(9,105,172,0.35)' }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                style={{ background: 'rgba(12,24,40,0.5)', border: '1px solid rgba(9,105,172,0.08)', color: 'var(--text-muted)', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                {p}
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Contact ─────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contacto" className="relative py-28 overflow-hidden" style={{ background: 'rgba(9,105,172,0.04)', borderTop: '1px solid rgba(9,105,172,0.12)' }}>
      <Glow className="bottom-0 left-1/4" size={500} opacity={0.1} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <FadeUp>
            <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: '#1a8fd1', fontFamily: 'monospace' }}>// Hablemos</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
              ¿Listo para llevar<br />su empresa al<br /><span style={{ color: '#1a8fd1' }}>siguiente nivel?</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
              Agenda una consultoría sin costo. Analizamos su situación actual y le mostramos cómo reducir costos y mejorar eficiencia con tecnología de clase mundial.
            </p>
            <div className="space-y-3">
              {[
                { icon: Phone, label: 'Llámenos ahora', value: '+56 2 3340 3759', href: 'tel:+56233403759' },
                { icon: Mail, label: 'Escríbanos', value: 'contacto@neox.cl', href: 'mailto:contacto@neox.cl' },
                { icon: MapPin, label: 'Visítenos', value: 'Huérfanos 669, Of. 614, Santiago', href: '#' },
              ].map(c => (
                <a key={c.label} href={c.href} className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group"
                  style={{ background: 'rgba(12,24,40,0.6)', border: '1px solid rgba(9,105,172,0.1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(9,105,172,0.4)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(9,105,172,0.1)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(9,105,172,0.12)' }}>
                    <c.icon size={17} style={{ color: '#1a8fd1' }} />
                  </div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{c.label}</div>
                    <div className="text-sm font-semibold text-white">{c.value}</div>
                  </div>
                  <ExternalLink size={13} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#1a8fd1' }} />
                </a>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="p-8 rounded-3xl" style={{ background: 'rgba(12,24,40,0.9)', border: '1px solid rgba(9,105,172,0.2)', backdropFilter: 'blur(12px)' }}>
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
                      style={{ background: 'rgba(5,12,22,0.8)', border: '1px solid rgba(9,105,172,0.2)', color: 'var(--text)' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#0969AC'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(9,105,172,0.1)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(9,105,172,0.2)'; e.currentTarget.style.boxShadow = 'none' }} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>¿En qué podemos ayudarle?</label>
                  <select className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(5,12,22,0.8)', border: '1px solid rgba(9,105,172,0.2)', color: 'var(--text)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#0969AC' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(9,105,172,0.2)' }}>
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
                <button className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all duration-300 mt-2"
                  style={{ background: 'var(--neox-blue)', boxShadow: '0 4px 20px rgba(9,105,172,0.35)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--neox-blue-light)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(9,105,172,0.5)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--neox-blue)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(9,105,172,0.35)' }}>
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

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative py-10 overflow-hidden" style={{ borderTop: '1px solid rgba(9,105,172,0.12)', background: 'rgba(5,12,22,0.95)' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5">
        <NeoxLogo size="sm" white />
        <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          © {new Date().getFullYear()} Neox · Huérfanos 669, Of. 614, Santiago de Chile
        </div>
        <div className="flex gap-5">
          {['Servicios', 'NX Frontier', 'Contacto'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`} className="text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1a8fd1' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
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
