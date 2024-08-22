// Archivo que controla el proceso de extracción de datos
// Utiliza la instancia del navegador para controlar el archivo pageScraper.js

const pageScraper = require("./pageScraper");

/* 
La instancia del navegador se pasa a la función scrapeAll().
Esta función, a su vez, pasa la instancia como argumento a pageScrapper.scraper(),
 que la utiliza para extraer datos de las páginas

*/
async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        let scrapedData = {};
        // Llama al scraper para la categoría de libros que se desea scrapear
        scrapedData["Travel"] = await pageScraper.scraper(browser, "Travel"); 
        await browser.close();
        console.log(scrapedData);
    } catch(err) {
        console.log("No se pudo resolver la instancia del navegador => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance); 