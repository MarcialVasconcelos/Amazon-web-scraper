const axios = require("axios");
const cheerio = require("cheerio");

const headers = {
  headers: {
    host: "www.amazon.com.br",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 OPR/83.0.4254.70",
    Pragma: "no-cache"
  }
}

class RequestService {
  static async start({ product, quantity }) {
    const urlArray = []
    for (let i = 0; i*48 < quantity; i++) {
      urlArray.push(
        axios.get(`https://www.amazon.com.br/s?k=${encodeURI(product)}&page=${i+1}`, 
        headers,
        )
      )
    }
    const response = await this.requestAmazon(urlArray, quantity)
    return response
  }

  static async requestAmazon(url, limit) {
    try {
      let body = await axios.all(url)

      const $ = []
      for (let i in body) {
        $[i] = cheerio.load(body[i].data)
      }

      let list = await this.getProductsFromHtml($, limit)
      return await Promise.all(list)
    } catch (err) {
      console.error(err)
      return { status: err.response.status, message: err.response.statusText }
      // return err
    }
  }

  static async getProductsFromHtml(bodyHtml, limit = 0) {
    const productList = []
    var total = 0
    for (let $ of bodyHtml) {
      let count = 0

      // $('.s-result-list .s-card-container')
      $('[data-component-type="s-search-result"]')
      .each(
        function (i, e) {
          if (count == limit) {
            return true
          }

          if (productList.length == limit) {
            return productList
          }

          let name = $(this).find(".a-link-normal .a-text-normal").text()

          let link = "https://www.amazon.com.br" + $(this).find("a.a-link-normal.a-text-normal").attr("href")
          
          // Ignores Prime Video produts
          if (link.includes('/gp/')) {
            // console.log(`Ignored: ${name}\n${link}`)
            return
          }

          let price = parseFloat($(this).find(' [data-a-size="l"] span.a-offscreen').text()
          .replace('R$', "").replace(",", "."))

          let img = $(this).find("img.s-image").attr("src")

          let productID = link.split("/dp/")[1].split("/ref")[0]

          let reviews = $(this).find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small')
            .children('span').last().attr('aria-label')

          let stars = parseFloat($(this).find('span.a-icon-alt').text()
            .split(' de ')[0].replace(",", "."))

          let prime  = $(this).find('span.s-prime').children().attr('aria-label')

          let element = {
            id: total+count,
            name,
            image: img,
            link,
            productID,
          }
          if (price) element.price = price
          if (reviews) {
            reviews = parseInt(reviews.replace(".", ""))
            element.reviews = reviews
          }
          if (stars) element.stars = stars
          if (prime == 'Amazon Prime') element.prime = true
            else element.prime = false
          productList.push(element)

          count++
        }
      )
      total += count
    }
    return productList
  }
}

module.exports = RequestService;