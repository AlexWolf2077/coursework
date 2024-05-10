var bubble = document.getElementById("bubble");
var text = document.getElementById("bubbleText");
var edit_link = document.getElementById("edit_link");
var dialog = document.getElementById("dialog");

onprofile = false;
ondialog = false;
opacity = 0;

/* кнопка забронировать */
document.addEventListener('DOMContentLoaded', function() {
  const reservationButton = document.querySelector('.reservation');
  if (reservationButton) {
    reservationButton.addEventListener('click', function() {
      window.location.href = 'reservation.html';
    });
  }
});
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
const passwordInput = document.getElementById('password');
const passportInput = document.getElementById('passport');
if (openModalBtn) {
  openModalBtn.addEventListener('click', function() {
    modalOverlay.style.display = 'flex';
  });
}
closeModalBtn.addEventListener('click', function() {
  closeModal();
});
contactForm.addEventListener('submit', function(event) {
  event.preventDefault();
  if (validateForm()) {
    contactForm.submit();
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
  const passwordValue = passwordInput.value.trim();
  if (nameValue === '' || passwordValue === '') {
    alert('Пожалуйста, заполните все поля формы.');
    return false;
  } 
  return true;
}
function profile_over()
{
  bubble.style.background = "#CEC2A8";
  text.style.color = "#433A28";
  onprofile = true;
}
function profile_leave()
{
  bubble.style.background = "#433A28";
  text.style.color = "#CEC2A8";
  onprofile = false;
}
function dialog_over()
{
  if (opacity > 0)
    ondialog = true;
}
function dialog_leave()
{
  ondialog = false;
}
function control_dialog_visible()
{
  if (!onprofile && !ondialog)
  {
    opacity = 0;
  }
}
function control_opacity()
{
  if (onprofile || ondialog)
  {
    opacity += 0.1;
    if (opacity > 1)
      {
        opacity = 1;
      }
    
  }
  dialog.style.opacity = opacity;
}
function validateRegistration()
{
  passportInput.value = passportInput.value.replace(" ", "");
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
/*document.getElementById("emailInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Предотвращаем отправку формы
    clearEmail();
  }
});*/
function clearEmail() {
  var emailInput = document.getElementById("emailInput").value;
  var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailInput == '') {
    alert('Пожалуйста, заполните поле формы.');
    return;
  }
  if (!emailPattern.test(emailInput)) {
    document.getElementById("emailInput").value = "";
    alert('Пожалуйста, введите корректный адрес электронной почты.');
  } else {
    alert("На адрес электронной почты отправлено письмо, содержащее ссылку для подтверждения правильности e-mail адреса.");
  }
}
/* кнопка узнать о нас больше */
function redirectToAboutPage() {
  window.location.href = "about_us.html";
}

if (dialog) {
  setInterval(()=>control_dialog_visible(), 250);
  setInterval(()=>control_opacity(), 25);
}