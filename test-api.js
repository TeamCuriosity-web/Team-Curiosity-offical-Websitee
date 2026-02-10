async function test() { 
    try { 
        console.log('Fetching from https://team-curiosity-offical-websitee.onrender.com/api/team...');
        const res = await fetch('https://team-curiosity-offical-websitee.onrender.com/api/team'); 
        console.log('Status:', res.status); 
        const data = await res.json();
        console.log('Data:', JSON.stringify(data, null, 2)); 
    } catch (e) { 
        console.error('Error:', e.message); 
    } 
} 
test();
