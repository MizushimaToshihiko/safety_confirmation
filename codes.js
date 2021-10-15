function doGet() {
  return HtmlService.createTemplateFromFile('index.html').evaluate();
}

function userSleep(t) {
  Utilities.sleep(t)
}

function sendGetAddressForm() {
  // get form
  // let frm = FormApp.openById("1qJlIYIKjq-Z9jpxxfMebdde0fjz4_sKR8QOh-tvJmvE");
  // var items = frm.getItems();
  // Logger.log("【items.length】" + items.length);
  // for (var i = 0; i < items.length; i++) {
  //   Logger.log("【getHelpText()】" + items[i].getHelpText());
  //   Logger.log("【getId()】" + items[i].getId());
  //   Logger.log("【getIndex()】" + items[i].getIndex());
  //   Logger.log("【getTitle()】" + items[i].getTitle());
  //   Logger.log("【getType()】" + items[i].getType());
  // }

  // get sheet
  let ss = SpreadsheetApp.openById("11ZuWJjgVMbiL_xfk0BSlgPYbfodop1CGStJDYJkQ0vQ");
  let sh = ss.getSheetByName("送信先"); // 

  // return values
  let ret = [];

  // console.log(cells);
  for (let i = 1; i < sh.getLastRow(); i++) {

    // set the recipient, the email address is corporate's.
    let recip = getTestRecip(sh, i);
    if (recip == "") {
      break;
    }
    // console.log(i + "行目", cells[i][0]);

    // get the name 
    let name = getName(sh, i);
    ret.push(name);

    // "https://docs.google.com/forms/d/e/1FAIpQLScE-3XqVKry-qo193xKnicIy3mkJ5wB7gzYzVdlf-92Dt0POg/viewform?usp=pp_url&entry.517384846=%E7%B7%8F%E5%8B%99%E9%83%A8%E3%80%80%E6%B0%B4%E5%B3%B6%E4%BF%8A%E5%BD%A6" 質問1事前入力URL

    let title = "【安否確認ｼｽﾃﾑ】緊急連絡先の登録をお願い致します";
    let url = "https://docs.google.com/forms/d/e/1FAIpQLScE-3XqVKry-qo193xKnicIy3mkJ5wB7gzYzVdlf-92Dt0POg/viewform?"
      + 'entry.517384846=' + getSec(sh, i) + ' ' + name;
    let content = '<p>' + getFname(sh, i) + getMPos(sh, i) + getHTitle(sh, i)
      + '<br><br>日々の業務大変お疲れ様です。</p>'
      + '<p> 下記の「連絡先登録」リンクを開いて連絡先を登録して下さい<br>'
      + '-----------------------------------------------<br>'
      + '<a href="' + url + '">連絡先登録フォーム</a><br>'
      + '-----------------------------------------------<br></p>'
      + '<p>上記リンクを開いてもうまく表示できない場合は、<br>'
      + '<u>件名・本文を変更せずに</u>ご返信をお願い致します。</p>'
      + '<p>※このメールは自動送信されています。<br>'
      + '========================================</p>';
    GmailApp.sendEmail(recip, title, content, {
      "from": "soumu2@socia-enterprise.co.jp",
      "htmlBody": content,
    });
  }

  return ret.join("\n");
}

function sendSafetyConfForm() {

  // get sheet
  let ss = SpreadsheetApp.openById("11ZuWJjgVMbiL_xfk0BSlgPYbfodop1CGStJDYJkQ0vQ");
  let sh = ss.getSheetByName("送信先"); // 

  // return values
  let ret = [];

  // console.log(cells);
  for (let i = 1; i < sh.getLastRow(); i++) {

    let recip = getTestRecip(sh. i);
    if (recip == "") {
      break;
    }

    let name = getName(sh, i);
    ret.push(name)

    // "https://docs.google.com/forms/d/e/1FAIpQLSdFGvVb7M9Y7qZG98fFWb7CYXchtQgN5pyQd9hmGcgEOsnejg/viewform?usp=pp_url&entry.1051334773=%E7%B7%8F%E5%8B%99%E9%83%A8%E3%80%80%E6%B0%B4%E5%B3%B6%E4%BF%8A%E5%BD%A6" 質問1事前入力URL

    let title = "【安否確認ｼｽﾃﾑ】安否情報の入力をお願い致します";

    let url = "https://docs.google.com/forms/d/e/1FAIpQLSdFGvVb7M9Y7qZG98fFWb7CYXchtQgN5pyQd9hmGcgEOsnejg/viewform?"
      + 'entry.1051334773=' + getSec(sh, i) + ' ' + name;
      
    let content = '<p>' + getFname(sh, i) + getMPos(sh, i) + getHTitle(sh, i)
      + '<br><br>日々の業務大変お疲れ様です。</p>'
      + '<p> 只今震度5以上の地震が発生しました。<br>'
      + '下記「安否確認入力フォーム」リンクから安否情報の入力をお願い致します。<br>'
      + '-----------------------------------------------<br>'
      + '<a href="' + url + '">安否確認入力フォーム</a><br>'
      + '-----------------------------------------------<br></p>'
      + '<p>上記リンクを開いてもうまく表示できない場合は、<br>'
      + '下記事項についてご返信をお願い致します。<br>'
      + '</p>'
      + '<p>※このメールは地震発生の地域が居住地又は勤務地である方に自動送信されています。<br>'
      + '========================================</p>';
    GmailApp.sendEmail(recip, title, content, {
      "from": "soumu2@socia-enterprise.co.jp",
      "htmlBody": content,
    });
  }

  return ret.join("\n")
}

// get the name 
function getName(sh, idx) {
  return sh.getRange("A:A").getValues()[idx] + sh.getRange("B:B").getValues()[idx];
}

// get the name of section they belongs
function getSec(sh, idx) {
  return sh.getRange("F:F").getValues()[idx];
}

// get the family name
function getFname(sh, idx) {
  return sh.getRange("B:B").getValues()[idx];
}

// get the managial positions
function getMPos(sh, idx) {
  return sh.getRange("D:D").getValues()[idx];
}

// get the honorific title
function getHTitle(sh, idx) {
  return sh.getRange("E:E").getValues()[idx];
}

// get the mail address of the recipient
function getRecip(sh, idx) {
  return sh.getRange("G:G").getValues()[idx];
}

// get the mail address of the recipient for test.
function getTestRecip(sh, idx) {
  return sh.getRange("K:K").getValues()[idx];
}

/**
 * Lists the labels in the user's account.
 */
function listLabels() {
  var response = Gmail.Users.Labels.list('me');
  if (response.labels.length == 0) {
    Logger.log('No labels found.');
  } else {
    Logger.log('Labels:');
    for (var i = 0; i < response.labels.length; i++) {
      var label = response.labels[i];
      Logger.log('- %s', label.name);
    }
  }
}