'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [konami, setKonami] = useState<string[]>([])
  const [showSecret, setShowSecret] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [clickCombo, setClickCombo] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([])

  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.key].slice(-10)
      setKonami(newKonami)

      if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
        setShowSecret(true)
        setScore(prev => prev + 9999)
        playSound('powerup')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konami])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    createStars()
  }, [])

  const createStars = () => {
    const starContainer = document.querySelector('.stars')
    if (!starContainer) return

    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 2}s`
      starContainer.appendChild(star)
    }
  }

  const playSound = (type: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    if (type === 'coin') {
      oscillator.frequency.value = 988
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } else if (type === 'powerup') {
      oscillator.frequency.value = 1047
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      oscillator.start(audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(2093, audioContext.currentTime + 0.2)
      oscillator.stop(audioContext.currentTime + 0.2)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    setScore(prev => prev + 10)
    setClickCombo(prev => prev + 1)
    playSound('coin')

    const particle = { id: Date.now(), x: e.clientX, y: e.clientY }
    setParticles(prev => [...prev, particle])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particle.id))
    }, 1000)

    if (clickCombo > 0 && clickCombo % 10 === 0) {
      setCoins(prev => prev + 1)
      playSound('powerup')
    }
  }

  const startGame = () => {
    setGameStarted(true)
    playSound('powerup')
  }

  const collectCoin = () => {
    setCoins(prev => prev + 1)
    setScore(prev => prev + 100)
    playSound('coin')
  }

  return (
    <>
      <div className="scanline"></div>
      <div className="crt-effect"></div>
      <div className="stars"></div>

      {particles.map(particle => (
        <div
          key={particle.id}
          className={styles.particle}
          style={{ left: particle.x, top: particle.y }}
        >
          +10
        </div>
      ))}

      <div className="container">
        {!gameStarted ? (
          <div className={styles.startScreen}>
            <h1 className={`${styles.title} glitch neon-glow`}>
              INSERT COIN
            </h1>
            <div className={styles.blinkText}>
              <p className="blink">PRESS START</p>
            </div>
            <button className="pixel-button" onClick={startGame}>
              START GAME
            </button>
            <div className={styles.credits}>
              <p>1 PLAYER MODE</p>
            </div>
          </div>
        ) : (
          <>
            <header className={styles.header}>
              <div className={styles.hud}>
                <div className={styles.hudItem}>
                  <span>SCORE</span>
                  <span className="rainbow-text">{score.toString().padStart(6, '0')}</span>
                </div>
                <div className={styles.hudItem}>
                  <span>COINS</span>
                  <span className="neon-glow">x{coins}</span>
                </div>
                <div className={styles.hudItem}>
                  <span>COMBO</span>
                  <span style={{color: '#ff00ff'}}>{clickCombo}</span>
                </div>
              </div>
            </header>

            <section className={styles.hero} onClick={handleClick}>
              <div className={styles.pixelArt}>
                <div className={styles.character}></div>
              </div>
              <h1 className={`${styles.mainTitle} glitch`}>
                <span className="neon-glow">AI ENGINEER</span>
              </h1>
              <p className={styles.subtitle}>
                <span className="rainbow-text">CSE (AIML) • NEURAL NETWORK ARCHITECT</span>
              </p>
              <div className={styles.statusBar}>
                <div className={styles.healthBar}>
                  <span>SKILLS</span>
                  <div className={styles.barContainer}>
                    <div className={styles.barFill} style={{width: '95%'}}></div>
                  </div>
                </div>
                <div className={styles.healthBar}>
                  <span>CAFFEINE</span>
                  <div className={styles.barContainer}>
                    <div className={styles.barFill} style={{width: '100%', background: '#ff0000'}}></div>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.about}>
              <div className={`${styles.window} pixel-border`}>
                <div className={styles.windowTitle}>
                  <span>▶ ABOUT.EXE</span>
                </div>
                <div className={styles.windowContent}>
                  <p className={styles.typewriter}>
                    &gt; LOADING PROFILE...<br/>
                    &gt; STATUS: ASPIRING AI ENGINEER<br/>
                    &gt; EDUCATION: CSE (AIML)<br/>
                    &gt; MISSION: BUILDING INTELLIGENT SYSTEMS<br/>
                    &gt; PASSION: NEURAL NETWORKS & DEEP LEARNING<br/>
                    &gt; SPECIAL ABILITY: TURNING COFFEE INTO CODE
                  </p>
                </div>
              </div>
            </section>

            <section className={styles.skills}>
              <h2 className={`${styles.sectionTitle} neon-glow`}>
                === SKILL TREE ===
              </h2>
              <div className={styles.skillGrid}>
                {[
                  { name: 'Python', level: 95, color: '#00ff00' },
                  { name: 'Machine Learning', level: 90, color: '#00ffff' },
                  { name: 'Deep Learning', level: 85, color: '#ff00ff' },
                  { name: 'TensorFlow', level: 80, color: '#ffff00' },
                  { name: 'PyTorch', level: 80, color: '#ff9900' },
                  { name: 'NLP', level: 75, color: '#00ff99' },
                  { name: 'Computer Vision', level: 75, color: '#9900ff' },
                  { name: 'Neural Networks', level: 85, color: '#ff0099' }
                ].map((skill, idx) => (
                  <div key={idx} className={`${styles.skillCard} float`} style={{animationDelay: `${idx * 0.1}s`}}>
                    <div className={styles.skillName}>{skill.name}</div>
                    <div className={styles.skillBarContainer}>
                      <div
                        className={styles.skillBar}
                        style={{
                          width: `${skill.level}%`,
                          background: skill.color,
                          boxShadow: `0 0 10px ${skill.color}`
                        }}
                      >
                        <span className={styles.skillLevel}>LVL {skill.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.projects}>
              <h2 className={`${styles.sectionTitle} neon-glow`}>
                === ACHIEVEMENTS UNLOCKED ===
              </h2>
              <div className={styles.projectGrid}>
                <div className={`${styles.projectCard} pixel-border`}>
                  <div className={styles.projectIcon}>🤖</div>
                  <h3>AI CHATBOT</h3>
                  <p>Built NLP-powered conversational AI</p>
                  <div className={styles.badge}>+500 XP</div>
                </div>
                <div className={`${styles.projectCard} pixel-border`}>
                  <div className={styles.projectIcon}>👁️</div>
                  <h3>IMAGE CLASSIFIER</h3>
                  <p>CNN model with 95% accuracy</p>
                  <div className={styles.badge}>+750 XP</div>
                </div>
                <div className={`${styles.projectCard} pixel-border`}>
                  <div className={styles.projectIcon}>📊</div>
                  <h3>PREDICTIVE MODEL</h3>
                  <p>Time series forecasting system</p>
                  <div className={styles.badge}>+600 XP</div>
                </div>
                <div className={`${styles.projectCard} pixel-border`}>
                  <div className={styles.projectIcon}>🧠</div>
                  <h3>NEURAL NETWORK</h3>
                  <p>Custom architecture from scratch</p>
                  <div className={styles.badge}>+1000 XP</div>
                </div>
              </div>
            </section>

            <section className={styles.minigame}>
              <div className={`${styles.window} pixel-border`}>
                <div className={styles.windowTitle}>
                  <span>▶ COIN_COLLECTOR.EXE</span>
                </div>
                <div className={styles.windowContent}>
                  <div className={styles.gameArea}>
                    <button
                      className={`${styles.coinButton} float`}
                      onClick={collectCoin}
                    >
                      💰
                    </button>
                    <p style={{fontSize: '12px', marginTop: '20px'}}>
                      CLICK THE COIN TO COLLECT!<br/>
                      OR CLICK ANYWHERE FOR POINTS!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {showSecret && (
              <section className={styles.secret}>
                <div className={`${styles.window} pixel-border`} style={{borderColor: '#ff00ff'}}>
                  <div className={styles.windowTitle} style={{background: '#ff00ff'}}>
                    <span>🎮 SECRET UNLOCKED! 🎮</span>
                  </div>
                  <div className={styles.windowContent}>
                    <h3 className="rainbow-text">KONAMI CODE ACTIVATED!</h3>
                    <p>You found the secret! +9999 BONUS POINTS!</p>
                    <p style={{fontSize: '10px', marginTop: '10px'}}>
                      Achievement: TRUE GAMER STATUS
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className={styles.contact}>
              <h2 className={`${styles.sectionTitle} neon-glow`}>
                === CONNECT ===
              </h2>
              <div className={styles.contactButtons}>
                <button className="pixel-button" onClick={() => playSound('coin')}>
                  GITHUB
                </button>
                <button className="pixel-button" onClick={() => playSound('coin')}>
                  LINKEDIN
                </button>
                <button className="pixel-button" onClick={() => playSound('coin')}>
                  EMAIL
                </button>
                <button className="pixel-button" onClick={() => playSound('coin')}>
                  TWITTER
                </button>
              </div>
            </section>

            <footer className={styles.footer}>
              <p className="blink">THANK YOU FOR PLAYING!</p>
              <p style={{fontSize: '10px', marginTop: '10px'}}>
                © 2025 AI ENGINEER • MADE WITH ❤️ AND PIXELS
              </p>
              <p style={{fontSize: '8px', marginTop: '5px', opacity: 0.5}}>
                TIP: Try the Konami Code (↑↑↓↓←→←→BA)
              </p>
            </footer>
          </>
        )}
      </div>
    </>
  )
}
