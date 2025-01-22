export function setButtonText(
  btn,
  isLoading,
  defaultTxt = "Save",
  loadingTxt = "Saving..."
) {
  if (isLoading) {
    btn.textContent = `${loadingTxt}`;
  } else {
    btn.textContent = `${defaultTxt}`;
  }
}
