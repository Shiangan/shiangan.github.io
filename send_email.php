<?php
if($_POST) {
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $message = $_POST['textarea'];
    $organization = implode(", ", $_POST['organization']);
    $gender = $_POST['gender'];
    
    $to = "shiang_an24@yahoo.com.tw";
    $subject = "新的表單提交";
    $body = "姓名: $name\n聯絡電話: $phone\n諮詢內容: $message\n選擇儀式: $organization\n稱謂: $gender";
    $headers = "From: 24hour@yahoo.com.tw";

    if(mail($to, $subject, $body, $headers)) {
        echo "感謝您的來信，禮儀師盡快回覆您！";
    } else {
        echo "Oops...! 有些問題，請稍後再試。";
    }
}
?>
