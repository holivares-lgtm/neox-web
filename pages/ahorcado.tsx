import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link2, Copy, Check, RotateCcw, Send, Eye, EyeOff,
  Trophy, Skull, ArrowLeft, Sparkles,
} from 'lucide-react'

// ─── Reto encoding (palabra dentro de la URL, sin backend) ────────────────────
// El "reto" viaja codificado en base64 URL-safe de UTF-8. No es seguro
// criptográficamente (cualquiera puede decodificarlo), pero evita que la
// palabra se lea de un vistazo en la barra de direcciones.
type Reto = { w: string; h: string }

function encodeReto(reto: Reto): string {
  const bytes = new TextEncoder().encode(JSON.stringify(reto))
  let bin = ''
  bytes.forEach((b) => { bin += String.fromCharCode(b) })
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeReto(token: string): Reto | null {
  try {
    let b64 = token.replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    const obj = JSON.parse(new TextDecoder().decode(bytes))
    if (!obj || typeof obj.w !== 'string') return null
    return { w: obj.w, h: typeof obj.h === 'string' ? obj.h : '' }
  } catch {
    return null
  }
}

// ─── Normalización en español ─────────────────────────────────────────────────
// Mayúsculas, se quitan las tildes (Á→A) pero se conserva la Ñ como letra propia.
function normalizeWord(raw: string): string {
  let out = ''
  for (const ch of raw.normalize('NFC').toUpperCase()) {
    if (ch === '\u00D1') { out += '\u00D1'; continue } // conservar la Ñ
    out += ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
  }
  return out
}

const ALFABETO = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]
const LETRAS = new Set(ALFABETO.flat())
const MAX_FALLOS = 6

const isGuessable = (ch: string) => LETRAS.has(ch)

// ─── Dibujo del ahorcado (SVG progresivo) ─────────────────────────────────────
const PARTES = [
  { id: 'cabeza', d: 'M140 50 a18 18 0 1 0 0.01 0' },
  { id: 'cuerpo', d: 'M140 86 V150' },
  { id: 'brazoIzq', d: 'M140 100 L115 125' },
  { id: 'brazoDer', d: 'M140 100 L165 125' },
  { id: 'piernaIzq', d: 'M140 150 L118 185' },
  { id: 'piernaDer', d: 'M140 150 L162 185' },
]

