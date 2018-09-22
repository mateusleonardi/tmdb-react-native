import React from 'react';
import { createStackNavigator } from 'react-navigation';
import UpcomingMovies from './movie/UpcomingMovies';
import MovieDetails from './movie/MovieDetails';

const RootStack = createStackNavigator({
  UpcomingMovies: {
    screen: UpcomingMovies
  },
  MovieDetails: {
    screen: MovieDetails
  }
});

export default class App extends React.Component {
  render() {
    return (
      <RootStack />
    );
  }
}