// Este archivo ejecuta todas las secuencias de comandos de extracción de datos


const scraperObject = {
    // propiedad url con la página web de la que se extrae los datos
    url: "http://books.toscrape.com",
    // método que contiene el código que realiza la extracción en sí
    async scraper(browser, category) {
        // método newPage() que crea una instancia de página nueva en el navegador
        let page = await browser.newPage();
        console.log(`Navegando hacia el sitio web${this.url}...`);
        // utiliza el método page.goto() para navegar a la página web en la propiedad url
        await page.goto(this.url);
        // Selecciona la categoría del libro que se va a mostrar
		let selectedCategory = await page.$$eval('.side_categories > ul > li > ul > li > a', (links, _category) => {

			// Busca el elemento que tiene el texto que coincide
			links = links.map(a => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category ? a : null);
			let link = links.filter(tx => tx !== null)[0];
			return link.href;
		}, category);
		// Navega hasta la categoría seleccionada
		await page.goto(selectedCategory);
        let scrapedData = [];
        // Espera al DOM requerido para renderizarse
        async function scrapeCurrentPage() {
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
                
            /*
            Bucle que recorre los enlaces, abre una nueva instancia de la página
            y obtiene los datos deseados de cada enlace
            Con el catch() en cada dataObj evitamos que pare la extracción si no se encuentra el dato como le indicamos
            */

            let pagePromise = (link) => new Promise(async(resolve, reject) => {
                let dataObj = {};
                let newPage = await browser.newPage();
                await newPage.goto(link);
                dataObj["bookTitle"] = await newPage.$eval(".product_main > h1", text => text.textContent).catch(() => "No title available");;
                dataObj["bookPrice"] = await newPage.$eval(".price_color", text => text.textContent).catch(() => "No price available");;
                dataObj["noAvailable"] = await newPage.$eval(".instock.availability", text => {
                    // Quita espacios de línea y espacios de tabulación
                    text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                    // Obtiene el número de stock disponible
                    let regexp = /^.*\((.*)\).*$/i;
                    let stockAvailable = regexp.exec(text)[1].split(" ")[0];
                    return stockAvailable;
                }).catch(() => "No availability available");;
                dataObj["imageUrl"] = await newPage.$eval("#product_gallery img", img => img.src).catch(() => "No imageUrl available");;
                dataObj["bookDescription"] = await newPage.$eval("#product_description", div => div.nextSibling.nextSibling.textContent).catch(() => "No description available");
                dataObj["upc"] = await newPage.$eval(".table.table-striped > tbody > tr > td", table => table.textContent).catch(() => "No upc available");;
                resolve(dataObj);
                await newPage.close();
            });

            /*
            Advertencia: Tenga en cuenta que esperó la promesa utilizando un bucle for-in. Puede utilizar cualquier otro bucle, pero evite recorrer en iteración sus matrices de URL con métodos de iteración de matrices, como forEach, o cualquier otro método que utilice una función de devolución de llamada. Esto se debe a que la función de devolución de llamada debe pasar, primero, por la cola de devolución de llamadas y el bucle de evento, por lo tanto, se abrirán varias instancias de la página a la vez. Esto consumirá mucha más memoria
            */

            for(link in urls) {
                let currentPageData = await pagePromise(urls[link]);
                scrapedData.push(currentPageData);
                // console.log(currentPageData);
            }

            /* Cuando todos los datos de la página se han extraido,
            hace click en el botón next,
            e inicia la extracción de la página siguiente
            Se comprueba primero si este botón existe,
            sabiendo así que realmente hay una página siguiente    
            */
           let nextButtonExist = false;
           try {
            const nextButton = await page.$eval(".next > a", a => a.textContent);
            nextButtonExist = true;  
           } catch(err) {
            nextButtonExist = false;
           }
           if(nextButtonExist) {
            await page.click(".next > a");
            return scrapeCurrentPage(); // Llama a esta función recursivamente
           }
           await page.close();
           return scrapedData;
        }
        let data = await scrapeCurrentPage();
        console.log(data);
        return data;
    }
}

module.exports = scraperObject;