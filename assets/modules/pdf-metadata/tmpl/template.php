<?php
if (!defined('MODX_BASE_PATH')) {
	http_response_code(403);
	exit();
}

if (!$modx->hasPermission('exec_module')) {
	$modx->sendRedirect('index.php?a=106');
}
$css_hash = filemtime( $mod_path . "css/main.min.css"  );
$pdf_hash = filemtime( $mod_path . "js/pdf-lib.min.js" );
$mod_path = filemtime( $mod_path . "js/main.min.js"    );
?>
<link rel="stylesheet" type="text/css" href="<?= $path; ?>css/main.min.css?<?= $css_hash; ?>">
<h1 class="pagetitle"><span class="pagetitle-icon"><i class="<?= $module["icon"];?>"></i></span><span class="pagetitle-text"><?= $module["name"];?></span></h1>
<div class="body-wapper">
	<div class="wrapper">
		<div class="upload-box">
			<input type="file" accept="application/pdf" hidden>
			<img src="<?= $path; ?>images/upload-icon.svg" alt="">
			<p data-after-error="<?= $lang_module['pdf_meta_meta_error']; ?>"><?= $lang_module['pdf_meta_upload_text']; ?></p>
		</div>
		<div class="content">
			<div class="meta">
				<div class="column meta-title">
					<input type="text" id="title" value="" placeholder="<?= $lang_module['pdf_meta_meta_title']; ?>">
					<label><?= $lang_module['pdf_meta_meta_title']; ?></label>
				</div>
				<div class="column meta-subject">
					<input type="text" id="subject" value="" placeholder="<?= $lang_module['pdf_meta_meta_subject']; ?>">
					<label><?= $lang_module['pdf_meta_meta_subject']; ?></label>
				</div>
				<div class="column meta-keywords">
					<input type="text" id="keywords" value="" placeholder="<?= $lang_module['pdf_meta_meta_keywords']; ?>">
					<label><?= $lang_module['pdf_meta_meta_keywords']; ?></label>
				</div>
				<div class="column meta-author">
					<input type="text" id="author" value="" placeholder="<?= $lang_module['pdf_meta_meta_author']; ?>">
					<label><?= $lang_module['pdf_meta_meta_author']; ?></label>
				</div>
			</div>
			<div class="row buttons">
				<button class="column download-btn"><?= $lang_module['pdf_meta_download_btn']; ?></button>
				<button class="column cancel-btn"><?= $lang_module['pdf_meta_cancel_btn']; ?></button>
			</div>
		</div>
	</div>
</div>
<footer>
	<div>
		<p><i class="fa fa-github"></i> GitHub: <a href="https://github.com/ProjectSoft-STUDIONIONS/module-pdf-metadata" target="_blank">https://github.com/ProjectSoft-STUDIONIONS/module-pdf-metadata</a></p>
	</div>
</footer>
<script type="module" src="<?= $path; ?>js/pdf-lib.min.js?<?= $css_hash; ?>"></script>
<script type="module" src="<?= $path; ?>js/main.min.js?<?= $css_hash; ?>"></script>
