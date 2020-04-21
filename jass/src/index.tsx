import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import { Server, Response } from 'miragejs';
import GameMocks from './classes/GameMocks';

const timeout = 2000;

new Server({
  routes() {
    this.namespace = 'api/v1';
    
    this.get('/team', (schema: any, request: Request) => {
      return new Response(200, {}, [
        {
          id: 0,
          name: 'babos'
        },
        {
          id: 1,
          name: 'brattas'
        },
        {
          id: 2,
          name: 'brudas'
        },
        {
          id: 3,
          name: 'bestis'
        }
      ]);
    }, { timing: timeout });

    this.post('/team', () => {
      return new Response(201, {}, {id:20});
    }, { timing: timeout });

    this.get('/game', (schema: any, request: Request) => {
      return new Response(200, {},  GameMocks);
    }, { timing: timeout });

    this.post('/game', (schema: any, request: Request) => {
      return new Response(201, {}, {
        id: 56
      });
    }, { timing: timeout });

  }
});
ReactDOM.render(<App />, document.getElementById('root'));