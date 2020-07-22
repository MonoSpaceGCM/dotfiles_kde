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
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptRunArguments = exports.promptFlags = exports.promptCompiler = void 0;
const vscode_1 = require("vscode");
function promptCompiler() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield vscode_1.window.showInputBox({ prompt: 'Compiler', placeHolder: '/usr/bin/gcc' });
    });
}
exports.promptCompiler = promptCompiler;
function promptFlags(defaultFlags) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield vscode_1.window.showInputBox({ prompt: 'Flags', placeHolder: '-Wall -Wextra', value: defaultFlags });
    });
}
exports.promptFlags = promptFlags;
function promptRunArguments(defaultArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield vscode_1.window.showInputBox({ prompt: 'Arguments', value: defaultArgs });
    });
}
exports.promptRunArguments = promptRunArguments;
//# sourceMappingURL=prompt-utils.js.map