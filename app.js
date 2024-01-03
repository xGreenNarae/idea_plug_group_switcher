"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var fs_1 = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
var scriptPath = __dirname;
var pluginsPath = path.join(scriptPath, 'plugins');
var plugins = {};
var disabledTxtPath = path.join(os.homedir(), 'Library/Application Support/JetBrains/IntelliJIdea2023.3/disabled_plugins.txt');
function ignoreComment(lines) {
    lines.forEach(function (line, index) {
        line = line.trim();
        var commentIndex = line.indexOf('#');
        if (commentIndex > -1) { // inline comment exists
            lines[index] = line.substring(0, commentIndex).trim();
        }
        if (line === '') {
            lines.splice(index, 1);
        }
    });
    return lines;
}
function readPlugins() {
    return __awaiter(this, void 0, void 0, function () {
        var foundPlugins, _i, foundPlugins_1, plugin, lang, filePath, file, lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readdir(pluginsPath)];
                case 1:
                    foundPlugins = _a.sent();
                    _i = 0, foundPlugins_1 = foundPlugins;
                    _a.label = 2;
                case 2:
                    if (!(_i < foundPlugins_1.length)) return [3 /*break*/, 5];
                    plugin = foundPlugins_1[_i];
                    lang = plugin.substring(0, plugin.lastIndexOf('.'));
                    filePath = path.join(pluginsPath, plugin);
                    return [4 /*yield*/, fs_1.promises.readFile(filePath, 'utf8')];
                case 3:
                    file = _a.sent();
                    lines = file.split('\n');
                    lines = ignoreComment(lines);
                    plugins[lang] = lines; // add plugin list
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function switchPluginsBySelectedConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var arg, selectedPlugins, file, lines, appliedPlugins;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    arg = process.argv[2];
                    selectedPlugins = plugins[arg];
                    if (!selectedPlugins) {
                        console.error("Invalid argument: ".concat(arg));
                        process.exit(1);
                    }
                    return [4 /*yield*/, fs_1.promises.readFile(disabledTxtPath, 'utf8')];
                case 1:
                    file = _a.sent();
                    lines = file.split('\n');
                    // 다른 언어의 플러그인목록은 disable 리스트에 추가: 플러그인 비활성화
                    Object.keys(plugins).forEach(function (lang) {
                        if (lang !== arg) {
                            plugins[lang].forEach(function (plugin) {
                                if (!lines.includes(plugin)) {
                                    lines.push(plugin);
                                }
                            });
                        }
                    });
                    // 선택된 언어의 플러그인을 disable 리스트에서 제거: 플러그인 활성화 (겹치는 요소가 있어서 덮어써야함)
                    Object.keys(plugins).forEach(function (lang) {
                        if (lang === arg) {
                            lines = lines.filter(function (line) { return !plugins[lang].includes(line); });
                        }
                    });
                    appliedPlugins = lines.join('\n');
                    console.log("\uC801\uC6A9\uB41C \uD50C\uB7EC\uADF8\uC778 \uBAA9\uB85D: \n ".concat(appliedPlugins));
                    return [4 /*yield*/, fs_1.promises.writeFile(disabledTxtPath, appliedPlugins, 'utf8')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var idea;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readPlugins()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, switchPluginsBySelectedConfig()];
                case 2:
                    _a.sent();
                    idea = (0, child_process_1.spawn)('idea', [], { detached: true, stdio: 'ignore' });
                    idea.unref();
                    console.log("IDEA is running ...");
                    return [2 /*return*/];
            }
        });
    });
}
main();
