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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rsmq_1 = __importDefault(require("rsmq"));
const redis_1 = __importDefault(require("redis"));
class SQS {
    constructor(channel) {
        this.channel = channel;
        this.channel = channel;
        this.rsmq = new rsmq_1.default({ host: "127.0.0.1", port: 6379, ns: "rsmq" });
        this.client = redis_1.default.createClient();
    }
    listQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rsmq.listQueuesAsync();
        });
    }
    createQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.listQueue()).find(item => item === this.channel)) {
                return;
            }
            else {
                yield this.rsmq.createQueueAsync({ qname: this.channel });
            }
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createQueue();
            this.client.publish(this.channel, message);
            return this.rsmq.sendMessageAsync({ qname: this.channel, message });
        });
    }
    pickMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createQueue();
            let message = yield this.rsmq.receiveMessageAsync({ qname: this.channel });
            if (message.id) {
                yield this.rsmq.deleteMessageAsync({ qname: this.channel, id: message.id });
            }
            return message;
        });
    }
    countMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            let attrs = yield this.getQueueAttributes();
            return attrs.msgs;
        });
    }
    getQueueAttributes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.rsmq.getQueueAttributesAsync({ qname: this.channel });
        });
    }
    deleteChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rsmq.deleteQueueAsync({ qname: this.channel });
        });
    }
    subscribe(cb) {
        this.client.subscribe(this.channel);
        this.client.on("message", (chanel, message) => {
            if (chanel === this.channel) {
                cb(message);
            }
        });
    }
}
exports.default = SQS;
//# sourceMappingURL=SQS.js.map