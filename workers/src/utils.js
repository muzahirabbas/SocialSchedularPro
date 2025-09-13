
// Utility functions can be added here as needed.

export const formatError = (message, status = 500) => {
  return new Response(JSON.stringify({ error: message }), {
    status: status,
    headers: { 'Content-Type': 'application/json' },
  });
};
