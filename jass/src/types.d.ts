declare module 'miragejs';

interface Message {
    show: boolean;
    message: string;
    error?: ErrorEvent;
}