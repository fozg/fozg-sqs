import RedisSMQ from "rsmq";
import redis from 'redis';

export default class SQS {
    private rsmq; private client;

    constructor(public channel: string) {
        this.channel = channel;
        this.rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379, ns: "rsmq" });
        this.client = redis.createClient();
    }

    async listQueue() {
        return await this.rsmq.listQueuesAsync();
    }

    async createQueue() {
        if ((await this.listQueue()).find(item => item === this.channel)) {
            return
        } else {
            try {
                await this.rsmq.createQueueAsync({ qname: this.channel })
            } catch (e) { }
        }
    }

    async sendMessage(message: string) {
        await this.createQueue();
        this.client.publish(this.channel, message);
        return this.rsmq.sendMessageAsync({ qname: this.channel, message });
    }

    async pickMessage() {
        await this.createQueue();

        let message: any = await this.rsmq.receiveMessageAsync({ qname: this.channel });
        if (message.id) {
            await this.rsmq.deleteMessageAsync({ qname: this.channel, id: message.id });
        }
        return message;
    }

    async countMessage() {
        let attrs = await this.getQueueAttributes();
        return attrs.msgs;
    }

    async getQueueAttributes() {
        return this.rsmq.getQueueAttributesAsync({ qname: this.channel })
    }

    async deleteChannel() {
        this.rsmq.deleteQueueAsync({ qname: this.channel })
    }

    subscribe(cb: (mess: string) => void) {
        this.client.subscribe(this.channel);
        this.client.on("message", (chanel, message) => {
            if (chanel === this.channel) {
                cb(message)
            }
        })
    }
}
