import SQS from '../index';

const sqs = new SQS("fozg");

sqs.subscribe(mess => {
    console.log("mess notified", mess);

    sqs.pickMessage().then(mess => {
        console.log("mess was piked", mess);
    })
})

// new SQS("fozg").delete()