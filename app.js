const { Telegraf } = require('telegraf');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME;
const SUBSCRIBER_LIMIT = process.env.SUBSCRIBER_LIMIT;
const COUPON_CODE = process.env.COUPON_CODE;
const db = new sqlite3.Database('./users.db');

bot.start((ctx) => {
  ctx.reply('Welcome! To receive your coupon, please use the /getcoupon command.');
});

bot.command('getcoupon', async (ctx) => {
  const userId = ctx.from.id;
  const isUserInDatabase = await checkIfUserExists(userId);

  if (isUserInDatabase) {
    return ctx.reply('You have already received your coupon.');
  }

  const isSubscribed = await checkSubscription(userId);

  if (isSubscribed) {
    const subscriberCount = await getSubscriberCount();

    if (subscriberCount < SUBSCRIBER_LIMIT) {
      await addUserToDatabase(userId);
      sendCoupon(ctx);
    } else {
      ctx.reply(`Sorry, the coupon is only available to the first ${SUBSCRIBER_LIMIT} subscribers.`);
    }
  } else {
    ctx.reply('You need to subscribe to our channel to receive the coupon.');
  }
});

async function checkSubscription(userId) {
  try {
    const response = await bot.telegram.getChatMember(CHANNEL_USERNAME, userId);
    const status = response.status;
    return status === 'member' || status === 'administrator' || status === 'creator';
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

function checkIfUserExists(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT 1 FROM subscribers WHERE id = ?", [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!row);
      }
    });
  });
}

function getSubscriberCount() {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS count FROM subscribers", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

function addUserToDatabase(userId) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO subscribers (id) VALUES (?)", [userId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function sendCoupon(ctx) {
  const imagePath = path.resolve(__dirname, 'coupon.png');
  ctx.replyWithPhoto({ source: imagePath }, { caption: `Congratulations! Here is your coupon code: ${COUPON_CODE}` });
}

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
