'use strict';

const express = require('express');

const PORT = process.env.PORT || 8089;
const app = express();

const axios = require("axios");
const cheerio = require("cheerio");


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/get', (req, res) => {
  const code = req.param('code');
  const htmls = getHtml(code);
  

  htmls.then(html => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const current_price = $("#chart_area").children("div.rate_info").children("div.today").children("p.no_today").children("em");
    const yesterday_per_price = $("#chart_area").children("div.rate_info").children("div.today").children("p.no_exday").children("em");
    
    const curr_price = current_price.children("span");
    const upDown = yesterday_per_price.children("span").eq(0);
    let isPlusMinus = "";
    let isUpDown = "";
    if( upDown.hasClass("up") ){
      isUpDown = " 상승";
      isPlusMinus = "+";
    }else if( upDown.hasClass("down") ){
      isUpDown = " 하락";
      isPlusMinus = "-";
    }
    const unit = "원"
    const per_won = yesterday_per_price.find("span.blind").html();

    const won = "현재가 " + curr_price.html()+unit;
    const letter = "전일대비 "+ per_won+ unit + isUpDown;
    const percentage = isPlusMinus + yesterday_per_price.next().next().find("span.blind").html()+"%";

    const result = {
      "123"  : won,
      "1" : percentage,
      "2" : letter
    };
    
    res.send(result);
  });
  // https://finance.naver.com/item/main.nhn?code=069080
});

const getHtml = async (code) => {
  if(!code) code = "069080"; // 웹젠
  try {
    return await axios.get(
      "https://finance.naver.com/item/main.nhn?code="+code
    );
  } catch (error) {
    console.error(error);
  }
};


app.listen(PORT, () =>
  console.log(`app listening at http://localhost:${PORT}`)
)