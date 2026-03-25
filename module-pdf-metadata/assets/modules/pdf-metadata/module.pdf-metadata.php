<?php
if (!defined('MODX_BASE_PATH')) {
	http_response_code(403);
	exit();
}

if (!$modx->hasPermission('exec_module')) {
	$modx->sendRedirect('index.php?a=106');
}

if (!is_array($modx->event->params)) {
	$modx->event->params = [];
}

// Получаем модуль
function getModule() {
	$evo = EvolutionCMS();
	$id = $_GET['id'] ? (int)$_GET['id'] : 0;
	$result = $evo->db->select('id,name,icon', $evo->getFullTablename('site_modules'), "id='$id'");
	if($row = $evo->db->getRow($result)):
		return $row;
	endif;
	return false;
}

$params = $modx->event->params;

// Получаем данные модуля
$module = getModule();
// Иконка
$module["icon"] = trim($module["icon"]) ? trim($module["icon"]) : "fa fa-cube";

ob_start();
include_once MODX_MANAGER_PATH . 'includes/header.inc.php';
include_once dirname(__FILE__) . '/tmpl/template.php';
include_once MODX_MANAGER_PATH . 'includes/footer.inc.php';
echo ob_get_clean();
