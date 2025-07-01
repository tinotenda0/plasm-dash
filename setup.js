#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Blog Dashboard Setup');
console.log('=======================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setup() {
  try {
    console.log('This script will help you set up your environment variables.\n');
    
    const projectId = await askQuestion('Enter your Sanity Project ID: ');
    const dataset = await askQuestion('Enter your Sanity Dataset (default: production): ') || 'production';
    const apiVersion = await askQuestion('Enter your Sanity API Version (default: 2024-03-15): ') || '2024-03-15';
    const token = await askQuestion('Enter your Sanity API Token: ');
    
    const envContent = `# Sanity Configuration
SANITY_PROJECT_ID=${projectId}
SANITY_DATASET=${dataset}
SANITY_API_VERSION=${apiVersion}
SANITY_TOKEN=${token}

# Next.js Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=${projectId}
NEXT_PUBLIC_SANITY_DATASET=${dataset}
`;

    fs.writeFileSync('.env.local', envContent);
    
    console.log('\n✅ Environment variables saved to .env.local');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure your Sanity project has the correct schema (see sanity-schema-example.js)');
    console.log('2. Run "npm run dev" to start the development server');
    console.log('3. Visit http://localhost:3000 to use your dashboard');
    console.log('\n🎉 Setup complete! Happy blogging!');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    rl.close();
  }
}

setup();
