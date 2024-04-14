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
        
      if (checkOutDate < checkInDate) {
          alert('Пожалуйста, выберите дату выезда не раньше даты въезда.');
          return false;
      }
        var roomType = document.getElementById('room-type').value;
        var totalPrice = calculatePrice(checkInDate, checkOutDate, roomType);
        alert('Стоимость проживания составляет: ' + totalPrice);

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
  
    var numberOfDays = Math.max(1, (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24) + 1);
    var totalPrice = pricePerDay * numberOfDays;
  
    return totalPrice + ' ₽ за ' + numberOfDays + ' дней';
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