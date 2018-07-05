import React from 'react'
import App from '../App'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

describe('App component', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallow(<App />)
    })

    // Check MapView tag
    it('Check <MapView> tag', () => {
        expect(wrapper.find('MapView')).toHaveLength(1)
    })

    // Check View tag
    // it('Check <View> tag', () => {
    //     expect(wrapper.find('View')).toHaveLength(1)
    // })

    // Check the snapshot in App component
    it('<App /> match snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('start with route array of nothing', () => {
        const routeArray = wrapper.state().route
        const array = []
        expect(routeArray).toEqual(array)
    })
})
