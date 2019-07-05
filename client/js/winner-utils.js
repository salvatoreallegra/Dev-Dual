function determineWinner (stars1, stars2) {
  if (stars1 > stars2) {
    return 'Profile1'
  } else if (stars2 > stars1) {
    return 'Profile2'
  } else {
    return 'Tied'
  }
}

function blink (selector) {
  $(selector).fadeOut('slow', function () {
    $(this).fadeIn('slow', function () {
      blink(this)
    })
  })
}
