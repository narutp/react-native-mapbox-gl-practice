
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import MapboxGL from 'react-native-mapmagic-gl'
import config from './config'
import MapView from './components/MapView'
import { lineString as makeLineString, multiLineString as makeMultiLineString } from '@turf/turf'
import Axios from 'axios';
import ApolloClient, { gql } from 'apollo-boost'
import ApolloProvider from 'react-apollo'

// const client = new ApolloClient({
//   uri: 'http://localhost:4000/graphql'
// })

const COORD_ORIGIN = [100.596212131283, 13.802003614469]
const COORD_DEST = [100.534788043111, 13.7284230074659]
const query = 
`
{
  coords(id: 1){
    id
    type
    distance
    time
    route {
      seq
      nameth
      geom
    }
  }
}
`
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      route: [],
      routeArr: [],
      filter: []
    }
  }

  async componentDidMount() {
    let getCoordRes
    // try {
    //   getCoordRes = await Axios.get('https://api-routing.mapmagic.co.th/v1/driving/route?src=13.802003614469, 100.596212131283&dst=13.7284230074659, 100.534788043111')
    // } catch(error) {
    //   console.log(error);
    // }
    try {
      getCoordRes = await Axios.post('http://localhost:4000/graphql', { query })
    } catch(error) {
      console.log(error);
    }
    console.log('get', getCoordRes.data.data)
    // console.log('Coordinates', getCoordRes.data.data[0])
    let routeArr = []
    let tempArr = []
    // For loop to push all coord in 1 array
    getCoordRes.data.data.coords.route.forEach((element) => {
      // Convert String to JSON
      let tempJSON = JSON.parse(element.geom)
      console.log('parse', tempJSON)
      // Push all JSON into temp array
      tempArr.push(tempJSON)
    });

    // console.log('temp arr', tempArr)
    for (let i = 0; i < tempArr.length; i++) {
      let route
      if (tempArr[i].type === 'LineString') {
        route = makeLineString(tempArr[i].coordinates)
      } else {
        route = makeMultiLineString(tempArr[i].coordinates)
      }
      routeArr.push(route)
      console.log('route arr', routeArr)
    }
    this.setState({
      route: routeArr
    })
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

  // origin circle
  renderOrigin = () => {
    return (
      <MapboxGL.ShapeSource
        id="origin"
        shape={MapboxGL.geoUtils.makePoint(COORD_ORIGIN)}>
        <MapboxGL.Animated.CircleLayer 
          id="originInnerCircle" 
          style={layerStyles.origin} 
        />
      </MapboxGL.ShapeSource>
    );
  }

  // destination circle
  renderDestination = () => {
    return (
      <MapboxGL.ShapeSource
        id="destination"
        shape={MapboxGL.geoUtils.makePoint(COORD_DEST)}>
        <MapboxGL.CircleLayer
          id="destinationInnerCircle"
          style={layerStyles.destination}
        />
      </MapboxGL.ShapeSource>
    )
  }

  renderRoute = (element, key) => {
    let component 
      component = (
        <MapboxGL.ShapeSource id={`routeSource-${key}`} shape={element} key={key}>
            <MapboxGL.LineLayer
              id={`routeFill-${key}`}
              style={layerStyles.route}
              belowLayerID="originInnerCircle"
            />
        </MapboxGL.ShapeSource>
      );
    return component
  }

  render() {
    const filter = this.state.filter
    return (
      // <ApolloProvider client={client}>
        <View style={styles.container}>
          <MapView
            ref={(ref) => { this.map = ref }}
            // onPress={this.onPressMap}
            showUserLocation
          >
            {this.renderOrigin()}
            { this.state.route && 
              this.state.route.map((element, key) => this.renderRoute(element, key))
            }
            {this.renderDestination()}

            {/* Job location */}

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
      // {/* </ApolloProvider> */}
    );
  }
}

const POI_COLOR = '#ff5c05'
const layerStyles = MapboxGL.StyleSheet.create({
  origin: {
    circleRadius: 10,
    circleColor: 'white',
  },
  destination: {
    circleRadius: 10,
    circleColor: 'white',
  },
  route: {
    lineColor: '#ff9d00',
    lineWidth: 6,
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
