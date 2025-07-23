# Node.js 공식 이미지 사용
FROM node:20

# 작업 디렉토리 생성
WORKDIR /usr/src/app

# package.json, package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# pm2 글로벌 설치
RUN npm install -g pm2

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 앱 실행 (pm2)
CMD ["pm2-runtime", "start", "app.js"] 