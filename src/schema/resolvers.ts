import { games,authors,reviews } from "../database/db.js"; '/src/database/db.ts';
import { typeDefs } from "./schema.js";
const resolvers = { 
      Query: {
        games() {
            return games
        },

        authors(){
            return authors;
        },
        reviews(){
            return reviews;
        }
      }
    
}