import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default class MovieDetails extends React.Component {
    state = {
        movie: {}
    }

    componentWillMount() {
        this.setState({ movie: this.props.navigation.getParam("movie") });
    }

    render() {
        return (
          <ScrollView>
            <View style={styles.container}>
                <Text style={styles.text}>Name: {this.state.movie.name}</Text>
                <Text style={styles.text}>Overview: {this.state.movie.overview}</Text>
                <Text style={styles.text}>Genre: {this.state.movie.genres.join(", ")}</Text>
                <Text style={styles.text}>Release date: {this.state.movie.release_date}</Text>
                <Image style={styles.poster} source={{uri: this.state.movie.poster_image}} />
            </View>
          </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  text: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginBottom: 15
  },
  poster: {
    width: 300,
    height: 450
  }
});