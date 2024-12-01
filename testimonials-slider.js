$(".swiper_testimonials").each(function (index) {
    console.log("Found swiper_testimonials element:", this);
    
    const nextButton = $(this).find(".swiper_button.swiper-next")[0];
    const prevButton = $(this).find(".swiper_button.swiper-prev")[0];
    const bulletWrapper = $(this).find(".swiper_bullets_wrap.is-testimonial")[0];
    
    let loopMode = true;
    if ($(this).attr("loop-mode") === "true") {
      loopMode = true;
    }
    
    let sliderDuration = 300;
    if ($(this).attr("slider-duration") !== undefined) {
      sliderDuration = +$(this).attr("slider-duration");
    }
 
    const swiper = new Swiper($(this).find(".swiper")[0], {
      speed: sliderDuration,
      loop: loopMode,
      autoHeight: false,
      centeredSlides: loopMode,
      followFinger: true,
      freeMode: false,
      slideToClickedSlide: true,
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: "4%",
      rewind: true,
      mousewheel: {
        forceToAxis: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      breakpoints: {
        480: {
          slidesPerView: 1,
          spaceBetween: "4%"
        },
        768: {
          slidesPerView: 1,
          spaceBetween: "4%"
        },
        992: {
          slidesPerView: 2,
          spaceBetween: "2%"
        }
      },
      pagination: {
        el: bulletWrapper,
        bulletActiveClass: "is-active",
        bulletClass: "swiper-bullet",
        clickable: true
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
        disabledClass: "is-disabled"
      },
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active"
    });
 
    // Override Swiper's default styles after initialization
    $(bulletWrapper).css({
        'width': 'auto',
        'flex': 'initial'
    });
 });
