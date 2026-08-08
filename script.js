window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress =
        documentHeight > 0 ? scrollTop / documentHeight : 0;


    const startColor = {
        r: 135,
        g: 206,
        b: 235
    };

    const endColor = {
        r: 138,
        g: 108,
        b: 255
    };


    const r = Math.round(
        startColor.r +
        (endColor.r - startColor.r) * progress
    );

    const g = Math.round(
        startColor.g +
        (endColor.g - startColor.g) * progress
    );

    const b = Math.round(
        startColor.b +
        (endColor.b - startColor.b) * progress
    );


    document.body.style.backgroundColor =
        `rgb(${r}, ${g}, ${b})`;

});


/* =========================
   Появление секций
========================= */

const revealElements =
    document.querySelectorAll(".reveal");


const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }

        });

    },
    {
        threshold: 0.2
    }
);


revealElements.forEach((element) => {
    observer.observe(element);
});


/* =========================
   Мобильное меню
========================= */

const menuToggle =
    document.querySelector(".menu-toggle");

const mainNav =
    document.querySelector(".main-nav");


if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        mainNav.classList.toggle("active");
        menuToggle.classList.toggle("active");

    });

}


const navLinks =
    document.querySelectorAll(".main-nav a");


navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("active");

        if (menuToggle) {
            menuToggle.classList.remove("active");
        }

    });

});


/* =========================
   Форма заявки → Telegram
========================= */

const contactForm =
    document.querySelector(".contact-form");


if (contactForm) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const submitButton =
            contactForm.querySelector('button[type="submit"]');


        let statusMessage =
            contactForm.querySelector(".form-success");


        if (!statusMessage) {

            statusMessage =
                document.createElement("div");

            statusMessage.classList.add("form-success");

            contactForm.appendChild(statusMessage);

        }


        const formData =
            new FormData(contactForm);


        const projectSelect =
            contactForm.querySelector(
                'select[name="project-type"]'
            );


        const projectType =
            projectSelect.options[
                projectSelect.selectedIndex
            ].text;


        const data = {

            name:
                formData.get("name"),

            email:
                formData.get("email"),

            contact:
                formData.get("contact"),

            projectType:
                projectType,

            message:
                formData.get("message")

        };


        submitButton.disabled = true;

        submitButton.textContent =
            "Отправляем...";


        try {

            const response = await fetch(
                "https://shrill-scene-ba5f.pavzolotow.workers.dev/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)
                }
            );


            const result =
                await response.json();


            if (!response.ok || !result.success) {

                throw new Error(
                    "Ошибка отправки заявки"
                );

            }


            statusMessage.textContent =
                "Спасибо! Заявка отправлена. Мы свяжемся с вами.";

            statusMessage.classList.add("active");


            contactForm.reset();

        }

        catch (error) {

            console.error(error);


            statusMessage.textContent =
                "Не удалось отправить заявку. Попробуйте ещё раз.";

            statusMessage.classList.add("active");

        }

        finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Отправить заявку";

        }

    });

}
