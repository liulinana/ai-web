<script setup lang="ts">
import { ref } from 'vue'
import { SCENE } from '../assets'
import introOtter from '../assets/intro-otter.jpg'
import { sights } from '../data/sights'
import { useCinemaScroll } from '../composables/useCinemaScroll'

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const controlsRef = ref<HTMLElement | null>(null)
const prevRef = ref<HTMLButtonElement | null>(null)
const nextRef = ref<HTMLButtonElement | null>(null)

useCinemaScroll({
  sectionRef,
  trackRef,
  controlsRef,
  prevRef,
  nextRef,
})
</script>

<template>
  <main class="site-shell">
    <section
      id="cinema"
      ref="sectionRef"
      class="cinema-scroll"
      aria-label="Mostar cinematic scroll story"
    >
      <div class="stage">
        <div class="world">
          <img class="scene-img sky-img" :src="SCENE.sky" alt="" />

          <header class="site-header" aria-label="Primary navigation">
            <a class="site-logo" href="#cinema">Bosnia and Herzegovina</a>
            <nav class="site-nav" aria-label="Main menu">
              <a href="#cinema">Intro</a>
              <a href="#bridge">Bridge</a>
              <a href="#bazaar">Bazaar</a>
              <a href="#routes">Routes</a>
            </nav>
            <button class="language-switcher" aria-label="Change language" type="button">
              <span>EN</span>
              <span aria-hidden="true">⌄</span>
            </button>
          </header>

          <div class="back-stack">
            <img
              class="scene-img back-img back-four"
              :src="SCENE.backFour"
              alt=""
            />
            <section class="sights-slider" aria-label="Mostar sights slider">
              <div ref="trackRef" class="sights-track">
                <article
                  v-for="sight in sights"
                  :key="sight.title"
                  class="sight-card"
                  tabindex="0"
                  role="button"
                  :aria-label="sight.ariaLabel"
                >
                  <span class="sight-kicker">{{ sight.kicker }}</span>
                  <img class="sight-pin" :src="sight.pin" alt="" />
                  <h3>{{ sight.title }}</h3>
                  <p>{{ sight.body }}</p>
                </article>
              </div>
            </section>
            <img
              class="scene-img back-img back-bazaar"
              :src="SCENE.bazaar"
              alt=""
            />
          </div>

          <div
            ref="controlsRef"
            class="sights-controls"
            aria-label="Slider controls"
          >
            <button
              ref="prevRef"
              class="sight-nav sight-prev"
              type="button"
              aria-label="Previous sight"
            >
              ←
            </button>
            <button
              ref="nextRef"
              class="sight-nav sight-next"
              type="button"
              aria-label="Next sight"
            >
              →
            </button>
          </div>

          <h1 class="hero-title">【个人测试】</h1>

          <img
            class="scene-img splitframe-img splitframe-left"
            :src="SCENE.splitLeft"
            alt=""
          />
          <img
            class="scene-img splitframe-img splitframe-right"
            :src="SCENE.splitRight"
            alt=""
          />
          <img class="scene-img bridge-img" :src="SCENE.bridge" alt="" />
          <img class="scene-img frame-two-img" :src="SCENE.frameTwo" alt="" />
          <div class="shade" />
        </div>

        <section class="intro-copy" aria-label="Mostar overview">
          <div class="intro-desc">
            <img class="intro-desc-img" :src="introOtter" alt="" />
            <p>
              【这个是信息描述，介绍本网站的基础信息】
            </p>
          </div>
          <div class="hero-tags" aria-label="Mostar highlights">
            <span>Old Bridge</span>
            <span>Neretva River</span>
            <span>UNESCO old city</span>
          </div>
          <ul class="personal-info" aria-label="个人基本信息">
            <li>姓名：张三</li>
            <li>联系方式：13xxxxxxxxx</li>
            <li>邮箱：13xxxxxxxxxx@163.com</li>
          </ul>
        </section>

        <section
          id="bridge"
          class="story-panel story-panel-bridge"
          aria-label="Old Bridge details"
        >
          <h2>The bridge is the city's compass.</h2>
          <p>
            Stari Most links the banks of the Neretva and anchors a historic
            quarter shaped by Ottoman, Mediterranean, and European layers.
          </p>
          <dl class="facts">
            <div>
              <dt>1566</dt>
              <dd>Original bridge completed</dd>
            </div>
            <div>
              <dt>2005</dt>
              <dd>Old Bridge Area inscribed by UNESCO</dd>
            </div>
          </dl>
        </section>

        <section
          id="bazaar"
          class="story-panel story-panel-bazaar"
          aria-label="Old town details"
        >
          <h2>The bazaar keeps Mostar close.</h2>
          <p>
            Stone lanes, mosque courtyards, copper stalls, and riverside coffee
            stay within a short walk of Stari Most.
          </p>
          <button class="note-button" type="button">
            <span aria-hidden="true">↗</span>
            <span>Open old town notes</span>
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
