// Archivo que contiene la secuencia de comandos que inicia el navegador

// Solciita el módulo Puppeteer
const puppeteer = require("puppeteer-core");

// Función que inicia el navegador y devuelve una instancia de él
async function startBrowser() {
    let browser;
    try {
        console.log("Abriendo el navegador...");
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"],
            "ignoreHTTPSErrors": true
        });
    } catch (err) {
        console.log("No puedo crear una instancia del navegador => :", err);
    }

    return browser;
}

module.exports = {
    startBrowser
};