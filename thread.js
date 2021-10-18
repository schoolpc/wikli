// データベースと接続する
var messagesRef = new Firebase('https://bbs1-fc402-default-rtdb.firebaseio.com/');

var messageField = $('#messageInput');
var nameField = $('#nameInput');
var messageList = $('#messages');
var button = $('#button');
var scroller = $('#scroller');
var title = $('#title');


//urlパラメータを取得
var url = new URL(window.location.href);
var params = url.searchParams;
var thID = params.get('t');



// ENTERキーを押した時に発動する
function sendbutton() {
        //フォームに入力された情報
        var username = nameField.val()|| "以下、あやしげからもっちがお送りします";
        var message = messageField.val();
        var time = new Date();
        time = time.toLocaleString();
        var type = "resu";
        var numb = threadcont.length;
        var threadId = thID;

        //データベースに保存する
        messagesRef.push({name:username, text:message, dat:time, type:type, ID:threadId, n:numb});
        messageField.val('');

        $('#scroller').scrollTop($('#messages').height());
};

let msgJson = [];
let threadcont = [];
// データベースにデータが追加されたときに発動する
messagesRef.on('child_added', function (snapshot) {
    //取得したデータ
    var data = snapshot.val();
    var username = data.name;
    var message = data.text;
    var time = data.dat;
    var type = data.type;
    var ID = data.ID;
    var numb = data.n;

    msgJson.push({name:username, text:message, dat:time, type:type, ID:ID, n:numb});

    if (data.ID === thID) {
        threadcont.push({name:username, text:message, dat:time, type:type, ID:ID, n:numb});
    }
    if (data.type === "resu" && data.ID === thID) {
        var messageElement = $("<il><p class='sender_name'>" + numb + " " + username + "</p><div><div class='left_balloon'>" + message + "</div><time id='time'>"+ time +"</time></div><p class='clear_balloon'></p></il>");
    }
    if (data.type === "thread" && data.ID === thID) {
        var titleElement = $("<il><br><div><div id='title'><h2>" + message + "</h2><br>" + username + " | " + time + "</div></div><p class='clear_balloon'></p></il>");
    }

    //HTMLに取得したデータを追加する
    messageList.append(messageElement);
    title.append(titleElement);

    //一番下にスクロールする
    $('#scroller').scrollTop($('#messages').height());
});
