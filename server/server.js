const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));


app.get('/closest_attacks/:id', routes.closest_attacks);
app.get('/bookmarked_listings/:user_id', routes.bookmarked_listings);
app.get('/frequent_attacks', routes.frequent_attacks);
app.get('/attack_count/:city', routes.attack_count);
app.get('/low_risk_neighborhoods/:max_attacks', routes.low_risk_neighborhoods);
app.get('/affordable_listings/:price:casualties', routes.affordable_listings);
app.get('/success_rate_and_type/:city', routes.success_rate_and_type);
app.get('/city_reviews:city', routes.city_reviews);
app.get('/highest_sucess_rate', routes.highest_success_rate);
app.get('/suggested_visit/:user_id', routes.suggested_visit);
app.get('/airbnbs', routes.all_airbnbs);
app.get('/airbnb/:id', routes.airbnb);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
