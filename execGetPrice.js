require("dotenv").config();
const { CronJob } = require("cron");
const { exeGetPrice } = require("./src/Controllers/getController");
console.log("CronJob started: ", process.env.CRON_TIME || "0 */3 * * *");
const job = new CronJob(
    process.env.CRON_TIME || "0 */3 * * *", // Padrão de tempo
    exeGetPrice, // Passar como referência, sem os parênteses
    null, // Função executada ao completar o cron (opcional)
    true, // Iniciar automaticamente
    "America/Sao_Paulo" // Fuso horário
);

exeGetPrice();