const axios = require("axios");

const options = {
  method: 'POST',
  url: 'https://d7-verify.p.rapidapi.com/verify/v1/otp/send-otp',
  headers: {
    'content-type': 'application/json',
    Token: 'undefined',
    'X-RapidAPI-Key': '9c4c3c28a9msh701b33e4dbe033ep1f669bjsne47e9a3f2eb1',
    'X-RapidAPI-Host': 'd7-verify.p.rapidapi.com'
  },
  data: '{"originator":"SignOTP","recipient":"+9715097525xx","content":"Greetings from Candy-Survey Bot, your mobile verification code is: {}","expiry":"600","data_coding":"text"}'
};

const generateOTP= async(phone_Number)=>{
    const options = {
        method: 'POST',
        url: 'https://d7-verify.p.rapidapi.com/verify/v1/otp/send-otp',
        headers: {
          'content-type': 'application/json',
          Token: 'undefined',
          'X-RapidAPI-Key': '9c4c3c28a9msh701b33e4dbe033ep1f669bjsne47e9a3f2eb1',
          'X-RapidAPI-Host': 'd7-verify.p.rapidapi.com'
        },
        data: '{"originator":"SignOTP","recipient":"+9715097525xx","content":"Greetings from Candy-Survey Bot, your mobile verification code is: {}","expiry":"600","data_coding":"text"}'
      };
    

    
    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
}

