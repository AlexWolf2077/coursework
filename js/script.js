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

document.addEventListener('DOMContentLoaded', function() {
  // Функция для получения текущей даты в формате YYYY-MM-DD
  function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }

  // Функция для установки минимальной даты в поле ввода даты въезда
  function setMinCheckInDate() {
    var currentDate = getCurrentDate();
    document.getElementById('check-in').setAttribute('min', currentDate);
  }

  // Функция для валидации дат
  function validateDates() {
    var checkInDate = document.getElementById('check-in').value;
    var checkOutDate = document.getElementById('check-out').value;
    var currentDate = getCurrentDate();

    if (checkInDate === '' || checkOutDate === '') {
        alert('Пожалуйста, заполните оба поля с датами.');
        return false;
    }

    if (checkInDate < currentDate) {
        alert('Пожалуйста, выберите дату въезда не раньше сегодняшней даты.');
        return false;
    }

    if (checkOutDate < checkInDate) {
        alert('Пожалуйста, выберите дату выезда не раньше даты въезда.');
        return false;
    }

    alert('Даты корректны. Можно продолжить.');
    return true;
  }

  // Функция для получения цены в рублях в зависимости от выбранного номера
  function calculatePrice(checkInDate, checkOutDate, roomType) {
    var pricePerDay = 0;
    
    switch (roomType) {
        case 'presidential':
            pricePerDay = 10000;
            break;
        case 'premium':
            pricePerDay = 5000;
            break;
        case 'luxury':
            pricePerDay = 3000;
            break;
        case 'business':
            pricePerDay = 2000;
            break;
        case 'minimalism':
            pricePerDay = 1000;
            break;
        default:
            pricePerDay = 0;
    }

    var numberOfDays = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    var totalPrice = pricePerDay * numberOfDays;

    return totalPrice + ' рублей за ' + numberOfDays + ' дней';
  }

  // Установка минимальной даты в поле ввода даты въезда
  setMinCheckInDate();

  // Обработчик события изменения даты въезда
  document.getElementById('check-in').addEventListener('input', function() {
      document.getElementById('check-out').disabled = false;
      document.getElementById('check-out').setAttribute('min', this.value);
  });

  // Обработчик события клика на кнопку "Узнать цену"
  document.getElementById('sbtn').addEventListener('click', function() {
      if (!validateDates()) {
          return;
      }

      var checkInDate = document.getElementById('check-in').value;
      var checkOutDate = document.getElementById('check-out').value;
      var roomType = document.getElementById('room-type').value;

      var totalPrice = calculatePrice(checkInDate, checkOutDate, roomType);
      this.textContent = totalPrice;
  });
});
