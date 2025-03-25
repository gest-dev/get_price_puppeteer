const puppeteer = require("puppeteer");
const { setTimeout } = require("timers/promises");
const { senAlertApiWhatsapp } = require("../Services/alert/sendAlertApiWhatsapp");

exports.exeGetPrice = async () => {


  try {
    let linksProducts = process.env.LINK_LIST.split('||')

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    for (const link of linksProducts) {
      await page.goto(link, { waitUntil: "domcontentloaded" });

      const name = await page.evaluate(() => {
        const nameElement = document.querySelector("h1.page-title span.base");
        return nameElement ? nameElement.innerText.trim() : null;
      });

      const price = await page.evaluate(() => {
        const priceElement = document.querySelector("span.price-wrapper span.price");
        return priceElement ? priceElement.innerText.trim() : null;
      });

      const sku = await page.evaluate(() => {
        const skuElement = document.querySelector(".product.attribute.sku .value");
        return skuElement ? skuElement.textContent.trim() : null;
      });

      console.log("Nome:", name);
      console.log("Preço:", price);
      console.log("Código SKU:", sku);

      let detailMessage = {
        serverName: process.env.SERVER_NAME,
        Product: name,
        Price: price,
        SKU: sku,
        sendType: "puppeteer",
        status: "Success",
        message: `---`,
      };

      if (process.env.SEND_ALERT_WHATSAPP == "true") {
        console.log("Enviando mensagem de alerta...");
        await senAlertApiWhatsapp(detailMessage);
      }

      // Aguarda 4 segundos antes de ir para o próximo link
      console.log("Aguardando 4 segundos antes da próxima busca...");
      await setTimeout(4000);
    }

    await browser.close();
  } catch (error) {
    const errorMessage = error.message.length > 20 ? error.message.slice(0, 20) + "..." : error.message;
    console.error("Erro Message:", errorMessage);

    let detailMessage = {
      serverName: process.env.SERVER_NAME,
      Product: "Getprice Havan",
      Price: 0,
      SKU: 0,
      sendType: "puppeteer",
      status: "Error",
      message: `Erro ao buscar preço do produto: ${errorMessage}`,
    };

    if (process.env.SEND_ALERT_WHATSAPP == "true") {
      await senAlertApiWhatsapp(detailMessage);
    }
  }
};
