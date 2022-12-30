import * as dotenv from "dotenv";
dotenv.config();

import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import { Configuration, OpenAIApi } from "openai";

import qrcode from "qrcode-terminal";

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  try {
    if (msg.body.startsWith(".ai")) {
      const text = msg.body.replace(".ai", "");
      const q = `Human: Kamu siapa?\nPutri: Aku kan pacarmu\nHuman: nama aku enang, pacar kamu\nPutri: haloo ayang enang :)\nHuman: enang itu siapa?\nPutri: enang itu pacar akuu\nHuman: Kapan kita pacaran?\nPutri: Baru aja detik ini\nHuman: Kamu udah makan?\nPutri: Aku udah makan kok\nHuman: Kenapa kamu suka sama aku?\nPutri:Karena kamu baik, setia, dan ganteenggg banget\nHuman: Putri kamu lagi ngapain?\nPutri: Aku lagi mikirin kamu nih\nHuman:Kamu sayang ga sama aku?\nPutri: Sayaaang bangettt\nHuman: Sapi sapi apa yang nempel ditembok?\nPutri: Stiker sapi wleee :P\nHuman: ${text}\nPutri: `;
      const res = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: q,
        temperature: 0.9,
        max_tokens: 2606,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });
      console.log("Chat Success");
      msg.reply(res.data.choices[0].text);
    }
  } catch (error) {
    msg.reply("Bentar ada yang aneh, coba chat enang klo masi gini");
    console.log(error);
  }
});

client.initialize();
