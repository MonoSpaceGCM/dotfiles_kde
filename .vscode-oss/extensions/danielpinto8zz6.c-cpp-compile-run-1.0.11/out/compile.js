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
exports.Compile = void 0;
const child_process_1 = require("child_process");
const vscode_1 = require("vscode");
const configuration_1 = require("./configuration");
const file_type_1 = require("./enums/file-type");
const output_channel_1 = require("./output-channel");
const prompt_utils_1 = require("./utils/prompt-utils");
const common_utils_1 = require("./utils/common-utils");
class Compile {
    constructor(file, shouldAskForInputFlags = false) {
        this.file = file;
        this.shouldAskForInputFlags = shouldAskForInputFlags;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setCompiler().catch(error => { throw new Error(error); });
            if (configuration_1.Configuration.saveBeforeCompile()) {
                yield vscode_1.window.activeTextEditor.document.save();
            }
            if (yield common_utils_1.isProccessRunning(this.file.executable)) {
                const errorMessage = `${this.file.executable} is already runing! Please close it first to compile successfully!`;
                vscode_1.window.showErrorMessage(errorMessage);
                throw new Error(errorMessage);
            }
            if (!this.isCompilerValid()) {
                const CHANGE_PATH = 'Change path';
                const choiceForDetails = yield vscode_1.window.showErrorMessage('Compiler not found, try to change path in settings!', CHANGE_PATH);
                if (choiceForDetails === CHANGE_PATH) {
                    this.compiler = yield prompt_utils_1.promptCompiler();
                    if (this.compiler !== null && common_utils_1.commandExists(this.compiler)) {
                        yield configuration_1.Configuration.setCompiler(this.compiler, this.file.type);
                    }
                    else {
                        const errorMessage = 'Compiler not found';
                        yield vscode_1.window.showErrorMessage(errorMessage);
                        throw new Error(errorMessage);
                    }
                }
                else {
                    throw new Error('Compiler not set!');
                }
            }
            if (this.shouldAskForInputFlags) {
                this.inputFlags = yield prompt_utils_1.promptFlags(this.inputFlags);
                if (this.inputFlags === null) {
                    throw new Error('No input flags specified');
                }
            }
            let compilerArgs = [`"${this.file.name}"`, '-o', `"${this.file.executable}"`];
            if (this.inputFlags) {
                compilerArgs = compilerArgs.concat(this.inputFlags.split(' '));
            }
            const proccess = child_process_1.spawnSync(`"${this.compiler}"`, compilerArgs, { cwd: this.file.directory, shell: true, encoding: 'utf-8' });
            if (proccess.output.length > 0) {
                output_channel_1.outputChannel.appendLine(proccess.output.toLocaleString(), this.file.name);
            }
            if (proccess.status === 0) {
                vscode_1.window.showInformationMessage('Compiled successfuly!');
            }
            else {
                vscode_1.window.showErrorMessage('Error compiling!');
                output_channel_1.outputChannel.show();
                throw new Error('error');
            }
        });
    }
    setCompiler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.file.type === null || this.file.type === file_type_1.FileType.unkown) {
                throw new Error('Invalid File!');
            }
            if (this.file.type === file_type_1.FileType.cplusplus) {
                this.compiler = configuration_1.Configuration.cppCompiler();
                this.inputFlags = configuration_1.Configuration.cppFlags();
            }
            if (this.file.type === file_type_1.FileType.c) {
                this.compiler = configuration_1.Configuration.cCompiler();
                this.inputFlags = configuration_1.Configuration.cFlags();
            }
        });
    }
    isCompilerValid() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.compiler !== null && (yield common_utils_1.commandExists(this.compiler));
        });
    }
}
exports.Compile = Compile;
//# sourceMappingURL=compile.js.map