const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('<p>Вітаємо! Це бекенд сервер крипто-калькулятора. Він працює і чекає на запити з React.</p>')
});

app.post('/api/calculate', (req, res) => {
	const { coin, buyPrice, investSumUsdt, targetPercent } = req.body;

	const averagingPrice = buyPrice * 0.90;
	const sellPrice = buyPrice * (1 + targetPercent / 100);

	const coinAmount = investSumUsdt / buyPrice;
	const sellSumAfter = coinAmount * sellPrice;

	const buyFee = investSumUsdt * 0.00075;
	const sellFee = sellSumAfter * 0.00075;
	const transactionFee = buyFee + sellFee;

	const netProfit = sellSumAfter - investSumUsdt - transactionFee;

	const strategyREsult = {
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
	res.status(200).json(strategyREsult);
});

app.listen(PORT, () => {
	console.log(`Сервер запущено на http://localhost:${PORT}`);
});