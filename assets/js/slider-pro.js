/**
 * TPF Slider Pro - Frontend JavaScript
 * 3D Coverflow Effect - Proper Implementation
 */

(function($) {
    'use strict';

    var TPFSliderPro = {

        init: function() {
            var self = this;

            // Initialize coverflow sliders
            $('.tpf-slider[data-transition="coverflow"]').each(function() {
                self.initCoverflow($(this));
            });
        },

        /**
         * Initialize coverflow effect for a slider
         */
        initCoverflow: function($slider) {
            var self = this;
            var $slides = $slider.find('.tpf-slide:not(.tpf-clone)');
            var slideCount = $slides.length;

            if (slideCount === 0) return;

            // Store slider data
            $slider.data('coverflow-index', 0);
            $slider.data('coverflow-count', slideCount);
            $slider.data('coverflow-animating', false);

            // Remove any clones (not needed for coverflow)
            $slider.find('.tpf-slide.tpf-clone').remove();

            // Remove carousel class if present
            $slider.removeClass('tpf-carousel');

            // Clear any inline transform on wrapper
            $slider.find('.tpf-slider-wrapper').css('transform', 'none');

            // Initial positioning
            self.updateCoverflowPositions($slider);

            // Override arrow click handlers
            $slider.find('.tpf-arrow').off('click').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if ($slider.data('coverflow-animating')) return;

                var currentIndex = $slider.data('coverflow-index');
                var count = $slider.data('coverflow-count');

                if ($(this).hasClass('tpf-arrow-next')) {
                    currentIndex = (currentIndex + 1) % count;
                } else {
                    currentIndex = (currentIndex - 1 + count) % count;
                }

                self.goToSlide($slider, currentIndex);
            });

            // Override dot click handlers
            $slider.find('.tpf-dot').off('click').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if ($slider.data('coverflow-animating')) return;

                var index = $(this).data('index');
                self.goToSlide($slider, index);
            });

            // Click on side slides to navigate
            $slides.on('click', function(e) {
                var $slide = $(this);
                var clickedIndex = $slide.data('index');
                var currentIndex = $slider.data('coverflow-index');

                // Only navigate if clicking a non-center slide
                if (clickedIndex !== currentIndex && !$slider.data('coverflow-animating')) {
                    e.preventDefault();
                    self.goToSlide($slider, clickedIndex);
                }
            });

            // Handle autoplay
            if ($slider.data('autoplay') === true || $slider.data('autoplay') === 'true') {
                self.startAutoplay($slider);

                // Pause on hover
                if ($slider.data('pause-on-hover') === true || $slider.data('pause-on-hover') === 'true') {
                    $slider.on('mouseenter', function() {
                        self.stopAutoplay($slider);
                    }).on('mouseleave', function() {
                        self.startAutoplay($slider);
                    });
                }
            }

            // Mark as initialized
            $slider.data('tpf-pro-initialized', true);
        },

        /**
         * Navigate to a specific slide
         */
        goToSlide: function($slider, index) {
            var self = this;

            $slider.data('coverflow-animating', true);
            $slider.data('coverflow-index', index);

            self.updateCoverflowPositions($slider);
            self.updateDots($slider, index);

            // Reset animating flag after transition
            setTimeout(function() {
                $slider.data('coverflow-animating', false);
            }, 550);
        },

        /**
         * Update all slide positions based on current index
         */
        updateCoverflowPositions: function($slider) {
            var $slides = $slider.find('.tpf-slide:not(.tpf-clone)');
            var currentIndex = $slider.data('coverflow-index') || 0;
            var count = $slides.length;

            // Remove all position classes
            $slides.removeClass('coverflow-center coverflow-left-1 coverflow-left-2 coverflow-left-3 coverflow-right-1 coverflow-right-2 coverflow-right-3 active');

            $slides.each(function(index) {
                var $slide = $(this);
                var position = index - currentIndex;

                // Handle wrapping for infinite feel
                if (position > count / 2) {
                    position -= count;
                } else if (position < -count / 2) {
                    position += count;
                }

                // Apply position class
                if (position === 0) {
                    $slide.addClass('coverflow-center active');
                } else if (position === -1) {
                    $slide.addClass('coverflow-left-1');
                } else if (position === -2) {
                    $slide.addClass('coverflow-left-2');
                } else if (position === -3) {
                    $slide.addClass('coverflow-left-3');
                } else if (position === 1) {
                    $slide.addClass('coverflow-right-1');
                } else if (position === 2) {
                    $slide.addClass('coverflow-right-2');
                } else if (position === 3) {
                    $slide.addClass('coverflow-right-3');
                }
                // Slides further than 3 positions stay hidden (default CSS)
            });
        },

        /**
         * Update dots to reflect current slide
         */
        updateDots: function($slider, index) {
            var $dots = $slider.find('.tpf-dot');
            $dots.removeClass('active');
            $dots.eq(index).addClass('active');
        },

        /**
         * Start autoplay
         */
        startAutoplay: function($slider) {
            var self = this;
            var speed = parseInt($slider.data('autoplay-speed'), 10) || 5000;

            // Clear any existing interval
            self.stopAutoplay($slider);

            var interval = setInterval(function() {
                if (!$slider.data('coverflow-animating')) {
                    var currentIndex = $slider.data('coverflow-index');
                    var count = $slider.data('coverflow-count');
                    var nextIndex = (currentIndex + 1) % count;
                    self.goToSlide($slider, nextIndex);
                }
            }, speed);

            $slider.data('coverflow-autoplay', interval);
        },

        /**
         * Stop autoplay
         */
        stopAutoplay: function($slider) {
            var interval = $slider.data('coverflow-autoplay');
            if (interval) {
                clearInterval(interval);
                $slider.data('coverflow-autoplay', null);
            }
        }
    };

    // Initialize on document ready
    $(document).ready(function() {
        // Small delay to ensure base slider has initialized
        setTimeout(function() {
            TPFSliderPro.init();
        }, 100);
    });

    // Re-initialize when new sliders are dynamically loaded
    $(document).on('tpf-slider-init', function() {
        $('.tpf-slider[data-transition="coverflow"]').each(function() {
            if (!$(this).data('tpf-pro-initialized')) {
                TPFSliderPro.initCoverflow($(this));
            }
        });
    });

})(jQuery);
