"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileType = void 0;
const file_type_1 = require("../enums/file-type");
function getFileType(extension) {
    if (extension === 'c' || extension === 'h') {
        return file_type_1.FileType.c;
    }
    if (extension === 'cpp' || extension === 'hpp') {
        return file_type_1.FileType.cplusplus;
    }
    return file_type_1.FileType.unkown;
}
exports.getFileType = getFileType;
//# sourceMappingURL=file-type-utils.js.map