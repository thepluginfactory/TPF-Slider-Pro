/**
 * TPF Slider Pro - Admin JavaScript
 */

jQuery(document).ready(function($) {

    // Initialize WordPress color pickers
    $('.tpf-color-picker').wpColorPicker();

    // Extend the form submission to include Pro color fields
    var originalAjax = $.ajax;
    $.ajax = function(options) {
        // Check if this is the slider save action
        if (options.data && options.data.action === 'tpf_save_slider') {
            // Add Pro color fields to the data
            options.data.title_color = $('input[name="title_color"]').val();
            options.data.subtitle_color = $('input[name="subtitle_color"]').val();
            options.data.button_bg_color = $('input[name="button_bg_color"]').val();
            options.data.button_text_color = $('input[name="button_text_color"]').val();
            options.data.arrow_bg_color = $('input[name="arrow_bg_color"]').val();
            options.data.arrow_icon_color = $('input[name="arrow_icon_color"]').val();
        }
        return originalAjax.apply(this, arguments);
    };

    // Duplicate slider handler
    $(document).on('click', '.tpf-duplicate-slider', function(e) {
        e.preventDefault();

        var $button = $(this);
        var sliderId = $button.data('id');
        var originalText = $button.html();

        if (!confirm('Are you sure you want to duplicate this slider?')) {
            return;
        }

        // Disable button and show loading
        $button.prop('disabled', true).html('<span class="dashicons dashicons-update" style="font-size: 14px; line-height: 1.4; animation: rotation 1s infinite linear;"></span> Duplicating...');

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'tpf_duplicate_slider',
                slider_id: sliderId,
                nonce: tpfSliderAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    // Reload page to show the new slider
                    location.reload();
                } else {
                    alert('Error: ' + (response.data || 'Failed to duplicate slider'));
                    $button.prop('disabled', false).html(originalText);
                }
            },
            error: function() {
                alert('Error: Failed to duplicate slider');
                $button.prop('disabled', false).html(originalText);
            }
        });
    });

});
