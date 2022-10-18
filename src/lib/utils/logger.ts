const info = (...params: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...params);
  }
};

const error = (...params: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...params);
  }
};

export const logger = {
  info,
  error,
};