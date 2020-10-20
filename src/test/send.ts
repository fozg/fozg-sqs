import SQS from '../SQS';

new SQS("fozg").sendMessage("hello world!").then(res => {
    console.log("id: ", res)
}).catch(e => { 
    console.log(e);
})