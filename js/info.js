typeText('Information &amp; Contact', '#mainHeader', () => {
  let content = document.querySelector('#content');
  console.log(content);
  content.style.opacity = 1;
  buttonFade();
})



// TODO: why does this need timeout
// setTimeout(() => buttonFade(), 60);
