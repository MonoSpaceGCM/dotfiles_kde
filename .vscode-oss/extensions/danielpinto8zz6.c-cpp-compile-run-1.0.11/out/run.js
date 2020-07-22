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
exports.Run = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const lookpath_1 = require("lookpath");
const vscode_1 = require("vscode");
const configuration_1 = require("./configuration");
const terminal_1 = require("./terminal");
const prompt_utils_1 = require("./utils/prompt-utils");
class Run {
    constructor(file, shouldAskForArgs = false) {
        this.file = file;
        this.shouldAskForArgs = shouldAskForArgs;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs_1.existsSync(this.file.path)) {
                const errorMessage = `"${this.file.path}" doesn't exists!`;
                vscode_1.window.showErrorMessage(errorMessage);
                throw new Error(errorMessage);
            }
            this.arguments = configuration_1.Configuration.runArgs();
            if (this.shouldAskForArgs) {
                this.arguments = yield prompt_utils_1.promptRunArguments(this.arguments);
            }
            if (configuration_1.Configuration.runInExternalTerminal()) {
                const command = this.getExternalCommand();
                if (command) {
                    child_process_1.exec(command, { cwd: this.file.directory });
                    return;
                }
            }
            yield terminal_1.terminal.run(`${terminal_1.getRunPrefix()}"${this.file.executable}" ${this.arguments}`, { name: 'C/C++ Compile Run', cwd: this.file.directory });
        });
    }
    getExternalCommand() {
        if (process.platform === 'win32') {
            return `start cmd /c ".\\\"${this.file.executable}\" ${this.arguments} & echo. & pause"`;
        }
        if (process.platform === 'darwin') {
            return `osascript -e 'do shell script "open -a Terminal " & "${this.file.directory}"' -e 'delay 0.3' -e `
                + `'tell application "Terminal" to do script ("./" & "${this.file.executable}") in first window'`;
        }
        if (process.platform === 'linux') {
            const linuxTerminal = configuration_1.Configuration.linuxTerminal();
            if (!terminal_1.terminal || lookpath_1.lookpath(linuxTerminal) === null) {
                vscode_1.window.showErrorMessage(`${terminal_1.terminal} not found! Try to enter a valid terminal in 'terminal.external.linuxExec' `
                    + `settings!(gnome - terminal, xterm, konsole)`);
                vscode_1.window.showInformationMessage('Running on vscode terminal');
                return null;
            }
            switch (linuxTerminal) {
                case 'xterm':
                    return `${linuxTerminal} -T ${this.file.title} -e './"${this.file.executable}" ${this.arguments}; `
                        + `echo; read -n1 -p "Press any key to continue..."'`;
                case 'gnome-terminal':
                case 'tilix':
                case 'mate-terminal':
                    return `${linuxTerminal} -t ${this.file.title} -x bash -c './"${this.file.executable}" ${this.arguments}; `
                        + `echo; read -n1 -p "Press any key to continue..."'`;
                case 'xfce4-terminal':
                    return `${linuxTerminal} --title ${this.file.title} -x bash -c './"${this.file.executable}" ${this.arguments}; `
                        + `read -n1 -p "Press any key to continue..."'`;
                case 'konsole':
                    return `${linuxTerminal} -p tabtitle='${this.file.title}' --noclose -e bash -c './"${this.file.executable}" `
                        + `${this.arguments}'`;
                case 'io.elementary.terminal':
                    return `${linuxTerminal} -e './"${this.file.executable}" ${this.arguments}'`;
                default:
                    vscode_1.window.showErrorMessage(`${linuxTerminal} isn't supported! Try to enter a supported terminal in `
                        + `'terminal.external.linuxExec' settings! (gnome-terminal, xterm, konsole)`);
                    vscode_1.window.showInformationMessage('Running on vscode terminal');
                    return null;
            }
        }
        return null;
    }
}
exports.Run = Run;
//# sourceMappingURL=run.js.map