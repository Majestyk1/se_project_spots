const initialCards = [
  {name:"Val Thorens", link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"},
  {name:"Restaurant terrace", link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},
  {name:"An outdoor cafe", link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},
  {name:"A very long bridge, over the forest and through the trees zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},
  {name:"Tunnel with morning light", link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},
  {name:"Mountain house", link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},
  {name:"Beautiful bridge view", link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"}
]

const editModalBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardForm = cardModal.querySelector(".modal__form");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn_type_preview");


const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function createCardElement(data) {
   const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
   const cardNameEl = cardElement.querySelector(".card__title");
   const cardImageEl = cardElement.querySelector(".card__image");
   const cardLikeBtn = cardElement.querySelector(".card__like-btn");
   const cardDeleteBtn = cardElement.querySelector(".card__delete-btn")

   cardNameEl.textContent = data.name;
   cardImageEl.src = data.link;
   cardImageEl.alt = data.name;

    cardLikeBtn.addEventListener("click", () => {
      cardLikeBtn.classList.toggle("card__like-btn_liked");
    });

    cardDeleteBtn.addEventListener("click", () => {
      cardElement.remove();
    });

    cardImageEl.addEventListener("click", ()=> {
     previewModalImageEl.src = data.link
     previewModalCaptionEl.textContent = data.name
     previewModalImageEl.alt = data.name
     openModal(previewModal);
    });

   return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(editModal);
}

function handleAddCardSubmit (evt) {
  evt.preventDefault();
  console.log(cardLinkInput.value);
  console.log(cardNameInput.value);
  const inputValue = {name: cardNameInput.value, link: cardLinkInput.value};
  const cardElement = createCardElement(inputValue);
  cardsList.prepend(cardElement);
  closeModal(cardModal);

}

// event listeners
editModalBtn.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});
editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});
cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});
cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);


initialCards.forEach((card) => {
  const cardElement = createCardElement(card);
  cardsList.prepend(cardElement);
});