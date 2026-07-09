
const https = require('https');
const fs = require('fs');
const path = require('path');

// Read the seedProducts.js file
const seedPath = path.join(__dirname, 'seed', 'seedProducts.js');
const seedContent = fs.readFileSync(seedPath, 'utf8');

// Extract the helper functions and products array
const helpersMatch = seedContent.match(/(const generateSKU[\s\S]*?)(?=const products = \[)/);
const helpers = helpersMatch ? helpersMatch[1] : '';

const productsMatch = seedContent.match(/const products = \[([\s\S]*?)\];\s*const normalizedProducts/);
if (!productsMatch) {
  console.error('Could not find products array in seedProducts.js');
  process.exit(1);
}

// Now, let's create a temporary file to evaluate the products array
const tempCode = `
${helpers}
const products = [${productsMatch[1]}];
module.exports = products;
`;

const tempPath = path.join(__dirname, 'tempProducts.js');
fs.writeFileSync(tempPath, tempCode);

// Now require the temp file to get products
const products = require(tempPath);

// Clean up temp file
fs.unlinkSync(tempPath);

console.log(`Found ${products.length} products to check...`);

// Function to check a single URL
const checkUrl = (url) => {
  return new Promise((resolve) => {
    const options = {
      method: 'GET',
      timeout: 10000,
    };

    const req = https.request(url, options, (res) => {
      res.destroy(); // Don't download the whole file
      resolve({ statusCode: res.statusCode, url });
    });

    req.on('error', (err) => {
      resolve({ statusCode: null, error: err.message, url });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: null, error: 'Request timeout', url });
    });

    req.end();
  });
};

// Collect all unique image URLs (main image, thumbnail, images array)
const imageUrls = new Map(); // key: url, value: product names using this url

products.forEach((product) => {
  const urlsToCheck = [];
  if (product.image) urlsToCheck.push(product.image);
  if (product.thumbnail) urlsToCheck.push(product.thumbnail);
  if (product.images && Array.isArray(product.images)) {
    urlsToCheck.push(...product.images);
  }

  urlsToCheck.forEach((url) => {
    if (!imageUrls.has(url)) {
      imageUrls.set(url, []);
    }
    imageUrls.get(url).push(product.name);
  });
});

console.log(`Checking ${imageUrls.size} unique URLs...`);

// Run checks in batches to prevent timeouts
const batchSize = 10;
const urlArray = Array.from(imageUrls.keys());
const results = [];

async function processBatches() {
  for (let i = 0; i < urlArray.length; i += batchSize) {
    const batch = urlArray.slice(i, i + batchSize);
    console.log(`Checking batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(urlArray.length / batchSize)} (${batch.length} URLs)...`);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const broken = results.filter((result) => !result.statusCode || result.statusCode >= 400);
  if (broken.length === 0) {
    console.log('\n✅ All images are working perfectly! 100% success!');
  } else {
    console.log(`\n❌ Found ${broken.length} broken URLs:\n`);
    broken.forEach((item) => {
      const productNames = imageUrls.get(item.url);
      console.log(`- Products: ${productNames.join(', ')}`);
      console.log(`  URL: ${item.url}`);
      console.log(`  Status: ${item.statusCode || 'Error - ' + item.error}\n`);
    });
  }

  // Also save results to a file for reference
  fs.writeFileSync(
    path.join(__dirname, 'imageCheckResults.json'),
    JSON.stringify({ all: results, broken }, null, 2)
  );
  console.log('Results saved to imageCheckResults.json');
}

processBatches().catch((err) => {
  console.error('Error running checks:', err);
  process.exit(1);
});
