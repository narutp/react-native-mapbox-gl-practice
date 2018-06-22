
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapboxGL from 'react-native-mapmagic-gl'
import config from './config'
import MapView from './components/MapView'
import { lineString as makeLineString } from '@turf/turf'
import Axios from 'axios';

const TEMPLATE_COORDINATE = [100.5214, 13.7270];

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      route: null,
      filter: []
    }
  }

  async componentDidMount() {
    let getCoordRes
    try {
      getCoordRes = await Axios.get('https://api-routing.mapmagic.co.th/v1/driving/route?src=13.7461440950738, 100.532691517184&dst=13.788453, 100.566592')
    } catch(error) {
      console.log(error);
    }
    console.log('Coordinates', getCoordRes.data.data[0].route[0].geom)
    let coordParse = JSON.parse(getCoordRes.data.data[0].route[0].geom)
    console.log('Coordinates after parse', coordParse.coordinates)
    this.setState({
      route: makeLineString(coordParse.coordinates)
    })
    console.log(this.state.route)
  }

  onPressMap = (event) => {
    const { screenPointX, screenPointY } = event.properties
    if (this.map) {
      // methods(coord, filter, id)
      this.map.queryRenderedFeaturesAtPoint([screenPointX, screenPointY], null, ['job_list_layer_stroke'])
      .then((queryResult) => {
        const result = { ...queryResult }
        return result
      }).catch(() => {})
    }
  }

  // renderOrigin = () => {
  //   let backgroundColor = 'white';
  //   const style = [layerStyles.origin, { circleColor: backgroundColor }];

  //   return (
  //     <MapboxGL.ShapeSource
  //       id="origin"
  //       shape={MapboxGL.geoUtils.makePoint(TEMPLATE_COORDINATE)}>
  //       <MapboxGL.Animated.CircleLayer id="originInnerCircle" style={style} />
  //     </MapboxGL.ShapeSource>
  //   );
  // }

  render() {
    const filter = this.state.filter
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.map = ref }}
          // onPress={this.onPressMap}
          showUserLocation
        >
          <MapboxGL.VectorSource
            id="jobthai"
            url={config.MAPBOX_TILE_JSON}
          >
            <MapboxGL.CircleLayer
              id="job_list_layer"
              sourceID="jobthai"
              sourceLayerID="geojsonLayer"
              filter={filter}
              style={layerStyles.jobList}
            />
            <MapboxGL.CircleLayer
              id="job_list_layer_stroke"
              sourceID="jobthai"
              sourceLayerID="geojsonLayer"
              filter={filter}
              style={layerStyles.jobListStroke}
            />
          </MapboxGL.VectorSource>
        </MapView>
      </View>
    );
  }
}

const POI_COLOR = '#ff5c05'
const layerStyles = MapboxGL.StyleSheet.create({
  origin: {
    circleRadius: 5,
    circleColor: 'white',
  },
  destination: {
    circleRadius: 5,
    circleColor: 'white',
  },
  route: {
    lineColor: 'white',
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: '#314ccd',
    lineWidth: 3,
  },
  jobList: {
    circleRadius: 8,
    circleColor: POI_COLOR,
    circleStrokeWidth: 5,
    circleStrokeColor: POI_COLOR,
    circleStrokeOpacity: 0.3,
  },
  jobListStroke: {
    circleRadius: 18,
    circleColor: POI_COLOR,
    circleOpacity: 0,
  },
})


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
