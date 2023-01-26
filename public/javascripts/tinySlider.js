document.querySelectorAll('.my-slider').forEach(slider => {
    tns({
        container: slider,
        "gutter": 10,
        controlsText: ['<span class="fas fa-chevron-circle-left"></span>', '<span class="fas fa-chevron-circle-right"></span>'],
        "swipeAngle": false,
        "speed": 400,

        responsive: {
            1600: {
                items: 4,
                gutter: 20
            },
            1024: {
                items: 3,
                gutter: 20
            },
            768: {
                items: 2,
                gutter: 20
            },
            480: {
                items: 1
            },
        }
    });
});

