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

});
