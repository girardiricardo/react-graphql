import React, { Component } from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { 
    View,
    Text,
    Platform,
    ScrollView,
    StyleSheet,
    Dimensions,
    StatusBar,
    ActivityIndicator,
    KeyboardAvoidingView
} from 'react-native';

import Input from './components/Input';

StatusBar.setBarStyle('light-content');

const author = 'Ricardo';

class Chat extends Component {
    componentDidMount() {
        this.props.conversation.subscribeToMore({
            document: gql`
                subscription onMessageAdded($author: String!) {
                    Message(filter: {
                        mutation_in: [CREATED]
                        node: {
                            from_not: $author
                        }
                    }) { 
                            node {
                                id
                                from
                                message
                            }
                        }
                }
            `,
            variables: {
                author,
            },
            updateQuery: (prev, { subscriptionData }) => {
                if(!subscriptionData.data['Message']) return prev;

                const newItem = subscriptionData.data['Message'].node;

                return { ...prev, allMessages: [ ...prev.allMessages, newItem ] };
            }
        });
    }

    componentDidUpdate() {
        setTimeout(() => {
            this._scrollView.scrollToEnd();
        }, 0);
    };

    handleAddMessage = (proxy, { data: { createMessage } }) => {
        const data = proxy.readQuery({
            query: ConversationQuery,
        });

        data.allMessages.push(createMessage);

        proxy.writeQuery({
            query: ConversationQuery,
            data
        });
    };

    renderChat = () => (
        this.props.conversation.allMessages.map(item => (
            <View
                key={item.id}
                style={[
                    styles.bubble, 
                    item.from === author ? styles['bubble-right'] : styles['bubble-left']
                ]}
                >
                <Text style={styles.author}>{item.from}</Text>
                <Text style={styles.message}>{item.message}</Text>
            </View>
        ))
    );

    render() {
        return(
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={'padding'}
            >
                <ScrollView 
                    contentContainerStyle={styles.conversation}
                    ref={scrollView => this._scrollView = scrollView}
                >
                    { this.props.conversation.loading 
                        ? <ActivityIndicator style={styles.loading} color="#FFF" />
                        : this.renderChat() 
                    }
                </ScrollView>
                <Input author={author} onAddMessage={this.handleAddMessage} />
            </KeyboardAvoidingView>
        );
    }
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c4241',
        ...Platform.select({
            ios: { paddingTop: 20 },
            android: { paddingTop: 20 }
        }),
    },

    conversation: {
        padding: 10,
    },

    bubble: {
        padding: 6,
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 0,
        marginTop: 10,
        maxWidth: width - 60,
    },

    'bubble-right': {
        alignSelf: 'flex-end',
        backgroundColor: '#D1EDC1',
    },

    'bubble-left': {
        alignSelf: 'flex-start',
    },

    author: {
        fontWeight: 'bold',
        marginBottom: 3,
        color: '#333',
    },

    message: {
        fontSize: 16,
        color: '#333',
    },

    loading: {
        marginTop: 10,
    }
});

const ConversationQuery = gql`
    query {
        allMessages(
            orderBy: createdAt_ASC
        ) {
            id
            from
            message
        }
    }
`;

export default graphql(ConversationQuery, { name: 'conversation' })(Chat);