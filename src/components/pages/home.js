/* eslint-disable no-extend-native */
import React, { useState } from 'react';
import Navbar from '../navbar';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import API from '../../utils/api';
import Progress from '../progress';
import Movie from '../card';
import Nomination from '../nomination';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  rootTwo: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  title: {
    color: '#e32402',
  },
  marFix: {
    marginTop: '24px',
  },
  // btn: {
  //   dis
  // }
}));

const localPic = JSON.parse(localStorage.getItem('picture')) || [];
const localScore = JSON.parse(localStorage.getItem('score')) || [];

export default function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState([]);
  const [picture, setPicture] = useState(localPic);
  const [score, setScore] = useState(localScore);
  const [newMovie, setNewMovie] = useState('No current results.');

  const apiCall = async (val) => {
    const data = await API.searchMovie(val);
    if (data.data.Response === 'False') {
      setNewMovie(data.data.Error);
      await setSearching(false);
    } else {
      await setResult(data.data.Search);
      await setSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearching(true);
    const data = await API.searchMovie(search);
    setResult(data.data.Search);
    await setSearching(false);

    document.getElementById('outlined-full-width').value = '';
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
    setSearching(true);
    apiCall(e.target.value);
  };

  const handleClick = (e, id, category) => {
    console.log(document.getElementById(id));
    let movie = result.filter((x) => x.imdbID === id);
    switch (category) {
      case 'picture':
        if (picture.length === 5) {
          setOpen(true);
        } else {
          document.getElementById(`pic-${id}`).classList.add('Mui-disabled');
          setPicture([...picture, movie[0]]);
          localStorage.setItem(
            'picture',
            JSON.stringify([...picture, movie[0]])
          );
        }
        break;
      case 'score':
        if (score.length === 5) {
          setOpen(true);
        } else {
          document.getElementById(`score-${id}`).classList.add('Mui-disabled');
          setScore([...score, movie[0]]);
          localStorage.setItem('score', JSON.stringify([...score, movie[0]]));
        }
        break;
      default:
        break;
    }
  };

  const handleDelete = (id, category) => {
    let filtered;
    switch (category) {
      case 'picture':
        filtered = picture.filter((x) => x.imdbID !== id);
        setPicture(filtered);
        localStorage.setItem('picture', JSON.stringify(filtered));
        break;
      case 'score':
        filtered = score.filter((x) => x.imdbID !== id);
        setScore(filtered);
        localStorage.setItem('score', JSON.stringify(filtered));
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClear = (e) => {
    e.preventDefault();
    document.getElementById('outlined-full-width').value = '';
    setNewMovie('No current results');
    setResult([]);
  };

  // eslint-disable-next-line no-extend-native
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  return (
    <Grid container spacing={2}>
      <Navbar />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={handleClose}
        message='That category is full. Please delete a title to add new nominee'
        autoHideDuration={6000}
      />
      <Grid container spacing={3} justify='center'>
        <Grid item xs={10} md={6}>
          <form
            className={classes.rootTwo}
            noValidate
            autoComplete='true'
            onSubmit={handleSubmit}>
            <TextField
              required
              id='outlined-full-width'
              label='required'
              style={{ margin: 8 }}
              placeholder='Movie Title'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined'
              onChange={handleChange}
            />
          </form>
        </Grid>
      </Grid>
      <Grid container spacing={8} justify='center'>
        <Grid item xs={10} md={8}>
          <br />
          {!result.length ? (
            <h3>{newMovie}</h3>
          ) : searching ? (
            <Progress />
          ) : (
            <Grid container spacing={2} justify='center'>
              <Grid
                container
                spacing={2}
                justify='center'
                className={classes.marFix}>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
              {result.map((res) => (
                <Grid item xs={12} sm={6}>
                  <Movie
                    key={res.imdbID}
                    id={res.imdbID}
                    year={res.Year}
                    type={res.Type.capitalize()}
                    title={res.Title}
                    handleClick={handleClick}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={8} justify='center'>
        <Grid item xs={10} md={8}>
          <br />
          <br />
          <Typography
            variant='h4'
            component='h2'
            gutterBottom
            className={classes.title}>
            And the award goes too...
          </Typography>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              <Nomination
                results={picture}
                handleDelete={handleDelete}
                category='picture'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Nomination
                results={score}
                handleDelete={handleDelete}
                category='score'
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
