export interface Payload {
    sub: number;
    email: string;
    nome: string,
    reset?: boolean,
    iat?: number
    exp?: number
}