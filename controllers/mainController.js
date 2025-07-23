const {
    getTodayPosts,
    getTop3,
    getTodayImage,
    getYesterdayTopPost,
    getYesterdayImage
  } = require('../services/mainService');
  
  const Main = async (req, res) => {
    try {
      const posts = await getTodayPosts();
      const image = await getTodayImage();
      const yesterdayTopPost = await getYesterdayTopPost();
      const yesterdayImage = await getYesterdayImage();
  
      res.render('main', {
        image,
        posts,
        postsTop3: getTop3(posts),
        yesterdayTopPost,
        yesterdayImage
      });
    } catch (err) {
      console.error('메인 페이지 렌더링 실패:', err);
      res.status(500).send('서버 오류');
    }
  };
  
module.exports = { Main };
  