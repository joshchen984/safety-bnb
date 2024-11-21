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

const closest_attacks = async function(req, res) {
  const id = req.params.id;
  const query = `WITH t_distance AS (
                  SELECT T.tid, T.*,
                      SQRT(
                        POWER(A.latitude - T.latitude, 2) + 
                        POWER(A.longitude - T.longitude, 2)
                      ) AS distance
                    FROM TerroristAttack T
                    CROSS JOIN AirbnbListing A
                    WHERE A.aid = id
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

const success_rate_and_type = async function(req, res) {
  const city = req.params.city;
  const query = `WITH attack_stats AS (
                  SELECT 
                    attack_type,
                    AVG(CAST(success AS FLOAT)) AS success_rate,
                    COUNT(*) AS attack_count
                  FROM TerroristAttack T
                  WHERE T.city = city
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

const highest_success_rate = async function(req, res) {
  const query = `WITH CountrySuccessRate AS (
                  SELECT country, 
                          COUNT(*) AS total_attacks,
                          SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS successful_attacks,
                          Total_attacks / successful_attacks AS success_rate
                  FROM Terrorist_Attack
                  GROUP BY country
                ),
                TopCountries AS (
                  SELECT country
                  FROM CountrySuccessRate
                  ORDER BY success_rate DESC
                  LIMIT 5
                ),
                CountryWeaponStats AS (
                  SELECT ta.country, ta.weapon_type,
                          COUNT(*) AS weapon_usage_count,
                          AVG(ncasualties) AS avg_casualties
                  FROM Terrorist_Attack ta
                  JOIN TopCountries tc ON ta.country = tc.country
                  GROUP BY ta.country, ta.weapon_type
                )
                SELECT cws.country, cws.weapon_type, cws.weapon_usage_count, cws.avg_casualties
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

module.exports = {
  closest_attacks,
  success_rate_and_type,
  highest_success_rate
}
