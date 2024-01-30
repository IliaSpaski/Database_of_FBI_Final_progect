window.addEventListener('load', function () {
  const preloader = document.querySelector('.preloader');
  preloader.style.display = 'none';
});


// client\js\index.js

window.addEventListener('load', function () {
  const preloader = document.querySelector('.preloader');
  preloader.style.display = 'none';
  

  // Добавляем обработчик формы
  const authorizationForm = document.querySelector('form[action="/FBI.gov/FBIAuthorization"]');
  authorizationForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const usernameInput = authorizationForm.querySelector('input[name="username"]');
      const oneTimeCodeInput = authorizationForm.querySelector('input[name="oneTimeCode"]');

      // Отправляем POST-запрос на сервер
      const response = await fetch('/FBI.gov/FBIAuthorization', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username: usernameInput.value,
              oneTimeCode: oneTimeCodeInput.value,
          }),
      });

      if (response.ok) {
          // Если успешный ответ, скрываем блок авторизации и отображаем содержимое
          const loginContainer = document.getElementById('login-container');
          loginContainer.style.display = 'none';

          const contentDiv = document.getElementById('content');
          contentDiv.style.display = 'block';
      }
  });
});
