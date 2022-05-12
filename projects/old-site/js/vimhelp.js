window.onload = () => {
  run_common_before_type();
  typeText('Commands: Help', '#mainHeader')
    .then(() => {
      run_common_after_type();
    });
};
