"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = void 0;
const path_1 = require("path");
const file_type_utils_1 = require("./file-type-utils");
function parseFile(doc) {
    const file = {
        path: doc.fileName,
        name: path_1.basename(doc.fileName),
        title: path_1.basename(doc.fileName, path_1.extname(doc.fileName)),
        directory: path_1.dirname(doc.fileName),
        type: file_type_utils_1.getFileType(doc.languageId),
        executable: process.platform === 'win32'
            ? `${path_1.basename(doc.fileName, path_1.extname(doc.fileName))}.exe`
            : path_1.basename(doc.fileName, path_1.extname(doc.fileName))
    };
    return file;
}
exports.parseFile = parseFile;
//# sourceMappingURL=file-utils.js.map