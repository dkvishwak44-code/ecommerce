async function testUrl(url) {
  const body = {
    email: "admin@example.com",
    password: "admin@123"
  };

  console.log(`\nTesting POST request to: ${url}`);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const status = res.status;
    const text = await res.text();
    console.log(`URL: ${url} -> Status: ${status}`);
    console.log(`Response snippet: ${text.substring(0, 200)}`);
  } catch (error) {
    console.error(`URL: ${url} -> Error:`, error.message);
  }
}

async function main() {
  await testUrl("http://localhost:5000/api/admin/v1/auth/login");
  await testUrl("http://127.0.0.1:5000/api/admin/v1/auth/login");
  await testUrl("http://[::1]:5000/api/admin/v1/auth/login");
}

main();
