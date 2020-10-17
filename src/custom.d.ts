declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  export interface Request {
    userID: string;
    userEmail: string;
    userFirstname: string;
    userLastname: string;
    role: string;
  }
}
declare module 'migrate' {}
