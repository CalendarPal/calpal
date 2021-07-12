/* eslint-disable no-undef */
$(document).ready(function () {

  function setMenuHeight() {
    var navbarHeight = $(".navbar").outerHeight();
    $(".menu-wrapper")
      .outerHeight(document.documentElement.clientHeight - navbarHeight)
      .niceScroll({
        emulatetouch: true,
      });
  }
  setMenuHeight();
  $(window).on("resize", function () {
    setMenuHeight();
  });
});
