// Solicita los archivos "browser.js" y "pageController.js"
const browserObject = require("./browser");
const scraperController = require("./pageController");

// Invoca la función startBrowser() y crea una instancia del navegador
let browserInstance = browserObject.startBrowser();

// Pasa la instancia creada del navegador al controlador de la página, que dirigirá sus acciones
scraperController(browserInstance);