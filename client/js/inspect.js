/* eslint-disable no-undef */
$('form').submit(() => {
  const username = $('form input').val()
  console.log(`examining ${username}`)
  console.log(`user url ${USER_URL}`)

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}/${username}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      console.log(`Got data for ${username}`)
      console.log(data)
      /*
        TODO
        Attach the data returned to the DOM
        The data currently hard-coded into the DOM is placeholder data
       */
      $('.favorite-language').text('Not Calculated Yet')
      $('.location').text(data.location)
      $('.avatar').attr('src', data.url)
      $('.username').text(data.login)
      $('.full-name').text(data.name)
      $('.email').text(data.email)
      $('.bio').text(data.bio)
      $('.titles').text(data.titles)
      $('.total-stars').text(data.totalStarGazers)
      $('.most-starred').text(data.maximumStarGazers)
      $('.public-repos').text(data.publicRepos)
      $('.perfect-repos').text('Not Calculated Yet')
      $('.followers').text(data.followers)
      $('.following').text(data.following)

      $('.user-results').removeClass('hide') // Display '.user-results' element
    })
    .catch(err => {
      console.log(`Error getting data for ${username}`)
      console.log(err)

      $('.duel-error').removeClass('hide');

      $('.user-error').removeClass('hide');
      /*
        TODO
        If there is an error finding the user, instead toggle the display of the '.user-error' element
        and populate it's inner span '.error' element with an appropriate error message
      */
    })

  return false // return false to prevent default form submission
})
