'use strict';

(() => {
  const Type = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  };

  const Message = {
    '200': 'Операция успешно выполнена',
    '403': 'У вас нет доступа к этой операции',
    '404': 'Объект не найден'
  };

  const createMessageElement = (type, content) => {
    const ElementClass = {
      SUCCESS: 'client-error__success',
      ERROR: 'client-error__fail'
    };

    const errorElement = document.createElement('div');
    errorElement.classList.add('client-error', ElementClass[type]);
    errorElement.textContent = content;
    document.body.prepend(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  };

  const onSuccess = (element) => {
    const card = element.closest('.notes__list-item');
    card.parentNode.removeChild(card);

    createMessageElement(Type.SUCCESS, Message['200']);
  };

  const onError = (error) => {
    createMessageElement(Type.ERROR, Message[error]);
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
        }

        throw new Error(response.status);
      })
      .catch((err) => {
        onError(err.message);
      })
  };

  const deleteArticleElements = document.querySelectorAll(`.notes__button`);

  const deleteObjectElements = [...deleteArticleElements];

  if(deleteObjectElements.length > 0) {
    Array.from(deleteObjectElements).forEach((element) => {
      element.addEventListener(`click`, deleteObjectHandler);
    });
  }

})();
