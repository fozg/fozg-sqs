"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const sqs = new index_1.default("fozg");
sqs.subscribe(mess => {
    console.log("mess notified", mess);
    sqs.pickMessage().then(mess => {
        console.log("mess was piked", mess);
    });
});
// new SQS("fozg").delete()
//# sourceMappingURL=recive.js.map