Intellij IDEA의 Plugin 활성화/비활성화 설정을 스크립트로 자동화 합니다.

## 원리
현재 IntelliJ IDEA는 유저가 `비활성화` 한 플러그인의 목록을 IDEA가 설치된 경로의 `disabled_plugins.txt` 파일에 기록합니다.

이 파일의 내용을 수정하여 IDEA가 시작 전, 명시된 플러그인 목록을 비활성화 상태로 만들 수 있습니다.(blacklist 방식)

활성화하고 싶은 플러그인 목록은 **"수동으로"** 수집하여 plugin id를 common.txt 에 추가해야합니다.
(플러그인 홈페이지 하단에 plugin id가 나와있습니다. 없는 경우, 수동으로 비활성화 목록에 들어간 id를 수집해야 합니다.)

## 사용법
1. 프로젝트를 clone 합니다.

2. 프로젝트의 plugins 디렉토리에 플러그인 설정파일을 추가합니다.

3. IDEA 실행
`node app.js <config_name>` (src 폴더 내)

```markdown
예시.

/plugins/python.txt 파일
Pythonid

$ node app.js python

common.txt 를 제외한 다른 설정파일들에 들어있는 플러그인들은 disabled_txt 에 추가됩니다(비활성화)
python.txt 파일에 들어있는 플러그인들은 disabled_txt에 들어있다면 제거됩니다(활성화)

중복 시 우선순위: 활성화할 목록 > common > 비활성화 목록(app.js 실행시 제공한 인자를 제외한 다른 설정파일들)

raycast 등의 툴을 사용하여 `node app.js python` 과 같은 실행 명령을 추가로 자동화 할 수 있습니다.
```
