require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const api = require('covid19-api');
const COUNTRIES = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `Приветствую ${ctx.message.from.first_name} 
Узнай статистику по COVID-19.
Введи название страны на английском языке и получи статистику.
Чтобы посмореть весь список стран введи команду /help`,
    Markup.keyboard([
      ['Russia', 'Ukraine'],
      ['US', 'Canada'],
    ]).resize()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES));

bot.on('text', async (ctx) => {
  let info = {};
  try {
    info = await api.getReportsByCountries(ctx.message.text);

    const formatInfo = `
Страна: ${info[0][0].country}
Случаи: ${info[0][0].cases}
Смертей: ${info[0][0].deaths}
Вылечились: ${info[0][0].recovered}`;
    ctx.reply(formatInfo);
  } catch {
    console.log('Error');
    ctx.reply(`
Ошибка, проверьте правильность ввода названия страны
Чтобы посмореть весь список стран введи команду /help`);
  }
});
bot.launch();
console.log('Start');
