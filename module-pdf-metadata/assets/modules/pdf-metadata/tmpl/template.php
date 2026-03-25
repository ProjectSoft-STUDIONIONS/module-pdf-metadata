<?php
if (!defined('MODX_BASE_PATH')) {
	http_response_code(403);
	exit();
}

if (!$modx->hasPermission('exec_module')) {
	$modx->sendRedirect('index.php?a=106');
}
$mod_path = str_replace('\\','/',dirname(__FILE__)) . '/';
$path = preg_replace('@^' . preg_quote(MODX_BASE_PATH) . '@', "/", $mod_path);
?>
<link rel="stylesheet" type="text/css" href="main.min.css">
<?= $path; ?>
