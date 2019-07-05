/* eslint-disable no-undef */
/*
  TODO
  Fetch 2 user's github data and display their profiles side by side
  If there is an error in finding user or both users, display appropriate error
  message stating which user(s) doesn't exist

  It is up to the student to choose how to determine a 'winner'
  and displaying their profile/stats comparison in a way that signifies who won.
 */
$('form').submit(() => {
  const leftUserName = $('input[name="username-left"]').val()
  const rightUserName = $('input[name="username-right"]').val()
  console.log(`examining ${leftUserName}`)
  console.log(`examining ${rightUserName}`)
  console.log(`user url ${USERS_URL}`)

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USERS_URL}?username=${leftUserName}&username=${rightUserName}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      $('.favorite-language').text('Not Calculated Yet')
      $('.location').text(data[0].location)
      $('.avatar').attr('src', data[0].url)
      $('.username').text(data[0].login)
      $('.full-name').text(data[0].name)
      $('.email').text(data[0].email)
      $('.bio').text(data[0].bio)
      $('.titles').text(data[0].titles)
      $('.total-stars').text(data[0].totalStarGazers)
      $('.most-starred').text(data[0].maximumStarGazers)
      $('.public-repos').text(data[0].publicRepos)
      $('.perfect-repos').text('Not Calculated Yet')
      $('.followers').text(data[0].followers)
      $('.following').text(data[0].following)

      $('.favorite-language2').text('Not Calculated Yet')
      $('.location2').text(data[1].location2)
      $('.avatar2').attr('src', data[1].url2)
      $('.username2').text(data[1].login2)
      $('.full-name2').text(data[1].name2)
      $('.email2').text(data[1].email2)
      $('.bio2').text(data[1].bio2)
      $('.titles2').text(data[1].titles2)
      $('.total-stars2').text(data[1].totalStarGazers2)
      $('.most-starred2').text(data[1].maximumStarGazers2)
      $('.public-repos2').text(data[1].publicRepos2)
      $('.perfect-repos2').text('Not Calculated Yet')
      $('.followers2').text(data[1].followers2)
      $('.following2').text(data[1].following2)

      let winner = determineWinner(
        data[0].totalStarGazers,
        data[1].totalStarGazers2
      )
      switch (winner) {
        case 'Profile1':
          alert(data[0].login + ' Is the Winner')
          blink('.left')
          $(".winner1").text("Winner!!!!!");

          break
        case 'Profile2':
          alert(data[1].login2 + 'Is the Winner')
          blink('.right')
          $(".winner2").text(" Winner!!!!!");
          break
        case 'Tied':
          alert('Tied')
          break
      }

      $('.duel-container').removeClass('hide') // Display '.user-results' element
    })
    .catch(err => {
      console.log(
        `Error getting data for ${leftUserName} + '  ' + ${rightUserName}`
      )
      console.log(err)

      $('.duel-error').removeClass('hide');
      /*
        TODO
        If there is an error finding the user, instead toggle the display of the '.user-error' element
        and populate it's inner span '.error' element with an appropriate error message
      */
    })

  return false // return false to prevent default form submission
})
