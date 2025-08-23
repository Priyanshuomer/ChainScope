// Test script to check API data fetching
const { ChainListAPI } = require('./src/lib/api.ts');

async function testAPI() {
  console.log('🧪 Testing ChainListAPI...');
  
  const api = new ChainListAPI();
  
  try {
    console.log('🔄 Fetching chains...');
    const startTime = Date.now();
    const chains = await api.fetchChains();
    const endTime = Date.now();
    
    console.log(`✅ Fetched ${chains.length} chains in ${endTime - startTime}ms`);
    
    // Check if we got live data or fallback data
    if (chains.length > 100) {
      console.log('🎉 SUCCESS: Got live data from external APIs!');
    } else {
      console.log('⚠️ WARNING: Got fallback data (static chains)');
    }
    
    // Show first few chains
    console.log('\n📋 First 5 chains:');
    chains.slice(0, 5).forEach((chain, index) => {
      console.log(`${index + 1}. ${chain.name} (ID: ${chain.chainId})`);
    });
    
    // Check data source
    const uniqueSources = [...new Set(chains.map(c => c.dataSource))];
    console.log(`\n📊 Data sources: ${uniqueSources.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testAPI();
