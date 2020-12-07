var selectList_dup = [];
var counts = {};
var json;
var start;
var end;
var seikaisya = [];
var seikaisyaId = [];

//時刻設定
window.onload = function () {
  var today = new Date();
  today.setDate(today.getDate());
  var yyyy = today.getFullYear();
  var mm = ('0' + (today.getMonth() + 1)).slice(-2);
  var dd = ('0' + today.getDate()).slice(-2);
  document.getElementById('end').value = yyyy + '-' + mm + '-' + dd;

  var past = new Date();
  past.setDate(past.getDate() - 7);
  var yyyy = past.getFullYear();
  var mm = ('0' + (past.getMonth() + 1)).slice(-2);
  var dd = ('0' + past.getDate()).slice(-2);
  document.getElementById('start').value = yyyy + '-' + mm + '-' + dd;
};

//時刻を文字列へ
function dateToStr(date) {
  var hh = ('0' + date.getHours()).slice(-2);
  var mm = ('0' + date.getMinutes()).slice(-2);
  //var ss = ('0' + date.getSeconds()).slice(-2);
  //var sss = ('00' + date.getMilliseconds()).slice(-3);
  //var time = hh + ':' + mm + ':' + ss + ':' + sss;
  var time = hh + ':' + mm;
  return time;
}

//時刻を文字列へ、キリ番用
function dateToStr2(date) {
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hh = ('0' + date.getHours()).slice(-2);
  var mm = ('0' + date.getMinutes()).slice(-2);
  //var ss = ('0' + date.getSeconds()).slice(-2);
  //var sss = ('00' + date.getMilliseconds()).slice(-3);
  //var time = hh + ':' + mm + ':' + ss + ':' + sss;
  var time = month + '/' + day + ' ' + hh + ':' + mm;
  return time;
}

//IDチェック，正しければ返す
function createID(id) {
  var str = String(id)
    .replace('@', '')
    .replace('＠', '')
    .replace(/\r?\n/g, '')
    .replace(/\s+/g, '');
  //console.log(str);
  if (str.match(/^[\x20-\x7e]+$/)) {
    // console.log('ok');
    return '@' + str;
  } else {
    // console.log('---ng---');
    // console.log(str.charCodeAt(8));
    // console.log(str.charCodeAt(9));
    // console.log(str.charCodeAt(10));
    // console.log(str.charCodeAt(11));
    return 'IDなし';
  }
}

//ユーザデータを文字列に，最速5人用
function createUserInfo(user) {
  console.log(user);
  var str =
    user['ハンドルネーム 記入欄'] +
    ' ' +
    createID(user['Twitter ID 記入欄（＠も含む）']) +
    ' ' +
    dateToStr(user['タイムスタンプ']);
  return str;
}

//ユーザデータを文字列に，5分用
function createUserInfo2(user) {
  var str =
    user['ハンドルネーム 記入欄'] +
    ' ' +
    createID(user['Twitter ID 記入欄（＠も含む）']);
  return str;
}

//ユーザデータを文字列に，キリ番用
function createUserInfo3(user) {
  console.log(user);
  var str =
    user['ハンドルネーム 記入欄'] +
    ' ' +
    createID(user['Twitter ID 記入欄（＠も含む）']) +
    ' ' +
    dateToStr2(user['タイムスタンプ']);
  return str;
}

