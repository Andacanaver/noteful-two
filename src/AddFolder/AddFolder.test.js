import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import AddFolder from "./AddFolder";

describe('AddFolder Component', () => {
    it('renders a .AddFolder by default', () => {
        const wrapper = shallow(<AddFolder />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })
    
})