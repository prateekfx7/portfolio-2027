/**
 * Prateekfx Portfolio — High-Performance Client Interactivity, Lenis Smooth Motion & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 0. Smooth Momentum Scrolling Engine (Lenis)
  // =========================================================================
  let lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // =========================================================================
  // 1. Scroll Reveal Engine (Scroll Appear Effects)
  // =========================================================================
  const revealElements = document.querySelectorAll('.framer-appear-reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appeared');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.05
    });

    revealElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Stagger initial in-viewport elements
        setTimeout(() => {
          el.classList.add('appeared');
        }, Math.min(index * 60, 600));
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    revealElements.forEach(el => el.classList.add('appeared'));
  }

  // =========================================================================
  // 2. Stats Number Counter Animation
  // =========================================================================
  const statsElements = [
    { target: '5M+', num: 5, prefix: '', suffix: 'M+' },
    { target: '30+', num: 30, prefix: '', suffix: '+' },
    { target: '$10K', num: 10, prefix: '$', suffix: 'K' },
    { target: '90%', num: 90, prefix: '', suffix: '%' }
  ];

  const animateCounter = (el, cfg) => {
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (cfg.num - start) * ease);
      el.textContent = `${cfg.prefix}${current}${cfg.suffix}`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = cfg.target;
      }
    };
    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const match = statsElements.find(s => s.target === text);
          if (match) {
            animateCounter(el, match);
            obs.unobserve(el);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.framer-1rosyc2 p.framer-styles-preset-1jdilrp').forEach(p => {
      statsObserver.observe(p);
    });
  }

  // =========================================================================
  // Unified Hover-to-Sound Controller for All Videos
  // =========================================================================
  let userHasInteracted = false;
  const registerUserInteraction = () => {
    userHasInteracted = true;
    ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(ev => {
      window.removeEventListener(ev, registerUserInteraction);
    });
  };
  ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(ev => {
    window.addEventListener(ev, registerUserInteraction, { passive: true });
  });

  let currentSoundVideo = null;

  const playVideoSound = (video, container) => {
    if (!video) return;

    // Silence any other video
    if (currentSoundVideo && currentSoundVideo !== video) {
      currentSoundVideo.muted = true;
      const prevCard = currentSoundVideo.closest('.work-card-anchor, .framer-hxYcN, .framer-1do01so, .thR3d7lalp-plate');
      if (prevCard) prevCard.classList.remove('has-sound');
    }

    currentSoundVideo = video;
    video.muted = false;
    video.volume = 1.0;
    if (container) container.classList.add('has-sound');

    const promise = video.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Autoplay policy prevented unmuted playback without prior user interaction
        if (!userHasInteracted) {
          const unlockOnNextGesture = () => {
            if (currentSoundVideo === video && (container?.matches(':hover') || video.matches(':hover'))) {
              video.muted = false;
              video.volume = 1.0;
              video.play().catch(() => {});
              if (container) container.classList.add('has-sound');
            }
          };
          ['pointerdown', 'click', 'touchstart'].forEach(ev => {
            window.addEventListener(ev, unlockOnNextGesture, { once: true, passive: true });
          });
        }
      });
    }
  };

  const muteVideoSound = (video, container) => {
    if (!video) return;
    video.muted = true;
    if (container) container.classList.remove('has-sound');
    if (currentSoundVideo === video) {
      currentSoundVideo = null;
    }
  };

  const setupHoverSound = (container, videoSelector = 'video') => {
    if (!container) return;
    const video = container.querySelector(videoSelector);
    if (!video) return;

    // Append subtle sound indicator pill if not already present
    if (!container.querySelector('.sound-hover-pill')) {
      const pill = document.createElement('div');
      pill.className = 'sound-hover-pill';
      pill.setAttribute('aria-hidden', 'true');
      pill.innerHTML = `
        <span class="sound-wave-icon">
          <span class="sound-wave-bar"></span>
          <span class="sound-wave-bar"></span>
          <span class="sound-wave-bar"></span>
        </span>
        <span class="sound-hover-text">Sound</span>
      `;
      container.appendChild(pill);
    }

    container.addEventListener('mouseenter', () => {
      playVideoSound(video, container);
    });

    container.addEventListener('mouseleave', () => {
      muteVideoSound(video, container);
    });
  };

  // =========================================================================
  // 3. Hero Showreel Player with 3D Reveal & Interactive Tilt
  // =========================================================================
  const showreelContainer = document.querySelector('.showreel-3d-reveal');
  const showreelCard = document.querySelector('.framer-1do01so');

  const updateShowreelTilt = () => {
    if (!showreelContainer) return;
    if (window.innerWidth <= 809) {
      showreelContainer.style.transform = 'none';
      showreelContainer.style.opacity = '1';
      return;
    }
    const rect = showreelContainer.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Start unrolling when top is near bottom of viewport, finish when well visible
    const enterZone = windowH * 0.95;
    const finishZone = windowH * 0.35;

    let progress = (enterZone - rect.top) / (enterZone - finishZone);
    progress = Math.max(0, Math.min(1, progress));

    const rotateX = (28 * (1 - progress)).toFixed(2);
    const translateY = (45 * (1 - progress)).toFixed(1);
    const scale = (0.93 + 0.07 * progress).toFixed(3);
    const opacity = (0.85 + 0.15 * progress).toFixed(2);

    showreelContainer.style.transform = `perspective(1400px) rotateX(${rotateX}deg) translateY(${translateY}px) scale(${scale})`;
    showreelContainer.style.opacity = opacity;

    if (progress >= 0.95) {
      showreelContainer.classList.add('revealed');
    }
  };

  if (lenis) {
    lenis.on('scroll', updateShowreelTilt);
  } else {
    window.addEventListener('scroll', updateShowreelTilt, { passive: true });
  }
  updateShowreelTilt();

  if (showreelCard) {
    const video = showreelCard.querySelector('video');

    // Autoplay hero showreel muted by default
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }

    // Hover to play sound
    setupHoverSound(showreelCard, 'video');

    // 3D Perspective Tilt on Mouse Movement (Desktop only)
    showreelCard.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 809) return;
      const rect = showreelCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      showreelCard.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    showreelCard.addEventListener('mouseleave', () => {
      if (window.innerWidth <= 809) {
        showreelCard.style.transform = 'none';
      } else {
        showreelCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
      }
    });

    // Click to Toggle Audio / Play-Pause
    showreelCard.addEventListener('click', () => {
      if (!video) return;
      if (video.paused) {
        video.play().catch(() => {});
      }
      if (video.muted) {
        playVideoSound(video, showreelCard);
      } else {
        muteVideoSound(video, showreelCard);
      }
    });
  }

  // =========================================================================
  // 4. 3D Rotating Video Carousel (Tholos) in "more selected work"
  // =========================================================================
  const stage = document.querySelector('[style*="perspective:1300px"], [style*="perspective: 1300px"]');
  if (stage) {
    stage.classList.add('tholos-carousel-stage');
    const plates = Array.from(stage.querySelectorAll('.thR3d7lalp-plate'));
    const totalCards = plates.length;

    if (totalCards > 0) {
      const cardW = 357;
      const gap = 30;
      const R = 1920;
      const stride = (cardW + gap) / R;
      const maxTurn = 50;
      const arc = 78;

      let currentPos = 0;
      let targetPos = 0;
      let isDragging = false;
      let startX = 0;
      let lastPos = 0;
      let isHovered = false;

      const updateLayout = () => {
        currentPos += (targetPos - currentPos) * 0.1;

        plates.forEach((plate, i) => {
          // Normalize position difference around circular loop
          let d = (i - currentPos) % totalCards;
          if (d > totalCards / 2) d -= totalCards;
          if (d < -totalCards / 2) d += totalCards;

          const theta = d * stride;
          const deg = (theta * 180) / Math.PI;

          if (Math.abs(deg) > arc) {
            plate.style.visibility = 'hidden';
            plate.style.opacity = '0';
            return;
          }

          const x = R * Math.sin(theta);
          const z = R * (Math.cos(theta) - 1);
          const turn = Math.max(-maxTurn, Math.min(maxTurn, deg));
          const alpha = Math.max(0, 1 - Math.abs(deg) / arc);
          const scale = 1;
          const layer = 500 - Math.round(Math.abs(d) * 20);

          plate.style.visibility = 'visible';
          plate.style.opacity = alpha.toFixed(3);
          plate.style.zIndex = layer;
          plate.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, 0px, ${z.toFixed(2)}px) rotateY(${turn.toFixed(2)}deg) scale(${scale})`;

          // Autoplay video for cards in center view
          const vid = plate.querySelector('video');
          if (vid) {
            if (Math.abs(d) < 1.5) {
              if (vid.paused) vid.play().catch(() => {});
            } else {
              if (!vid.paused) vid.pause();
            }
          }
        });

        // Auto-drift when not dragging or hovering
        if (!isDragging && !isHovered) {
          targetPos += 0.008;
        }

        requestAnimationFrame(updateLayout);
      };

      // Pointer / Drag Interactions
      stage.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        lastPos = targetPos;
        stage.setPointerCapture(e.pointerId);
      });

      stage.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        targetPos = lastPos - (deltaX / 280);
      });

      const stopDrag = (e) => {
        if (isDragging) {
          isDragging = false;
          try { stage.releasePointerCapture(e.pointerId); } catch (_) {}
        }
      };

      stage.addEventListener('pointerup', stopDrag);
      stage.addEventListener('pointercancel', stopDrag);

      stage.addEventListener('mouseenter', () => { isHovered = true; });
      stage.addEventListener('mouseleave', () => { isHovered = false; });

      // Enable hover to sound on carousel cards
      plates.forEach(plate => {
        setupHoverSound(plate, 'video');
      });

      // Start 3D animation loop
      requestAnimationFrame(updateLayout);
    }
  }

  // =========================================================================
  // 5. Showcase Videos Autoplay, Viewport Loop & Hover-to-Sound
  // =========================================================================
  const allVideos = document.querySelectorAll('video');
  if ('IntersectionObserver' in window) {
    const vidObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (vid.closest('.framer-1do01so')) return; // Hero showreel managed separately
        if (vid.closest('.thR3d7lalp-plate')) return; // 3D carousel managed separately
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.15 });

    allVideos.forEach(v => {
      if (!v.closest('.framer-1do01so') && !v.closest('.thR3d7lalp-plate')) {
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        vidObserver.observe(v);
      }
    });
  }

  // Set up Hover-to-Sound on all Selected Work cards
  document.querySelectorAll('.work-card-anchor').forEach(card => {
    setupHoverSound(card, 'video');
  });

  // =========================================================================
  // 5b. Animated Lottie Icons for Services Cards & Deliverables Marquee
  // =========================================================================
  const servicesLotties = [
    { selector: '.framer-13fd11i-container .framer-p0m547', file: '/assets/lottie/VQ7fofXEw2LVtjYPx1GyCK24w.json' },
    { selector: '.framer-diiw6g-container .framer-p0m547', file: '/assets/lottie/dpQkmTztCXQ7O112mcm9y9CLxo.json' },
    { selector: '.framer-1axx82u-container .framer-p0m547', file: '/assets/lottie/TbI0p4b5vF30K9jyZfA8DZSTw.json' },
    { selector: '.framer-10k3s3h-container .framer-p0m547', file: '/assets/lottie/VQ7fofXEw2LVtjYPx1GyCK24w.json' },
    { selector: '.framer-1j0ubxc-container .framer-p0m547', file: '/assets/lottie/dpQkmTztCXQ7O112mcm9y9CLxo.json' },
    { selector: '.framer-m1od4v-container .framer-p0m547', file: '/assets/lottie/Kasbdyv7dRLp9bdTRWS3V4okhA.json' }
  ];

  if (window.lottie) {
    servicesLotties.forEach(item => {
      const box = document.querySelector(item.selector);
      if (box) {
        box.innerHTML = ''; // Clear placeholder canvas
        window.lottie.loadAnimation({
          container: box,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: item.file
        });
      }
    });
  }

  // Clone deliverables pills for seamless continuous marquee loop
  document.querySelectorAll('.framer-11j3kll-container ul').forEach(ul => {
    const items = Array.from(ul.children);
    items.forEach(li => {
      const clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      ul.appendChild(clone);
    });
  });

  // =========================================================================
  // 6. Interactive FAQ Accordions
  // =========================================================================
  const accordions = document.querySelectorAll('.framer-AsESN');
  accordions.forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't toggle if user clicks an actual link inside the answer
      if (e.target.closest('a')) return;

      const isOpen = item.classList.contains('is-open');

      // Close other accordion items
      accordions.forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          other.classList.remove('framer-v-17i2odx');
          other.classList.add('framer-v-1mvyd8x');
          other.setAttribute('data-framer-name', 'Close');
        }
      });

      if (!isOpen) {
        item.classList.add('is-open');
        item.classList.remove('framer-v-1mvyd8x');
        item.classList.add('framer-v-17i2odx');
        item.setAttribute('data-framer-name', 'Open');
      } else {
        item.classList.remove('is-open');
        item.classList.remove('framer-v-17i2odx');
        item.classList.add('framer-v-1mvyd8x');
        item.setAttribute('data-framer-name', 'Close');
      }
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // =========================================================================
  // 7. Infinite Logo Marquee Ticker
  // =========================================================================
  const tickerUl = document.querySelector('.framer-cpjc5d-container ul, .framer-6vmy7n ul');
  if (tickerUl) {
    tickerUl.classList.add('framer-ticker-track');
    // Clone children to ensure seamless continuous loop
    const items = Array.from(tickerUl.children);
    items.forEach(li => {
      const clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      tickerUl.appendChild(clone);
    });
  }

  // =========================================================================
  // 8. Work Cards Link Navigation
  // =========================================================================
  const workReels = {
    'the cyberunbound network': 'https://www.instagram.com/reel/DeeT0jZorVb/',
    'intro video for fizinga': 'https://www.instagram.com/reel/DasE5izsEzZ/',
    'fizinga website launch': 'https://www.instagram.com/reel/DbNwjm8Mb9J/',
    'cybesecurity ctf event promo': 'https://www.instagram.com/reel/DcI8T6fK7yP/',
    'demo video for cyberunbound yc startup': 'https://www.instagram.com/p/DeeT0jZorVb/'
  };

  document.querySelectorAll('.work-card-anchor, .framer-hxYcN.framer-moxbx3').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Find destination url from anchor href, data-href, or title match
      let url = card.getAttribute('href') || card.dataset.href;
      if (!url) {
        const titleEl = card.querySelector('.framer-11uonim p');
        const titleText = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
        for (const [key, val] of Object.entries(workReels)) {
          if (titleText.includes(key)) {
            url = val;
            break;
          }
        }
      }
      if (url && e.target.tagName !== 'A') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // =========================================================================
  // 9. High-Ticket VIP Qualification Modal System & Booking
  // =========================================================================
  const vipModal = document.getElementById('vip-qualification-modal');
  const vipCloseBtn = document.getElementById('vip-modal-close');
  const vipForm = document.getElementById('vip-qualification-form');
  const vipSuccess = document.getElementById('vip-modal-success');
  const vipManualCalBtn = document.getElementById('vip-manual-cal-btn');

  const openVipModal = (preselectedBudget) => {
    if (!vipModal) return;
    vipModal.classList.add('is-open');
    vipModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // If preselected budget tier specified, activate its button
    if (preselectedBudget) {
      const budgetBtns = vipModal.querySelectorAll('.vip-budget-btn');
      budgetBtns.forEach(btn => {
        if (btn.dataset.val === preselectedBudget) {
          btn.classList.add('is-selected');
          const hiddenInput = document.getElementById('vip-budget-tier');
          if (hiddenInput) hiddenInput.value = preselectedBudget;
        } else {
          btn.classList.remove('is-selected');
        }
      });
    }

    // Focus first input after slight delay for smooth transition
    setTimeout(() => {
      const firstInput = document.getElementById('vip-name');
      if (firstInput) firstInput.focus();
    }, 150);
  };

  const closeVipModal = () => {
    if (!vipModal) return;
    vipModal.classList.remove('is-open');
    vipModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Wire all booking CTAs ("Book a call", "Apply for Retainer", etc.) to VIP modal
  document.querySelectorAll('a, button').forEach(el => {
    const text = el.textContent.trim().toLowerCase();
    const href = el.getAttribute('href') || '';
    if (
      href.includes('calendly.com') ||
      text.includes('book a call') ||
      text.includes('apply for retainer') ||
      text.includes('apply for launch film') ||
      text.includes('apply for project') ||
      text.includes('start your project') ||
      text.includes('work with me') ||
      el.dataset.openVipModal === 'true'
    ) {
      el.addEventListener('click', (e) => {
        if (el.id === 'vip-manual-cal-btn') return;
        e.preventDefault();

        let budgetTier = null;
        if (text.includes('5,500') || text.includes('flagship')) {
          budgetTier = '$5,000 – $10,000 / mo';
        } else if (text.includes('7,500') || text.includes('launch film')) {
          budgetTier = '$10,000+ / Custom Launch Film';
        } else if (text.includes('3,000') || text.includes('growth')) {
          budgetTier = '$3,000 – $5,000 / mo';
        }

        openVipModal(budgetTier);
      });
    }
  });

  if (vipModal) {
    // Close button click
    if (vipCloseBtn) {
      vipCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeVipModal();
      });
    }

    // Backdrop click outside container
    vipModal.addEventListener('click', (e) => {
      if (e.target === vipModal) {
        closeVipModal();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && vipModal.classList.contains('is-open')) {
        closeVipModal();
      }
    });

    // Chip selectors (Client type & Project scope)
    vipModal.querySelectorAll('.vip-chip-grid').forEach(grid => {
      const fieldName = grid.dataset.name;
      const hiddenInput = document.getElementById(`vip-${fieldName.replace('_', '-')}`);
      grid.querySelectorAll('.vip-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          grid.querySelectorAll('.vip-chip').forEach(c => c.classList.remove('is-selected'));
          chip.classList.add('is-selected');
          if (hiddenInput) {
            hiddenInput.value = chip.dataset.val;
          }
        });
      });
    });

    // Budget selector buttons
    const budgetSelector = vipModal.querySelector('.vip-budget-selector');
    const budgetInput = document.getElementById('vip-budget-tier');
    if (budgetSelector && budgetInput) {
      budgetSelector.querySelectorAll('.vip-budget-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          budgetSelector.querySelectorAll('.vip-budget-btn').forEach(b => b.classList.remove('is-selected'));
          btn.classList.add('is-selected');
          budgetInput.value = btn.dataset.val;
        });
      });
    }

    // Form submit -> pre-fill Calendly URL & transition
    if (vipForm) {
      vipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('vip-name')?.value.trim() || '';
        const email = document.getElementById('vip-email')?.value.trim() || '';
        const website = document.getElementById('vip-website')?.value.trim() || '';
        const clientType = document.getElementById('vip-client-type')?.value || 'Tech Founder';
        const projectScope = document.getElementById('vip-project-scope')?.value || 'Retainer';
        const budgetTier = document.getElementById('vip-budget-tier')?.value || '$3,000 – $5,000 / mo';

        const notes = `[Type: ${clientType}] [Scope: ${projectScope}] [Budget: ${budgetTier}]${website ? ' [URL: ' + website + ']' : ''}`;
        const calendlyUrl = `https://calendly.com/prateekmaurya862/30min?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&a1=${encodeURIComponent(notes)}`;

        if (vipManualCalBtn) {
          vipManualCalBtn.href = calendlyUrl;
        }

        // Show success state
        vipForm.style.display = 'none';
        if (vipSuccess) {
          vipSuccess.style.display = 'block';
        }

        // Open Calendly in 1.8 seconds
        setTimeout(() => {
          window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
        }, 1800);
      });
    }
  }

  // =========================================================================
  // 10. Footer Contact Links (Email & Phone)
  // =========================================================================
  document.querySelectorAll('a.framer-wMyS3').forEach(link => {
    const rawText = link.textContent.trim();
    if (rawText.includes('@')) {
      link.href = `mailto:${rawText}`;
      link.setAttribute('aria-label', `Send email to ${rawText}`);
    } else if (rawText.replace(/\D/g, '').length >= 10) {
      const cleanDigits = rawText.replace(/\D/g, '');
      link.href = `tel:+91${cleanDigits.slice(-10)}`;
      link.setAttribute('aria-label', `Call +91 ${cleanDigits.slice(-10)}`);
    }
  });

  // Smooth scroll for internal hashes with Lenis support
  document.querySelectorAll('a[href^="#"], a[href^="./#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      const hash = href.substring(href.indexOf('#'));
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -50, duration: 1.3 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
