const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const path = require('path');

const _dirname = path.dirname("")
const buildPath = path.join(_dirname  , "../client/build");

app.use(express.static(buildPath))

app.get("/*", function(req, res){

    res.sendFile(
        path.join(__dirname, "../client/build/index.html"),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        }
      );

})




io.on("connection" , (socket) => {
   console.log('We are connected')

   socket.on("chat" , chat => {
      io.emit('chat' , chat)
   } )

   socket.on('disconnect' , ()=> {
    console.log('disconnected')
   })
})

const app = express();
app.use(cors({
  origin: '*',
}));


app.get('/closest_attacks/:id', routes.closest_attacks);
app.get('/bookmarked_listings/:user_id', routes.bookmarked_listings);
app.get('/frequent_attacks', routes.frequent_attacks);
app.get('/attack_count/:city', routes.attack_count);
app.get('/low_risk_neighborhoods/:max_attacks', routes.low_risk_neighborhoods);
app.get('/affordable_listings/:price/:casualties', routes.affordable_listings);
app.get('/success_rate_and_type/:city', routes.success_rate_and_type);
app.get('/city_reviews/:city', routes.city_reviews);
app.get('/highest_success_rate', routes.highest_success_rate);
app.get('/airbnbs', routes.all_airbnbs);
app.get('/airbnb/:id', routes.airbnb);
app.get('/search', routes.search);
app.get('/create_bookmark/:uid/:aid', routes.create_bookmark);
app.get('/delete_bookmark/:uid/:aid', routes.delete_bookmark);
app.get('/create_user/:email/:firstname/:lastname', routes.create_user);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
