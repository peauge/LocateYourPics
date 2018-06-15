'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import CreateClass from 'create-react-class';

var SegmentedControlAndroid = CreateClass({
    getInitialState: function () {
        return {
            values: this.props.values || [],
            selectedIndex: this.props.selectedIndex || 0,
            style: this.props.style || {},
            onChange: this.props.onChange
        };
    },

    componentWillReceiveProps: function (props) {
        this.setState(props);
    },

    onPress: function (selectedIndex) {
        if (typeof this.state.onChange === 'function') {
            return this.state.onChange(selectedIndex);
        }
    },

    render: function () {
        return (
            <View style={[{flexDirection: 'row', borderWidth: 1, borderColor: '#007AFF', borderRadius: 5}, this.state.style]}>
                {this.state.values.map(function (value, position, values) {
                    return (
                        <TouchableOpacity key={position} onPress={()=>this.onPress(position)} style={{flex: 1}}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 5,
                            backgroundColor: this.state.selectedIndex == position ? '#0D47A1' : '#007AFF',
                            borderRightWidth: position < values.length - 1 ? 1 : 0, borderRightColor: '#0D47A1'}}>
                                <Text style={{fontSize: 15, color: this.state.selectedIndex == position ? 'white' : 'white'}}>{value}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }.bind(this))}
            </View>
        );
    }
});

module.exports = SegmentedControlAndroid;
