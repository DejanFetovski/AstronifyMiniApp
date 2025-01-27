import dotenv from "dotenv";
dotenv.config();

import * as app from "./app";
import * as bot from "./bot";

const start = async () => {
    bot.init();
    
    await bot.sessionInit();
    app.run(bot);
}

start();

