export const SECRET = process.env.SECRET;
export const SALTROUNDS = 10;
export const MONGODB_URI = process.env.NODE_ENV !== 'production' ? process.env.PROD_MONGODB_URI : process.env.TEST_MONGODB_URI;