//選択肢を表示
function Selection() {
  start = new Date(document.getElementById('start').value);
  start = start.setHours(20);
  end = new Date(document.getElementById('end').value);
  end = end.setHours(20);
  strToJson();
  var selectList = [];
  for (i = 0; i < json.length; i++) {
    selectList.push(String(json[i]['解答 記入欄']));
  }

  for (var i = 0; i < selectList.length; i++) {
    var key = selectList[i];
    counts[key] = counts[key] ? counts[key] + 1 : 1;
  }

  selectList_dup = selectList.filter(function (x, i, self) {
    return self.indexOf(x) === i;
  });

  // for (var i = 0; i < selectList_dup.length; i++) {
  //   console.log(
  //     '「' + selectList_dup[i] + '」の回数：' + counts[selectList_dup[i]]
  //   );
  // }

  var elem = document.getElementById('output');
  for (var i = 0; i < selectList_dup.length; i++) {
    var chkboxstr =
      '<label for="' +
      i +
      '"><input type="checkbox" name="genre" id="' +
      i +
      '" value="0' +
      i +
      '">' +
      selectList_dup[i] +
      '(' +
      counts[selectList_dup[i]] +
      ')' +
      '</label><br>';
    elem.insertAdjacentHTML('beforeend', chkboxstr);
    //   selectList_dup[i] +
    //   '" id="+
    //   i +
    //   '>' +
    //   '<label for="genre_' +
    //   index +
    //   '">' +
    //   value.escapeHTML() +
    //   '</label>';
    // hoge.insert(chkboxstr);
    // var cb = document.createElement('input'); //チェックを作成
    // cb.type = 'checkbox';
    // cb.value = selectList_dup[i];
    // cb.id = i;
  }
}

// //正解者のIDを抜き出し、重複があれば、先頭のみ出力する
// function dupCheck(seikaisya) {
//   var dupList = [];
//   var dupSource = [];
//   var l = seikaisya.length;
//   for (var i = 0; i < l; i++) {
//     for (var j = i + 1; j < l; j++) {
//       //一致チェック
//       if (
//         seikaisya[i]['Twitter ID 記入欄（＠も含む）'] ==
//           seikaisya[j]['Twitter ID 記入欄（＠も含む）'] ||
//         seikaisya[i]['ハンドルネーム 記入欄'] ==
//           seikaisya[j]['ハンドルネーム 記入欄']
//       ) {
//         //一致可能性
//         dupSource.push(i);
//         dupList.push(j);
//       }
//     }
//   }
//   console.log(dupSource);
//   console.log(dupList);
//   console.log(seikaisya);
// }

//正解者のIDを抜き出し、重複があれば、先頭のみ出力する
//ただし，IDなしはないとする，ペナント用
// function dupCheck(seikaisya) {
//   var seikaisyaList = [];
//   for (i = 0; i < seikaisya.length; i++) {
//     seikaisyaList.push(String(seikaisya[i]['Twitter ID 記入欄（＠も含む）']));
//   }
//   var seikaisyaID = seikaisyaList.filter(function(x, i, self) {
//     return self.indexOf(x) === i;
//   });

//   var len = seikaisyaID.length;
//   for (var i = 0; i < len; i++) {
//     if (seikaisyaID[i] == 'IDなし') {
//       seikaisyaID.splice(i, 1);
//       i--;
//       len--;
//     }
//   }
//   console.log(seikaisyaID);
// }

//正解者を順番にpushしていく
//ついでに重複チェックもする
function addSeikaisya(p) {
  var flag = false;
  for (i = 0; i < seikaisya.length; i++) {
    if (
      p['Twitter ID 記入欄（＠も含む）'] ==
      seikaisya[i]['Twitter ID 記入欄（＠も含む）']
    ) {
      //既存の登録者、登録済フラグを立てる
      flag = true;
      break;
    }
  }
  if (!flag) {
    seikaisya.push(p);
  } else {
    console.log('重複削除');
    console.log(p);
  }
}

