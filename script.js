const startColor = { r: 135, g: 206, b: 235 };
const endColor = { r: 138, g: 108, b: 255 };

function updatePageBackground() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? Math.min(Math.max(scrollTop / documentHeight, 0), 1) : 0;

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);

    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

window.addEventListener("scroll", updatePageBackground, { passive: true });
updatePageBackground();

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach((element) => observer.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("active"));
}

const navbarCollapseElement = document.getElementById("navbarContent");
const navLinks = document.querySelectorAll("#mainNavbar .nav-link");

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (!navbarCollapseElement || window.innerWidth >= 992) {
            return;
        }

        const collapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapseElement, { toggle: false });
        collapse.hide();
    });
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            event.stopPropagation();
            contactForm.classList.add("was-validated");
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const submitText = submitButton.querySelector(".submit-text");
        const spinner = submitButton.querySelector(".spinner-border");
        const statusContainer = contactForm.querySelector(".form-status");
        const formData = new FormData(contactForm);
        const projectSelect = contactForm.querySelector('select[name="project-type"]');

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            contact: formData.get("contact"),
            projectType: projectSelect.options[projectSelect.selectedIndex].text,
            message: formData.get("message")
        };

        submitButton.disabled = true;
        submitText.textContent = "Отправляем...";
        spinner.classList.remove("d-none");
        statusContainer.innerHTML = "";

        try {
            const response = await fetch("https://shrill-scene-ba5f.pavzolotow.workers.dev/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error("Ошибка отправки заявки");
            }

            statusContainer.innerHTML = '<div class="alert alert-success py-2 px-3">Спасибо! Заявка отправлена. Мы свяжемся с вами.</div>';
            contactForm.reset();
            contactForm.classList.remove("was-validated");
        } catch (error) {
            console.error(error);
            statusContainer.innerHTML = '<div class="alert alert-danger py-2 px-3">Не удалось отправить заявку. Попробуйте ещё раз.</div>';
        } finally {
            submitButton.disabled = false;
            submitText.textContent = "Отправить заявку";
            spinner.classList.add("d-none");
        }
    });
}
