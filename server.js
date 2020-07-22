'use strict';

const express = require('express');

const PORT = process.env.PORT || 8089;
const app = express();

const axios = require("axios");
const cheerio = require("cheerio");
const Iconv =  require('iconv').Iconv;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/test', (req, res) => {
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
});

app.post('/get', (req, res) => {
  // {
  //   "token" : "YE1ronbbuoZkq7h3J5KMI4Tn",
  //   "teamName" : "Toss Lab, Inc.",
  //   "roomName" : "토스랩 코리아",
  //   "writerName" : "김잔디",
  //   "text" : "/날씨 내일 대전 날씨 어때?",
  //   "keyword" : "날씨",
  //   "createdAt" : "2017-05-15T11:34:11.266Z"
  //   }
  const code = req.param('code');
  const token = req.param('token');
  const teamName = req.param('teamName');
  const roomName = req.param('roomName');
  const writerName = req.param('writerName');
  const text = req.param('text');
  const keyword = req.param('keyword');
  const createdAt = req.param('createdAt');

  // const keywordString = keyword.split(" ");



  
    const htmls = getHtml(code);
      
    htmls.then(html => {
      const $ = cheerio.load(html.data);
      const current_price = $("#chart_area").children("div.rate_info").children("div.today").children("p.no_today").children("em");
      const yesterday_per_price = $("#chart_area").children("div.rate_info").children("div.today").children("p.no_exday").children("em");
      const company = $("div.wrap_company").children("h2").text();
      
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
      const won = "현재가 " + curr_price.html() + unit;
      const letter = "전일대비 "+ per_won + unit + isUpDown;
      const percentage = isPlusMinus + yesterday_per_price.next().next().find("span.blind").html()+"%";

      
      // {
      //   "body" : "[[PizzaHouse]](http://url_to_text) You have a new Pizza order.",
      //   "connectColor" : "#FAC11B",
      //   "connectInfo" : [{
      //   "title" : "Topping",
      //   "description" : "Pepperoni"
      //   },
      //   {
      //   "title": "Location",
      //   "description": "Empire State Building, 5th Ave, New York",
      //   }]
      //   }

      const result = {
        body: "영차 영차 개미는 (뚠뚠) 오늘도 (뚠뚠)",
        connectColor : "#FAC11B",
        connectInfo: [{
          title: won,
          description: letter + '</br>' + percentage
        }],
      };
      res.send(result);
    });
  // https://finance.naver.com/item/main.nhn?code=069080
  // https://finance.naver.com/search/search.nhn?query=%C0%A5%C1%A8
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