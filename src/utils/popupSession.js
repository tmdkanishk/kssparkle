let sessionHidePopup = false;
let sessionHasShownPopup = false; // ✅ NEW

export const setSessionHidePopup = (value) => {
  sessionHidePopup = value;
};

export const getSessionHidePopup = () => {
  return sessionHidePopup;
};

// ✅ NEW
export const setSessionHasShownPopup = (value) => {
  sessionHasShownPopup = value;
};

export const getSessionHasShownPopup = () => {
  return sessionHasShownPopup;
};