import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { 
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text
} from 'react-native';

class Input extends Component {
    state = {
        message: '',
    }

    handleAddMessage = async () => {
        const { message } = this.state;
        const { author } = this.props;

        if(message.length > 0){
            const newMessage = await this.props.addMessage({
                author,
                message,
            })
        }

        this.setState({ message: '' });
    }

    render() {
        return(
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    value={this.state.message}
                    onChangeText={message => this.setState({ message })}   
                />
                <TouchableOpacity onPress={(this.handleAddMessage)}>
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

const MessageMutation = gql`
    mutation(
        $author: String!
        $message: String!
    ) {
        createMessage(
            from: $author,
            message: $message,
        ) {
            id
            from
            message
        }
    }
`;

export default graphql(MessageMutation, { 
    props: ({ ownProps, mutate }) => ({
        addMessage: ({ author, message }) => mutate({
            variables: { author, message },
            update: ownProps.onAddMessage,
        }) 
    }),
})(Input);
