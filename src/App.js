import React, { useState, useEffect } from "react";
import "./App.css";
import {MenuItem,Typography,FormControl,Select,Card,CardContent} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import MapJs from "./MapJs";
import "leaflet/dist/leaflet.css";
const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [lat,setLat]=useState('');
  const [long,setLong]=useState('');
  const [findhospital,isfindhospital]=useState(false);
  const [findRoute,isfindRoute]=useState(false);
  const [hospitalId,setHospitalId]=useState('');
  const [destLat,setDestLat]=useState('');
  const [destLong,setDestLong]=useState('');
  const [hospitals,setHospitals]=useState([]);
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
          console.clear();
    });
    };
    getCountriesData();
    currentPosition();
  }, []);
  async function hospitalData(latitude,longitude){
    const url=`https://api.foursquare.com/v2/venues/explore?client_id=WQXULLYJJS1AA0ISCQXOJ5PFBGRIMSCRCNIBLJLRGIGPGYO3&client_secret=TGRLECJHRSMCGFT241KDJR4YNGR4451DYSYWDGJG4GAJCFEE&v=20210323&limit=20&ll=${latitude},${longitude}&query=HOSPITALS`;
    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
      const x=data.response.groups[0]['items'];
      let nearHospital=[];
      for(let i in x){
        let hospital=x[i];
        let hos={
          id:hospital['venue']['id'],
          name:hospital['venue']['name'],
          lat:hospital['venue']['location']['lat'],
          long:hospital['venue']['location']['lng'],
          dist:hospital['venue']['location']['distance'],
          address:hospital['venue']['location']['formattedAddress']
        } 
        nearHospital.push(hos);
       };
       setHospitals(nearHospital);
    });
  }
  const getNearestHospital=async(e)=>{
    isfindhospital(true);
    if(lat==='' || long==='') alert('Please check your GPS');
  };

const currentPosition=async(e)=>{
  function geoSuccess(position) {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
          hospitalData(position.coords.latitude,position.coords.longitude);
  }
  await navigator.geolocation.getCurrentPosition(geoSuccess);
};
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setInputCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        if(countryCode === "worldwide") {
       {     setMapCenter({ lat: 34.80746, lng: -40.4796 });
              setMapZoom(3)
       }
        }else{ setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
              setMapZoom(5);
        }
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
        <h1>CORONA VIRUS TRACKER</h1>
        <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
            <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
         </div>
       <div className="app_mid">
       <button className="button" onClick={getNearestHospital}>Get Nearest Hospital</button>
       {findhospital===true && 
        <div  className="hospital_list">
          {
            hospitals.map((hospital)=>(
                    <Card onClick={(e)=>{
                      setDestLat(hospital.lat);
                      setDestLong(hospital.long);
                      setMapZoom(15);
                      isfindRoute(true);
                      setHospitalId(hospital.id);
                    }} className={`hospital_list_card ${(hospital.id===hospitalId) && "hospital_active"}`}> 
                      <CardContent>
                      <h4>{hospital.name}</h4> <h6>{numeral(hospital.dist/1000).format('0,0.0')} Km</h6>
                          < Typography color="textSecondary" gutterBottom>
                            {hospital.address}
                          </Typography>
                      </CardContent>
                    </Card>  
                  ))
          }
        </div>
       }
       </div>
       <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <MapJs
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          lat={lat}
          long={long}
          destLat={destLat}
          destLong={destLong}
          findRoute={findRoute===true}
          setCenter={setMapCenter}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph className="LineGraph" casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default App;
