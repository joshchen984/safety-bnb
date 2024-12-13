import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, TextField, Button } from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, } from '@mui/material';
import BookmarkCard from '../components/BookmarkCard';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams, Link } from 'react-router-dom';

const CountryCard = ({ country, attackType }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{country}</Typography>
      {attackType && <Typography variant="body2">Attack Type: {attackType}</Typography>}
    </CardContent>
  </Card>
);

const StatisticsPage = () => {
  const [cookies] = useCookies(['email']);
  const navigate = useNavigate();

  const [frequentAttacks, setFrequentAttacks] = useState([]);
  const [attackCountData, setAttackCountData] = useState([]);
  const [lowRiskNeighborhoods, setLowRiskNeighborhoods] = useState([]);
  const [affordableListings, setAffordableListings] = useState([]);
  const [successRateData, setSuccessRateData] = useState([]);
  const [cityReviews, setCityReviews] = useState([]);
  const [highestSuccessRate, setHighestSuccessRate] = useState([]);
  const [suggestedVisit, setSuggestedVisit] = useState([]);
  const [closestAttacks, setClosestAttacks] = useState([]);

  const [currentPageLowRisk, setCurrentPageLowRisk] = useState(1);
  const [currentPageAffordable, setCurrentPageAffordable] = useState(1);
  const [currentPageCity, setCurrentPageCity] = useState(1);
  const [currentPageType, setCurrentPageType] = useState(1);

  const [loading, setLoading] = useState({
    frequentAttacks: false,
    attackCount: false,
    lowRiskNeighborhoods: false,
    affordableListings: false,
    successRateData: false,
    cityReviews: false,
    highestSuccessRate: false,
    suggestedVisit: false,
    closestAttacks: false
  });

  const [cityInput, setCityInput] = useState('');
  const [cityInput2, setCityInput2] = useState('');
  const [cityInput3, setCityInput3] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [maxAttacks, setMaxAttacks] = useState(5);
  const [price, setPrice] = useState(10);
  const [casualties, setCasualties] = useState(1);
  const [aid, setAid] = useState();

  useEffect(() => {
    fetchFrequentAttacks();
    fetchAttackCount();
    fetchLowRiskNeighborhoods();
    fetchAffordableListings();
    fetchSuccessRateAndTypeData();
    fetchCityReviews();
    fetchHighestSuccessRate();
    fetchSuggestedVisit();
  }, []);

  const handleAddToBookmarks = async (aid) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/create_bookmark/${cookies.email}/${aid}`, {
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
    setLoading((prev) => ({ ...prev, frequentAttacks: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/frequent_attacks`);
      const data = await response.json();
      setFrequentAttacks(data);
    } catch (error) {
      console.error("Error fetching frequent attacks:", error);
    } finally {
      setLoading((prev) => ({ ...prev, frequentAttacks: false }));
    }
  };

  const fetchAttackCount = async () => {
    setLoading((prev) => ({ ...prev, attackCount: true }));
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/attack_count/${cityInput}?year=${yearInput}`;
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
    setLoading((prev) => ({ ...prev, lowRiskNeighborhoods: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/low_risk_neighborhoods/${maxAttacks}`);
      const data = await response.json();
      setLowRiskNeighborhoods(data);
    } catch (error) {
      console.error("Error fetching low risk neighborhoods:", error);
    } finally {
      setLoading((prev) => ({ ...prev, lowRiskNeighborhoods: false }));
    }
  };

  const fetchAffordableListings = async () => {
    setLoading((prev) => ({ ...prev, affordableListings: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/affordable_listings/${price}/${casualties}`);
      const data = await response.json();
      setAffordableListings(data);
    } catch (error) {
      console.error("Error fetching affordable listings:", error);
    } finally {
      setLoading((prev) => ({ ...prev, affordableListings: false }));
    }
  };

  const fetchSuccessRateAndTypeData = async () => {
    setLoading((prev) => ({ ...prev, successRateData: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/success_rate_and_type/${cityInput2}`);
      const data = await response.json();
      setSuccessRateData(data);
    } catch (error) {
      console.error("Error fetching success rate and type data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, successRateData: false }));
    }
  };

  const fetchCityReviews = async () => {
    setLoading((prev) => ({ ...prev, cityReviews: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/city_reviews/${cityInput3}`);
      const data = await response.json();
      setCityReviews(data);
    } catch (error) {
      console.error("Error fetching city reviews:", error);
    } finally {
      setLoading((prev) => ({ ...prev, cityReviews: false }));
    }
  };

  const fetchHighestSuccessRate = async () => {
    setLoading((prev) => ({ ...prev, highestSuccessRate: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/highest_success_rate`);
      const data = await response.json();
      setHighestSuccessRate(data);
    } catch (error) {
      console.error("Error fetching success rate data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, highestSuccessRate: false }));
    }
  };

  const fetchSuggestedVisit = async () => {
    setLoading((prev) => ({ ...prev, suggestedVisit: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/suggested_visit/${cookies.email}`);
      const data = await response.json();
      setSuggestedVisit(data);
    } catch (error) {
      console.error("Error fetching suggested visit:", error);
    } finally {
      setLoading((prev) => ({ ...prev, suggestedVisit: false }));
    }
  };

  const fetchClosestAttacks = async () => {
    setLoading((prev) => ({ ...prev, closestAttacks: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/closest_attacks/${aid}`);
      const data = await response.json();
      setClosestAttacks(data);
    } catch (error) {
      console.error("Error fetching closest attacks:", error);
    } finally {
      setLoading((prev) => ({ ...prev, closestAttacks: false }));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Suggested Visit Based on Bookmarks */}
      <section style={{ marginTop: '40px' }}>
      <Typography variant="h4" gutterBottom>Suggested Visit</Typography>
      {loading.suggestedVisit ? <CircularProgress /> : (
        <Grid container spacing={2}>
          {suggestedVisit.length > 0 ? (
            <Grid item xs={12}>
              <Typography variant="h7">
                {`${suggestedVisit[0].city} (${suggestedVisit[0].country})`}
              </Typography>
            </Grid>
          ) : (
            cookies.email ? (
              <p>No low-risk suggestions. Try bookmarking more listings.</p>
            ) : (
              <p><Link to="/login">Log In</Link> or <Link to="/signup">Sign Up</Link> to view.</p>
            )
          )}
        </Grid>
      )}
      </section>
      
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

      {/* closest attacks */}
      <section style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>Closest Attacks</Typography>
        <TextField 
          label="Airbnb ID" 
          variant="outlined" 
          value={aid}
          onChange={(e) => setAid(e.target.value)} 
          style={{ marginBottom: '10px' }} 
        />
        <Button onClick={fetchClosestAttacks} disabled={loading.closestAttacks}>Fetch data</Button>

        {loading.closestAttacks ? <CircularProgress /> : (
          <>
            {closestAttacks.length > 0 ? (
              <>
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>City</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Country</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Year</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Success</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Attack Type</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Weapon Type</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Num Wounded</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Num Killed</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {closestAttacks.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.city}</TableCell>
                          <TableCell>{item.country}</TableCell>
                          <TableCell>{item.year}</TableCell>
                          <TableCell>{item.success}</TableCell>
                          <TableCell>{item.attack_type}</TableCell>
                          <TableCell>{item.weapon_type}</TableCell>
                          <TableCell>{item.nwound}</TableCell>
                          <TableCell>{item.nkill}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Typography>No data found.</Typography>
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
      <Button onClick={fetchAttackCount} disabled={loading.attackCount}>Fetch Data</Button>
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
        <Typography variant="h4" gutterBottom>Most Frequent Attack Type for High-Casualty Countries</Typography>

        {loading.frequentAttacks ? (<CircularProgress />) : frequentAttacks.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {frequentAttacks.slice((currentPageType - 1) * 20, currentPageType * 20).map((item, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <CountryCard country={item.country} attackType={item.attack_type} />
                  </Grid>
                ))}
            </Grid>
            <Pagination
              count={Math.ceil(frequentAttacks.length / 20)} 
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
