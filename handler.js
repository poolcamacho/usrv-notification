"use strict";

const axios = require("axios");

module.exports.dynamoDBStreamHandler = async (event) => {
  try {
    // Itera sobre cada registro en el evento
    for (const record of event.Records) {
      // Extrae el evento y el registro de DynamoDB
      const eventName = record.eventName;
      const dynamodbRecord = record.dynamodb;

      // Inicializa el mensaje a enviar a Slack
      let message;

      // Realiza acciones basadas en el tipo de evento
      switch (eventName) {
        case "INSERT":
          message =
            "Nuevo registro insertado: " +
            JSON.stringify(dynamodbRecord.NewImage);
          break;
        case "MODIFY":
          message =
            "Registro modificado: " + JSON.stringify(dynamodbRecord.NewImage);
          break;
        case "REMOVE":
          message =
            "Registro eliminado: " + JSON.stringify(dynamodbRecord.OldImage);
          break;
        default:
          console.log("Evento no reconocido:", eventName);
      }

      // Si se detectó un evento reconocido, envía el mensaje a Slack
      if (message) {
        // Webhook URL de Slack
        const slackWebhookUrl =
          "https://hooks.slack.com/services/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";

        // Objeto de datos a enviar a Slack
        const slackData = {
          text: message,
        };

        // Envía el mensaje a Slack
        await axios.post(slackWebhookUrl, slackData);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Notificaciones enviadas a Slack correctamente",
          input: event,
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          error: "Ocurrió un error al enviar las notificaciones a Slack",
        },
        null,
        2
      ),
    };
  }
};
