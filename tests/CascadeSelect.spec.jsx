import expect from 'expect.js';
import React from 'react';
import $ from 'jquery';
import Enzyme from 'enzyme';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';
import CascadeSelect from '../src';
import Adapter from 'enzyme-adapter-react-15';

const { mount } = Enzyme;
Enzyme.configure({ adapter: new Adapter() });

const options = [{
  value: 'alibaba',
  label: '阿里巴巴',
  children: [{
    value: 'platform',
    label: '信息平台',
    children: [{
      value: 'fe',
      label: '前端开发',
    }],
  }],
}, {
  value: 'beijing',
  label: '日本',
  children: [{
    value: 'xicheng',
    label: '西城',
    children: [
      // {
      //   value: 'zhonggc',
      //   label: '中观村大街',
      // },
    ],
  }],
}, {
  value: 'tianjin',
  label: '天津',
  children: [{
    value: 'heping',
    label: '和平区',
    children: [{
      value: 'nanjinglu',
      label: '南京路',
    }],
  }, {
    value: 'hexi',
    label: '河西区',
    children: [{
      value: 'dagu',
      label: '大沽路',
    }],
  }],
}, {
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖',
    }],
  }],
}, {
  value: 'jiangsu',
  label: '江苏',
  children: [{
    value: 'nanjing',
    label: '南京',
    children: [{
      value: 'zhonghuamen',
      label: '中华门',
    }],
  }],
}];

describe('CascadeSelect', () => {
  let instance;
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should display placeholder', () => {
    instance = render(<CascadeSelect placeholder="请选择" />, div);
    expect($(findDOMNode(instance)).find('.kuma-cascader-placeholder').html()).to.equal('请选择');
  });

  it('should add the custom className', () => {
    instance = render(<CascadeSelect className="abc" />, div);
    expect($(findDOMNode(instance))[0].className.indexOf('abc') > -1).to.be.ok();
  });

  it('should have a sub menu', () => {
    const wrapper = mount(<CascadeSelect options={options} />);
    wrapper.simulate('change');
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    expect(dropdownWrapper.length > 0).to.be.ok();
  });

  it('should have the defaultValue', () => {
    instance = render(<CascadeSelect options={options} defaultValue={['alibaba', 'platform', 'fe']} />, div);
    expect($(findDOMNode(instance)).find('.kuma-cascader-trigger').attr('title')).to.eql('阿里巴巴 / 信息平台 / 前端开发');
  });

  it('onChange should be called successfully', () => {
    const wrapper = mount(
      <CascadeSelect
        options={options}
        onChange={(value, selected) => {
          expect(value.length === selected.length).to.be.ok();
        }}
      />
    );
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    mount(dropdownWrapper.props().overlay).props().onItemClick();
  });

  it('should be disabled', () => {
    instance = render(<CascadeSelect options={options} disabled />, div);
    expect($(findDOMNode(instance))[0].className.indexOf('kuma-cascader-disabled') > -1).to.be.ok();
  });

  it('should be clearable', () => {
    const wrapper = mount(<CascadeSelect options={options} clearable />);
    wrapper.find('.kuma-icon-error').simulate('click');
    expect(wrapper.find('.kuma-cascader-placeholder').text()).to.eql('请选择');
  });

  it('expandTrigger', () => {
    const wrapper = mount(<CascadeSelect options={options} expandTrigger="hover" />);
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    expect(mount(dropdownWrapper.props().overlay).props().expandTrigger).to.eql('hover');
  });

  it('onItemClick', () => {
    const wrapper = mount(<CascadeSelect options={options} />);
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    mount(dropdownWrapper.props().overlay)
      .find('li')
      .at(0)
      .simulate('click');
    const option = mount(dropdownWrapper.props().overlay).props().options[0];
    mount(dropdownWrapper.props().overlay).props().onItemClick(option, 2, false);
    expect(wrapper.state('value').length > 0).to.be.ok();
  });

  it('onItemHover', () => {
    const wrapper = mount(<CascadeSelect options={options} expandTrigger="hover" />);
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    mount(dropdownWrapper.props().overlay)
      .find('li')
      .at(0)
      .simulate('mouseover');
    const option = mount(dropdownWrapper.props().overlay).props().options[0];
    mount(dropdownWrapper.props().overlay).props().onItemClick(option, 2, false);
    expect(wrapper.state('value').length > 0).to.be.ok();
  });

  it('render sunmenus value renderArr', (done) => {
    const wrapper = mount(<CascadeSelect options={options} defaultValue={['alibaba', 'platform', 'fe']} />);
    const dropdownWrapper = mount(wrapper.find('Trigger').getElement());
    const value = mount(dropdownWrapper.props().overlay).props().value;
    expect(value.length).to.eql(mount(dropdownWrapper.props().overlay).find('ul').length);
    done();
  });

  it('array contains single item as the value - case 1', (done) => {
    instance = render(<CascadeSelect options={options} value={['nanjinglu']} />, div);
    expect($(findDOMNode(instance)).find('.kuma-cascader-trigger').text()).to.eql('天津 / 和平区 / 南京路');
    done();
  });

  it('array contains single item as the value - case 2', (done) => {
    instance = render(<CascadeSelect options={options} value={['xicheng']} />, div);
    expect($(findDOMNode(instance)).find('.kuma-cascader-trigger').text()).to.eql('日本 / 西城');
    done();
  });
});
