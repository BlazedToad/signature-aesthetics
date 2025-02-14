// ✅ Load Testimonials
// ✅ Load Testimonials from JSON
fetch('content/testimonials.json')
    .then(response => response.json())
    .then(data => {
        let testimonialContainer = document.getElementById("testimonial-container");
        testimonialContainer.innerHTML = ""; // ✅ Clear existing content

        data.testimonials.forEach(testimonial => {
            let testimonialSlide = document.createElement("div");
            testimonialSlide.classList.add("swiper-slide");

            testimonialSlide.innerHTML = `
                <div class="testimonial">
                    <img src="${testimonial.image}" alt="${testimonial.name}'s testimonial">
                    <p>"${testimonial.text}"</p>
                    <strong class="client-name">- ${testimonial.name}</strong>
                </div>
            `;

            testimonialContainer.appendChild(testimonialSlide);
        });

        // ✅ Initialize Swiper After Content Loads
        new Swiper('.testimonial-carousel', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    })
    .catch(error => console.error("Error loading testimonials:", error));



// ✅ Load Treatments from JSON
fetch('content/treatments.json')
    .then(response => response.json())
    .then(data => {
        let treatmentsContainer = document.getElementById("treatments-container");
        treatmentsContainer.innerHTML = ""; // ✅ Clear existing content

        data.services.forEach(service => {
            let treatmentCard = document.createElement("div");
            treatmentCard.classList.add("service-card");

            treatmentCard.innerHTML = `
                <i class="fa-solid ${service.icon} treatment-icon"></i>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <strong>${service.price}</strong>
            `;

            treatmentsContainer.appendChild(treatmentCard);
        });
    })
    .catch(error => console.error("Error loading treatments:", error));

