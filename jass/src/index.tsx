import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import { Server } from "miragejs";
import GameMocks from "./classes/GameMocks";

new Server({
  routes() {
    this.namespace = 'graphql';
    this.post("/", (schema: any, request:any) => {
      console.log(JSON.parse(request.requestBody));
      return {
        data: {
          games: GameMocks
        }
      };
    });
  }
});
ReactDOM.render(<App />, document.getElementById('root'));