window.onload = () => {
  run_common_before_type();
  typeText('Thomas Povinelli', '#mainTitle', () => {
    run_common_after_type();
  }, 3);
}
