# Telegram Coupon Bot

## Description

**Telegram Coupon Bot** is a Node.js application that distributes a coupon code to the first N subscribers of a specified Telegram channel. The bot verifies if users are subscribed to the channel and ensures that each user only receives the coupon once. If a user has already received the coupon, they are notified accordingly.

## Features

- Automatically sends a coupon image with the specified code to new subscribers.
- Tracks the first N subscribers who claim the coupon.
- Prevents users from receiving the coupon more than once.
- Uses an SQLite database to store subscriber information and manage coupon distribution.
- Configurable via environment variables for easy deployment.

## Setup and Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ismayilibrahimov/telegram-coupon-bot.git
   cd telegram-coupon-bot
   ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Environment Variables**
    
    Create a .env file in the root directory and add the following:

    ```bash
    BOT_TOKEN=your_telegram_bot_token
    CHANNEL_USERNAME=@YourChannelUsername
    SUBSCRIBER_LIMIT=10
    COUPON_CODE=CouponCode
    ```

4. **Database Setup**

    Initialize the SQLite database:
    
    ```bash
    node setup.js
    ```

5. **Run the Bot**
    ```bash
    node app.js
    ```

## Usage
- Start the Bot: Users can start interacting with the bot by sending the /getcoupon command.
- Coupon Distribution: The bot will check if the user is subscribed and among the first N subscribers. If eligible, the bot sends a coupon image with the specified coupon code.


## Deployment
For production deployment, it is recommended to use a process manager like PM2:
```bash
sudo npm install -g pm2
pm2 start bot.js --name "telegram-coupon-bot"
pm2 save
pm2 startup
```