"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileRunManager = void 0;
const compile_1 = require("./compile");
const run_1 = require("./run");
const vscode_1 = require("vscode");
const configuration_1 = require("./configuration");
const file_utils_1 = require("./utils/file-utils");
class CompileRunManager {
    constructor() {
    }
    compile(shouldAskForInputFlags = false) {
        const file = this.getFile();
        const compile = new compile_1.Compile(file, shouldAskForInputFlags);
        compile.run()
            .catch(error => console.error(error));
    }
    run(shouldAskForArgs = false) {
        const file = this.getFile();
        const run = new run_1.Run(file, shouldAskForArgs);
        run.run()
            .catch(error => console.error(error));
    }
    compileRun(shouldAskForInputFlags = false, shouldAskForArgs = false) {
        const file = this.getFile();
        const compile = new compile_1.Compile(file, shouldAskForInputFlags);
        const run = new run_1.Run(file, shouldAskForArgs);
        compile.run()
            .then(() => {
            run.run()
                .catch(error => console.error(error));
        }).catch(error => console.error(error));
    }
    getFile() {
        if (!vscode_1.window || !vscode_1.window.activeTextEditor || !vscode_1.window.activeTextEditor.document) {
            throw new Error('Invalide active text editor document!');
        }
        const doc = vscode_1.window.activeTextEditor.document;
        if (doc.isUntitled && !configuration_1.Configuration.saveBeforeCompile()) {
            const errorMessage = 'Please save file first then try again!';
            vscode_1.window.showErrorMessage(errorMessage);
            throw new Error(errorMessage);
        }
        return file_utils_1.parseFile(doc);
    }
}
exports.CompileRunManager = CompileRunManager;
//# sourceMappingURL=compile-run-manager.js.map