import fetch from 'node-fetch';

const keepAlive = (url: string): void => {
  setInterval(async () => {
    try {
      await fetch(url);
      console.log('Keep-alive ping sent');
    } catch (err) {
      console.error('Keep-alive ping failed', err);
    }
  }, 840000); // 14 minutes (Render's timeout is 15 minutes)
};

export { keepAlive };
