import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import axios from 'axios';
import { api_key, base_path_poster } from '../configs/Api';

export default class UpcomingMovies extends React.Component {
      state = {
        current_page: 1,
        total_pages: 2,
        upcomingMoviesList: [],
        upcomingMoviesListNotFiltered: [],
        all_genres: []
      }
    
      componentWillMount() {
        this.loadAllUpcomingMovies();
      }

      loadAllUpcomingMovies = () => {
        this.getGenresAndThenGetUpcomingMovies();
      }
    
      getGenresAndThenGetUpcomingMovies = () => {
        var apiUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + api_key;
    
        axios.get(apiUrl)
             .then(response =>
                this.setState({ all_genres: response.data.genres })
              )
              .then(() => 
                this.getUpcomingMovies(this.state.current_page)
              );
      }
    
      getUpcomingMovies = (page = 1) => {
        if (this.state.current_page <= this.state.total_pages) {
          this.setState({ current_page: this.state.current_page + 1 });
    
          var apiUrl = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + api_key + "&page=" + page;
    
          axios.get(apiUrl)
              .then(response => {
                    this.setState({ upcomingMoviesListNotFiltered: this.mapUpcomingMoviesObject(response.data.results) });
                    this.setState({ upcomingMoviesList: this.state.upcomingMoviesListNotFiltered });
                    this.setState({ total_pages: response.data.total_pages });
                  }
              )
              .then(() =>
                  this.loadMoreUpcomingMovies()
              );
        }
      }
    
      loadMoreUpcomingMovies = () => {
        if (this.state.current_page <= this.state.total_pages) {
          this.getUpcomingMovies(this.state.current_page);
        }
    
        return null;
      }
    
      mapUpcomingMoviesObject = (results) => {
        return this.state.upcomingMoviesList.concat(results.map(movie => {
          return {
            'key': `${movie.id}`,
            'name': movie.original_title,
            'poster_image': base_path_poster + movie.poster_path,
            'genres': this.mapGenresFromMovie(movie.genre_ids),
            'overview': movie.overview,
            'release_date': movie.release_date
          }
        }));
      }
    
      mapGenresFromMovie = (genre_ids) => {
        var genres = [];
    
        genre_ids.forEach(genre_id => {
          var item = this.state.all_genres.find(genre => {
            return genre_id === genre.id;
          });
    
          if (item) {
            genres.push(item.name);
          }
        });
    
        return genres;
      }

      onChangeTextAction = (text) => {
        if (text.length === 0) {
            this.setState({ upcomingMoviesList: this.state.upcomingMoviesListNotFiltered });
        } else{
            var all = this.state.upcomingMoviesListNotFiltered;
            var result = [];

            all.forEach(element => {
                if (element.name.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    result.push(element);
                }
            });

            this.setState({ upcomingMoviesList: result });
        }
      }
      
      onPressAction = (movie) => {
          this.props.navigation.navigate("MovieDetails", { movie });
      }

      getTouchableComponent = (item) => {
        return (<TouchableOpacity style={styles.listItem} onPress={() => this.onPressAction(item) }>
                    <Text style={styles.name}>{ item.name }</Text>
                    <Image style={styles.poster} source={{uri: item.poster_image}} />
                    <Text style={styles.text}>Genre: { item.genres.join(", ") }</Text>
                    <Text style={styles.text}>Release date: { item.release_date }</Text>
                </TouchableOpacity>);
      }
    
      render() {
        return (
          <View style={styles.container}>
            <TextInput style={styles.search}
                       onChangeText={(text) => this.onChangeTextAction(text)} />
            <FlatList
              data = { this.state.upcomingMoviesList }
              renderItem = { ({item}) => this.getTouchableComponent(item) }
            />
          </View>
        );
      }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#FFF',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: 50
  },
  name: {
    flex: 1,
    backgroundColor: '#FFE39F',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold'
  },
  text: {
    flex: 1,
    backgroundColor: '#FFE39F',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontSize: 10
  },
  listItem: {
    flex: 1,
    backgroundColor: '#FFE39F',
    alignItems: 'center',
    justifyContent: 'center',
    height: 180
  },
  search: {
    backgroundColor: '#FFF',
    height: 30
  },
  poster: {
    width: 50,
    height: 80
  }
});