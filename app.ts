import * as os from 'os';
import {promises as fs} from 'fs';
import * as path from 'path';
import {spawn} from 'child_process';

// 추가/제외 할 plugin 목록 파일 경로
const pluginsPath = path.join(__dirname, 'plugins');
let plugins = {};

// IDEA 경로
const disabledTxtPath: string = path.join(os.homedir(), 'Library/Application Support/JetBrains/IntelliJIdea2023.3/disabled_plugins.txt');

// 공통으로 적용할 플러그인목록은 파일 이름이 common.txt 이어야 함.

function ignoreComment(lines: string[]): string[] {
    let results = [];
    for (const line of lines) {
        let newLine = line.trim();
        const commentIndex = newLine.indexOf('#');

        if (commentIndex > -1) { // inline comment exists
            newLine = newLine.substring(0, commentIndex).trim();
        }
        if (newLine === '') {
            continue;
        }
        results.push(newLine);
    }

    return results;
}

async function readPlugins() {
    const foundPlugins = await fs.readdir(pluginsPath);

    for (const plugin of foundPlugins) {
        const lang = plugin.substring(0, plugin.lastIndexOf('.'));
        const filePath = path.join(pluginsPath, plugin);

        const file = await fs.readFile(filePath, 'utf8');
        let lines = file.split('\n');
        lines = ignoreComment(lines);
        plugins[lang] = lines; // add plugin list
    }
}


async function switchPluginsBySelectedConfig() {
    // 커맨드 라인 인자 읽기 (첫 번째 두 인자는 노드와 파일 경로)
    const arg = process.argv[2];

    if (!plugins[arg]) {
        console.error(`Invalid argument: ${arg}`);
        process.exit(1);
    }

    // disabled_plugins.txt 파일 읽기
    const file = await fs.readFile(disabledTxtPath, 'utf8');

    let lines = file.split('\n');

    // 다른 언어의 플러그인목록은 disable 리스트에 추가: 플러그인 비활성화
    Object.keys(plugins).forEach(lang => {
        if (lang !== arg) {
            plugins[lang].forEach((plugin: string) => {
                if (!lines.includes(plugin)) {
                    lines.push(plugin);
                }
            });
        }
    });

    // 제거 이후, 추가 = 순서가 바뀌면 중복 요소가 추가되지 않음!

    // 공통 플러그인 추가: common
    lines = lines.filter(line => !plugins['common'].includes(line));

    // 선택된 언어의 플러그인을 disable 리스트에서 제거: 플러그인 활성화
    lines = lines.filter(line => !plugins[arg].includes(line));

    const appliedPlugins = lines.join('\n');

    console.log(`적용된 플러그인 목록: \n ${appliedPlugins}`);
    await fs.writeFile(disabledTxtPath, appliedPlugins, 'utf8');
}


async function main() {
    await readPlugins();

    await switchPluginsBySelectedConfig();

    const idea = spawn('idea', [], {detached: true, stdio: 'ignore'});

    idea.unref();

    console.log("IDEA is running ...")
}

main();



export { ignoreComment };
