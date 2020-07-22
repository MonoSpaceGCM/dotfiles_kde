"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const terminal_1 = require("./terminal");
const compile_run_manager_1 = require("./compile-run-manager");
function activate(context) {
    const compileRunManager = new compile_run_manager_1.CompileRunManager();
    const compile = vscode_1.commands.registerCommand('extension.Compile', () => {
        compileRunManager.compile();
    });
    const run = vscode_1.commands.registerCommand('extension.Run', () => {
        compileRunManager.run();
    });
    const compileRun = vscode_1.commands.registerCommand('extension.CompileRun', () => {
        compileRunManager.compileRun();
    });
    const customCompile = vscode_1.commands.registerCommand('extension.CustomCompile', () => {
        compileRunManager.compile(true);
    });
    const customRun = vscode_1.commands.registerCommand('extension.CustomRun', () => {
        compileRunManager.compile(true);
    });
    const customCompileRun = vscode_1.commands.registerCommand('extension.CustomCompileRun', () => {
        compileRunManager.compileRun(true, true);
    });
    context.subscriptions.push(compile);
    context.subscriptions.push(run);
    context.subscriptions.push(compileRun);
    context.subscriptions.push(customCompile);
    context.subscriptions.push(customRun);
    context.subscriptions.push(customCompileRun);
    // Free resources when manually closing a terminal
    context.subscriptions.push(vscode_1.window.onDidCloseTerminal((closedTerminal) => {
        terminal_1.terminal.dispose(closedTerminal.name);
    }));
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map