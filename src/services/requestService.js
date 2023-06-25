const axios = require("axios");
const cheerio = require("cheerio");

const headers = {
  headers: {
    host: "www.amazon.com.br",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    'user-agent': "AppleWebKit/537.36 (KHTML, like Gecko))", //Mozilla/5.0 (Windows NT 10.0; Win64; x64     Chrome/97.0.4692.99 Safari/537.36 OPR/83.0.4254.70
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

          // Ignores sponsored products
          if($(this).find("div.a-row.a-spacing-micro").children("span")
            .children("a.s-label-popover.s-sponsored-label-text").attr("href")) return

          // Scraping Information
          let name = $(this).find(".a-link-normal .a-text-normal").text()
          
          let link = "https://www.amazon.com.br" + $(this).find("a.a-link-normal.a-text-normal").attr("href")
          
          if (link.includes('/gp/')) return  // Ignores Prime Video produts
          
          let price = $(this).find('[data-a-size="l"] span.a-offscreen').text()
          if (!price) price = $(this).find('[data-a-size="xl"] span.a-offscreen').text()
          price = parseFloat(price.replace('R$', "").replace(".", "").replace(",", "."))
          
          let img = $(this).find("img.s-image").attr("src")
          
          
          let productID = link.split('/dp/')[1].split('/ref')[0]
          
          let reviews = $(this).find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small')
            .children('span').last().attr('aria-label')
          
          let stars = $(this).find('span.a-icon-alt').text()
            .split(' de ')[0].replace(",", ".")
          stars = parseFloat(stars)
          
          let shipingText = $(this).find('.a-section.a-spacing-small.s-padding-left-small.s-padding-right-small')
            .children('div.a-section.a-spacing-none.a-spacing-top-micro').last()
            .children('div.a-row').children().last().text()
          
          let prime  = $(this).find('span.s-prime').children().attr('aria-label')
          if (prime == 'Amazon Prime') prime = true
          if (shipingText == 'Frete GRÁTIS no seu primeiro pedido enviado pela Amazon') prime = true
          if ($(this).text().includes('Frete GRÁTIS no seu primeiro pedido enviado pela Amazon')) prime = true
          if ($(this).text().includes('Opção de frete GRÁTIS disponível')) prime = true
          
          
          let shiping
          if (shipingText.includes('GRÁTIS') || prime) shiping = 0.00
          else {
            shiping = shipingText.split('de frete')[0].split('R$')[1]
            if(shiping) shiping = parseFloat(shiping.replace(",", "."))         
          }

          
          // Building the Data object 
          let element = {
            id: total+count,
            name,
            image: img,
            link,
            productID,
          }
          if (price) element.price = price
          if (shiping || shiping===0) element.shiping = shiping
          if (prime) element.prime = true
            else element.prime = false
          if (reviews) element.reviews = parseInt(reviews.replace(".", ""))
          if (stars) element.stars = stars

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