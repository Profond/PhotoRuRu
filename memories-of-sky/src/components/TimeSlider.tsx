import { useRef, useEffect, useCallback, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { SEASON_COLORS, getTimeLabel } from '@/lib/utils'

export default function TimeSlider() {
  const { timeFraction, setTimeFraction, season } = useApp()
  const color = SEASON_COLORS[season]
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const [showMeteor, setShowMeteor] = useState(false)
  const [isGolden, setIsGolden] = useState(false)
  const meteorTriggered = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const updateTime = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return
      const rect = sliderRef.current.getBoundingClientRect()
      const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      setTimeFraction(fraction)

      const targetFraction = (5 + 46 / 60 - 4) / 20
      if (Math.abs(fraction - targetFraction) < 0.017 && !meteorTriggered.current) {
        meteorTriggered.current = true
        setIsGolden(true)
        setShowMeteor(true)

        setTimeout(() => setIsGolden(false), 3000)
        setTimeout(() => {
          setShowMeteor(false)
          meteorTriggered.current = false
        }, 6000)
      }
    },
    [setTimeFraction]
  )

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      updateTime(e.clientX)
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) updateTime(e.clientX)
    }
    const handleMouseUp = () => {
      isDragging.current = false
    }
    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true
      updateTime(e.touches[0].clientX)
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) updateTime(e.touches[0].clientX)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [updateTime])

  useEffect(() => {
    if (!showMeteor || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let progress = 0
    const startTime = performance.now()

    function animate(now: number) {
      if (!ctx || !canvas) return
      progress = Math.min(1, (now - startTime) / 2000)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const startX = canvas.width * 0.2
      const startY = canvas.height * 0.15
      const endX = canvas.width * 0.7
      const endY = canvas.height * 0.45
      const x = startX + (endX - startX) * progress
      const y = startY + (endY - startY) * progress

      const tailLength = 200
      const angle = Math.atan2(endY - startY, endX - startX)
      const tailX = x - Math.cos(angle) * tailLength * (1 - progress * 0.5)
      const tailY = y - Math.sin(angle) * tailLength * (1 - progress * 0.5)

      const gradient = ctx.createLinearGradient(tailX, tailY, x, y)
      gradient.addColorStop(0, 'rgba(100, 150, 255, 0)')
      gradient.addColorStop(0.7, 'rgba(150, 200, 255, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)')

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(x, y)
      ctx.stroke()

      const headGrad = ctx.createRadialGradient(x, y, 0, x, y, 12)
      headGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
      headGrad.addColorStop(0.3, 'rgba(150, 200, 255, 0.5)')
      headGrad.addColorStop(1, 'rgba(100, 150, 255, 0)')
      ctx.fillStyle = headGrad
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fill()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 500)
      }
    }

    requestAnimationFrame(animate)
  }, [showMeteor])

  const timeLabel = getTimeLabel(timeFraction)

  return (
    <>
      {showMeteor && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-[60] pointer-events-none"
        />
      )}

      {showMeteor && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none">
          <div
            className="writing-vertical font-display text-6xl md:text-8xl"
            style={{
              animation: 'fadeInOut 5s ease forwards',
              textShadow: '0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.3)',
            }}
          >
            君の名は。
          </div>
        </div>
      )}

      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-6 pt-3"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
        }}
      >
        <span
          className="font-mono-label text-sm mb-3 transition-colors duration-300"
          style={{
            color: isGolden ? '#FFD700' : 'rgba(255,255,255,0.5)',
            textShadow: isGolden ? '0 0 12px rgba(255, 215, 0, 0.5)' : 'none',
          }}
        >
          {timeLabel}
        </span>

        <div
          ref={sliderRef}
          className="relative h-6 cursor-pointer"
          style={{ width: 'min(600px, 80vw)' }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-white/20" />
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-px transition-[width] duration-75"
            style={{
              width: `${timeFraction * 100}%`,
              background: color,
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-white/40 transition-[left] duration-75"
            style={{
              left: `${timeFraction * 100}%`,
              background: color,
              boxShadow: `0 0 8px ${color}60`,
            }}
          />
        </div>

        <div
          className="flex justify-between font-mono-label text-[10px] text-white/25 mt-1"
          style={{ width: 'min(600px, 80vw)' }}
        >
          <span>04:00</span>
          <span>12:00</span>
          <span>20:00</span>
          <span>24:00</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          15% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}
