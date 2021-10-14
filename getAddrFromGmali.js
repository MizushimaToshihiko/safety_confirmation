// It's based on https://hacknote.jp/archives/3523/
// GoogleAppScriptの実行トリガーを時間主導型の1分ごとに設定
function getMail() {
  //履歴保存用スプレッドシート指定
  var ss = SpreadsheetApp.openById('11ZuWJjgVMbiL_xfk0BSlgPYbfodop1CGStJDYJkQ0vQ');
  var sh = ss.getSheetByName("送信先");

  //未読メールを検索
  var thds = GmailApp.search("label:inbox is:unread");

  //一度に処理できるメール数
  var row_limit = 3;

  //受信履歴をスプレッドシートに格納
  // var row = sheet.getLastRow() + 1;
  // var row_first = row;
  // var oldIds = new Array();
  // for (var i = 1; i <= row; i++) {
  //   oldIds.push(sheet.getRange(i, 1).getValue());
  // }

  for (var n in thds) {
    var thd = thds[n];
    var msgs = thd.getMessages();
    for (m in msgs) {
      var msg = msgs[m];
      var date = msg.getDate();
      var body = msg.getBody();
      var id = msg.getId();

      //受信済みメールをスキップ
      if (oldIds.indexOf(id) > -1) {
        Logger.log(id + ' skipped.');
        continue;
      }

      //bodyにメールの内容がはいるのでここにメインの処理

      //受信ログを保存
      sheet.getRange(row, 1).setValue(id);
      sheet.getRange(row, 2).setValue("" + date);
      row++;

      //一度に処理できるメール数を超えたら処理終了
      if (row - row_first > row_limit) {
        break;
      }
    }
  }
}