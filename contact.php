<?php
// Telo Cargo Services – envoi du formulaire de devis par e-mail (hébergement OVH) – v2
date_default_timezone_set('Indian/Antananarivo');
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

function out($code, $data) { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(405, ['ok' => false, 'error' => 'method']);

$TO   = 'sales@telocargoservices.com';
$FROM = 'noreply@telocargoservices.com';

$f = function ($k, $max = 200) {
  $v = isset($_POST[$k]) ? (is_array($_POST[$k]) ? implode(', ', $_POST[$k]) : $_POST[$k]) : '';
  $v = trim(str_replace("\0", '', (string)$v));
  return mb_substr($v, 0, $max, 'UTF-8');
};
$oneLine = function ($v) { return trim(preg_replace('/[\r\n\t]+/', ' ', $v)); };

// Anti-spam : champ piège vide et délai minimal de remplissage
if ($f('website') !== '') out(200, ['ok' => true]);
$ts = (int)$f('ts', 20);
if ($ts > 0 && (time() * 1000 - $ts) < 3000) out(400, ['ok' => false, 'error' => 'too_fast']);

$lang       = $f('lang', 2) === 'en' ? 'en' : 'fr';
$nom        = $oneLine($f('nom', 120));
$entreprise = $oneLine($f('entreprise', 160));
$email      = $oneLine($f('email', 160));
$tel        = $oneLine($f('tel', 40));
$modes      = $oneLine($f('modes', 120));
$message    = $f('message', 5000);

if ($nom === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) out(422, ['ok' => false, 'error' => 'invalid']);
if ($tel !== '' && !preg_match('/^[0-9 +().\-\/]{6,40}$/', $tel)) out(422, ['ok' => false, 'error' => 'tel']);

$subject = ($lang === 'en' ? 'Quote request — ' : 'Demande de devis — ') . $nom;
$body  = "Nouvelle demande depuis le site telocargoservices.com (" . strtoupper($lang) . ")\n\n";
$body .= "Nom : $nom\n";
$body .= "Entreprise : " . ($entreprise !== '' ? $entreprise : '—') . "\n";
$body .= "E-mail : $email\n";
$body .= "Téléphone : " . ($tel !== '' ? $tel : '—') . "\n";
$body .= "Mode(s) : " . ($modes !== '' ? $modes : '—') . "\n\n";
$body .= "Besoin :\n" . ($message !== '' ? $message : '—') . "\n\n";
$body .= "--\nEnvoyé le " . date('d/m/Y H:i') . " · IP " . ($_SERVER['REMOTE_ADDR'] ?? '?') . "\n";

$headers  = "From: =?UTF-8?B?" . base64_encode('Site Telo Cargo Services') . "?= <$FROM>\r\n";
$headers .= "Reply-To: " . '=?UTF-8?B?' . base64_encode($nom) . "?= <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$encSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = @mail($TO, $encSubject, $body, $headers, '-f' . $FROM);

if (!$sent) out(500, ['ok' => false, 'error' => 'mail']);
out(200, ['ok' => true]);
