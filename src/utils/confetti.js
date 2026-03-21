export function confetti() {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '0'
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.pointerEvents = 'none'
  container.style.zIndex = '9999'
  container.style.overflow = 'hidden'
  document.body.appendChild(container)

  const colors = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6']

  for (let i = 0; i < 80; i++) {
    const particle = document.createElement('div')
    particle.style.position = 'absolute'
    const size = Math.random() * 8 + 4
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.borderRadius = '2px'
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    particle.style.top = '-20px'
    particle.style.left = `${Math.random() * 100}%`
    particle.style.transform = `rotate(${Math.random() * 360}deg)`
    container.appendChild(particle)

    const duration = Math.random() * 1500 + 1500
    const delay = Math.random() * 1000
    const xSkew = (Math.random() - 0.5) * 150

    particle.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${xSkew}px, ${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration,
      delay,
      easing: 'ease-out',
      fill: 'forwards'
    })
  }

  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container)
    }
  }, 4000)
}
