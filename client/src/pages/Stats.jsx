import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, TextField, Button } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, } from '@mui/material';

const CountryCard = ({ country, attackCount, successCount, totalCasualties, avgAttackSuccessRate, attackType, weaponType, weaponUsageCount, avgCasualties }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{country}</Typography>
      {attackCount && <Typography variant="body2">Attacks: {attackCount}</Typography>}
      {successCount && <Typography variant="body2">Successful Attacks: {successCount}</Typography>}
      {totalCasualties && <Typography variant="body2">Casualties: {totalCasualties}</Typography>}
      {avgAttackSuccessRate && (
        <Typography variant="body2">Avg Attack Success Rate: {avgAttackSuccessRate}%</Typography>
      )}
      {attackType && <Typography variant="body2">Attack Type: {attackType}</Typography>}
      {weaponType && <Typography variant="body2">Weapon Type: {weaponType}</Typography>}
      {weaponUsageCount && <Typography variant="body2">Weapon Usage Count: {weaponUsageCount}</Typography>}
      {avgCasualties && <Typography variant="body2">Avg Casualties: {avgCasualties}</Typography>}
    </CardContent>
  </Card>
);

const CityCard = ({ city, attackCount, successCount, totalCasualties }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{city}</Typography>
      {attackCount && <Typography variant="body2">Attacks: {attackCount}</Typography>}
      {successCount && <Typography variant="body2">Successful Attacks: {successCount}</Typography>}
      {totalCasualties && <Typography variant="body2">Casualties: {totalCasualties}</Typography>}
    </CardContent>
  </Card>
);

const AirbnbCard = ({ aid, city, country, price, rating, guests }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">Airbnb ID: {aid}</Typography>
      {city && country && (
        <Typography variant="body2">
          {city}, {country}
        </Typography>
      )}
      {price && <Typography variant="body2">Price: ${price} / night</Typography>}
      {rating && <Typography variant="body2">Rating: {rating}</Typography>}
      {guests && <Typography variant="body2">Guests: {guests}</Typography>}
    </CardContent>
  </Card>
);

const AttackCard = ({ attackType, successRate, count }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">Attack Type: {attackType}</Typography>
      {successRate && <Typography variant="body2">Avg Success Rate: {successRate} </Typography>}
      {count && <Typography variant="body2">Attack Count: {count}</Typography>}
    </CardContent>
  </Card>
);

const NeighborhoodCard = ({ neighborhood, city, country, numListings, avgRating, avgPrice, neighborhoodRank }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">Neighborhood: {neighborhood}</Typography>
      {city && <Typography variant="body2">City: {city} </Typography>}
      {country && <Typography variant="body2">Country: {country}</Typography>}
      {numListings && <Typography variant="body2">Number of Listings: {numListings} </Typography>}
      {avgRating && <Typography variant="body2">Avg Rating: {avgRating}</Typography>}
      {avgPrice && <Typography variant="body2">Avg Price: {avgPrice}</Typography>}
      {neighborhoodRank && <Typography variant="body2">Neighborhood Rank: {neighborhoodRank}</Typography>}
    </CardContent>
  </Card>
);

