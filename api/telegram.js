// api/telegram.js
// Минимальный webhook-хендлер для Vercel (Node Serverless Function)

export default async function handler(req, res) {
  // Telegram шлёт POST
  if (req.method !== 'POST') {
    return res.status(200).send('ok');
  }

  // (опционально) проверяем секрет, чтобы левый трафик не дергал эндпоинт
  const secretHeader = req.headers['x-telegram-bot-api-secret-token'];
  if (process.env.WEBHOOK_SECRET && secretHeader !== process.env.WEBHOOK_SECRET) {
    return res.status(401).send('unauthorized');
  }

  try {
    // Если req.body пуст, аккуратно читаем поток и парсим JSON (на всякий случай)
    const update = req.body && Object.keys(req.body).length
      ? req.body
      : await new Promise((resolve) => {
          let data = '';
          req.on('data', chunk => (data += chunk));
          req.on('end', () => {
            try { resolve(JSON.parse(data || '{}')); }
            catch { resolve({}); }
          });
        });

    const msg = update?.message;
    const chatId = msg?.chat?.id;
    const text = msg?.text || '';

    let reply = 'Я жив! Напиши /help';
    if (/^\/start/.test(text)) reply = 'Привет! Это тест-бот на Vercel. Команды: /ping, /help';
    else if (/^\/ping/.test(text)) reply = 'pong';
    else if (/^\/help/.test(text)) reply = 'Команды: /start, /ping, /help';

    if (chatId) {
      await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply })
      });
    }

    // важно быстро вернуть 200, чтобы Телега не ретраила
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('handler error', e);
    // всё равно 200 (Телега сама ретраит при не-200)
    return res.status(200).json({ ok: true });
  }
}