//選択肢から結果の表示
function showcheck() {
  var seikai = [];
  $('#output :checkbox:checked').each(function () {
    //値を取得
    var val = $(this).val();
    seikai.push(selectList_dup[Number(val)]);
  });

  for (var i = 0; i < json.length; i++) {
    for (var s = 0; s < seikai.length; s++) {
      if (json[i]['解答 記入欄'] == seikai[s]) {
        addSeikaisya(json[i]);
        break;
      }
    }
  }
  seikaisya.sort(function (a, b) {
    return a['タイムスタンプ'] > b['タイムスタンプ'] ? 1 : -1;
  });

  //dupCheck(seikaisya);

  var message = '【No.】出題 20:00</br>';
  for (i = 0; i < 5; i++) {
    message =
      message + (i + 1 + '位：' + createUserInfo(seikaisya[i])) + '</br>';
  }
  message += '</br>正解者：' + seikaisya.length + '人';

  var elem = document.getElementById('copy');

  elem.insertAdjacentHTML('beforeend', message);

  var limitDate = new Date(new Date(start).setMinutes(1));
  message = '</br>5分以内の正解者</br>';
  var j = 5;
  var m_limit = 1;
  for (times = 0; times <= 5; times++) {
    message += '☆20:0' + String(m_limit - 1) + '</br>';
    i = j;
    while (true) {
      if (seikaisya[i]['タイムスタンプ'].getTime() < limitDate.getTime()) {
        message += createUserInfo2(seikaisya[i]) + '</br>';
        i++;
      } else {
        j = i;
        break;
      }
    }
    m_limit += 1;
    limitDate = new Date(new Date(start).setMinutes(m_limit));
  }

  //キリ番作成
  message = message + '【キリ番順位】</br>';
  for (i = 99; i < seikaisya.length; i = i + 100) {
    message =
      message +
      ('☆' + (i + 1) + '位：' + createUserInfo3(seikaisya[i])) +
      '</br>';
  }

  elem.insertAdjacentHTML('beforeend', message);
}

//入力文字列をjsonに変換
function strToJson() {
  var str = document.getElementById('textbox').value;
  // var url = 'https://script.google.com/macros/s/AKfycbwFx0AJlgKmU7_-VY9kjeSpcehpJniTQr6j-3FU5zMKo2gRlZU/exec';
  // $.ajax({
  //     url: url,
  //     /* 自サイトのドメインであれば、https://kinocolog.com/ajax/test.html というURL指定も可 */
  //     type: 'GET',
  //     dataType: 'text'
  // }).done(function(data){
  //     /* 通信成功時 */
  //     console.log(data)
  //     str = data;
  //     str = str.replace(/\r?\n/g, '：');
  //     json = JSON.parse(str);
  //     var tmp = [];
  // console.log(json);
  // for (i = 0; i < json.length; i++) {
  //   json[i]['タイムスタンプ'] = new Date(json[i]['タイムスタンプ']);
  //   if(start <= json[i]['タイムスタンプ'] && json[i]['タイムスタンプ'] <= end){
  //   json[i]['Twitter ID 記入欄（＠も含む）'] = createID(
  //     json[i]['Twitter ID 記入欄（＠も含む）']
  //   );
  //   tmp.push(json[i])
  //   }
  // }
  // json = tmp;

  // }).fail(function(data){
  //     /* 通信失敗時 */
  //     alert('通信失敗！');

  // });

  str = str.replace(/\r?\n/g, '：');
  json = JSON.parse(str);
  var tmp = [];
  console.log(json);
  for (i = 0; i < json.length; i++) {
    json[i]['タイムスタンプ'] = new Date(json[i]['タイムスタンプ']);
    if (
      start <= json[i]['タイムスタンプ'] &&
      json[i]['タイムスタンプ'] <= end
    ) {
      json[i]['Twitter ID 記入欄（＠も含む）'] = createID(
        json[i]['Twitter ID 記入欄（＠も含む）']
      );
      tmp.push(json[i]);
    }
  }
  json = tmp;
}

