

const { format } = require('date-fns');
var request = require('request');

exports.senAlertApiWhatsapp = async (detailMessage) => {

  try {

    // Data hora atual
    const now = new Date();
    const formattedDate = format(now, 'dd-MM-yyyy HH:mm:ss');
    let bodyData = null;
    if (process.env.WHATSAPP_API_API_TYPE == 'HUBOOT-API') {
      console.log(process.env.WHATSAPP_API_API_TYPE);

      let messageString = `*${detailMessage.serverName}*\n*Produto*: ${detailMessage.Product}\n*Price*: ${detailMessage.Price}\n*SKU*: ${detailMessage.SKU}\n*Status*: ${detailMessage.status}\n*Message*: ${detailMessage.message}\n*Date*: ${formattedDate}`;

      bodyData = JSON.stringify({
        "id": process.env.WHATSAPP_API_ID,
        "message": messageString,
        "group": process.env.WHATSAPP_API_GROUP
      });
    } else {
      console.error("Erro ao enviar mensagem whatsapp: WHATSAPP_API_API_TYPE não configurada");
      return;
    }


    let options = {
      'method': process.env.WHATSAPP_API_METHOD || 'POST',
      'url': process.env.WHATSAPP_API_HOST,
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
      },
      body: bodyData
    };

    const response = await new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          console.log(error);

          reject(error);
        } else {
          resolve(response);
        }
      });
    });

  } catch (error) {
    console.error("Error Enviar mensagem whatsapp: ", error.message);
  }
}