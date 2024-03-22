/* Модальное окно */
document.addEventListener('DOMContentLoaded', function() {
  const modalOverlay = document.querySelector('.modal-overlay');
  modalOverlay.style.display = 'none';
});
const openModalBtn = document.querySelector('.open-modal-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const closeModalBtn = document.querySelector('.close-modal-btn');
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
openModalBtn.addEventListener('click', function() {
  modalOverlay.style.display = 'flex';
});
closeModalBtn.addEventListener('click', function() {
  closeModal();
});
contactForm.addEventListener('submit', function(event) {
  event.preventDefault();
  if (validateForm()) {
    // Отправка формы
    closeModal();
  }
});
modalOverlay.addEventListener('click', function(event) {
  if (event.target === modalOverlay) {
    closeModal();
  }
});
function validateForm() {
  const nameValue = nameInput.value.trim();
  const phoneValue = phoneInput.value.trim();
  if (nameValue === '' || phoneValue === '') {
    alert('Пожалуйста, заполните все поля формы.');
    return false;
  }
  if (!/^[a-zA-Zа-яА-Я\s]+$/.test(nameValue)) {
    alert('Поле "Имя" должно содержать только текстовые значения.');
    return false;
  }
  if (!/^\d+$/.test(phoneValue)) {
    alert('Поле "Номер телефона" должно содержать только числовые значения.');
    return false;
  }
  return true;
}
function closeModal() {
  modalOverlay.style.display = 'none';
  contactForm.reset();
}
document.addEventListener('DOMContentLoaded', function() {
  const modalOverlay = document.querySelector('.modal-overlay');
  modalOverlay.style.display = 'none';
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
});
/* поле ввода почты */
document.getElementById("emailInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Предотвращаем отправку формы
    clearEmail();
  }
});
function clearEmail() {
  var emailInput = document.getElementById("emailInput").value;
  var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailInput == '') {
    alert('Пожалуйста, заполните поле формы.');
    return;
  }
  if (!emailPattern.test(emailInput)) {
    alert('Пожалуйста, введите корректный адрес электронной почты.');}
    else {
  document.getElementById("emailInput").value = "";
  alert("Данные отправлены");
}
}
/* кнопка узнать о нас больше */
function redirectToAboutPage() {
  window.location.href = "about_us.html";
}