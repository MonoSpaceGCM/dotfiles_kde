"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputChannel = void 0;
const vscode = __importStar(require("vscode"));
class OutputChannel {
    constructor() {
        this.channel = vscode.window.createOutputChannel('C/C++ Compile Run');
    }
    appendLine(message, title) {
        if (title) {
            const simplifiedTime = (new Date()).toISOString().replace(/z|t/gi, ' ').trim(); // YYYY-MM-DD HH:mm:ss.sss
            const hightlightingTitle = `[${title} ${simplifiedTime}]`;
            this.channel.appendLine(hightlightingTitle);
        }
        this.channel.appendLine(message);
    }
    append(message) {
        this.channel.append(message);
    }
    show() {
        this.channel.show();
    }
    dispose() {
        this.channel.dispose();
    }
    clear() {
        this.channel.clear();
    }
}
exports.outputChannel = new OutputChannel();
//# sourceMappingURL=output-channel.js.map