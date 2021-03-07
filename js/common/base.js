


function run_common_before_type() {
  reloadFontChoice();
  loadBrightnessPreference();
  loadCustomColors();
  setDateBasedClass();
  status_timeout = Number(localStorage.getItem(LS_STATUS_TIMEOUT)) || 3500;
}

function run_common_after_type() {
  fade();
  cursorFade();
  vimHandle();
}
