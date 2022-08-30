'use strict';

(() => {
  const Type = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  };

  const Message = {
    '200': 'Операция успешно выполнена',
    '403': 'У вас нет доступа к этой операции',
    '404': 'Объект не найден',
    '400': 'Удаление невозможно.',
  };

  const createMessageElement = (errorMsg, element) => {
    const card = element.closest('li');
    const errorElement = document.createElement('div');
    errorElement.classList.add('comments__error');
    errorElement.textContent = Message[errorMsg];
    card.after(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 4000);
  };

  const onSuccess = (element) => {
    const card = element.closest('li');
    card.parentNode.removeChild(card);
  };

  const deleteObjectHandler = (evt) => {
    evt.preventDefault();

    const URL = evt.target.getAttribute(`data`);

    fetch(URL, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          onSuccess(evt.target);
          createMessageElement(response.ok, evt.target);
        }

        throw new Error(response.status);
      })
      .catch((err) => {
        createMessageElement(err.message, evt.target);
      })
  };

  const deleteArticleElements = document.querySelectorAll(`.delete__button`);
  // const deleteCategoryElements = document.querySelectorAll(`.category__button`);

  const deleteObjectElements = [...deleteArticleElements];

  if(deleteObjectElements.length > 0) {
    Array.from(deleteObjectElements).forEach((element) => {
      element.addEventListener(`click`, deleteObjectHandler);
    });
  }

})();
