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
      const $ = cheerio.load(html.data);
      const current_price = $("#chart_area").children("div.rate_info").children("div.today").children("p.no_today").children("em");
      const yesterday_per_price = $("#chart_area").children("div.rate_info").children("div.today").children("p.no_exday").children("em");
      const company = $("div.wrap_company").children("h2").text();
      
      const curr_price = current_price.children("span");
      const upDown = yesterday_per_price.children("span").eq(0);
      let isPlusMinus = "";
      let isUpDown = "";
      
      
      let color = "#C0C0C0"; // GREY
      if( upDown.hasClass("up") ){
        isUpDown = " 상승";
        isPlusMinus = "+";
        color = "#FF0000"; //red
      }else if( upDown.hasClass("down") ){
        isUpDown = " 하락";
        isPlusMinus = "-";
        color = "#0000FF"; //blue
      }
      
      const unit = "원";
      const per_won = yesterday_per_price.find("span.blind").html().replace(",", "");
      const won = "현재가 " + curr_price.html() + unit;
      const letter = "전일대비 "+ per_won + unit + isUpDown;
      const percentage = isPlusMinus + yesterday_per_price.next().next().find("span.blind").html()+"%";
 
      let bodyTitle = "뜨뜨 미지근~"; // 0원 상승/하락
      if(isPlusMinus === "+" && per_won >= 1000){
        bodyTitle = "♬오늘은 한우 오마카세 가는 날♬";
        color = "#FF00FF"; // PURPLE
      }else if(isPlusMinus === "+" && per_won >= 700){
        bodyTitle = "오늘은 한우 먹는 날♬";
        color = "#FF6670"; // PINK
      }else if(isPlusMinus === "+" && per_won >= 500){
        bodyTitle = "오늘은 참치 먹는 날♪♪";
        color = "#00FF00"; // GREEN
      }else if(isPlusMinus === "+" && per_won >= 300){
        bodyTitle = "오늘은 삼겹살 먹는 날~";
      }else if(isPlusMinus === "+" && per_won >= 100){
        bodyTitle = "오늘은 돈까스 먹는 날";
      }else if(isPlusMinus === "+" && per_won >= 0){
        bodyTitle = "존버는 승리한다!";
      }
      
      if(isPlusMinus === "-" && per_won >= 1000){
        bodyTitle = "한강 입수 전 준비운동 철저히!";
      }else if(isPlusMinus === "-" && per_won >= 700){
        bodyTitle = "오른손 주먹을 쥐고, 내 머리를 세게 내려치도록 하자";
      }else if(isPlusMinus === "-" && per_won >= 500){
        bodyTitle = "내가 왜 이런 개잡주를 사서 고생할까...";
      }else if(isPlusMinus === "-" && per_won >= 300){
        bodyTitle = "더 떨어지진 않겠지...?";
      }else if(isPlusMinus === "-" && per_won >= 100){
        bodyTitle = "라면으로 떼우는 날";
      }else if(isPlusMinus === "-" && per_won >= 0){
        bodyTitle = "존버는 승리한다!";
      }
      
      const result = {
        body: bodyTitle,
        connectColor : color,
        connectInfo: [{
          title: won+"(" + percentage + ")",
          description: letter
        }],
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
    const token = req.param('token');
    const teamName = req.param('teamName');
    const roomName = req.param('roomName');
    const writerName = req.param('writerName');
    const text = req.param('text');
    const keyword = req.param('keyword');
    const key = Number(keyword);
    const createdAt = req.param('createdAt');
    
    const arr = [
      "069080", 
      "069080", 
      "007700", 
      "096530"
    ];
    
    const tit = [
      "웹젠", 
      "웹젠", 
      "F&F", 
      "씨젠"
    ];

    const htmls = getHtml(arr[key]);
      
    htmls.then(html => {
      const $ = cheerio.load(html.data);
      const current_price = $("#chart_area").children("div.rate_info").children("div.today").children("p.no_today").children("em");
      const yesterday_per_price = $("#chart_area").children("div.rate_info").children("div.today").children("p.no_exday").children("em");
      const company = $("div.wrap_company").children("h2").text();
      
      const curr_price = current_price.children("span");
      const upDown = yesterday_per_price.children("span").eq(0);
      let isPlusMinus = "";
      let isUpDown = "";
      
      
      let color = "#C0C0C0"; // GREY
      if( upDown.hasClass("up") ){
        isUpDown = " 상승";
        isPlusMinus = "+";
        color = "#FF0000"; //red
      }else if( upDown.hasClass("down") ){
        isUpDown = " 하락";
        isPlusMinus = "-";
        color = "#0000FF"; //blue
      }
      
      const unit = "원"
      const per_won = yesterday_per_price.find("span.blind").html().replace(",", "");
      const won = "현재가 " + curr_price.html() + unit;
      const letter = "전일대비 "+ per_won + unit + isUpDown;
      const percentage = isPlusMinus + yesterday_per_price.next().next().find("span.blind").html()+"%";

      let bodyTitle = "";
      
      if(isPlusMinus === "+" && per_won >= 1000){
        bodyTitle = "♬오늘은 한우 오마카세 가는 날♬";
        color = "#FF00FF"; // PURPLE
      }else if(isPlusMinus === "+" && per_won >= 700){
        bodyTitle = "오늘은 한우 먹는 날♬";
        color = "#FF6670"; // PINK
      }else if(isPlusMinus === "+" && per_won >= 500){
        bodyTitle = "오늘은 참치 먹는 날♪♪";
        color = "#00FF00"; // GREEN
      }else if(isPlusMinus === "+" && per_won >= 300){
        bodyTitle = "오늘은 삼겹살 먹는 날~";
      }else if(isPlusMinus === "+" && per_won >= 100){
        bodyTitle = "오늘은 돈까스 먹는 날";
      }else if(isPlusMinus === "+" && per_won >= 0){
        bodyTitle = "존버는 승리한다!";
      }
      
      if(isPlusMinus === "-" && per_won >= 1000){
        bodyTitle = "한강 입수 전 준비운동 철저히!";
      }else if(isPlusMinus === "-" && per_won >= 700){
        bodyTitle = "오른손 주먹을 쥐고, 내 머리를 세게 내려치도록 하자";
      }else if(isPlusMinus === "-" && per_won >= 500){
        bodyTitle = "내가 왜 이런 개잡주를 사서 고생할까...";
      }else if(isPlusMinus === "-" && per_won >= 300){
        bodyTitle = "더 떨어지진 않겠지...?";
      }else if(isPlusMinus === "-" && per_won >= 100){
        bodyTitle = "라면으로 떼우는 날";
      }else if(isPlusMinus === "-" && per_won >= 0){
        bodyTitle = "존버는 승리한다!";
      }
      
      const result = {
        body: "["+tit[test]+"]"+bodyTitle,
        connectColor : color,
        connectInfo: [{
          title: won+"(" + percentage + ")",
          description: letter
        }],
      };
      res.send(result);
    });
  // https://finance.naver.com/item/main.nhn?code=069080
  // https://finance.naver.com/search/search.nhn?query=%C0%A5%C1%A8
});

const getHtml = async (code) => {
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