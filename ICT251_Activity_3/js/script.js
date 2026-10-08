document.addEventListener("DOMContentLoaded", function () {
    // Feature 1: Switch between light and dark themes.
    const themeToggle = document.getElementById("themeToggle");

    themeToggle.addEventListener("click", function () {
        const isDark = document.body.classList.toggle("dark-theme");

        themeToggle.textContent = isDark
            ? "Switch to Light Theme"
            : "Switch to Dark Theme";

        themeToggle.setAttribute("aria-pressed", String(isDark));
    });

    // Feature 2: Search and filter the project cards.
    const skillSearch = document.getElementById("skillSearch");
    const resetSearch = document.getElementById("resetSearch");
    const projectCards = Array.from(
        document.querySelectorAll(".project-card")
    );
    const searchFeedback = document.getElementById("searchFeedback");

    function filterProjects() {
        const query = skillSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        projectCards.forEach(function (card) {
            const searchableText =
                (card.dataset.search || "") + " " + card.textContent;

            const matches = searchableText.toLowerCase().includes(query);

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }
        });

        if (visibleCount === 0) {
            searchFeedback.textContent =
                "No matching projects found. Try another keyword or reset the search.";
        } else {
            searchFeedback.textContent =
                "Showing " + visibleCount + " of " +
                projectCards.length + " projects.";
        }
    }

    skillSearch.addEventListener("input", filterProjects);

    resetSearch.addEventListener("click", function () {
        skillSearch.value = "";
        filterProjects();
        skillSearch.focus();
    });

    // Feature 3: Expand or collapse project details.
    document.querySelectorAll(".detailsToggle").forEach(function (button) {
        button.addEventListener("click", function () {
            const detailsId = button.getAttribute("aria-controls");
            const details = document.getElementById(detailsId);
            const isOpening = details.hidden;

            details.hidden = !isOpening;
            button.setAttribute("aria-expanded", String(isOpening));
            button.textContent = isOpening ? "Hide Details" : "Show Details";
        });
    });

    // Feature 4: Validate the contact form and show a local preview.
    const contactForm = document.getElementById("contactForm");
    const formFeedback = document.getElementById("formFeedback");
    const contactPreview = document.getElementById("contactPreview");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const topicInput = document.getElementById("topic");
    const messageInput = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    function setFieldError(input, errorElement, message) {
        errorElement.textContent = message;
        input.setAttribute("aria-invalid", String(Boolean(message)));
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Clear previous errors before validating again.
        setFieldError(nameInput, nameError, "");
        setFieldError(emailInput, emailError, "");
        setFieldError(messageInput, messageError, "");

        formFeedback.textContent = "";
        contactPreview.hidden = true;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const topic = topicInput.value.trim();
        const message = messageInput.value.trim();

        let isValid = true;

        if (!name) {
            setFieldError(nameInput, nameError, "Please enter your name.");
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailPattern.test(email)) {
            setFieldError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );
            isValid = false;
        }

        if (!message) {
            setFieldError(
                messageInput,
                messageError,
                "Please enter a message."
            );
            isValid = false;
        }

        if (!isValid) {
            formFeedback.textContent =
                "Please correct the errors above and submit again.";

            const firstInvalidField = contactForm.querySelector(
                '[aria-invalid="true"]'
            );

            if (firstInvalidField) {
                firstInvalidField.focus();
            }

            return;
        }

        // textContent displays user input as text rather than HTML.
        document.getElementById("previewName").textContent = name;
        document.getElementById("previewEmail").textContent = email;
        document.getElementById("previewTopic").textContent = topic || "Not provided";
        document.getElementById("previewMessage").textContent = message;

        contactPreview.hidden = false;
        formFeedback.textContent =
            "Success: your form data was validated in this browser. No message was sent.";

        contactPreview.scrollIntoView({
            behavior: "auto",
            block: "nearest"
        });
    });

    // Reset the validation messages when the visitor clears the form.
    contactForm.addEventListener("reset", function () {
        setTimeout(function () {
            setFieldError(nameInput, nameError, "");
            setFieldError(emailInput, emailError, "");
            setFieldError(messageInput, messageError, "");

            formFeedback.textContent = "";
            contactPreview.hidden = true;
        }, 0);
    });

    // Initialise the project list.
    filterProjects();
});