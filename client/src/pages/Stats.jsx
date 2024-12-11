import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, TextField, Button } from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, } from '@mui/material';
import BookmarkCard from '../components/BookmarkCard';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const CountryCard = ({ country, attackType }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{country}</Typography>
      {attackType && <Typography variant="body2">Attack Type: {attackType}</Typography>}
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

  const [currentPageLowRisk, setCurrentPageLowRisk] = useState(1);
  const [currentPageAffordable, setCurrentPageAffordable] = useState(1);
  const [currentPageCity, setCurrentPageCity] = useState(1);
  const [currentPageType, setCurrentPageType] = useState(1);
  const [cookies, setCookie, removeCookie] = useCookies(['email']);
  const navigate = useNavigate();

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
  const [cityInput2, setCityInput2] = useState('New York City');
  const [cityInput3, setCityInput3] = useState('New York City');
  const [yearInput, setYearInput] = useState('');
  const [maxAttacks, setMaxAttacks] = useState(5);
  const [price, setPrice] = useState(50);
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

  const handleAddToBookmarks = async (aid) => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/create_bookmark/${cookies.email}/${aid}`, {
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error('Error adding bookmark');
      }
      navigate(`/bookmarks/${cookies.email}`);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      alert('Error adding bookmark');
    }
  };

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
      {/* Low-risk neighborhoods */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom> Low-Risk Neighborhoods by Rating & Popularity </Typography>
        <TextField
          label="Max Attacks since 2004" 
          variant="outlined" value={maxAttacks} 
          onChange={(e) => setMaxAttacks(e.target.value)} 
          style={{ marginBottom: '10px' }}
        />
        <Button onClick={fetchLowRiskNeighborhoods} disabled={loading.lowRiskNeighborhoods} style={{ marginBottom: '10px' }}>
          Fetch Listings
        </Button>

        {loading.lowRiskNeighborhoods ? (<CircularProgress />) : lowRiskNeighborhoods.length > 0 ? (
          <> <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }}>Neighborhood</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>City</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Country</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Number of Listings</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Average Rating</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Average Price Per Night</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Rank</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowRiskNeighborhoods.slice((currentPageLowRisk - 1) * 10, currentPageLowRisk * 10).map((listing, index) => (
                      <TableRow key={index}>
                        <TableCell>{listing.neighborhood}</TableCell>
                        <TableCell>{listing.city}</TableCell>
                        <TableCell>{listing.country}</TableCell>
                        <TableCell>{listing.num_listings}</TableCell>
                        <TableCell>{listing.avg_rating}</TableCell>
                        <TableCell>{listing.avg_price}</TableCell>
                        <TableCell>{listing.neighborhood_rank}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.ceil(lowRiskNeighborhoods.length / 10)}
              page={currentPageLowRisk}
              onChange={(e, page) => setCurrentPageLowRisk(page)}
              style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}
            />
          </>
        ) : (
          <Typography>No neighborhoods found.</Typography>
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
          <> 
            {affordableListings.length > 0 ? ( 
            <>
                <Grid container spacing={2}>
                  {affordableListings.slice((currentPageAffordable - 1) * 3, currentPageAffordable * 3).map((listing) => (
                      <Grid item xs={12} sm={6} md={4} key={listing.id}>
                        <BookmarkCard listing={listing} onAddToBookmarks={handleAddToBookmarks} />
                      </Grid>
                  ))}
                </Grid>
                <Pagination
                  count={Math.ceil(affordableListings.length / 3)}
                  page={currentPageAffordable}
                  onChange={(e, page) => setCurrentPageAffordable(page)}
                  style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}
                />
              </>
            ) : (
              <Typography>No listings found.</Typography>
            )}
          </>
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
          <>
            {cityReviews.length > 0 ? (
              <>
                <Grid container spacing={2}>
                  {cityReviews.slice((currentPageCity - 1) * 3, currentPageCity * 3).map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <BookmarkCard listing={item} onAddToBookmarks={handleAddToBookmarks} />
                      </Grid>
                  ))}
                </Grid>
                <Pagination
                  count={Math.ceil(cityReviews.length / 3)} 
                  page={currentPageCity}
                  onChange={(e, page) => setCurrentPageCity(page)}
                  style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}
                />
              </>
            ) : (
              <Typography>No listings found.</Typography>
            )}
          </>
        )}
      </section>

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

      {/* Avg Success Rate by Attack Type */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>Avg Success Rate for Attack Type by City</Typography>
        <TextField 
          label="City" 
          variant="outlined" 
          value={cityInput2}
          onChange={(e) => setCityInput2(e.target.value)} 
          style={{ marginBottom: '10px' }} 
        />
        <Button onClick={fetchSuccessRateAndTypeData} disabled={loading.successRateData}>Fetch Data</Button>
        
        {loading.successRateData ? <CircularProgress /> : (
          <>
            {successRateData.length > 0 ? (
              <>
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Attack Type</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Success Rate</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Attack Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {successRateData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.attack_type}</TableCell>
                          <TableCell>{item.success_rate}</TableCell>
                          <TableCell>{item.attack_count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Typography>No data available for this city.</Typography>
            )}
          </>
        )}
      </section>

      {/* Most Frequent Attack Type for High-Casualty Countries */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>
          Most Frequent Attack Type for High-Casualty Countries
        </Typography>

        {loading.frequentAttacks ? (<CircularProgress />) : frequentAttacks.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {frequentAttacks.slice((currentPageType - 1) * 16, currentPageType * 16).map((item, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <CountryCard country={item.country} attackType={item.attack_type} />
                  </Grid>
                ))}
            </Grid>
            <Pagination
              count={Math.ceil(frequentAttacks.length / 16)} 
              page={currentPageType}
              onChange={(e, page) => setCurrentPageType(page)}
              style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
          </>
        ) : (
          <Typography>No data available.</Typography>
        )}
      </section>

      {/* Weapon Stats for Countries with Highest Attack Success Rate */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>
          Weapon Stats for Countries with Highest Attack Success Rate
        </Typography>

        {loading.highestSuccessRate ? (<CircularProgress />) : highestSuccessRate.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Country</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Weapon Type</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Weapon Usage Count</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Avg Casualties</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {highestSuccessRate.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.country}</TableCell>
                    <TableCell>{item.weapon_type}</TableCell>
                    <TableCell>{item.weapon_usage_count}</TableCell>
                    <TableCell>{item.avg_casualties}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No data available.</Typography>
        )}
      </section>
    </div>
  );
};

export default StatisticsPage;