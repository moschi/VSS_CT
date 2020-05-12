import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import { Server, Response } from 'miragejs';
import GameMocks from './classes/GameMocks';

if (process.env.NODE_ENV !== 'production') {
    const timeout = 20;
    interface Reg {
        params: {
            id: number
        }
    }
    new Server({
        routes() {
            this.namespace = '/v1';

            this.get(
                '/team',
                (schema: any, request: Request) => {
                    return new Response(200, {}, [
                        {
                            id: 0,
                            name: 'babos',
                        },
                        {
                            id: 1,
                            name: 'brattas',
                        },
                        {
                            id: 2,
                            name: 'brudas',
                        },
                        {
                            id: 3,
                            name: 'bestis',
                        },
                    ]);
                },
                { timing: timeout }
            );

            this.post(
                '/team',
                () => {
                    return new Response(201, {}, { id: 20 });
                },
                { timing: timeout }
            );

            this.get(
                '/game',
                (schema: any, request: Request) => {
                    return new Response(200, {}, GameMocks);
                },
                { timing: timeout }
            );

            this.get(
                '/game/0',
                (schema: any, request: Request) => {
                    return new Response(200, {}, GameMocks[0]);
                },
                { timing: timeout }
            );

            this.delete(
                '/game/:id',
                (schema: any, request: Reg) => {
                    return new Response(204, {});
                },
                { timing: timeout }
            );

            this.post(
                '/game',
                (schema: any, request: Request) => {
                    return new Response(
                        201,
                        {},
                        {
                            id: 0,
                        }
                    );
                },
                { timing: timeout }
            );
            this.put(
                '/game/:id',
                (schema: any, request: Reg) => {
                    return new Response(
                        200,
                        {},
                    );
                },
                { timing: timeout }
            );

            this.post(
                'game/0/round',
                () => {
                    return new Response(201, {}, '6');
                },
                { timing: timeout }
            );

            this.post(
                'game/0/6',
                () => {
                    return new Response(201, {});
                },
                { timing: timeout }
            );
        },
    });
}

ReactDOM.render(<App />, document.getElementById('root'));
