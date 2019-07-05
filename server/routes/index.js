import { Router } from 'express'
import axios from 'axios'
import validate from 'express-validation'
import token from '../../token'

import validation from './validation'

export default () => {
  let router = Router()

  /** GET /health-check - Check service health */
  router.get('/health-check', (req, res) => res.send('OK'))

  // The following is an example request.response using axios and the
  // express res.json() function
  /** GET /api/rate_limit - Get github rate limit for your token */
  router.get('/rate', (req, res) => {
    axios
      .get(`http://api.github.com/rate_limit`, {
        headers: {
          Authorization: token
        }
      })
      .then(({ data }) => res.json(data))
  })

  /** GET /api/user/:username - Get user */
  router.get('/user/:username', validate(validation.user), (req, res) => {
    console.log(req.params)

    axios
      .all([
        axios.get('https://api.github.com/users/' + req.params.username),
        axios.get(
          'https://api.github.com/users/' + req.params.username + '/repos'
        )
      ])
      .then(
        axios.spread(function (userResponse, reposResponse) {
          let titleArray = [] // will be a field of the object we are returning to client
          const numObjectsInRepo = Object.keys(reposResponse.data).length
          let numOfReposWithForks = 0
          let stalker = false
          let totalFollowers = 0
          let totalFollowing = 0
          let firstRepoLanguage = ''
          let oneTrickPony = false
          let popular = false

          reposResponse.data.forEach(function (arrayItem) {
            if (arrayItem.fork === true) {
              numOfReposWithForks++
            }
          })

          function calculateStalker () {
            totalFollowers = userResponse.data.followers
            totalFollowing = userResponse.data.following
            if (totalFollowing >= totalFollowers * 2) {
              titleArray.push('Stalker')
            }
          }
          calculateStalker()

          function calculatePopular () {
            totalFollowers = userResponse.data.followers
            totalFollowing = userResponse.data.following
            if (totalFollowers >= totalFollowing * 2) {
              titleArray.push('Mr. Popular')
            }
          }
          calculatePopular()

          // calculate if user is a forker
          if (numOfReposWithForks / numObjectsInRepo >= 0.5) {
            titleArray.push['Forker']
          }

          // set owner value of total
          if (userResponse.data.site_admin === false) {
            titleArray.push('Non-Owner')
          } else {
            titleArray.push('Owner')
          }

          // determine if user uses the same language in all repos
          firstRepoLanguage = reposResponse.data[0].language
          let arrayRepoLanguages = []

          reposResponse.data.forEach(function (arrayItem) {
            arrayRepoLanguages.push(arrayItem.language)
          })
          function isSameLanguage (currentValue) {
            return currentValue === firstRepoLanguage
          }
          oneTrickPony = arrayRepoLanguages.every(isSameLanguage)

          if (oneTrickPony) {
            titleArray.push('One Trick Pony')
          }

          // calculate the highest starred repo
          const maxStargazers = reposResponse.data.reduce(function (
            prev,
            current
          ) {
            return prev.stargazers_count > current.stargazers_count
              ? prev
              : current
          })

          // calculate the total amount of stars across all repos
          let totalStars = reposResponse.data.reduce(function (prev, cur) {
            return prev + cur.stargazers_count
          }, 0)

          // ToDo Jack of All Trades  more than 10 languages across all repos
          // get a set of all languages and see if it's greater than 10
          function uniqueLanguages (value, index, self) {
            return self.indexOf(value) === index
          }
          let unique = arrayRepoLanguages.filter(uniqueLanguages)
          if (unique.length > 10) {
            titleArray.push('Jack of All Trades')
          }

          // Todo favorite language most used language in repositories

          console.log(numObjectsInRepo)

          const responseObject = {
            name: userResponse.data.name,
            login: userResponse.data.login,
            location: userResponse.data.location,
            bio: userResponse.data.bio,
            url: userResponse.data.avatar_url,
            email: userResponse.data.email,
            titles: titleArray,
            maximumStargazers: maxStargazers.stargazers_count,
            totalStarGazers: totalStars,
            publicRepos: userResponse.data.public_repos,
            followers: userResponse.data.followers,
            following: userResponse.data.following
          }

          res.json(responseObject)
        })
      )
      .catch(reason => {
        console.log(reason)
      })

    /*
      TODO
      Fetch data for user specified in path variable
      parse/map data to appropriate structure and return as JSON object
    */
  })

  /** GET /api/users? - Get users */
  router.get('/users', validate(validation.users), (req, res) => {
    console.log(req.query.username)

    let user1 = req.query.username[0]
    let user2 = req.query.username[1]
    axios
      .all([
        axios.get('https://api.github.com/users/' + user1),
        axios.get('https://api.github.com/users/' + user1 + '/repos'),
        axios.get('https://api.github.com/users/' + user2),
        axios.get('https://api.github.com/users/' + user2 + '/repos')
      ])
      .then(
        axios.spread(function (
          userResponse,
          reposResponse,
          userResponse2,
          reposResponse2
        ) {
          let titleArray = [] // will be a field of the object we are returning to client
          const numObjectsInRepo = Object.keys(reposResponse.data).length
          let numOfReposWithForks = 0
          let stalker = false
          let totalFollowers = 0
          let totalFollowing = 0
          let firstRepoLanguage = ''
          let oneTrickPony = false
          let popular = false

          // initalizations for user number 2
          let titleArray2 = [] // will be a field of the object we are returning to client
          const numObjectsInRepo2 = Object.keys(reposResponse2.data).length
          let numOfReposWithForks2 = 0
          let stalker2 = false
          let totalFollowers2 = 0
          let totalFollowing2 = 0
          let firstRepoLanguage2 = ''
          let oneTrickPony2 = false
          let popular2 = false

          // Begin processing section for user one
          reposResponse.data.forEach(function (arrayItem) {
            if (arrayItem.fork === true) {
              numOfReposWithForks++
            }
          })

          function calculateStalker () {
            totalFollowers = userResponse.data.followers
            totalFollowing = userResponse.data.following
            if (totalFollowing >= totalFollowers * 2) {
              titleArray.push('Stalker')
            }
          }
          calculateStalker()

          function calculatePopular () {
            totalFollowers = userResponse.data.followers
            totalFollowing = userResponse.data.following
            if (totalFollowers >= totalFollowing * 2) {
              titleArray.push('Mr. Popular')
            }
          }
          calculatePopular()

          // calculate if user is a forker
          if (numOfReposWithForks / numObjectsInRepo >= 0.5) {
            titleArray.push['Forker']
          }

          // set owner value of total
          if (userResponse.data.site_admin === false) {
            titleArray.push('Non-Owner')
          } else {
            titleArray.push('Owner')
          }

          // determine if user uses the same language in all repos
          firstRepoLanguage = reposResponse.data[0].language
          let arrayRepoLanguages = []

          reposResponse.data.forEach(function (arrayItem) {
            arrayRepoLanguages.push(arrayItem.language)
          })
          function isSameLanguage (currentValue) {
            return currentValue === firstRepoLanguage
          }
          oneTrickPony = arrayRepoLanguages.every(isSameLanguage)

          if (oneTrickPony) {
            titleArray.push('One Trick Pony')
          }

          // calculate the highest starred repo
          const maxStargazers = reposResponse.data.reduce(function (
            prev,
            current
          ) {
            return prev.stargazers_count > current.stargazers_count
              ? prev
              : current
          })

          // calculate the total amount of stars across all repos
          let totalStars = reposResponse.data.reduce(function (prev, cur) {
            return prev + cur.stargazers_count
          }, 0)

          // ToDo Jack of All Trades  more than 10 languages across all repos
          // get a set of all languages and see if it's greater than 10
          function uniqueLanguages (value, index, self) {
            return self.indexOf(value) === index
          }
          let unique = arrayRepoLanguages.filter(uniqueLanguages)
          if (unique.length > 10) {
            titleArray.push('Jack of All Trades')
          }

          // Begin processing session for User2

          reposResponse2.data.forEach(function (arrayItem) {
            if (arrayItem.fork === true) {
              numOfReposWithForks2++
            }
          })

          function calculateStalker2 () {
            totalFollowers2 = userResponse2.data.followers
            totalFollowing2 = userResponse2.data.following
            if (totalFollowing2 >= totalFollowers2 * 2) {
              titleArray2.push('Stalker')
            }
          }
          calculateStalker2()

          function calculatePopular2 () {
            totalFollowers2 = userResponse2.data.followers
            totalFollowing2 = userResponse2.data.following
            if (totalFollowers2 >= totalFollowing2 * 2) {
              titleArray2.push('Mr. Popular')
            }
          }
          calculatePopular2()

          // calculate if user is a forker
          if (numOfReposWithForks2 / numObjectsInRepo2 >= 0.5) {
            titleArray2.push['Forker']
          }

          // set owner value of total
          if (userResponse2.data.site_admin === false) {
            titleArray2.push('Non-Owner')
          } else {
            titleArray2.push('Owner')
          }

          // determine if user uses the same language in all repos
          firstRepoLanguage2 = reposResponse2.data[0].language
          let arrayRepoLanguages2 = []

          reposResponse2.data.forEach(function (arrayItem) {
            arrayRepoLanguages2.push(arrayItem.language)
          })
          function isSameLanguage2 (currentValue) {
            return currentValue === firstRepoLanguage
          }
          oneTrickPony2 = arrayRepoLanguages2.every(isSameLanguage2)

          if (oneTrickPony2) {
            titleArray2.push('One Trick Pony')
          }

          // calculate the highest starred repo
          const maxStargazers2 = reposResponse2.data.reduce(function (
            prev,
            current
          ) {
            return prev.stargazers_count > current.stargazers_count
              ? prev
              : current
          })

          // calculate the total amount of stars across all repos
          let totalStars2 = reposResponse2.data.reduce(function (prev, cur) {
            return prev + cur.stargazers_count
          }, 0)

          // ToDo Jack of All Trades  more than 10 languages across all repos
          // get a set of all languages and see if it's greater than 10
          function uniqueLanguages2 (value, index, self) {
            return self.indexOf(value) === index
          }
          let unique2 = arrayRepoLanguages2.filter(uniqueLanguages)
          if (unique.length > 10) {
            titleArray2.push('Jack of All Trades')
          }

          console.log('data..........' + userResponse.data.location)
          console.log('data..........' + userResponse.data)
          console.log('data..........' + userResponse2.data.location)
          console.log('data..........' + userResponse2.data)

          const responseObject = {
            name: userResponse.data.name,
            login: userResponse.data.login,
            location: userResponse.data.location,
            bio: userResponse.data.bio,
            url: userResponse.data.avatar_url,
            email: userResponse.data.email,
            titles: titleArray,
            maximumStargazers: maxStargazers.stargazers_count,
            totalStarGazers: totalStars,
            publicRepos: userResponse.data.public_repos,
            followers: userResponse.data.followers,
            following: userResponse.data.following
          }

          // Object representing second user
          const responseObject2 = {
            name2: userResponse2.data.name,
            login2: userResponse2.data.login,
            location2: userResponse2.data.location,
            bio2: userResponse2.data.bio,
            url2: userResponse2.data.avatar_url,
            email2: userResponse2.data.email,
            titles2: titleArray2,
            maximumStargazers2: maxStargazers2.stargazers_count,
            totalStarGazers2: totalStars2,
            publicRepos2: userResponse2.data.public_repos,
            followers2: userResponse2.data.followers,
            following2: userResponse2.data.following
          }

          let returnArray = [responseObject, responseObject2]
          console.log(returnArray);
          res.json(returnArray)
        })
      )
      .catch(reason => {
        console.log(reason)
      })
  })

  return router
}
