document.addEventListener("DOMContentLoaded", function() {
    // --- Регистрация и вход ---
    const registerForm = document.getElementById("register-form");
    const loginBtn = document.getElementById("login-btn");

    // Проверка, авторизован ли пользователь
    function checkCurrentUser() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            const card = document.querySelector(".register-card");
            if (card) {
                card.innerHTML = `
                    <h2>Привет, ${currentUser.username}!</h2>
                    <p>Вы уже вошли в систему.</p>
                    <button id="logout-btn">Выйти</button>
                `;
                document.getElementById("logout-btn").addEventListener("click", function() {
                    localStorage.removeItem("currentUser");
                    location.reload();
                });
            }
        }
    }

    // Регистрация
    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (username.length < 3) {
                alert('Имя пользователя должно содержать минимум 3 символа');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Введите корректный email адрес');
                return;
            }
            if (!password || password.length < 8 || password.length > 20 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
                alert('Пароль должен содержать 8-20 символов, буквы и цифры');
                return;
            }

            let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
            const existingUser = registeredUsers.find(u => u.username === username || u.email === email);
            if (existingUser) {
                if (existingUser.username === username) {
                    alert('Пользователь с таким именем уже зарегистрирован');
                } else {
                    alert('Пользователь с таким email уже зарегистрирован');
                }
                return;
            }
            const newUser = { username, email, password, registrationDate: new Date().toISOString() };
            registeredUsers.push(newUser);
            localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
            localStorage.setItem("currentUser", JSON.stringify({ username, email }));
            alert(`Регистрация успешна! Добро пожаловать, ${username}.`);
            window.location.href = getPersonalPageHref();
        });
    }

    // Вход
    if (loginBtn) {
        loginBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            if (!username || !email || !password) {
                alert("Пожалуйста, заполните все поля для входа");
                return;
            }
            const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
            const user = registeredUsers.find(u => u.username === username && u.email === email && u.password === password);
            if (user) {
                localStorage.setItem("currentUser", JSON.stringify({ username: user.username, email: user.email }));
                alert("Вход выполнен успешно! Переходим в личный кабинет...");
                window.location.href = getPersonalPageHref();
            } else {
                alert("Ошибка! Пользователь с такими данными не найден. Проверьте правильность введенных данных.");
            }
        });
    }

    // Определить путь до личного кабинета (работает и для index.html, и для src/index.html)
    function getPersonalPageHref() {
        // Если мы находимся в src/, то переход в personal.html без src/
        if (window.location.pathname.includes('/src/')) {
            return 'personal.html';
        } else {
            return 'src/personal.html';
        }
    }

    checkCurrentUser();

