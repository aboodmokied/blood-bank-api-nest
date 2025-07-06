export type AuthPayload={
    sub:number;
    email:string;
    role:Role;
    jti: any,
}

export type Role = 'admin' | 'user';
