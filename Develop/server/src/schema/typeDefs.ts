const typeDefs = `
    type me: User

    type Books {
        id: ID!
        title: String
        author: String
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Books]
    }

    type Auth {
        token: ID!
        user: [User]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: BookInput): User
        removeBook(bookId: ID!): User
    }
      
    type Query {
        users: [User]
        books: [Books]
    }
`;

export default typeDefs;