function Horca({ fallos }: { fallos: number }) {
  return (
    <svg viewBox="0 0 200 240" className="w-full max-w-[260px] mx-auto" aria-hidden>
      {/* Cadalso */}
      {[
        'M20 232 H100',   // base
        'M40 232 V16',    // poste
        'M40 16 H140',    // viga
        'M140 16 V32',    // cuerda
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="#3a5572"
          strokeWidth={6}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
        />
      ))}
      {/* Muñeco — una parte por cada fallo */}
      <AnimatePresence>
        {PARTES.slice(0, fallos).map((p) => (
          <motion.path
            key={p.id}
            d={p.d}
            fill="none"
            stroke="#1a8fd1"
            strokeWidth={5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </AnimatePresence>
    </svg>
  )
}

// ─── Marco / layout compartido ────────────────────────────────────────────────
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-10"
      style={{ background: 'var(--primary)' }}>
      <Link href="/" className="self-start inline-flex items-center gap-2 text-sm mb-8 transition-colors"
        style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> Volver a Neox
      </Link>
      <div className="w-full max-w-xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
            El <span style={{ color: '#1a8fd1' }}>Ahorcado</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Dos jugadores · uno escribe la palabra, el otro adivina · todo por un enlace
          </p>
        </header>
        {children}
      </div>
    </div>
  )
}

// ─── Pantalla 1: crear el reto (Jugador 1) ────────────────────────────────────
function CrearReto() {
  const [palabra, setPalabra] = useState('')
  const [pista, setPista] = useState('')
  const [enlace, setEnlace] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [verPalabra, setVerPalabra] = useState(false)

  const normalizada = useMemo(() => normalizeWord(palabra.trim()), [palabra])
  const valida = useMemo(
    () => [...normalizada].some(isGuessable) && normalizada.length <= 40,
    [normalizada],
  )

  const generar = () => {
    if (!valida) return
    const token = encodeReto({ w: normalizada, h: pista.trim() })
    const url = `${window.location.origin}/ahorcado?reto=${token}`
    setEnlace(url)
    setCopiado(false)
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2200)
    } catch {
      // fallback: el usuario puede copiar a mano
    }
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(
    `¡Te reto al Ahorcado! Adivina mi palabra 👇\n${enlace}`,
  )}`

  // ── Vista 2: enlace generado ──────────────────────────────────────────────
  if (enlace) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl p-7 sm:p-8 flex flex-col gap-5"
        style={{ background: 'var(--card)', border: '1px solid rgba(9,105,172,0.4)' }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-white mb-1">¡Enlace listo!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Mándaselo a tu rival para que adivine tu palabra
          </p>
        </div>

        {/* URL visible para copiar a mano */}
        <div className="px-4 py-3 rounded-2xl text-xs break-all select-all"
          style={{ background: 'rgba(5,12,22,0.8)', color: '#1a8fd1', fontFamily: 'monospace', border: '1px solid var(--border)' }}>
          {enlace}
        </div>

        {/* Botón principal: copiar */}
        <button
          onClick={copiar}
          className="w-full rounded-2xl font-bold text-white transition-all duration-200 inline-flex items-center justify-center gap-3"
          style={{
            padding: '20px 24px',
            fontSize: '1.05rem',
            minHeight: '64px',
            background: copiado ? 'rgba(40,167,99,0.8)' : 'var(--neox-blue)',
            boxShadow: '0 4px 24px rgba(9,105,172,0.45)',
          }}
        >
          {copiado
            ? <><Check size={22} /> ¡Copiado al portapapeles!</>
            : <><Copy size={22} /> Copiar enlace</>}
        </button>

        {/* WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-2xl font-bold transition-all duration-200 inline-flex items-center justify-center gap-3"
          style={{
            padding: '18px 24px',
            fontSize: '1rem',
            minHeight: '60px',
            background: 'rgba(37,211,102,0.15)',
            border: '1px solid rgba(37,211,102,0.4)',
            color: '#25d366',
          }}
        >
          <Send size={20} /> Enviar por WhatsApp
        </a>

        {/* Cambiar palabra */}
        <button
          onClick={() => { setEnlace(''); setPalabra(''); setPista('') }}
          className="w-full rounded-2xl font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2"
          style={{
            padding: '14px 24px',
            minHeight: '52px',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}
        >
          <RotateCcw size={16} /> Cambiar palabra
        </button>
      </motion.div>
    )
  }

  // ── Vista 1: formulario ───────────────────────────────────────────────────
  return (
    <div className="rounded-3xl p-7 sm:p-8"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
        Palabra o frase secreta
      </label>
      <div className="relative">
        <input
          type={verPalabra ? 'text' : 'password'}
          value={palabra}
          onChange={(e) => { setPalabra(e.target.value) }}
          placeholder="Ej: Murciélago"
          autoComplete="off"
          spellCheck={false}
          maxLength={40}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all pr-11"
          style={{ background: 'rgba(5,12,22,0.8)', border: '1px solid var(--border)', color: 'var(--text)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0969AC' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,105,172,0.2)' }}
        />
        <button
          type="button"
          onClick={() => setVerPalabra((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
          aria-label={verPalabra ? 'Ocultar palabra' : 'Mostrar palabra'}
        >
          {verPalabra ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      <label className="block text-xs font-medium mb-1.5 mt-5" style={{ color: 'var(--text-muted)' }}>
        Pista (opcional)
      </label>
      <input
        type="text"
        value={pista}
        onChange={(e) => { setPista(e.target.value) }}
        placeholder="Ej: Animal nocturno"
        autoComplete="off"
        maxLength={60}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{ background: 'rgba(5,12,22,0.8)', border: '1px solid var(--border)', color: 'var(--text)' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#0969AC' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,105,172,0.2)' }}
      />

      {palabra.trim() && !valida && (
        <p className="text-xs mt-3" style={{ color: '#e0796b' }}>
          Escribe al menos una letra (A–Z o Ñ); máximo 40 caracteres.
        </p>
      )}

      <button
        onClick={generar}
        disabled={!valida}
        className="w-full mt-6 rounded-2xl font-bold text-white transition-all duration-300 inline-flex items-center justify-center gap-3"
        style={{
          padding: '20px 24px',
          fontSize: '1.05rem',
          minHeight: '64px',
          background: valida ? 'var(--neox-blue)' : 'rgba(9,105,172,0.25)',
          cursor: valida ? 'pointer' : 'not-allowed',
          boxShadow: valida ? '0 4px 24px rgba(9,105,172,0.45)' : 'none',
        }}
      >
        <Link2 size={20} /> Generar enlace para retar
      </button>
    </div>
  )
}

// ─── Pantalla 2: jugar (Jugador 2) ────────────────────────────────────────────
function Jugar({ reto, onReiniciar }: { reto: Reto; onReiniciar: () => void }) {
  const secreto = useMemo(() => normalizeWord(reto.w), [reto.w])
  const [guessed, setGuessed] = useState<Set<string>>(new Set())

  const letrasSecretas = useMemo(
    () => new Set([...secreto].filter(isGuessable)),
    [secreto],
  )
  const fallos = useMemo(
    () => [...guessed].filter((l) => !letrasSecretas.has(l)).length,
    [guessed, letrasSecretas],
  )
  const gano = useMemo(
    () => [...letrasSecretas].every((l) => guessed.has(l)),
    [letrasSecretas, guessed],
  )
  const perdio = fallos >= MAX_FALLOS
  const terminado = gano || perdio

  const probar = useCallback(
    (letra: string) => {
      if (terminado || guessed.has(letra) || !LETRAS.has(letra)) return
      setGuessed((prev) => new Set(prev).add(letra))
    },
    [terminado, guessed],
  )

  // Teclado físico
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toUpperCase()
      if (LETRAS.has(k)) probar(k)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [probar])

  const reiniciarMismo = () => setGuessed(new Set())

  return (
    <div className="rounded-3xl p-6 sm:p-8"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      {/* Pista */}
      {reto.h && (
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs"
            style={{ background: 'rgba(9,105,172,0.12)', border: '1px solid var(--border)', color: '#1a8fd1' }}>
            Pista: {reto.h}
          </span>
        </div>
      )}

      <Horca fallos={fallos} />

      {/* Intentos restantes */}
      <p className="text-center text-xs mt-1 mb-5" style={{ color: 'var(--text-muted)' }}>
        Intentos restantes: <span style={{ color: fallos >= 4 ? '#e0796b' : '#1a8fd1', fontWeight: 700 }}>
          {MAX_FALLOS - fallos}
        </span> / {MAX_FALLOS}
      </p>

      {/* Palabra */}
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 mb-7">
        {[...secreto].map((ch, i) => {
          if (ch === ' ') return <span key={i} className="w-4" />
          const guess = isGuessable(ch)
          const revelada = !guess || guessed.has(ch) || terminado
          const fallada = terminado && !gano && guess && !guessed.has(ch)
          return (
            <div key={i} className="flex flex-col items-center" style={{ minWidth: 22 }}>
              <span className="text-2xl sm:text-3xl font-bold h-9 flex items-center"
                style={{ color: fallada ? '#e0796b' : 'white' }}>
                <AnimatePresence mode="wait">
                  {revelada && (
                    <motion.span
                      key={ch + i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {ch}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {guess && (
                <span className="block w-6 h-[2px] rounded"
                  style={{ background: revelada ? 'rgba(122,144,168,0.4)' : '#1a8fd1' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Resultado */}
      <AnimatePresence>
        {terminado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6 p-5 rounded-2xl"
            style={{
              background: gano ? 'rgba(40,167,99,0.1)' : 'rgba(224,121,107,0.1)',
              border: `1px solid ${gano ? 'rgba(40,167,99,0.4)' : 'rgba(224,121,107,0.4)'}`,
            }}
          >
            <div className="flex justify-center mb-2">
              {gano
                ? <Trophy size={30} style={{ color: '#36c97f' }} />
                : <Skull size={30} style={{ color: '#e0796b' }} />}
            </div>
            <p className="font-bold text-lg" style={{ color: gano ? '#36c97f' : '#e0796b' }}>
              {gano ? '¡Ganaste! 🎉' : '¡Te ahorcaron! 💀'}
            </p>
            {!gano && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                La palabra era <span className="font-bold text-white">{secreto}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teclado */}
      {!terminado && (
        <div className="flex flex-col items-center gap-1.5 sm:gap-2 mb-2">
          {ALFABETO.map((fila, fi) => (
            <div key={fi} className="flex gap-1.5 sm:gap-2 justify-center">
              {fila.map((letra) => {
                const usada = guessed.has(letra)
                const acierto = usada && letrasSecretas.has(letra)
                return (
                  <button
                    key={letra}
                    onClick={() => probar(letra)}
                    disabled={usada}
                    className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg font-bold text-sm transition-all"
                    style={{
                      background: usada
                        ? acierto ? 'rgba(40,167,99,0.2)' : 'rgba(224,121,107,0.15)'
                        : 'rgba(9,105,172,0.12)',
                      border: `1px solid ${usada
                        ? acierto ? 'rgba(40,167,99,0.5)' : 'rgba(224,121,107,0.4)'
                        : 'var(--border)'}`,
                      color: usada
                        ? acierto ? '#36c97f' : '#e0796b'
                        : 'var(--text)',
                      cursor: usada ? 'default' : 'pointer',
                      opacity: usada && !acierto ? 0.5 : 1,
                    }}
                  >
                    {letra}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-2 mt-6">
        {terminado && (
          <button
            onClick={reiniciarMismo}
            className="flex-1 min-w-[140px] py-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <RotateCcw size={15} /> Reintentar
          </button>
        )}
        <button
          onClick={onReiniciar}
          className="flex-1 min-w-[140px] py-3 rounded-xl font-bold text-sm text-white inline-flex items-center justify-center gap-2"
          style={{ background: 'var(--neox-blue)', boxShadow: '0 4px 20px rgba(9,105,172,0.35)' }}
        >
          <Link2 size={15} /> Crear mi propio reto
        </button>
      </div>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function AhorcadoPage() {
  const router = useRouter()
  const [reto, setReto] = useState<Reto | null>(null)
  const [ready, setReady] = useState(false)
  const [invalido, setInvalido] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    const raw = router.query.reto
    const token = typeof raw === 'string' ? raw : null
    if (token) {
      const decoded = decodeReto(token)
      setReto(decoded)
      setInvalido(decoded === null)
    } else {
      setReto(null)
      setInvalido(false)
    }
    setReady(true)
  }, [router.isReady, router.query.reto])

  const volverACrear = () => {
    router.push('/ahorcado', undefined, { shallow: true })
  }

  if (!ready) {
    return (
      <Shell>
        <div className="rounded-3xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Cargando…</p>
        </div>
      </Shell>
    )
  }

  if (invalido) {
    return (
      <Shell>
        <div className="rounded-3xl p-8 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-white font-semibold mb-2">Enlace no válido</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            El reto de este enlace está dañado o incompleto.
          </p>
          <button
            onClick={volverACrear}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2"
            style={{ background: 'var(--neox-blue)' }}
          >
            <Link2 size={15} /> Crear un reto nuevo
          </button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      {reto
        ? <Jugar reto={reto} onReiniciar={volverACrear} />
        : <CrearReto />}
    </Shell>
  )
}
