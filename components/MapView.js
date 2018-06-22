
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapboxGL from 'react-native-mapmagic-gl'
import config from '../config'

const INITIAL = {
  coords: [100.5314, 13.7270],// thinknet coords
  // coords: [100.532691517184, 13.7461440950738],
  zoomLevel: 10,
  maxZoomLevel: 22,
  minZoomLevel: 4,
}

const { 
  MAPBOX_STYLE_URL,
  MAP_API_KEY,
  MAP_APP_ID,
  MAPBOX_ACCESS_TOKEN
} = config

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)

class MapView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: []
    }
  }

  render() {
    const filter = this.state.filter
    return (
      <View style={styles.container}>
        <MapboxGL.MapMagicView
          ref={(ref) => { this._map = ref }}
          style={styles.container}
          styleURL={`${MAPBOX_STYLE_URL}api_key=${MAP_API_KEY}&app_id=${MAP_APP_ID}&lang=th`}
          // styleURL={MapboxGL.StyleURL.Satellite}
          centerCoordinate={INITIAL.coords}
          zoomLevel={INITIAL.zoomLevel}
          maxZoomLevel={INITIAL.maxZoomLevel}
          minZoomLevel={INITIAL.minZoomLevel}
          attributionEnabled={false}
          logoEnabled={false}
          api_key={MAP_API_KEY}
          app_id={MAP_APP_ID}
          {...this.props}
        >
        {this.props.children}
        </MapboxGL.MapMagicView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default MapView