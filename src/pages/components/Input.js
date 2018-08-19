import React, { Component } from 'react';

import { 
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text
} from 'react-native';

export default class Input extends Component {
    render() {
        return(
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    underlineColorAndroid="transparent"    
                />
                <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.button}>Enviar</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        height: 42,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#fafafa',
        borderTopWidth: StyleSheet.hairLineWidth,
        borderTopColor: '#CCC',
        flexDirection: 'row',
        alignItems: 'center',
    },

    input: {
        flex: 1,
        height: 30,
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
    },

    button: {
        marginLeft: 10,
        color: '#358cFF',
        fontWeight: 'bold',
    }
});
