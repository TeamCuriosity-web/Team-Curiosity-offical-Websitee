async function test() { 
    try { 
        console.log('Fetching from https:
        const res = await fetch('https:
        console.log('Status:', res.status); 
        const data = await res.json();
        console.log('Data:', JSON.stringify(data, null, 2)); 
    } catch (e) { 
        console.error('Error:', e.message); 
    } 
} 
test();
