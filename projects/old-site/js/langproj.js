window.onload = () => {
  run_common_before_type();
  typeText('Language Projects', '#mainHeader')
    .then(() => {
      run_common_after_type();
    });
};
