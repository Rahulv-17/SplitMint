async function testLive() {
  console.log('--- Starting Live Test ---');
  try {
    // 1. Register User
    console.log('1. Registering user...');
    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const registerData = await registerRes.json();
    if (!registerRes.ok) throw new Error(registerData.message || 'Register failed');
    console.log('User registered successfully!', registerData);
    const token = registerData.token;

    // 2. Create Group
    console.log('\n2. Creating group...');
    const groupRes = await fetch('http://localhost:5000/api/groups', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        name: 'Test Group',
        members: [] 
      })
    });
    const groupData = await groupRes.json();
    if (!groupRes.ok) throw new Error(groupData.message || 'Group failed');
    console.log('Group created successfully!', groupData);

    // 3. Create Budget
    console.log('\n3. Creating budget...');
    const budgetRes = await fetch('http://localhost:5000/api/budgets', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        category: 'Food & Drinks',
        limit: 5000
      })
    });
    const budgetData = await budgetRes.json();
    if (!budgetRes.ok) throw new Error(budgetData.message || 'Budget failed');
    console.log('Budget created successfully!', budgetData);

    // 4. Fetch Dashboard
    console.log('\n4. Fetching dashboard data...');
    const dashRes = await fetch('http://localhost:5000/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dashData = await dashRes.json();
    if (!dashRes.ok) throw new Error(dashData.message || 'Dash failed');
    console.log('Dashboard data fetched successfully!', Object.keys(dashData));

    console.log('\n✅ All tests passed!');
  } catch (err) {
    console.error('❌ Test failed!');
    console.error(err.message);
  }
}

testLive();
