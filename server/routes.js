const { Pool, types } = require('pg');
const config = require('./config.json')

types.setTypeParser(20, val => parseInt(val, 10));

const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

// Route 1
const closest_attacks = async function(req, res) {
  const id = req.params.id;
  const query = `WITH t_distance AS (
                  SELECT T.tid, T.*,
                      SQRT(
                        POWER(A.latitude - T.latitude, 2) + 
                        POWER(A.longitude - T.longitude, 2)
                      ) AS distance
                    FROM TerroristAttack T
                    CROSS JOIN airbnb A
                    WHERE A.aid = ${id}
                  )
                  SELECT *
                  FROM t_distance
                  ORDER BY distance ASC
                  LIMIT 5`;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 2
const bookmarked_listings = async function(req, res) {
  const user_id = req.params.user_id;
  const email = req.cookies.email;

  if (email !== user_id) {
    res.status(404).send('404 Not Found');
    return;
  }

  const query = `SELECT * FROM bookmark NATURAL JOIN airbnb WHERE user_email = '${user_id}'`;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 3
const frequent_attacks = async function(req, res) {
  const query = `WITH HighCasualtyCountries AS (
                  SELECT country, SUM(COALESCE(ta.nkill, 0) + COALESCE(ta.nwound, 0)) AS total_casualties
                  FROM terroristattack ta
                  GROUP BY country
                  HAVING SUM(COALESCE(ta.nkill, 0) + COALESCE(ta.nwound, 0)) > 1000
                ),
                ATTACK_TYPE AS (
                SELECT ta.country, ta.attack_type, COUNT(*) AS attack_count 
                FROM terroristattack ta JOIN HighCasualtyCountries hc ON ta.country = hc.country
                GROUP BY ta.country, ta.attack_type
                )
                SELECT at.country, at.attack_type 
                FROM ATTACK_TYPE at 
                WHERE at.attack_count >= (
                SELECT MAX(at2.attack_count)
                FROM ATTACK_TYPE at2 
                WHERE at2.country=at.country)
                `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 4
const attack_count = async function(req, res) {
  const city = req.params.city;
  const year = req.query.year;
  const query = `SELECT COUNT(tid)
                  FROM terroristattack
                  WHERE year >= ${year} AND city=\'${city}\'`;
                  
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 5 ITs fucking broken
const low_risk_neighborhoods = async function(req, res) {
  const max_attacks = req.params.max_attacks;
  const query = `WITH AttackCount AS (
                  SELECT city, neighborhood, COUNT(*) AS attack_count
                  FROM terroristattack
                  GROUP BY city, neighborhood
              )
              SELECT city, neighborhood
              FROM AttackCount
              WHERE attack_count <= ${max_attacks}`;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
} 

//Route 6
const affordable_listings = async function(req, res) {
  const price = req.params.price;
  const casualties = req.params.casualties;
  const query = `WITH CountryCasualties AS (
                  SELECT country, AVG(COALESCE(ta.nkill, 0) + COALESCE(ta.nwound, 0)) AS avg_casualties
                  FROM TerroristAttack
                  GROUP BY country
                )
                SELECT a.*
                FROM AirbnbListing a JOIN CountryCasualties cc ON a.country=cc.country
                WHERE price <= ${price} AND cc.avg_casualties <= ${casualties}
                `;
  connection.query(query , (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 7
const success_rate_and_type = async function(req, res) {
  const city = req.params.city;
  const query = `WITH attack_stats AS (
                  SELECT
                      attack_type,
                      ROUND(AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END), 2) AS success_rate,
                      COUNT(*) AS attack_count
                  FROM TerroristAttack T
                  WHERE LOWER(T.city) = LOWER('${city}')
                  GROUP BY attack_type
              )
              SELECT
                  attack_type,
                  success_rate,
                  attack_count
              FROM attack_stats
              ORDER BY attack_count DESC`;
  connection.query(query , (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 8
const city_reviews = async function(req, res) {
  const city = req.params.city;
  const query = `SELECT ab.review_score_rating
                FROM Airbnb ab 
                WHERE ab.city = \'${city}\'
                ORDER BY review_score_rating DESC`;
  connection.query(query , (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 9
const highest_success_rate = async function(req, res) {
  const query = `WITH CountrySuccessRate AS (
                  SELECT
                      country,
                      COUNT(*) AS total_attacks,
                      SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) AS successful_attacks,
                      CAST(SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(*), 0) AS success_rate
                  FROM terroristattack
                  GROUP BY country
              ),
              TopCountries AS (
                  SELECT country
                  FROM CountrySuccessRate
                  ORDER BY success_rate DESC
                  LIMIT 5
              ),
              CountryWeaponStats AS (
                  SELECT
                      ta.country,
                      ta.weapon_type,
                      COUNT(*) AS weapon_usage_count,
                      AVG(COALESCE(ta.nkill, 0) + COALESCE(ta.nwound, 0)) AS avg_casualties
                  FROM terroristattack ta
                  JOIN TopCountries tc ON ta.country = tc.country
                  GROUP BY ta.country, ta.weapon_type
              )
              SELECT
                  cws.country,
                  cws.weapon_type,
                  cws.weapon_usage_count,
                  ROUND(cws.avg_casualties, 2)
              FROM CountryWeaponStats cws
              ORDER BY cws.country, cws.weapon_usage_count DESC, cws.avg_casualties DESC`;
  connection.query(query , (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
} 

const all_airbnbs = async function(req, res) {
  const query = `SELECT * FROM airbnb`;
  connection.query(query , (err,
    data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  })
}

const airbnb = async function(req, res) {
  const id = req.params.id;
  const query = `SELECT * FROM airbnb WHERE aid = ${id
  }`;
  connection.query(query , (err,
    data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  })
}

const search = async function(req, res) {
  const country = req.query.country ?? '';
  const max_price = req.query.max_price ?? 100000;
  const guests = req.query.guests ?? 1;
  const bedrooms = req.query.bedrooms ?? 1;
  const min_rating = req.query.min_rating ?? 0;
  const min_attacks_same_country = req.query.min_attacks_same_country ?? -1;

  let query = `
    SELECT * FROM airbnb
    WHERE price <= ${max_price} 
    AND accommodates >= ${guests} 
    AND bedrooms >= ${bedrooms}
    AND CAST(review_scores_rating AS FLOAT) >= ${min_rating}
  `;

  if (country) {
    query += ` AND country = \'${country}\'`;
    query += ` AND ${min_attacks_same_country} <= 
      (SELECT COUNT(*) FROM terroristattack WHERE country = \'${country}\')`;
  }

  query += ` LIMIT 100`;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows.length ? data.rows : []);
    }
  });
}


const create_user = async function(req, res) {
  const email = req.params.email;
  const firstname = req.params.firstname;
  const lastname = req.params.lastname;
  const query = `INSERT INTO users (email, firstname, lastname) VALUES ('${email}', '${firstname}', '${lastname}')`;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error creating user');
    } else {
      res.status(201).send('User created');
    }
  });
}

const create_bookmark = async function(req, res) {
  const uid = req.params.uid;
  const aid = req.params.aid;
  const query = `INSERT INTO bookmark (user_email, aid) VALUES ('${uid}', ${aid})`;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error creating bookmark');
    } else {
      res.status(201).send('Bookmark created');
    }
  });
}


module.exports = {
  closest_attacks,
  bookmarked_listings,
  frequent_attacks,
  attack_count,
  low_risk_neighborhoods,
  success_rate_and_type,
  city_reviews,
  highest_success_rate,
  affordable_listings,
  all_airbnbs,
  airbnb,
  search,
  create_bookmark,
  create_user
}
