<?php
// Modèle de configuration de l'assistant Telo Cargo Services.
// 1) Copiez ce fichier sous le nom  tcs-assistant-config.php
// 2) Déposez-le à la RACINE de votre hébergement OVH (/home/telocargqv/), c'est-à-dire
//    à côté du dossier « www », et PAS dans « www » : il ne doit jamais être accessible depuis le web
//    ni être envoyé sur GitHub.
// 3) Remplacez la valeur de api_key par votre clé API Anthropic (console.anthropic.com).
return [
  'api_key'    => 'sk-ant-REMPLACEZ-MOI',
  // Modèle : 'claude-sonnet-4-5' (meilleure qualité, notamment en malgache)
  //       ou 'claude-haiku-4-5'  (environ 3 fois moins cher, un peu moins précis)
  'model'      => 'claude-sonnet-4-5',
  'max_tokens' => 800,
  // Adresse qui reçoit les demandes transmises par l'assistant
  'notify_to'  => 'sales@telocargoservices.com',
  // Limites anti-abus par visiteur (adresse IP)
  'rate_per_15min' => 40,
  'rate_per_day'   => 300,
];
