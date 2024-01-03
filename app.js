"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var fs = require("fs");
var path = require("path");
// 플러그인 목록 예시
var plugins = {
    python: ["python_plugin_1", "python_plugin_2"],
    node: ["node_plugin_1", "node_plugin_2"],
    java: ["java_plugin_1", "java_plugin_2"]
};
var disabledTxtPath = path.join(os.homedir(), 'Library/Application Support/JetBrains/IntelliJIdea2023.3/disabled_plugins.txt');
// 커맨드 라인 인자 읽기 (첫 번째 두 인자는 노드와 파일 경로)
var arg = process.argv[2];
// 선택된 언어의 플러그인 목록 가져오기
var selectedPlugins = plugins[arg];
if (!selectedPlugins) {
    console.error("Invalid argument: ".concat(arg));
    process.exit(1);
}
// disabled_plugins.txt 파일 읽기
fs.readFile(disabledTxtPath, 'utf8', function (err, data) {
    if (err) {
        console.error("Error reading file: ".concat(err));
        return;
    }
    // 파일 내용을 줄 단위로 분리
    var lines = data.split('\n');
    // 필요한 플러그인 추가 및 제거
    Object.keys(plugins).forEach(function (lang) {
        if (lang === arg) {
            // 선택된 언어의 플러그인 제거: 플러그인 활성화
            lines = lines.filter(function (line) { return !plugins[lang].includes(line); });
        }
        else {
            // 다른 언어의 플러그인 추가: 플러그인 비활성화
            plugins[lang].forEach(function (plugin) {
                if (!lines.includes(plugin)) {
                    lines.push(plugin);
                }
            });
        }
    });
    // 파일 업데이트
    fs.writeFile(disabledTxtPath, lines.join('\n'), 'utf8', function (err) {
        if (err) {
            console.error("Error writing file: ".concat(err));
            return;
        }
        console.log('disabled_plugins.txt updated successfully.');
    });
});
