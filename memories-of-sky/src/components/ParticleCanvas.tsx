import { useEffect, useRef, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import type { Season } from '@/lib/utils'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  opacity: number
  color: string
  phase: number
  pulseSpeed?: number
}

function createParticles(season: Season, w: number, h: number): Particle[] {
  const particles: Particle[] = []

  if (season === 'spring') {
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 3 + Math.random() * 6,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.3,
        speedY: 0.3 + Math.random() * 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: 0.4 + Math.random() * 0.4,
        color: '#FAD0C4',
        phase: Math.random() * Math.PI * 2,
      })
    }
  } else if (season === 'summer') {
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1.5 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.3,
        rotation: 0,
        rotationSpeed: 0,
        opacity: 0.3 + Math.random() * 0.5,
        color: '#FFD700',
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      })
    }
  } else if (season === 'autumn') {
    const colors = ['#D35400', '#E74C3C', '#F39C12', '#C0392B']
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 6 + Math.random() * 10,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.4,
        speedY: 0.4 + Math.random() * 0.6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
        opacity: 0.5 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
      })
    }
  } else {
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 2 + Math.random() * 4,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: 0.5 + Math.random() * 0.8,
        rotation: 0,
        rotationSpeed: 0,
        opacity: 0.3 + Math.random() * 0.5,
        color: '#ffffff',
        phase: Math.random() * Math.PI * 2,
      })
    }
  }

  return particles
}

function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string, opacity: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.globalAlpha = opacity
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.bezierCurveTo(size * 0.6, -size * 0.6, size * 0.6, size * 0.3, 0, size)
  ctx.bezierCurveTo(-size * 0.6, size * 0.3, -size * 0.6, -size * 0.6, 0, -size)
  ctx.fill()
  ctx.restore()
}

export default function ParticleCanvas() {
  const { season } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)
  const seasonRef = useRef(season)

  useEffect(() => {
    seasonRef.current = season
  }, [season])

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    particlesRef.current = createParticles(seasonRef.current, canvas.width, canvas.height)
  }, [])

  useEffect(() => {
    initCanvas()
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initCanvas])

  useEffect(() => {
    particlesRef.current = createParticles(season, window.innerWidth, window.innerHeight)
  }, [season])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 1

      for (const p of particlesRef.current) {
        if (seasonRef.current === 'spring') {
          p.x += Math.sin(time * 0.01 + p.phase) * 0.5 + p.speedX
          p.y += p.speedY
          p.rotation += p.rotationSpeed
          if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width }
          if (p.x > canvas.width + 10) p.x = -10
          if (p.x < -10) p.x = canvas.width + 10

          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else if (seasonRef.current === 'summer') {
          p.x += p.speedX + Math.sin(time * 0.005 + p.phase) * 0.3
          p.y += p.speedY + Math.cos(time * 0.003 + p.phase) * 0.2
          if (p.y > canvas.height) p.y = 0
          if (p.y < 0) p.y = canvas.height
          if (p.x > canvas.width) p.x = 0
          if (p.x < 0) p.x = canvas.width

          const pulse = Math.sin(time * (p.pulseSpeed || 0.02) + p.phase) * 0.5 + 0.5
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
          gradient.addColorStop(0, `rgba(255, 215, 0, ${p.opacity * pulse})`)
          gradient.addColorStop(0.5, `rgba(255, 215, 0, ${p.opacity * pulse * 0.3})`)
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (seasonRef.current === 'autumn') {
          p.x += Math.sin(time * 0.008 + p.phase) * 0.8 + p.speedX
          p.y += p.speedY
          p.rotation += p.rotationSpeed
          if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width }
          if (p.x > canvas.width + 20) p.x = -20
          if (p.x < -20) p.x = canvas.width + 20

          drawLeaf(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity)
        } else {
          p.x += p.speedX + Math.sin(time * 0.003 + p.phase) * 0.15
          p.y += p.speedY
          if (p.y > canvas.height + 5) { p.y = -5; p.x = Math.random() * canvas.width }
          if (p.x > canvas.width + 5) p.x = -5
          if (p.x < -5) p.x = canvas.width + 5

          ctx.globalAlpha = p.opacity
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.5)
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
          gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)')
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [season])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[2] pointer-events-none"
    />
  )
}
