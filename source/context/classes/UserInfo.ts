export default class UserInfo<meta extends object> {
    constructor(
        public userID: string,
        public username: string,
        public metadata: meta
    ) { };
};