<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $guestTitle = $_POST['guestTitle'];
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $sokaGakkai = isset($_POST['sokaGakkai']) ? '是' : '否';
    $nichiren = isset($_POST['nichiren']) ? '是' : '否';
    $inquiry = $_POST['inquiry'];

    $to = 'shiang_an24@yahoo.com.tw'; // 你的邮箱地址
    $subject = '新表单提交';
    $message = "
    貴客稱呼: $guestTitle\n
    姓名: $name\n
    聯絡電話: $phone\n
    創價學會: $sokaGakkai\n
    日蓮正宗: $nichiren\n
    想詢問的: $inquiry
    ";
    $headers = "From: no-reply@yourdomain.com\r\n";
    mail($to, $subject, $message, $headers);
    header("Location: thank_you.html"); // 提交后跳转的页面
    exit();
}
?>
