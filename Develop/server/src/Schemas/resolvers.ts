import { AuthinticationError } from 'apollo-server-express';
import { BookSchema , User } from '../models/User';
import { signToken } from '../services/auth';
import bcrypt from 'bcrypt';

const resolvers = {
    Query: {
        me: async (_: any, args: any, context: { user: any }) => {
            if(context.user){
                const userData = await User.findOne({_id: context.user._id})
                .select('-__v -password')
                return userData;
            }
            throw new AuthinticationError('Not logged in');
        }
    },
    Mutation: {
        login: async (_: any, { email, password }: { email: string, password: string }) => {
            const user = await User.findOne({email});
            if(!user){
                throw new AuthinticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw){
                throw new AuthinticationError('Incorrect credentials');
            }

            const token = signToken(user.username, user.email, user._id);
            return {token, user};
        },
        addUser: async (_: any, { username, email, password }: { username: string, email: string, password: string }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.email, user._id);
            return {token, user};
        },
        saveBook: async (_: any, { input }: { input: any}, context: { user: any } ) => {
            if (context.user){
                const updatedUser = await User.findOneAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new AuthinticationError('You need to be logged in!');
        },
        removeBook: async (_: any, { bookId }: { bookId: string }, context: { user: any }) => {
            if(context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new AuthinticationError('You need to be logged in!');
        }, 
    }
};

export default resolvers;