"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SQS_1 = __importDefault(require("../SQS"));
new SQS_1.default("fozg").sendMessage("hello world!").then(res => {
    console.log("id: ", res);
}).catch(e => {
    console.log(e);
});
//# sourceMappingURL=send.js.map