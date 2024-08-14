
const scraperObject = {
    // propiedad url con la página web de la que se extrae los datos
    url: "http://books.toscrape.com",
    // método que contiene el código que realiza la extracción en sí
    async scraper(browser) {
        // método newPage() que crea una instancia de página nueva en el navegador
        let page = await browser.newPage();
        console.log(`Navegando a ${this.url}...`);
        // utiliza el método page.goto() para navegar a la página web en la propiedad url
        await page.goto(this.url);
    }
}

module.exports = scraperObject;