/**
 * Example: Query ChatGPT with Scrapeless Browser
 *
 * This example demonstrates how to use the ChatGPT query service
 * to get responses with citations for GEO (Generative Engine Optimization) analysis.
 */

const API_URL = 'http://localhost:3000/api/chatgpt/query';

/**
 * Single query example
 */
async function singleQuery() {
  console.log('🔍 Querying ChatGPT: Single Question\n');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: 'What are the best features of Trae.ai for startups?',
      proxyCountry: 'US',
      webSearch: true,
      answerType: 'text',
    }),
  });

  const data = await response.json();

  if (data.success) {
    console.log('✅ Query successful!\n');
    console.log(`Question: ${data.prompt}`);
    console.log(`Duration: ${data.duration}s`);
    console.log(`Country: ${data.countryCode}\n`);
    console.log(`Answer: ${data.answer}\n`);

    if (data.citations && data.citations.length > 0) {
      console.log(`📚 Citations (${data.citations.length}):`);
      data.citations.forEach((citation: any, index: number) => {
        console.log(`  ${index + 1}. ${citation.title}`);
        console.log(`     ${citation.url}\n`);
      });
    }

    if (data.linksAttached && data.linksAttached.length > 0) {
      console.log(`🔗 Links Attached (${data.linksAttached.length}):`);
      data.linksAttached.slice(0, 5).forEach((link: any) => {
        console.log(`  - ${link.text}: ${link.url}`);
      });
    }

    if (data.products && data.products.length > 0) {
      console.log(`\n🛍️  Products (${data.products.length}):`);
      data.products.forEach((product: any) => {
        console.log(`  - ${product.title}: ${product.url}`);
      });
    }
  } else {
    console.error('❌ Query failed:', data.errorReason);
  }
}

/**
 * Batch queries for GEO analysis
 */
async function batchQueries() {
  console.log('\n\n🔍 Batch Querying ChatGPT for GEO Analysis\n');

  const questions = [
    'What is the best AI automation tool?',
    'Compare AI automation platforms',
    'Top AI solutions for enterprise',
  ];

  console.log(`Running ${questions.length} queries...\n`);

  const results = await Promise.all(
    questions.map(async (prompt) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          proxyCountry: 'US',
          webSearch: true,
        }),
      });
      return response.json();
    })
  );

  console.log('✅ All queries completed!\n');
  console.log('GEO Analysis Summary:');
  console.log('='.repeat(80));

  results.forEach((result, index) => {
    if (result.success) {
      const brandMentioned = result.answer?.toLowerCase().includes('trae.ai');
      console.log(`\nQ${index + 1}: ${result.prompt}`);
      console.log(`  Brand mentioned: ${brandMentioned ? '✅' : '❌'}`);
      console.log(`  Citations: ${result.citations?.length || 0}`);
      console.log(`  Products: ${result.products?.length || 0}`);
      console.log(`  Links: ${result.linksAttached?.length || 0}`);
      console.log(`  Duration: ${result.duration}s`);
    } else {
      console.log(`\nQ${index + 1}: ${result.prompt}`);
      console.log(`  ❌ Failed: ${result.errorReason}`);
    }
  });

  console.log('\n' + '='.repeat(80));
}

/**
 * Multi-region testing
 */
async function multiRegionQuery() {
  console.log('\n\n🌍 Multi-Region Testing\n');

  const countries = ['US', 'UK', 'JP'];
  const prompt = 'Best AI automation tools';

  console.log(`Testing prompt: "${prompt}"`);
  console.log(`Regions: ${countries.join(', ')}\n`);

  const results = await Promise.all(
    countries.map(async (country) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          proxyCountry: country,
          webSearch: true,
        }),
      });
      return { country, data: await response.json() };
    })
  );

  console.log('Regional Analysis:');
  console.log('='.repeat(80));

  results.forEach(({ country, data }) => {
    if (data.success) {
      console.log(`\n🌍 ${country}:`);
      console.log(`  Answer length: ${data.answer?.length || 0} chars`);
      console.log(`  Citations: ${data.citations?.length || 0}`);
      console.log(`  Products: ${data.products?.length || 0}`);
      console.log(`  Duration: ${data.duration}s`);

      if (data.citations && data.citations.length > 0) {
        console.log(`  Top citation: ${data.citations[0].title}`);
      }
    } else {
      console.log(`\n🌍 ${country}:`);
      console.log(`  ❌ Failed: ${data.errorReason}`);
    }
  });

  console.log('\n' + '='.repeat(80));
}

/**
 * Export results to CSV format
 */
async function exportToCSV() {
  console.log('\n\n📊 Export Results for Analysis\n');

  const questions = [
    'What is ABCProxy?',
    'Best proxy services',
  ];

  const results = await Promise.all(
    questions.map(async (prompt) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, proxyCountry: 'US' }),
      });
      return response.json();
    })
  );

  // Create CSV-like data
  console.log('CSV Preview:');
  console.log('prompt,answer_length,citations,products,links,brand_mentioned');

  results.forEach((result) => {
    if (result.success) {
      const brandMentioned = result.answer?.toLowerCase().includes('abcproxy') ? 1 : 0;
      console.log([
        `"${result.prompt}"`,
        result.answer?.length || 0,
        result.citations?.length || 0,
        result.products?.length || 0,
        result.linksAttached?.length || 0,
        brandMentioned,
      ].join(','));
    }
  });

  console.log('\nℹ️  Use https://csvjson.com/json2csv to convert full JSON to CSV\n');
}

// Run examples
async function main() {
  console.log('🚀 ChatGPT Query Examples with Scrapeless Browser\n');
  console.log('Make sure the server is running: bun run dev\n');
  console.log('='.repeat(80));

  try {
    // Run single query
    await singleQuery();

    // Uncomment to run batch queries
    // await batchQueries();

    // Uncomment to test multiple regions
    // await multiRegionQuery();

    // Uncomment to see CSV export example
    // await exportToCSV();

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.log('\nMake sure:');
    console.log('1. Server is running (bun run dev)');
    console.log('2. SCRAPELESS_API_KEY is set');
    console.log('3. puppeteer-core is installed');
  }
}

// Run if executed directly
if (import.meta.main) {
  main();
}

export { singleQuery, batchQueries, multiRegionQuery, exportToCSV };
