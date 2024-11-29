/* -------------------------------------------------------------------------- */
/*                           constants and elements                           */
/* -------------------------------------------------------------------------- */

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Beautiful bridge view",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModalBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const closeButtons = document.querySelectorAll(".modal__close-btn");

const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector('[name ="edit-profile"]');
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector('[name ="add-card-form"]');
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const modalOpened = "modal_opened";

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */

const createCardElement = (data) => {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
    openModal(previewModal);
  });

  return cardElement;
};

const handleEscapeKey = (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
};

const handleOverlayClick = (event) => {
  const modal = document.querySelector(`.${modalOpened}`);
  if (event.target === modal) {
    closeModal();
  }
};

const openModal = (modal) => {
  const closeBtn = modal.querySelector(".modal__close-btn");
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("dblclick", handleOverlayClick);
  document.addEventListener("keydown", handleEscapeKey);
  modal.classList.add(modalOpened);
};

const closeModal = () => {
  const modal = document.querySelector(`.${modalOpened}`);
  modal.classList.remove(modalOpened);
  modal.removeEventListener("dblclick", handleOverlayClick);
  document.removeEventListener("keydown", handleEscapeKey);
};

const handleEditFormSubmit = (event) => {
  event.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal();
};

const handleAddCardSubmit = (event) => {
  event.preventDefault();
  const inputValue = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = createCardElement(inputValue);
  cardsList.prepend(cardElement);
  event.target.reset();
  disableButton(cardSubmitBtn, settings);
  closeModal();
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

editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

/* -------------------------------------------------------------------------- */
/*                               initialization                               */
/* -------------------------------------------------------------------------- */
initialCards.forEach((card) => {
  renderCard(card);
});
