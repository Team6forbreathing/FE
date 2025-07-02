# FE

## `src/context/AuthContext.jsx`
- **설명**: 이 파일은 React 애플리케이션에서 인증 상태를 관리하기 위한 Context를 정의.
- **주요 기능**:
  - `AuthContext`를 생성하여 로그인 상태(`isLoggedIn`), 로딩 상태(`isLoading`), 디코딩된 사용자 역할 정보(`decodedAuth`), 그리고 인증 관련 함수(`login`, `register`, `logout`, `info`) 제공.
  - JWT 토큰을 사용해 토큰 만료 여부를 확인하고, 유효성 검사를 통해 로그인 상태를 유지하거나 해제.
  - `useAuth` 커스텀 훅을 제공하여 다른 컴포넌트에서 인증 상태와 기능을 쉽게 접근할 수 있도록 함.
  - Axios를 사용해 로그인, 회원가입, 사용자 정보 조회 API 호출을 처리하며, 쿠키를 통해 토큰과 사용자 정보 관리.

## `src/pages`
- **설명**: 이 디렉토리에는 애플리케이션의 각 페이지 컴포넌트가 정의되어 있음.
- **포함된 페이지**:
  - `AuthUserPage.jsx`: 관리자 권한 사용자만 접근 가능한 페이지로, 모든 사용자 목록을 표시하고 클릭 시 특정 사용자 데이터 페이지로 이동.
  - `Data.jsx`: 사용자 데이터 파일 목록을 표시하며, 날짜 범위 필터링과 정렬 기능을 제공. 파일 세트를 그룹화하여 표시.
  - `FileList.jsx`: 특정 사용자와 날짜에 대한 파일 목록과 수면 무호흡 진단 결과를 표시. 파일 업로드 및 다운로드 기능 포함.
  - `FindID.jsx`: 아이디 찾기 페이지를 제공하며, 이름과 이메일을 입력받아 아이디를 조회하는 기능(현재는 알림으로 대체).
  - `MyPage.jsx`: 사용자 프로필 정보와 최근 7일간의 수면 데이터(최대 3일)를 표시. 클릭 시 해당 날짜의 파일 목록 페이지로 이동.
  - 이외 페이지 설명 생략  
  
## `src/components`
- **설명**: 이 디렉토리에는 재사용 가능한 컴포넌트가 포함되어 있음.
- **포함된 컴포넌트**:
  - `Header.jsx`: 애플리케이션의 상단 헤더를 정의하며, 모든 페이지에서 공통적으로 사용됨.
  - `Section.jsx`: 특정 섹션 UI를 정의하는 컴포넌트로, 페이지별로 필요한 레이아웃을 구성하는 데 사용됨.

## 추가 정보
- **스타일링**: 각 페이지와 컴포넌트는 `src/styles` 디렉토리 내의 CSS 파일(예: `AuthUserPage.css`, `Data.css`, `FileList.css`, `FindAccount.css`, `MyPage.css`)을 통해 스타일링됨.
- **아이콘 및 에셋**: `FileList.jsx`에서는 `src/assets` 디렉토리의 아이콘(`download.png`, `result.png`, `upload.png`)을 사용.
- **환경 변수**: API URL(`VITE_ALL_USER_LIST`, `VITE_USER_DATA_LIST_API_URL`, `VITE_LOGIN_API_URL`, `VITE_REGISTRATION_API_URL`, `VITE_USER_INFO_API_URL`)은 환경 변수로 관리되며, `import.meta.env`를 통해 접근됨.
