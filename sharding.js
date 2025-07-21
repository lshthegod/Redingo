const { MongoClient } = require('mongodb');

async function main() {
  const uri = 'mongodb://127.0.0.1:27020'; // mongos 포트
  const client = new MongoClient(uri, {
    useUnifiedTopology: true
  });

  try {
    await client.connect();
    console.log('MongoDB 연결 성공');

    const db = client.db('testdb');
    const collection = db.collection('users');

    // 기존 데이터 제거
    await collection.deleteMany({});
    console.log('기존 데이터 삭제 완료');

    const BATCH_SIZE = 10000;
    const TOTAL = 1000000; // 100만 건
    let count = 0;

    console.time('데이터 삽입 시간');

    while (count < TOTAL) {
      const bulk = [];

      for (let i = 0; i < BATCH_SIZE; i++) {
        const userId = count + i;
        bulk.push({
          insertOne: {
            document: {
              userId: userId,
              name: 'User' + userId,
              email: `user${userId}@example.com`,
              age: Math.floor(Math.random() * 50) + 20,
              address: {
                city: 'Seoul',
                street: `Street ${userId % 1000}`
              },
              createdAt: new Date()
            }
          }
        });
      }

      await collection.bulkWrite(bulk, { ordered: false });
      count += BATCH_SIZE;
      console.log(`${count}건 삽입 완료`);
    }

    console.timeEnd('데이터 삽입 시간');
    console.log('모든 데이터 삽입 완료');

  } catch (err) {
    console.error('MongoDB 작업 중 에러:', err);
  } finally {
    await client.close();
    console.log('MongoDB 연결 종료');
  }
}

main();
