async function globalTeardown() {
  // Server will be automatically cleaned up when process exits
  console.log('Shutting down mock server');
}

export default globalTeardown;
