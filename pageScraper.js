// Este archivo ejecuta todas las secuencias de comandos de extracción de datos


const scraperObject = {
    // propiedad url con la página web de la que se extrae los datos
    url: "http://books.toscrape.com",
    // método que contiene el código que realiza la extracción en sí
    async scraper(browser) {
        // método newPage() que crea una instancia de página nueva en el navegador
        let page = await browser.newPage();
        console.log(`Navegando hacia el sitio web${this.url}...`);
        // utiliza el método page.goto() para navegar a la página web en la propiedad url
        await page.goto(this.url);
        // El método waitForSelector() usa el div que contiene la información  
        await page.waitForSelector(".page_inner");
        // El método page.$$eval() obtiene el enlace de los libros requeridos 
        let urls = await page.$$eval(
            "section ol > li", links => {
                // Filtra que el libro esté disponible
                links = links.filter(
                    link => link.querySelector(
                        ".instock.availability > i")
                    .textContent !== "In stock")
                // Identifica en la propiedad href el enlace del libro y lo devuelve
                links = links.map(el => el.querySelector("h3 > a").href)
                return links;
            });
            console.log(urls);
    }
}

module.exports = scraperObject;