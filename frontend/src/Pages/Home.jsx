import axios from "axios";
import NavBar from "../components/NavBar";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import PoemCard from "../components/PoemCard";

export const Home = () => {
  const [year, setYear] = useState("");
  const [poet, setPoet] = useState("");
  const [domain, setDomain] = useState("");
  const [mood, setMood] = useState("");
  const [meaning, setMeaning] = useState("");
  const [poems, setPoems] = useState([]);
  const [domains, setDomains] = useState([]);
  const [moods, setMoods] = useState([]);


  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}/get_moods_domains`)
      .then((response) => {
        const domains = response.data.domains;
        const moods = response.data.moods;
        setDomains(domains);
        setMoods(moods);
        handleSearch();
      })
      .catch((error) => {
        console.error(error);
      });
  }, [baseUrl]);

  const handleSearch = async () => {
    try {
      const body = {};
      if (year !== "") {
        body["year"] = parseInt(year);
      }
      if (poet !== "") {
        body["poet"] = poet;
      }
      if (domain !== "") {
        body["domain"] = domain;
      }
      if (mood !== "") {
        body["mood"] = mood;
      }
      if (meaning !== "") {
        body["meaning"] = meaning;
      }

      const response = await axios.post(`${baseUrl}/search`, { ...body });
      setPoems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <NavBar />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        p={3}
        spacing={5}
      >
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth={true}
            placeholder={"Year"}
            value={year}
            onChange={(e) => setYear(e.currentTarget.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth={true}
            placeholder={"Poet"}
            value={poet}
            onChange={(e) => setPoet(e.currentTarget.value)}
          />
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        p={3}
        spacing={5}
      >
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Domain</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={domain}
              label="domain"
              onChange={(e) => {
                setDomain(e.target.value);
              }}
            >
              <MenuItem value={""}>&nbsp;</MenuItem>
              {domains.map((domain, index) => {
                return (
                  <MenuItem key={index} value={domain}>
                    {domain}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Mood</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mood}
              label="mood"
              onChange={(e) => {
                setMood(e.target.value);
              }}
            >
              <MenuItem value={""}>&nbsp;</MenuItem>
              {moods.map((mood, index) => {
                return (
                  <MenuItem key={index} value={mood}>
                    {mood}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        p={3}
        spacing={5}
      >
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            value={meaning}
            onChange={(e) => setMeaning(e.currentTarget.value)}
            placeholder={
              "Enter the word either in english or sinhala about meaning"
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth={true} onClick={handleSearch} variant={"contained"}>
            Search
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        p={5}
        spacing={5}
      >
        <Grid item xs={12}>
          {Object.keys(poems).map((index) => (
            <PoemCard key={index} poem={poems[index]} />
          ))}
        </Grid>
      </Grid>
    </>
  );
};