/* document.addEventListener("DOMContentLoaded", function() {
    const resetForm = document.getElementById("reset-form");
    const codeSection = document.getElementById("code-section");
    const confirmReset = document.getElementById("confirm-reset");

    let resetCode = "";

    if (resetForm) {
        resetForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const email = document.getElementById("reset-email").value.trim();
            const userData = JSON.parse(localStorage.getItem("user"));

            if (!userData || userData.email !== email) {
                alert("Ошибка: Этот email не зарегистрирован!");
                return;
            }

            // 🔹 Генерируем код
            resetCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            alert(`Ваш код восстановления: ${resetCode}`); // Здесь можно заменить на реальную отправку email
            codeSection.style.display = "block";
        });
    }

    if (confirmReset) {
        confirmReset.addEventListener("click", function() {
            const enteredCode = document.getElementById("reset-code").value.trim();
            const newPassword = document.getElementById("new-password").value.trim();

            if (enteredCode !== resetCode) {
                alert("Ошибка: Неверный код восстановления!");
                return;
            }

            if (newPassword.length < 6) {
                alert("Пароль должен содержать минимум 6 символов!");
                return;
            }

            let userData = JSON.parse(localStorage.getItem("user"));
            userData.password = newPassword;
            localStorage.setItem("user", JSON.stringify(userData));
            alert("Пароль успешно изменён!");
            window.location.href = "/login.html";
        });
    }
});
 */

    // --- Отзывы ---
    const reviewForm = document.querySelector(".review-form");
    const reviewList = document.querySelector(".review-list");

    if (reviewForm && reviewList) {
        reviewForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const name = document.getElementById("name").value.trim();
            const comment = document.getElementById("comment").value.trim();
            if (!name || !comment) {
                alert("Пожалуйста, заполните все поля!");
                return;
            }
            const newReview = document.createElement("div");
            newReview.classList.add("review");
            newReview.innerHTML = `
                <h3>${name}</h3>
                <p>${comment}</p>
                <div class="review-actions">
                    <button class="like-btn">👍</button>
                    <button class="dislike-btn">👎</button>
                    <button class="report-btn">🚨</button>
                </div>
            `;
            reviewList.appendChild(newReview);
            reviewForm.reset();
        });

        // Делегирование для отзывов
        reviewList.addEventListener("click", function(event) {
            if (event.target.classList.contains("like-btn")) {
                alert("Вы поставили лайк!");
            } else if (event.target.classList.contains("dislike-btn")) {
                alert("Вы поставили дизлайк!");
            } else if (event.target.classList.contains("report-btn")) {
                alert("Ваш отзыв отправлен на модерацию.");
            }
        });
    }

    // --- Факты ---
    /*
    const factForm = document.querySelector(".fact-form");
    const factsList = document.querySelector(".facts-list");
    if (factForm && factsList) {
        factForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const factText = document.getElementById("fact-text").value.trim();
            if (!factText) {
                alert("Введите текст факта!");
                return;
            }
            const newFact = document.createElement("div");
            newFact.classList.add("fact");
            newFact.innerHTML = `
                <p>${factText}</p>
                <button class="like-btn">👍</button>
            `;
            factsList.appendChild(newFact);
            document.getElementById("fact-text").value = "";
        });

        factsList.addEventListener("click", function(event) {
            if (event.target.classList.contains("like-btn")) {
                alert("Вы поставили лайк!");
            }
        });
    }
    */

    // --- Галерея ---
    /*
    const gallery = document.querySelector('.gallery');
    const modal = document.querySelector('.modal');
    const modalImg = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const uploadForm = document.querySelector('.upload-form');

    if (gallery) {
        gallery.addEventListener("click", function(event) {
            if (event.target.classList.contains("preview")) {
                if (modal && modalImg) {
                    modal.style.display = "flex";
                    modalImg.src = event.target.src;
                }
            } else if (event.target.classList.contains("like-btn")) {
                alert("Вы поставили лайк!");
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function() {
            modal.style.display = "none";
        });
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function() {
            modal.style.display = "none";
        });
    }
    if (modal) {
        modal.addEventListener("click", function(event) {
            if (!event.target.closest(".modal-content-wrapper")) {
                modal.style.display = "none";
            }
        });
    }
    if (uploadForm && gallery) {
    uploadForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const fileInput = document.getElementById("upload-file");
        if (fileInput.files.length === 0) return;
        const file = fileInput.files[0];

        // 🔹 Проверяем тип файла
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("Ошибка: можно загружать только изображения!");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const newArt = document.createElement("div");
            newArt.classList.add("art");
            newArt.innerHTML = `
                <img src="${e.target.result}" alt="Ваш арт" class="preview">
                <div class="art-actions">
                    <button class="like-btn">👍</button>
                </div>
            `;
            gallery.appendChild(newArt);
        };
        reader.readAsDataURL(file);
        fileInput.value = "";
    });
}
    */

    // --- Теории ---
    /*
    const theoryList = document.querySelector(".theory-list");
    const theoryForm = document.querySelector(".theory-form");
    if (theoryForm && theoryList) {
    theoryForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();
        const imageInput = document.getElementById("image");

        if (!title || !content) {
            alert("Заполните все поля!");
            return;
        }

        // 🔹 Проверяем тип файла
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

            if (!allowedTypes.includes(file.type)) {
                alert("Ошибка: можно загружать только изображения!");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const newTheory = document.createElement("div");
                newTheory.classList.add("theory");
                newTheory.innerHTML = `<h3>${title}</h3>`;
                newTheory.innerHTML += `<img src="${e.target.result}" alt="${title}">`;
                newTheory.innerHTML += `<p>${content}</p>`;
                theoryList.appendChild(newTheory);
            };
            reader.readAsDataURL(file);
        } else {
            const newTheory = document.createElement("div");
            newTheory.classList.add("theory");
            newTheory.innerHTML = `<h3>${title}</h3>`;
            newTheory.innerHTML += `<p>${content}</p>`;
            theoryList.appendChild(newTheory);
        }

        theoryForm.reset();
    });
}
    */

    // --- Личный кабинет: проверка регистрации и профиль ---
   if (window.location.pathname.includes("personal.html")) {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
            const redirect = confirm("Вам нужно зарегистрироваться, чтобы зайти в личный кабинет! Нажмите 'ОК' для перехода на главную.");
            if (redirect) window.location.href = "index.html";
            return;
        }
        const avatarUpload = document.getElementById("avatar-upload");
        const avatarImg = document.getElementById("avatar");
        const usernameInput = document.getElementById("username");
        const savedAvatar = localStorage.getItem("avatar");
        const savedName = localStorage.getItem("username");
        if (savedAvatar) avatarImg.src = savedAvatar;
        if (savedName) usernameInput.value = savedName;
        if (avatarUpload) {
            avatarUpload.addEventListener("change", function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        avatarImg.src = e.target.result;
                        localStorage.setItem("avatar", e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        if (usernameInput) {
            usernameInput.addEventListener("input", function() {
                localStorage.setItem("username", this.value);
            });
        }
    }
});
