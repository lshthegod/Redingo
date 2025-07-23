const { MongoClient } = require('mongodb');

async function main() {
  const uri = 'mongodb://127.0.0.1:27020'; // mongos 포트

  const client = new MongoClient(uri, {
    useUnifiedTopology: true
  });

  try {
    await client.connect();
    console.log('MongoDB 연결 성공');

    const db = client.db('redingo');
    const collection = db.collection('images');

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('url을 입력해주세요 : ', async (answer) => {
      // url과 timestamp를 images 컬렉션에 저장
      const insertResult = await collection.insertOne({ url: answer, timestamp: new Date() });
      console.log('이미지 저장 완료\n_id :', insertResult.insertedId, '\n링크 :', answer);
      rl.close();
      await client.close();
    });
  } catch (err) {
    console.error('MongoDB 연결 에러:', err);
    await client.close();
  }
}

main();