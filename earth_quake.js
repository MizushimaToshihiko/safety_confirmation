/**
 * From : https://stpost.net/it/web-se/web-service/earthquake
 * 気象庁が公開している地震情報(高頻度フィード)を取得し、震度5～9の場合は安否確認メールを送る
 * http://xml.kishou.go.jp/xmlpull.html
*/
function getEarthQuake() {
  
  var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  // var feedUrl = 'http://www.data.jma.go.jp/developer/xml/feed/eqvol.xml';
  // var feedRes = UrlFetchApp.fetch(feedUrl).getContentText();
  let feedRes = "http://localhost:8080/"
  var feedDoc = XmlService.parse(feedRes);
  var feedXml = feedDoc.getRootElement();
  var feedLocs = getElementsByTagName(feedXml, 'entry'); // xmlに含まれるentry要素を配列で取得する
  var sendFlg = false;  //メール送信フラグ
  
  //前回スクリプト実行時刻の保持(スプレッドシートから取得)
  // get sheet
  let ss = SpreadsheetApp.openById("11ZuWJjgVMbiL_xfk0BSlgPYbfodop1CGStJDYJkQ0vQ");
  let sh = ss.getSheetByName("地震発生時送信");

  if(sh.getRange(2, 3).getValue() == ''){
    //空の場合は現在時刻を設定
    sh.getRange(2, 2).setValue('前回スクリプト実行時刻');
    var preDate = Utilities.formatDate(new Date(),"JST","yyyy-MM-dd HH:mm:ss");
  }else{
    var preDate = Utilities.formatDate(sh.getRange(2, 3).getValue(),"JST","yyyy-MM-dd HH:mm:ss");
    Logger.log("前回スクリプト実行時刻：" + preDate);
  }
  
  //スクリプト実行時刻の更新(スプレッドシートを更新)
  var now = Utilities.formatDate(new Date(),"JST","yyyy-MM-dd HH:mm:ss");
  sh.getRange(2, 3).setValue(now);
  Logger.log("スクリプト実行時刻　　：" + now);
  
  //気象庁のxmlデータ(feed)より、entry要素を繰り返し探索
  var quakeInfo = "";  //地震情報
  feedLocs.forEach(function(value, i) {
    
    var titleText = value.getChild('title', atom).getText();  //title
    var linkText = value.getChild('link', atom).getAttribute('href').getValue();  //link
    
    //titleが震度速報の場合(震度３以上)
    if('震度速報' == titleText){
      
      //気象庁のxmlデータ(data)の情報を取得
      var dataUrl = linkText;
      var dataRes = UrlFetchApp.fetch(dataUrl).getContentText();
      var dataDoc = XmlService.parse(dataRes);
      var dataXml = dataDoc.getRootElement();
      var dataLocs = getElementsByTagName(dataXml, 'Item'); // xmlに含まれるItem要素を配列で取得する
      var dataReportDateTime = getElementsByTagName(dataXml, 'TargetDateTime')[0].getValue(); // 地震発生時刻
      dataReportDateTime = dataReportDateTime.replace('T', ' ');
      dataReportDateTime = dataReportDateTime.replace('+09:00', '');
      
      //気象庁のxmlデータ(data)より、Item要素を繰り返し探索
      dataLocs.forEach(function(value, i) {
        
        //Item要素の文字列を取得(震度と地域)
        var strItem = value.getValue();
        
        //「地震発生時刻 > 前回スクリプト実行時刻」かつ「震度が５～９」の場合
        if(dataReportDateTime > preDate 
           && strItem.match(/震度[５-９]/)){
             sendFlg = true;  //送信フラグをtrue
             quakeInfo = quakeInfo + strItem;  //地震情報
             Logger.log("地震発生時刻　　　　　：" + dataReportDateTime);
             Logger.log(strItem);  //Item要素
        }
      });
    }
  });
  
  //送信フラグがtrueの場合
  if(sendFlg == true){
    var recip ="toshihiko.mizushima@socia-enterprise.co.jp";
    var mailTitle = '安否確認';
    var mailMessage = 
        '【安否確認】\n'+  
        '震度５弱以上の強い揺れを検知しました。\n'+
        '安否確認のため、今の状況を入力してください。\n'+
        'https://docs.google.com/forms/d/e/1FAIpQLSdFGvVb7M9Y7qZG98fFWb7CYXchtQgN5pyQd9hmGcgEOsnejg/viewform?\n\n'+
        '【地震情報】\n'+ quakeInfo;
    GmailApp.sendEmail(recip, mailTitle, mailMessage, {
      "from": "soumu2@socia-enterprise.co.jp",
      "htmlBody": content,
    });
    Logger.log("送信完了");
  }else{
    Logger.log("送信なし");
  }
}

/**
* @param {string} element 検索要素
* @param {string} tagName タグ
* @return {string} data 要素
*/ 

function getElementsByTagName(element, tagName) {
  var data = [], descendants = element.getDescendants();
  for(var i in descendants) {
    var elem = descendants[i].asElement();
    if ( elem != null && elem.getName() == tagName) data.push(elem);
  }
  return data;
}