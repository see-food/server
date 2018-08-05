const axios = require('axios')
const cheerio = require('cheerio')

const scrapeSearch = (url) => {
  return axios.get(url)
  .then(response => {
    let recipesUrls = []
    let $ = cheerio.load(response.data)

    $('.grid-card-image-container').each((i, e) => {
      recipesUrls.push($(e).children('a').attr('href'))
    })

    return recipesUrls
  })
}

const scrapeRecipes = (urls) => {
  //Scrape recipes
  return Promise.all(urls.map(url => {
    return new Promise((resolve, reject) => {
      axios.get(url)
      .then(response => {
        let recipe = {}
        let $ = cheerio.load(response.data)

        //Obtain recipe name
        $('h1').filter((i, e) => {
          recipe.name = $(e).text()
        })

        //Obtain recipe time
        $('.ready-in-time').filter((i, e) => {
          recipe.time = $(e).text()
        })

        //Obtain servings
        $('#metaRecipeServings').filter((i, e) => {
          recipe.servings = $(e).attr('content')
        })

        //Obtain calories
        $('.calorie-count').filter((i, e) => {
          recipe.calories = $(e).children().first().text()
        })

        recipe.ingredients = []
        //Obtain ingredients
        $('[itemProp=recipeIngredient]').each((i, e) => {
          recipe.ingredients.push($(e).text())
        })

        recipe.instructions = []
        //Obtain directions
        $('.recipe-directions__list--item').each((i, e) => {
          if ($(e).text().trim() != '') recipe.instructions.push($(e).text().trim())
        })

        recipe.images = []
        //Obtain images
        $('.photo-strip__items').children().each((i, e) => {
          if ($(e).children('a').children('img').attr('src')) recipe.images.push($(e).children('a').children('img').attr('src'))
        })

        resolve(recipe)
      })
    })
  }))
  .then(recipes => {
    return recipes
  })
}


const saveRecipes = (recipes) => {

}


module.exports = {
  scrapeSearch,
  scrapeRecipes,
  saveRecipes
}
