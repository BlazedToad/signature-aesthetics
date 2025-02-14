// Load Testimonials
fetch('content/testimonials.json')
    .then(response => response.json())
    .then(data => {
        let container = document.getElementById("testimonial-container");
        data.testimonials.forEach(testimonial => {
            let slide = `
                <div class="swiper-slide">
                    <img src="${testimonial.image}" alt="${testimonial.name}">
                    <p>"${testimonial.text}"</p>
                    <h4>- ${testimonial.name}</h4>
                </div>
            `;
            container.innerHTML += slide;
        });

        new Swiper(".testimonial-carousel", {
            slidesPerView: 1,
            loop: true,
            autoplay: { delay: 3000 },
            pagination: { el: ".swiper-pagination", clickable: true }
        });
    });

// Load Pricing
fetch('content/pricing.json')
    .then(response => response.json())
    .then(data => {
        let pricingContainer = document.getElementById("pricing-container");
        data.services.forEach(service => {
            let serviceItem = `
                <div class="service">
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <strong>${service.price}</strong>
                </div>
            `;
            pricingContainer.innerHTML += serviceItem;
        });
    });
