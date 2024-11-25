document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const toggleButton = document.getElementById('toggleButton');
  const wrapper = document.getElementById('parent-wrapper');
  const pageWrap = document.querySelector('.page_wrap');
  
  const state = {
    rangeSliderLoaded: false,
    isAnimating: false,
    needsReinitialization: false,
    sliderValues: {} // Store slider values
  };

  // Load range slider script only once
  function loadRangeSliderScript() {
    return new Promise((resolve, reject) => {
      if (state.rangeSliderLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js";
      script.onload = () => {
        state.rangeSliderLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  // Save current slider values
  function saveSliderState() {
    const sliders = document.querySelectorAll('[fs-rangeslider-element="handle"]');
    sliders.forEach(slider => {
      const sliderId = slider.closest('[fs-rangeslider-element="wrapper"]').id;
      if (sliderId) {
        state.sliderValues[sliderId] = {
          min: slider.getAttribute('aria-valuemin'),
          max: slider.getAttribute('aria-valuemax'),
          current: slider.getAttribute('aria-valuenow')
        };
      }
    });
  }

  // Restore slider values
  function restoreSliderState() {
    const sliders = document.querySelectorAll('[fs-rangeslider-element="handle"]');
    sliders.forEach(slider => {
      const wrapper = slider.closest('[fs-rangeslider-element="wrapper"]');
      const sliderId = wrapper?.id;
      
      if (sliderId && state.sliderValues[sliderId]) {
        const values = state.sliderValues[sliderId];
        // Update the slider UI
        slider.setAttribute('aria-valuenow', values.current);
        
        // Update the slider position
        const range = values.max - values.min;
        const percentage = ((values.current - values.min) / range) * 100;
        slider.style.left = `${percentage}%`;
        
        // Update the track fill
        const track = wrapper.querySelector('[fs-rangeslider-element="track-fill"]');
        if (track) {
          track.style.width = `${percentage}%`;
        }
        
        // Trigger change event to update any connected elements
        const event = new Event('input', { bubbles: true });
        slider.dispatchEvent(event);
      }
    });
  }

  // Initialize range slider
  async function initializeRangeSlider() {
    if (!state.rangeSliderLoaded) {
      await loadRangeSliderScript();
    }

    // Wait for sidebar animation
    await new Promise(resolve => setTimeout(resolve, 300));

    if (window.FsAttributes?.rangeslider) {
      if (Object.keys(state.sliderValues).length > 0) {
        // If we have saved values, initialize and then restore them
        window.FsAttributes.rangeslider.init();
        setTimeout(restoreSliderState, 100); // Small delay to ensure initialization is complete
      } else {
        // First time initialization
        window.FsAttributes.rangeslider.init();
      }
    }
    
    state.needsReinitialization = false;
  }

  // Device state change detection
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Save state when page is hidden
      if (sidebar.classList.contains('is-open')) {
        saveSliderState();
      }
    }
  });

  // Handle orientation changes which often occur during wake
  window.addEventListener('orientationchange', () => {
    if (sidebar.classList.contains('is-open')) {
      saveSliderState();
    }
    state.needsReinitialization = true;
  });

  function toggleSidebar() {
    if (state.isAnimating) return;
    state.isAnimating = true;

    const isOpening = !sidebar.classList.contains('is-open');
    
    sidebar.classList.toggle('is-open');
    overlay.classList.toggle('is-open');
    wrapper.classList.toggle('is-open');

    // Handle scroll lock only on tablet and below
    if (window.innerWidth < 992) {
      document.body.style.overflow = isOpening ? 'hidden' : '';
      pageWrap.style.overflow = isOpening ? 'hidden' : '';
    }

    if (isOpening) {
      if (!state.rangeSliderLoaded || state.needsReinitialization) {
        initializeRangeSlider();
      }
    } else {
      // Save state when closing sidebar
      saveSliderState();
    }

    setTimeout(() => {
      state.isAnimating = false;
    }, 300);
  }

  toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  });

  overlay.addEventListener('click', toggleSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.innerWidth >= 992) {
      toggleSidebar();
    }
  });
});
