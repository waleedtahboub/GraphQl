import db from '../database/db.js';

export const resolvers = { 
    Query: {
        games() {
            return db.games;
        },
        game(_: any, args: { id: string }) {
            return db.games.find((game) => game.id === args.id);
        },
        authors() {
            return db.authors;
        },
        author(_: any, args: { id: string }) {
            return db.authors.find((author) => author.id === args.id);
        },
        reviews() {
            return db.reviews;
        },
        review(_: any, args: { id: string }) {
            return db.reviews.find((review) => review.id === args.id);
        },
    },
    Game: {
        reviews(parent: any) {
            return db.reviews.filter((r) => r.game_id === parent.id);
        }
    },
    Review: {
        author(parent: any) {
            return db.authors.find((a) => a.id === parent.author_id);
        },
        game(parent: any) {
            return db.games.find((g) => g.id === parent.game_id);
        }
    },
    Author: {
        reviews(parent: any) {
            return db.reviews.filter((r) => r.author_id === parent.id);
        },
    },
    Mutation: { 
        deleteGame(_: any, args: { id: string }) {
            db.games = db.games.filter((game) => game.id !== args.id);
            return db.games;
        },
        addGame(_: any, args: { game: { title: string, platform: string[] } }) {
            let newGame = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString()
            };
            db.games.push(newGame);
            return newGame;
        },
        updateGame(_: any, args: { id: string, edit: { title?: string, platform?: string[] } }) {
            db.games = db.games.map((g) => {
                if (g.id === args.id) {
                    return { ...g, ...args.edit };
                }
                return g;
            });
            return db.games.find((g) => g.id === args.id);
        } 
    }
};