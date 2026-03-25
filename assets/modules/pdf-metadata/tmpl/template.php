<?php
if (!defined('MODX_BASE_PATH')) {
	http_response_code(403);
	exit();
}

if (!$modx->hasPermission('exec_module')) {
	$modx->sendRedirect('index.php?a=106');
}
$css_hash = filemtime($mod_path . "css/main.min.css");
$pdf_hash = filemtime($mod_path . "js/pdf-lib.min.js");
$mod_path = filemtime($mod_path . "js/main.min.js");
?>
<link rel="stylesheet" type="text/css" href="<?= $path; ?>css/main.min.css?<?= $css_hash; ?>">
<h1 class="pagetitle">
	<span class="pagetitle-icon"><i class="<?= $module["icon"];?>"></i></span>
	<span class="pagetitle-text"><?= $module["name"];?></span>
</h1>
<div class="body-wapper">
	<div class="wrapper">
		<div class="upload-box">
			<input type="file" accept="application/pdf" hidden>
			<img src="<?= $path; ?>images/upload-icon.svg" alt="">
			<p>Загрузите PDF</p>
		</div>
		<div class="content">
			<div class="meta">
				<div class="column meta-title">
					<label>Заголовок</label>
					<input type="text" id="title">
				</div>
				<div class="column meta-subject">
					<label>Тема</label>
					<input type="text" id="subject">
				</div>
				<div class="column meta-keywords">
					<label>Ключевые слова</label>
					<input type="text" id="keywords">
				</div>
				<div class="column meta-author">
					<label>Автор</label>
					<input type="text" id="author">
				</div>
			</div>
			<div class="row buttons">
				<button class="column download-btn">Скачать PDF</button>
				<button class="column cancel-btn">Начать заново</button>
			</div>
		</div>
	</div>
</div>
<script type="module" src="<?= $path; ?>js/pdf-lib.min.js?<?= $css_hash; ?>"></script>
<script type="module" src="<?= $path; ?>js/main.min.js?<?= $css_hash; ?>"></script>
