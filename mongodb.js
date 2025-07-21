const { MongoClient } = require('mongodb');

async function main() {
  const uri = 'mongodb://127.0.0.1:27020';  // mongos 포트

  const client = new MongoClient(uri, {
    useUnifiedTopology: true
  });

  try {
    // 연결
    await client.connect();
    console.log('MongoDB 연결 성공');

    // DB/컬렉션 선택
    const db = client.db('testdb');
    const collection = db.collection('sample');

    // 데이터 삽입
    await collection.insertOne({ message: 'Hello MongoDB!' });
    console.log('Insert 성공');

    // 데이터 조회
    const result = await collection.findOne({ message: 'Hello MongoDB!' });
    console.log('Find 결과:', result);

  } catch (err) {
    console.error('MongoDB 연결 에러:', err);
  } finally {
    // 연결 종료
    await client.close();
  }
}

main();
