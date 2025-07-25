# Redingo

매일 하나의 이미지를 보고, 떠오른 생각을 글로 남기고 다른 사람의 글에 투표하는 감성 기록 서비스

## **기술 스택**

**백엔드**

- **Node.js + Express**
- **MongoDB**
- **Redis**
- **Docker** / **Docker Compose**

**프론트엔드**

- **EJS**
- **CSS**

## **주요 기능**

- **글 작성**
    
    이미지를 보고 떠오르는 생각을 작성하는 기능 제공
    
- **게시글 목록 조회**
    
    당일 작성된 글들을 최신순으로 조회 가능
    
- **투표 기능**
    
    다른 사용자의 게시글에 공감 투표를 할 수 있는 기능 제공
    
- **TOP3 게시글 확인**
    
    하루 동안 가장 많은 투표를 받은 상위 3개의 인기 게시글을 확인 가능
    
- **Redis 캐싱**
    
    게시글 목록 등 주요 데이터에 대한 캐싱 처리로 성능 향상
    
- **스케줄러**
    
    주기적으로 데이터 정리 및 관리 작업 수행
    
- **Docker 지원**
    
    개발 및 운영 환경 모두 Docker로 손쉽게 실행 가능
    

## **설치 및 실행 방법**

**1. 환경 변수 설정**

- `.env.example` 참고하여 `.env` 파일 작성

**2-1. Docker로 전체 실행 (권장)**

루트 디렉토리에서 아래 명령어 실행:

```bash
docker-compose up --build
```

**2-2. 로컬 개발 환경 (직접 실행)**

```bash
npm install
node app
```

## **기타**

- 테스트 코드: test/ 디렉토리 내에 MongoDB, Redis 의 테스트 코드 포함