const StatisticsPage = () => {
  const [frequentAttacks, setFrequentAttacks] = useState([]);
  const [attackCountData, setAttackCountData] = useState([]);
  const [lowRiskNeighborhoods, setLowRiskNeighborhoods] = useState([]);
  const [affordableListings, setAffordableListings] = useState([]);
  const [successRateData, setSuccessRateData] = useState([]);
  const [cityReviews, setCityReviews] = useState([]);
  const [highestSuccessRate, setHighestSuccessRate] = useState([]);

  const [loading, setLoading] = useState({
    frequentAttacks: true,
    attackCount: true,
    lowRiskNeighborhoods: true,
    affordableListings: true,
    successRateData: true,
    cityReviews: true,
    highestSuccessRate: true,
  });

  const [cityInput, setCityInput] = useState('');
  const [cityInput2, setCityInput2] = useState('');
  const [cityInput3, setCityInput3] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [maxAttacks, setMaxAttacks] = useState(2);
  const [price, setPrice] = useState(10);
  const [casualties, setCasualties] = useState(1);

  useEffect(() => {
    fetchFrequentAttacks();
    fetchAttackCount();
    fetchLowRiskNeighborhoods();
    fetchAffordableListings();
    fetchSuccessRateAndTypeData();
    fetchCityReviews();
    fetchHighestSuccessRate();
  }, []);

  const fetchFrequentAttacks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/frequent_attacks');
      const data = await response.json();
      setFrequentAttacks(data);
    } catch (error) {
      console.error("Error fetching frequent attacks:", error);
    } finally {
      setLoading((prev) => ({ ...prev, frequentAttacks: false }));
    }
  };

  const fetchAttackCount = async () => {
    try {
      const url = `http://127.0.0.1:8080/attack_count/${cityInput}?year=${yearInput}`;
      const response = await fetch(url);
      const data = await response.json();
      setAttackCountData(data);
    } catch (error) {
      console.error("Error fetching attack count:", error);
    } finally {
      setLoading((prev) => ({ ...prev, attackCount: false }));
    }
  };

  const fetchLowRiskNeighborhoods = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/low_risk_neighborhoods/${maxAttacks}`);
      const data = await response.json();
      setLowRiskNeighborhoods(data);
    } catch (error) {
      console.error("Error fetching low risk neighborhoods:", error);
    } finally {
      setLoading((prev) => ({ ...prev, lowRiskNeighborhoods: false }));
    }
  };

  const fetchAffordableListings = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/affordable_listings/${price}/${casualties}`);
      const data = await response.json();
      setAffordableListings(data);
    } catch (error) {
      console.error("Error fetching affordable listings:", error);
    } finally {
      setLoading((prev) => ({ ...prev, affordableListings: false }));
    }
  };

  const fetchSuccessRateAndTypeData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/success_rate_and_type/${cityInput2}`);
      const data = await response.json();
      setSuccessRateData(data);
    } catch (error) {
      console.error("Error fetching success rate and type data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, successRateData: false }));
    }
  };

  const fetchCityReviews = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/city_reviews/${cityInput3}`);
      const data = await response.json();
      setCityReviews(data);
    } catch (error) {
      console.error("Error fetching city reviews:", error);
    } finally {
      setLoading((prev) => ({ ...prev, cityReviews: false }));
    }
  };

  const fetchHighestSuccessRate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/highest_success_rate`);
      const data = await response.json();
      setHighestSuccessRate(data);
    } catch (error) {
      console.error("Error fetching weapon stats:", error);
    } finally {
      setLoading((prev) => ({ ...prev, highestSuccessRate: false }));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h2" gutterBottom>Location Statistics</Typography>

      {/* Low-risk neighborhoods */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>Low-Risk Neighborhoods by Rating & Popularity</Typography>
        <TextField 
          label="Max Attacks since 2004" 
          variant="outlined" 
          value={maxAttacks}
          onChange={(e) => setMaxAttacks(e.target.value)} 
          style={{ marginBottom: '10px' }} 
        />
        <Button onClick={fetchLowRiskNeighborhoods} disabled={loading.lowRiskNeighborhoods}>Fetch Listings</Button>
        
        {loading.lowRiskNeighborhoods ? <CircularProgress /> : (
          <Grid container spacing={2}>
            {lowRiskNeighborhoods.length > 0 ? (
              lowRiskNeighborhoods.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                  <NeighborhoodCard neighborhood={listing.neighborhood} city={listing.city} country={listing.country} numListings={listing.num_listings} avgRating={listing.avg_rating} avgPrice={listing.avg_price} neighborhoodRank={listing.neighborhood_rank} />
                </Grid>
              ))
            ) : (
              <Typography>No low-risk neighborhoods found.</Typography>
            )}
          </Grid>
        )}
      </section>

      {/* Affordable Listings */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>Affordable Listings</Typography>
        <TextField 
          label="Max Price" 
          variant="outlined" 
          value={price}
          onChange={(e) => setPrice(e.target.value)} 
          style={{ marginBottom: '10px' }} 
        />
        <TextField 
          label="Max Avg Casualties per Attack" 
          variant="outlined"
          value={casualties}
          onChange={(e) => setCasualties(e.target.value)} 
          style={{ marginBottom: '10px' }} 
        />
        <Button onClick={fetchAffordableListings} disabled={loading.affordableListings}>Fetch Listings</Button>
        
        {loading.affordableListings ? <CircularProgress /> : (
          <Grid container spacing={2}>
            {affordableListings.length > 0 ? (
              affordableListings.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                  <AirbnbCard aid={listing.aid} city={listing.city} country={listing.country} price={listing.price} rating={listing.review_scores_rating} guest={listing.guests_included} />
                </Grid>
              ))
            ) : (
              <Typography>No affordable listings found.</Typography>
            )}
          </Grid>
        )}
      </section>

      {/* Top-rated airbnbs by city */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>Top-Rated AirBnbs by City</Typography>
        <TextField 
          label="City" 
          variant="outlined" 
          value={cityInput3}
          onChange={(e) => setCityInput3(e.target.value)} 
          style={{ marginBottom: '10px' }} 
      />
        <Button onClick={fetchCityReviews} disabled={loading.cityReviews}>Fetch listings</Button>
        
        {loading.cityReviews ? <CircularProgress /> : (
          <Grid container spacing={2}>
            {cityReviews.length > 0 ? (
              cityReviews.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <AirbnbCard aid={item.aid} city={item.city} country={item.country} price={item.price} rating={item.review_scores_rating} guests={item.guests_included} />
                </Grid>
              ))
            ) : (
              <Typography>No listings found.</Typography>
            )}
          </Grid>
        )}
      </section>

      <Typography variant="h2" gutterBottom>Attack Statistics</Typography>

      {/* Attack Count per City */}
      <section style={{ marginTop: '40px' }}>
      <Typography variant="h4" gutterBottom>Attack Count by City</Typography>
      <TextField 
        label="City" 
        variant="outlined" 
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)} 
        style={{ marginBottom: '10px' }} 
      />
      <TextField 
        label="Year Since" 
        variant="outlined"
        value={yearInput}
        onChange={(e) => setYearInput(e.target.value)} 
        style={{ marginBottom: '10px' }} 
      />
      <Button onClick={fetchAttackCount} disabled={loading.attackCount}>Fetch Attack Count</Button>
      {loading.attackCount ? <CircularProgress /> : (
        <Grid container spacing={2}>
          {attackCountData.length > 0 ? (
            <Grid item xs={12}>
              <Typography variant="h7">
                {`Attack Count: ${attackCountData[0].attack_count}`}
              </Typography>
            </Grid>
          ) : (
            <Typography>No data available for this city.</Typography>
          )}
        </Grid>
      )}
      </section>

      {/* Avg success rate by attack type */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>Avg Success Rate for Attack Type by City </Typography>
        <TextField 
          label="City" 
          variant="outlined" 
          value={cityInput2}
          onChange={(e) => setCityInput2(e.target.value)} 
          style={{ marginBottom: '10px' }} 
      />
        <Button onClick={fetchSuccessRateAndTypeData} disabled={loading.successRateData}>Fetch data</Button>
        
        {loading.successRateData ? <CircularProgress /> : (
          <Grid container spacing={2}>
            {successRateData.length > 0 ? (
              successRateData.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <AttackCard attackType={item.attack_type} successRate={item.success_rate} count={item.attack_count} />
                </Grid>
              ))
            ) : (
              <Typography>No success rate data found.</Typography>
            )}
          </Grid>
        )}
      </section>

      {/* Most Frequent Attack Type for High-Casualty Countries */}
      <section style={{marginTop: '40px'}}>
        <Typography variant="h4" gutterBottom>Most Frequent Attack Type for High-Casualty Countries</Typography>
        {loading.frequentAttacks ? <CircularProgress /> : (
          <Grid container spacing={2}>
            {frequentAttacks.map((item, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <CountryCard country={item.country} attackType={item.attack_type} />
              </Grid>
            ))}
          </Grid>
        )}
      </section>

      {/* Weapon Stats for Countries with Highest Attack Success Rate */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>Weapon Stats for Countries with Highest Attack Success Rate</Typography>
        {loading.highestSuccessRate ? <CircularProgress /> : (
          <Grid container spacing={2}>
            {highestSuccessRate.map((item, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <CountryCard country={item.country} weaponType={item.weapon_type} weaponUsageCount={item.weapon_usage_count} avgCasualties={item.avg_casualties} />
              </Grid>
            ))}
          </Grid>
        )}
      </section>
    </div>
  );
};

export default StatisticsPage;