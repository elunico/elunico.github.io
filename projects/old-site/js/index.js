window.onload = () => {
  run_common_before_type();

  typeText('Thomas Povinelli', '#mainTitle', 3)
    .then(() => {
      // place a random phrase in the welcome area;
      let welcome = document.querySelector('#welcome');
      let phrase = phrases[Math.floor(Math.random() * phrases.length)];
      let text = phrase.join('<br>');
      welcome.innerHTML = text;
      run_common_after_type();
    });
};


