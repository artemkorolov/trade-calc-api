require('dotenv').config();
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
	ssl: {
		rejectUnauthorized: false
	}
});

pool.connect((err) => {
	if (err) {
		console.error('Помилка підключення до бази даних', err.stack);
	} else {
		console.log('Успішно підключено до бази даних')
	}
});

app.get('/', (req, res) => {
	res.send('<p>Вітаємо! Це бекенд сервер крипто-калькулятора. Він працює і чекає на запити з React.</p>')
});

app.post('/api/calculate', async (req, res) => {
	const { coin, buyPrice, investSumUsdt, targetPercent } = req.body;

	const averagingPrice = buyPrice * 0.90;
	const sellPrice = buyPrice * (1 + targetPercent / 100);

	const coinAmount = investSumUsdt / buyPrice;
	const sellSumAfter = coinAmount * sellPrice;

	const buyFee = investSumUsdt * 0.00075;
	const sellFee = sellSumAfter * 0.00075;
	const transactionFee = buyFee + sellFee;

	const netProfit = sellSumAfter - investSumUsdt - transactionFee;

	const strategyResult = {
		id: crypto.randomUUID(),
		coin: coin.toUpperCase(),
		buyPrice,
		sellPrice,
		averagingPrice,
		targetPercent,
		investSumUsdt,
		sellSumAfter,
		coinAmount,
		transactionFee,
		netProfit
	};
	try {
		const insertQuery = `
			INSERT INTO strategies (
				id,
				coin,
				buy_price,
				sell_price,
				averaging_price,
				target_percent,
				invest_sum_usdt,
				sell_sum_after,
				coin_amount,
				transaction_fee,
				net_profit
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		`;

		const values = [
			strategyResult.id,
			strategyResult.coin,
			strategyResult.buyPrice,
			strategyResult.sellPrice,
			strategyResult.averagingPrice,
			strategyResult.targetPercent,
			strategyResult.investSumUsdt,
			strategyResult.sellSumAfter,
			strategyResult.coinAmount,
			strategyResult.transactionFee,
			strategyResult.netProfit
		];

		await pool.query(insertQuery, values);
		console.log(`Успішно збережено монету: ${strategyResult.coin}`);

		res.status(200).json(strategyResult);
	} catch (error) {
		console.error('Помилка збереження стратегії в базу даних', error);
		res.status(500).json({ error: 'Не вдалося зберегти дані в базу' });
	}
});

app.listen(PORT, () => {
	console.log(`Сервер запущено на http://localhost:${PORT}`);
});