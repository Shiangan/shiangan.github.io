<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 验证输入
    $guestTitle = trim($_POST['guestTitle']);
    $name = trim($_POST['name']);
    $phone = trim($_POST['phone']);
    $sokaGakkai = isset($_POST['sokaGakkai']) ? '是' : '否';
    $nichiren = isset($_POST['nichiren']) ? '是' : '否';
    $inquiry = trim($_POST['inquiry']);

    // 簡單驗證
    if (empty($name) || empty($phone)) {
        // 處理錯誤，重定向或顯示錯誤信息
        die("姓名和電話是必填的。");
    }

    $to = 'shiang_an24@yahoo.com.tw'; // 你的邮箱地址
    $subject = '新表單提交';
    $message = "
    貴客稱呼: $guestTitle\n
    姓名: $name\n
    聯絡電話: $phone\n
    創價學會: $sokaGakkai\n
    日蓮正宗: $nichiren\n
    想詢問的: $inquiry
    ";
    $headers = "From: shiang_an24@yahoo.com.tw";

    // 发送邮件并检查是否成功
    if (mail($to, $subject, $message, $headers)) {
        header("Location: thank_you.html"); // 提交后跳转的页面
        exit();
    } else {
        // 处理邮件发送错误
        die("郵件發送失敗，請稍後再試。");
    }
}
?>
