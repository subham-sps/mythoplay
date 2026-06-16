// Vercel serverless entry point.
// All incoming requests are rewritten to this file by vercel.json
// (see the root "rewrites" rule). The underlying Express app handles
// routing internally.
module.exports = require('../src/index.js');
