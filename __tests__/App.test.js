import React from 'react'
import App from '../App'
import { shallow } from 'enzyme'
// import renderer from 'react-test-renderer'

// test('render app correctly', () => {
//     const tree = renderer.create(<App/>).toJSON()
//     expect(tree).toMatchSnapshot()
// })

describe('App component', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallow(<App/>)
    })

    it('Check <View> tag', () => {
        expect(wrapper.find('MapView')).toHaveLength(1)
    })
    // it('<App /> match snapshot', () => {
    //     expect(wrapper.html()).toMatchSnapshot()
    // })
})
