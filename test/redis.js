const redis = require('redis');

async function main() {
  const client = redis.createClient({
    socket: {
      host: '127.0.0.1',
      port: 6379
    }
  });

  client.on('error', (err) => {
    console.error('Redis 연결 에러:', err);
  });

  await client.connect();

  // 키 저장
  await client.set('test-key', 'Hello Redis!');
  console.log('SET 성공');

  // 키 가져오기
  const value = await client.get('test-key');
  console.log('GET 결과:', value);

  // 연결 종료
  await client.quit();
}

main();