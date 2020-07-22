"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// see: https://github.com/microsoft/vscode-maven/blob/master/src/mavenTerminal.ts
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
exports.terminal = exports.getRunPrefix = exports.toWinPath = exports.toWslPath = void 0;
const vscode = __importStar(require("vscode"));
const output_channel_1 = require("./output-channel");
const cp_utils_1 = require("./utils/cp-utils");
var WindowsShellType;
(function (WindowsShellType) {
    WindowsShellType["CMD"] = "Command Prompt";
    WindowsShellType["POWERSHELL"] = "PowerShell";
    WindowsShellType["GIT_BASH"] = "Git Bash";
    WindowsShellType["WSL"] = "WSL Bash";
    WindowsShellType["OTHERS"] = "Others";
})(WindowsShellType || (WindowsShellType = {}));
class Terminal {
    constructor() {
        this.terminals = {};
    }
    run(command, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultOptions = { addNewLine: true, name: 'C/C++ Compile Run' };
            const { addNewLine, name, cwd, workspaceFolder } = Object.assign(defaultOptions, options);
            if (this.terminals[name] === undefined) {
                const env = Object.assign({}, options.env);
                // Open terminal in workspaceFolder if provided
                // See: https://github.com/microsoft/vscode-maven/issues/467#issuecomment-584544090
                const terminalCwd = workspaceFolder ? workspaceFolder.uri : undefined;
                this.terminals[name] = vscode.window.createTerminal({ name, env, cwd: terminalCwd });
                // Workaround for WSL custom envs.
                // See: https://github.com/Microsoft/vscode/issues/71267
                if (currentWindowsShell() === WindowsShellType.WSL) {
                    setupEnvForWSL(this.terminals[name], env);
                }
            }
            this.terminals[name].show();
            if (cwd) {
                this.terminals[name].sendText(yield getCDCommand(cwd), true);
            }
            this.terminals[name].sendText(getCommand(command), addNewLine);
            return this.terminals[name];
        });
    }
    // To Refactor: remove from here.
    formattedPathForTerminal(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.platform === 'win32') {
                switch (currentWindowsShell()) {
                    case WindowsShellType.WSL:
                        return yield toWslPath(filepath);
                    default:
                        return filepath;
                }
            }
            else {
                return filepath;
            }
        });
    }
    dispose(terminalName) {
        if (terminalName && this.terminals[terminalName] !== undefined) {
            this.terminals[terminalName].dispose();
            delete this.terminals[terminalName];
        }
        else {
            Object.keys(this.terminals).forEach((id) => {
                this.terminals[id].dispose();
                delete this.terminals[id];
            });
        }
    }
}
function getCommand(cmd) {
    if (process.platform === 'win32') {
        switch (currentWindowsShell()) {
            case WindowsShellType.POWERSHELL:
                return `cmd /c ${cmd}`; // PowerShell
            default:
                return cmd; // others, try using common one.
        }
    }
    else {
        return cmd;
    }
}
function getCDCommand(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.platform === 'win32') {
            switch (currentWindowsShell()) {
                case WindowsShellType.GIT_BASH:
                    return `cd "${cwd.replace(/\\+$/, '')}"`; // Git Bash: remove trailing '\'
                case WindowsShellType.POWERSHELL:
                    // Escape '[' and ']' in PowerShell
                    // See: https://github.com/microsoft/vscode-maven/issues/324
                    const escaped = cwd.replace(/([\[\]])/g, '``$1');
                    return `cd "${escaped}"`; // PowerShell
                case WindowsShellType.CMD:
                    return `cd /d "${cwd}"`; // CMD
                case WindowsShellType.WSL:
                    return `cd "${yield toWslPath(cwd)}"`; // WSL
                default:
                    return `cd "${cwd}"`; // Unknown, try using common one.
            }
        }
        else {
            return `cd "${cwd}"`;
        }
    });
}
function currentWindowsShell() {
    const currentWindowsShellPath = vscode.env.shell;
    if (currentWindowsShellPath.endsWith('cmd.exe')) {
        return WindowsShellType.CMD;
    }
    else if (currentWindowsShellPath.endsWith('powershell.exe')) {
        return WindowsShellType.POWERSHELL;
    }
    else if (currentWindowsShellPath.endsWith('pwsh.exe')) {
        return WindowsShellType.POWERSHELL;
    }
    else if (currentWindowsShellPath.endsWith('bash.exe') || currentWindowsShellPath.endsWith('wsl.exe')) {
        if (currentWindowsShellPath.includes('Git')) {
            return WindowsShellType.GIT_BASH;
        }
        return WindowsShellType.WSL;
    }
    else {
        return WindowsShellType.OTHERS;
    }
}
function toDefaultWslPath(p) {
    const arr = p.split(':\\');
    if (arr.length === 2) {
        const drive = arr[0].toLowerCase();
        const dir = arr[1].replace(/\\/g, '/');
        return `/mnt/${drive}/${dir}`;
    }
    else {
        return p.replace(/\\/g, '/');
    }
}
function toWslPath(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return (yield cp_utils_1.executeCommand('wsl', ['wslpath', '-u', `"${path.replace(/\\/g, '/')}"`])).trim();
        }
        catch (error) {
            output_channel_1.outputChannel.appendLine(error, 'WSL');
            return toDefaultWslPath(path);
        }
    });
}
exports.toWslPath = toWslPath;
function toWinPath(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield cp_utils_1.executeCommand('wsl', ['wslpath', '-w', `"${path}"`])).trim();
    });
}
exports.toWinPath = toWinPath;
function getRunPrefix() {
    if (process.platform === 'win32') {
        const shell = currentWindowsShell();
        if (shell === WindowsShellType.CMD || shell === WindowsShellType.POWERSHELL) {
            return '.\\';
        }
    }
    return './';
}
exports.getRunPrefix = getRunPrefix;
exports.terminal = new Terminal();
function setupEnvForWSL(term, env) {
    if (term !== undefined) {
        Object.keys(env).forEach(key => {
            term.sendText(`export ${key}="${env[key]}"`, true);
        });
    }
}
//# sourceMappingURL=terminal.js.map