//選択肢から結果の表示 = 15分羅列用 =
function showcheck2() {
  //チェックした回答の抽出
  var seikai = [];
  $('#output :checkbox:checked').each(function () {
    //値を取得
    var val = $(this).val();
    seikai.push(selectList_dup[Number(val)]);
  });

  //正解者の抽出
  for (var i = 0; i < json.length; i++) {
    for (var s = 0; s < seikai.length; s++) {
      if (json[i]['解答 記入欄'] == seikai[s]) {
        addSeikaisya(json[i]);
        break;
      }
    }
  }

  //15分無いの人を出す
  var seikai15min = [];
  var limitDate = new Date(new Date(start).setMinutes(15));
  for (var i = 0; i < seikaisya.length; i++) {
    if (seikaisya[i]['タイムスタンプ'].getTime() < limitDate.getTime()) {
      seikai15min.push(seikaisya[i]);
    }
  }

  // ソートする
  seikai15min.sort(function (a, b) {
    return a['Twitter ID 記入欄（＠も含む）'] >
      b['Twitter ID 記入欄（＠も含む）']
      ? 1
      : -1;
  });

  var strLength = 0;

  var messageTmp = '【No.138 15分以内の正解者】出題 20:00</br>';
  var message = '';
  strLength = message.bytes();

  //メッセージ追加
  for (var i = 0; i < seikai15min.length; i++) {
    if (createUserInfo2(seikai15min[i]).bytes() + messageTmp.bytes() > 260) {
      message += messageTmp;
      message += '</br></br>';
      messageTmp = '【No.138 15分以内の正解者】出題 20:00</br>';
    }
    messageTmp += createUserInfo2(seikai15min[i]) + '</br>';
  }

  message += messageTmp;

  //正解者人数の追加
  message += '</br>正解者：' + seikaisya.length + '人';

  var elem = document.getElementById('copy');

  elem.insertAdjacentHTML('beforeend', message);
}

String.prototype.bytes = function () {
  var length = 0;
  for (var i = 0; i < this.length; i++) {
    var c = this.charCodeAt(i);
    if (
      (c >= 0x0 && c < 0x81) ||
      c === 0xf8f0 ||
      (c >= 0xff61 && c < 0xffa0) ||
      (c >= 0xf8f1 && c < 0xf8f4)
    ) {
      length += 1;
    } else {
      length += 2;
    }
  }
  return length;
};

function checkAPI() {
  url =
    'https://script.googleusercontent.com/macros/echo?user_content_key=smH8EK0gBacGPWN0YGVC4vJhYfMu1YndLcfONvLnva8h36q2UDGSXAq_UmYmWQ7-g2fVrl1qNH86tW7-JFNQDQLzp6Ohyy78m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMxd7jAwRxWOcmejfIoChdDrokl_bsFpjQjOB9Nyvijs0BcEIvICfs5LEout0LlqVEWY2nZ7HPw5&lib=MiknC3HRAvizzmGSSk54aXN-ogQrA5nHA';

  // XMLHttpRequestオブジェクトの作成
  var request = new XMLHttpRequest();

  // URLを開く
  request.open('GET', url, false);

  // レスポンスが返ってきた時の処理を記述
  request.onload = function () {
    // レスポンスが返ってきた時の処理
    var data = this.response;
    console.log(data);
  };

  // リクエストをURLに送信
  request.send();
}

//APIからテキストを取りたい
function checkAPI() {
  const auth = gapi.auth2.getAuthInstance();
  auth.signIn();
  url =
    'https://script.googleusercontent.com/macros/echo?user_content_key=smH8EK0gBacGPWN0YGVC4vJhYfMu1YndLcfONvLnva8h36q2UDGSXAq_UmYmWQ7-g2fVrl1qNH86tW7-JFNQDQLzp6Ohyy78m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMxd7jAwRxWOcmejfIoChdDrokl_bsFpjQjOB9Nyvijs0BcEIvICfs5LEout0LlqVEWY2nZ7HPw5&lib=MiknC3HRAvizzmGSSk54aXN-ogQrA5nHA';

  // XMLHttpRequestオブジェクトの作成
  var request = new XMLHttpRequest();

  // URLを開く
  request.open('GET', url, false);

  // レスポンスが返ってきた時の処理を記述
  request.onload = function () {
    // レスポンスが返ってきた時の処理
    var data = this.response;
    console.log(data);
  };

  // リクエストをURLに送信
  request.send();
}
