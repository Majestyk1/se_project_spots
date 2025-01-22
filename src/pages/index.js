/* -------------------------------------------------------------------------- */
/*                           constants and elements                           */
/* -------------------------------------------------------------------------- */
import "./index.css";
import {
  settings,
  enableValidation,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f5f37795-460a-4027-8d2b-61c9933d5033",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((card) => {
      renderCard(card);
    });
    profileAvatar.src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch((err) => {
    console.error(err);
  });

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.forms["edit-avatar-profile"];
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form_delete");

const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editModalBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const closeBtns = document.querySelectorAll(".modal__close-btn");
const cancelBtn = document.querySelector(".modal__button");

const editModal = document.querySelector("#edit-modal");
const editForm = document.forms["edit-profile"];
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["add-card-form"];
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const modalOpened = "modal_opened";

let selectedCard, selectedCardId;

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */

const handleDeleteSubmit = (event) => {
  event.preventDefault();
  const submitBtn = event.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      if (selectedCard) {
        selectedCard.remove();
      }
      closeModal();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
};

const handleDeleteCard = (cardElement, cardId) => {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
};

const createCardElement = (data) => {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  let isLiked = data.isLiked;

  if (isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", (event) => {
    handleLike(event, data._id);
  });

  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
    openModal(previewModal);
  });

  const handleLike = () => {
    api
      .handleLikeStatus(data._id, isLiked)
      .then(() => {
        cardLikeBtn.classList.toggle("card__like-btn_liked");
        isLiked = !isLiked;
      })
      .catch((err) => {
        console.error(err);
        alert("Could not like card");
      });
  };
  return cardElement;
};

const handleEscapeKey = (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
};

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};

const openModal = (modal) => {
  modal.classList.add(modalOpened);
  modal.addEventListener("mousedown", handleOverlayClick);
  document.addEventListener("keydown", handleEscapeKey);
};

const closeModal = () => {
  const modal = document.querySelector(`.${modalOpened}`);
  modal.classList.remove(modalOpened);
  modal.removeEventListener("mousedown", handleOverlayClick);
  document.removeEventListener("keydown", handleEscapeKey);
};

const handleEditFormSubmit = (event) => {
  event.preventDefault();
  const submitBtn = event.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({ name: nameInput.value, about: descriptionInput.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal();
    })
    .catch((err) => {
      console.error(err).finally(() => {
        setButtonText(submitBtn, false);
      });
    });
};

const handleAddCardSubmit = (event) => {
  event.preventDefault();

  const submitBtn = event.submitter;
  setButtonText(submitBtn, true);

  const inputValue = { name: cardNameInput.value, link: cardLinkInput.value };
  api
    .addNewCard(inputValue)
    .then((newCard) => {
      renderCard(newCard);
      event.target.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal();
    })
    .catch((err) => {
      console.error(err);
      alert("Could not add new card");
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
};

const handleAvatarSubmit = (event) => {
  event.preventDefault();
  const submitBtn = event.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
};

const renderCard = (card, method = "prepend") => {
  const cardElement = createCardElement(card);
  cardsList[method](cardElement);
};

/* -------------------------------------------------------------------------- */
/*                               event listeners                              */
/* -------------------------------------------------------------------------- */
editModalBtn.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  resetValidation(editForm, [nameInput, descriptionInput], settings);
  openModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cancelBtn.addEventListener("click", () => {
  closeModal();
});

closeBtns.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => {
    closeModal();
  });
});
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

/* -------------------------------------------------------------------------- */
/*                               initialization                               */
/* -------------------------------------------------------------------------- */

enableValidation(settings);
