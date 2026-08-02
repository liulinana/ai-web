import { onMounted, onUnmounted, type Ref } from 'vue'

type CinemaScrollOptions = {
  sectionRef: Ref<HTMLElement | null>
  trackRef: Ref<HTMLElement | null>
  controlsRef: Ref<HTMLElement | null>
  prevRef: Ref<HTMLButtonElement | null>
  nextRef: Ref<HTMLButtonElement | null>
}

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v))
}

function smoothstep(e0: number, e1: number, v: number) {
  const x = clamp((v - e0) / (e1 - e0))
  return x * x * (3 - 2 * x)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function segmentInOut(s: number, a: number, b: number, c: number, d: number) {
  const enter = smoothstep(a, b, s)
  const exit = smoothstep(c, d, s)
  return { enter, exit, active: enter * (1 - exit) }
}

export function useCinemaScroll(options: CinemaScrollOptions) {
  const { sectionRef, trackRef, controlsRef, prevRef, nextRef } = options

  let targetMouseX = 0
  let targetMouseY = 0
  let mouseX = 0
  let mouseY = 0
  let targetScroll = 0
  let smoothScroll = 0
  let initialized = false
  let rafPending = false
  let rafId = 0
  let sightCards: HTMLElement[] = []
  let originalSightCount = 0
  let activeSight = 0

  const root = document.documentElement
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  function getScrollDistance() {
    const section = sectionRef.value
    if (!section) return 0
    return clamp(
      -section.getBoundingClientRect().top,
      0,
      section.offsetHeight - window.innerHeight,
    )
  }

  function setVar(name: string, value: string | number) {
    root.style.setProperty(name, String(value))
  }

  function updateSightSlider() {
    const track = trackRef.value
    if (!track || sightCards.length === 0) return

    const cardWidth = sightCards[0].offsetWidth
    const gap = parseFloat(getComputedStyle(track).columnGap || '0')
    setVar('--sights-shift', `${-(cardWidth + gap) * activeSight}px`)

    for (const card of sightCards) {
      const index = Number(card.dataset.sightIndex)
      card.classList.toggle('is-active', index === activeSight)
    }
  }

  function jumpSightSlider(i: number) {
    const track = trackRef.value
    if (!track) return
    track.classList.add('is-jumping')
    activeSight = i
    updateSightSlider()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.classList.remove('is-jumping')
      })
    })
  }

  function normalizeSightSlider() {
    if (activeSight >= originalSightCount * 2) {
      jumpSightSlider(activeSight - originalSightCount)
    } else if (activeSight < originalSightCount) {
      jumpSightSlider(activeSight + originalSightCount)
    }
  }

  function moveSightSlider(dir: number) {
    activeSight += dir
    updateSightSlider()
  }

  function selectSightCard(card: HTMLElement) {
    const index = Number(card.dataset.sightIndex)
    if (Number.isFinite(index)) {
      activeSight = index
      updateSightSlider()
    }
  }

  function onCardKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectSightCard(event.currentTarget as HTMLElement)
    }
  }

  function setupSightSlider() {
    const track = trackRef.value
    if (!track) return

    const originals = Array.from(track.querySelectorAll<HTMLElement>('.sight-card'))
    originalSightCount = originals.length
    if (originalSightCount === 0) return

    track.replaceChildren()

    for (let setIndex = 0; setIndex < 3; setIndex += 1) {
      originals.forEach((card, cardIndex) => {
        const clone = card.cloneNode(true) as HTMLElement
        clone.dataset.sightIndex = String(setIndex * originalSightCount + cardIndex)
        track.append(clone)
      })
    }

    sightCards = Array.from(track.querySelectorAll<HTMLElement>('.sight-card'))
    activeSight = originalSightCount

    for (const card of sightCards) {
      card.addEventListener('click', () => selectSightCard(card))
      card.addEventListener('keydown', onCardKeydown)
    }

    track.addEventListener('transitionend', normalizeSightSlider)
    updateSightSlider()
  }

  function update() {
    rafPending = false

    const section = sectionRef.value
    const sightsControls = controlsRef.value
    if (!section || !sightsControls) return

    targetScroll = getScrollDistance()
    if (!initialized || reduceMotion.matches) {
      smoothScroll = targetScroll
      initialized = true
    } else {
      smoothScroll = lerp(smoothScroll, targetScroll, 0.14)
    }
    if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll

    mouseX = lerp(mouseX, targetMouseX, 0.12)
    mouseY = lerp(mouseY, targetMouseY, 0.12)

    const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620)
    const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700)
    const progress = clamp(smoothScroll / 2700)
    const introExit = smoothstep(90, 650, smoothScroll)
    const sightsEnterRaw = smoothstep(2760, 3560, smoothScroll)
    const sightsEnter = Math.pow(sightsEnterRaw, 1.55)
    const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll)
    const blurActive = clamp(frame2.active + frame3.active)
    const frame2Opacity = frame2.active * (1 - frame3.enter)
    const splitDrift = Math.pow(frame2.enter, 1.5)
    const panel2Opacity = frame2.active * (1 - frame2.exit)
    const panel3Opacity = frame3.active * (1 - frame3.exit)
    const backScale =
      0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16
    const sharedHeroY = progress * -74
    const sharedHeroScale = progress * 0.23
    const sightsScreenTop =
      Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50
    const sightsParentTop =
      window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale

    const mx = reduceMotion.matches ? 0 : mouseX
    const my = reduceMotion.matches ? 0 : mouseY

    setVar('--mx', mx.toFixed(4))
    setVar('--my', my.toFixed(4))

    setVar('--back-opacity', 1 - frame2.active * 0.06)
    setVar('--back-x', `${mouseX * -12}px`)
    setVar('--back-y', `${mouseY * -4}px`)
    setVar('--back-scale', backScale)
    setVar('--four-y', `${10 + progress * 10}vh`)
    setVar('--four-scale', 0.78 + progress * 0.16)
    setVar('--bazaar-y', `${20 - progress * 8}vh`)
    setVar('--blur-px', `${blurActive * 14}px`)
    setVar('--back-brightness', 1 - blurActive * 0.255)
    setVar('--bazaar-blur-px', `${frame2.active * 14}px`)
    setVar(
      '--bazaar-brightness',
      1 - frame2.active * 0.255 - frame3.active * 0.06,
    )
    setVar('--bazaar-saturation', 1 + frame3.active * 0.18)
    setVar('--shade-opacity', '1')
    setVar('--shade-z', frame2.active > 0.02 ? '2' : '0')
    setVar('--shade-top-alpha', blurActive * 0.465)
    setVar('--shade-mid-alpha', blurActive * 0.42)
    setVar('--shade-bottom-alpha', blurActive * 0.51)

    setVar('--title-y', `${introExit * -210}px`)
    setVar('--title-scale', 1 - introExit * 0.08)
    setVar('--title-opacity', 1 - introExit)

    setVar('--bridge-x', `calc(-50% + ${mouseX * 18}px)`)
    setVar(
      '--bridge-y',
      `${mouseY * 8 + sharedHeroY - frame2.exit * 760}px`,
    )
    setVar('--bridge-bottom', `${5 - frame2.enter * 13}vh`)
    setVar('--bridge-width', `${67.2 + frame2.enter * 37.8}vw`)
    setVar('--bridge-scale', 1.02 + sharedHeroScale + frame2.exit * 0.46)

    setVar(
      '--split-left-x',
      `calc(-50% + ${-splitDrift * 46}vw + ${mouseX * 22}px)`,
    )
    setVar(
      '--split-left-y',
      `${mouseY * 10 + sharedHeroY - splitDrift * 180}px`,
    )
    setVar('--split-left-scale', 1 + sharedHeroScale + frame2.enter * 0.74)
    setVar(
      '--split-right-x',
      `calc(-50% + ${splitDrift * 46}vw + ${mouseX * 22}px)`,
    )
    setVar(
      '--split-right-y',
      `${mouseY * 10 + sharedHeroY - splitDrift * 180}px`,
    )
    setVar('--split-right-scale', 1 + sharedHeroScale + frame2.enter * 0.74)

    setVar('--frame2-opacity', frame2Opacity)
    setVar('--frame2-x', `calc(-50% + ${mouseX * 10}px)`)
    setVar(
      '--frame2-y',
      `calc(-50% + ${mouseY * 8 - frame2.exit * 150}px)`,
    )
    setVar(
      '--frame2-scale',
      1.06 + frame2.enter * 0.08 + frame2.exit * 0.08,
    )

    setVar('--intro-copy-y', `${introExit * 90}px`)
    setVar('--intro-copy-opacity', 1 - introExit)
    setVar('--panel2-opacity', panel2Opacity)
    setVar(
      '--panel2-y',
      `calc(-50% + ${-frame2.exit * 86 + (1 - frame2.enter) * 58}px)`,
    )
    setVar('--panel3-opacity', panel3Opacity)
    setVar(
      '--panel3-y',
      `calc(-50% + ${-frame3.exit * 86 + (1 - frame3.enter) * 58}px)`,
    )

    setVar('--sights-opacity', sightsEnter)
    setVar('--sights-controls-opacity', sightsControlsEnter)
    sightsControls.classList.toggle('is-ready', sightsControlsEnter > 0.98)
    setVar('--sights-visibility', sightsEnter > 0.01 ? 'visible' : 'hidden')
    setVar('--sights-y', '0px')
    setVar('--sights-enter-x', `${(1 - sightsEnter) * 420}vw`)
    setVar('--sights-scale', 1 / backScale)
    setVar('--sights-top', `${sightsParentTop}px`)
    setVar('--sights-screen-top', `${sightsScreenTop}px`)

    if (
      Math.abs(smoothScroll - targetScroll) > 0.08 ||
      Math.abs(mouseX - targetMouseX) > 0.001 ||
      Math.abs(mouseY - targetMouseY) > 0.001
    ) {
      requestTick()
    }
  }

  function requestTick() {
    if (rafPending) return
    rafPending = true
    rafId = requestAnimationFrame(update)
  }

  function onScroll() {
    requestTick()
  }

  function onResize() {
    updateSightSlider()
    requestTick()
  }

  function onPointerMove(event: PointerEvent) {
    targetMouseX = event.clientX / window.innerWidth - 0.5
    targetMouseY = event.clientY / window.innerHeight - 0.5
    requestTick()
  }

  function onPrevClick() {
    moveSightSlider(-1)
  }

  function onNextClick() {
    moveSightSlider(1)
  }

  onMounted(() => {
    setupSightSlider()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    prevRef.value?.addEventListener('click', onPrevClick)
    nextRef.value?.addEventListener('click', onNextClick)
    requestTick()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onPointerMove)
    prevRef.value?.removeEventListener('click', onPrevClick)
    nextRef.value?.removeEventListener('click', onNextClick)
    trackRef.value?.removeEventListener('transitionend', normalizeSightSlider)
    cancelAnimationFrame(rafId)
  })
}
