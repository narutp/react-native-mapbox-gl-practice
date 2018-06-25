
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapboxGL from 'react-native-mapmagic-gl'
import config from './config'
import MapView from './components/MapView'
import { lineString as makeLineString, multiLineString as makeMultiLineString } from '@turf/turf'
import Axios from 'axios';

const COORD_ORIGIN = [100.596212131283, 13.802003614469]
const COORD_DEST = [100.534788043111, 13.7284230074659]

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      route: null,
      routeArr: [],
      filter: []
    }
  }

  async componentDidMount() {
    let getCoordRes
    try {
      getCoordRes = await Axios.get('https://api-routing.mapmagic.co.th/v1/driving/route?src=13.802003614469, 100.596212131283&dst=13.7284230074659, 100.534788043111')
    } catch(error) {
      console.log(error);
    }
    console.log('Coordinates', getCoordRes.data.data[0])

    let tempArr = []
    // // For loop to push all coord in 1 array
    getCoordRes.data.data[0].route.forEach((element) => {
      // Convert String to JSON
      let tempJSON = JSON.parse(element.geom)
      console.log('parse', tempJSON)
      // Push all JSON into temp array
      tempArr.push(tempJSON)
    });
    console.log('temp arr', tempArr)
    // // For loop an array containing JSON
    // tempArr.forEach((e) => {
    //   // Push the element inside array into the route array
    //   routeArr.push(e.coordinates)
    // })
    for (let i = 0; i < tempArr.length; i++) {
      console.log(i)
      let route = makeLineString(tempArr[0].coordinates)
      console.log('route', route)
      
      this.renderRoute(route)
    }
    let coordParse = JSON.parse(getCoordRes.data.data[0].route[0].geom)
      console.log('Coordinates after parse', coordParse.coordinates)
      console.log('Make line', makeLineString(coordParse.coordinates))
    // console.log('Coordinates deep', getCoordRes.data.data[0].route[0].geom)
    // let coordParse = JSON.parse(getCoordRes.data.data[0].route[0].geom)
    // console.log('Coordinates after parse', coordParse.coordinates)
    // this.setState({
    //   route: makeLineString(coordParse)
    // })
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

  renderOrigin = () => {
    console.log('render origin')
    let backgroundColor = 'yellow';
    const style = [layerStyles.origin, { circleColor: backgroundColor }];

    return (
      <MapboxGL.ShapeSource
        id="origin"
        shape={MapboxGL.geoUtils.makePoint(COORD_ORIGIN)}>
        <MapboxGL.Animated.CircleLayer id="originInnerCircle" style={style} />
      </MapboxGL.ShapeSource>
    );
  }

  renderRoute = (route) => {
    console.log('in', route);
    if (!route) {
      return null;
    }
    return (
      <MapboxGL.ShapeSource id="routeSource" shape={route}>
        <MapboxGL.LineLayer
          id="routeFill"
          style={layerStyles.route}
          belowLayerID="originInnerCircle"
        />
      </MapboxGL.ShapeSource>
    );
  }

  render() {
    const filter = this.state.filter
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.map = ref }}
          // onPress={this.onPressMap}
          // showUserLocation
        >
          {this.renderOrigin()}
          {this.renderRoute()}
          <MapboxGL.ShapeSource
            id="destination"
            shape={MapboxGL.geoUtils.makePoint(COORD_DEST)}>
            <MapboxGL.CircleLayer
              id="destinationInnerCircle"
              style={layerStyles.destination}
            />
          </MapboxGL.ShapeSource>
          {/* <MapboxGL.VectorSource
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
          </MapboxGL.VectorSource> */}
        </MapView>
      </View>
    );
  }
}

const POI_COLOR = '#ff5c05'
const layerStyles = MapboxGL.StyleSheet.create({
  origin: {
    circleRadius: 7,
    circleColor: 'yellow',
  },
  destination: {
    circleRadius: 7,
    circleColor: 'yellow',
  },
  route: {
    lineColor: 'white',
    lineWidth: 5,
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
