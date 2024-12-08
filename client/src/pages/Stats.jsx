import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, TextField, Button } from '@mui/material';

const CountryCard = ({ country, attackCount, successCount, totalCasualties, avgAttackSuccessRate, attackType }) => (
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

const AirbnbCard = ({ aid, city, country, price, guests }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">Airbnb ID: {aid}</Typography>
      {city && country && (
        <Typography variant="body2">
          {city}, {country}
        </Typography>
      )}
      {price && <Typography variant="body2">Price: ${price} / night</Typography>}
      {guests && <Typography variant="body2">Guests: {guests}</Typography>}
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
  const [yearInput, setYearInput] = useState('');
  const [maxAttacks, setMaxAttacks] = useState(10);
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
      const response = await fetch(`http://127.0.0.1:8080/{cityInput}`);
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
      const response = await fetch(`http://127.0.0.1:8080/{cityInput}`);
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
      const response = await fetch(`http://127.0.0.1:8080/{cityInput}`);
      const data = await response.json();
      setCityReviews(data);
    } catch (error) {
      console.error("Error fetching city reviews:", error);
    } finally {
      setLoading((prev) => ({ ...prev, cityReviews: false }));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h2" gutterBottom>Attack Statistics</Typography>

      {/* Most Frequent Attack Type for High-Casualty Countries */}
      <section>
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

      {/* Attack Count per City */}
      <section style={{ marginTop: '40px' }}>
      <Typography variant="h4" gutterBottom>Attack Count per City</Typography>
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
                {`Attack Count for ${cityInput} since ${yearInput}: ${attackCountData[0].attack_count}`}
              </Typography>
            </Grid>
          ) : (
            <Typography>No data available for this city.</Typography>
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
                  <AirbnbCard aid={listing.aid} city={listing.city} country={listing.country} price={listing.price} guest={listing.guests_included} />
                </Grid>
              ))
            ) : (
              <Typography>No affordable listings found.</Typography>
            )}
          </Grid>
        )}
      </section>
    </div>
  );
};

export default StatisticsPage;