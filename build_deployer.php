<?php
/**
 * Build script: Generates deploy_package.php for RunPayway (API + Frontend)
 * Run this locally: php build_deployer.php
 *
 * Deploys to: peoplestar.com/RunPayway/
 *   /RunPayway/api/      → PHP backend
 *   /RunPayway/           → Static frontend (Next.js export)
 */

$apiDir = __DIR__ . '/api/';
$frontendOutDir = __DIR__ . '/frontend/out/';

// ── API files ───────────────────────────────────────────────────────────────
$apiFiles = [
    'db_connect.php',
    'stripe_config.php',
    'create_checkout.php',
    'webhook_handler.php',
    'submit_diagnostic.php',
    'get_report.php',
    'download_report.php',
    'contact_submit.php',
    'setup_db.php',
    'schema.sql',
    'composer.json',
    '.htaccess',
    '.user.ini',
    'lib/token_utils.php',
    'lib/audit_logger.php',
    'engine/ScoringEngineV1.php',
    'engine/CalibrationEngineV1.php',
    'engine/OutputLogicV1.php',
    'pdf/ReportGenerator.php',
];

// ── Collect frontend files recursively ──────────────────────────────────────
function collectFiles(string $dir, string $prefix = ''): array {
    $files = [];
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..' || $item === '.DS_Store') continue;
        $fullPath = $dir . '/' . $item;
        $relativePath = $prefix === '' ? $item : $prefix . '/' . $item;
        if (is_dir($fullPath)) {
            $files = array_merge($files, collectFiles($fullPath, $relativePath));
        } else {
            $files[] = $relativePath;
        }
    }
    return $files;
}

$frontendFiles = [];
if (is_dir($frontendOutDir)) {
    $frontendFiles = collectFiles($frontendOutDir);
} else {
    echo "WARNING: Frontend /out/ directory not found. Run 'npm run build' in /frontend/ first.\n";
}

// ── Encode API files ────────────────────────────────────────────────────────
$apiEntries = [];
foreach ($apiFiles as $f) {
    $path = $apiDir . $f;
    if (!file_exists($path)) {
        echo "WARNING: Missing API file: $f\n";
        continue;
    }
    $content = file_get_contents($path);
    $b64 = base64_encode($content);
    $key = 'api/' . $f;
    $apiEntries[] = "    " . var_export($key, true) . " => \n        '" . $b64 . "'";
}

// ── Encode frontend files ───────────────────────────────────────────────────
$frontendEntries = [];
foreach ($frontendFiles as $f) {
    $path = $frontendOutDir . $f;
    if (!file_exists($path)) continue;
    $content = file_get_contents($path);
    $b64 = base64_encode($content);
    $key = 'web/' . $f;
    $frontendEntries[] = "    " . var_export($key, true) . " => \n        '" . $b64 . "'";
}

$allEntries = array_merge($apiEntries, $frontendEntries);
$apiCount = count($apiEntries);
$webCount = count($frontendEntries);
$totalCount = count($allEntries);

echo "Encoding $apiCount API files + $webCount frontend files = $totalCount total...\n";

// ── Build the deployer ──────────────────────────────────────────────────────
$deployer = '<?php
/**
 * ============================================================
 * RunPayway\u2122 - Full Deployment Package (API + Frontend)
 * ============================================================
 *
 * INSTRUCTIONS:
 * 1. Upload this file to GoDaddy public_html via cPanel File Manager
 * 2. Visit: https://peoplestar.com/deploy_runpayway.php?key=runpaywaydeploy2026
 * 3. Script deploys everything, creates the database, then deletes itself
 *
 * Generated: ' . date('Y-m-d H:i:s T') . '
 * API files: ' . $apiCount . '
 * Frontend files: ' . $webCount . '
 * Total: ' . $totalCount . '
 * ============================================================
 */

$secret_key = \'runpaywaydeploy2026\';
if (($_GET[\'key\'] ?? \'\') !== $secret_key) {
    http_response_code(403);
    die(\'<!DOCTYPE html><html><body style="font-family:monospace;padding:40px;"><h1>403 Forbidden</h1></body></html>\');
}

$db_host = \'localhost\';
$db_user = \'mcallpl\';
$db_pass = \'amazing123\';
$db_name = \'runpayway\';

header(\'Content-Type: text/html; charset=utf-8\');
ob_implicit_flush(true);
if (ob_get_level()) ob_end_flush();

echo \'<!DOCTYPE html>
<html>
<head><title>RunPayway Deployer</title>
<style>
body{font-family:"Courier New",monospace;background:#0A1628;color:#e0e0e0;padding:30px;line-height:1.6}
.c{max-width:800px;margin:0 auto}
h1{color:#1E40AF;border-bottom:2px solid #1E40AF;padding-bottom:10px}
.ok{color:#10B981}.err{color:#EF4444}.warn{color:#F59E0B}.info{color:#3B82F6}
.step{margin:15px 0;padding:10px;background:#111D35;border-left:3px solid #1E40AF}
.st{font-weight:bold;color:#3B82F6;font-size:14px}
.d{margin-left:20px;font-size:13px}
.sum{margin-top:30px;padding:20px;background:#111D35;border:2px solid #1E40AF}
.sum h2{color:#1E40AF;margin-top:0}
</style></head><body><div class="c">
<h1>RunPayway Deployer</h1>\';

$errors=0; $warnings=0;
function s($m,$t=\'ok\'){echo "<div class=\\"d\\"><span class=\\"$t\\">[$t]</span> $m</div>\n";flush();}
function st($t){echo "<div class=\\"step\\"><div class=\\"st\\">$t</div>\n";flush();}
function es(){echo "</div>\n";flush();}

// STEP 1: Environment
st("STEP 1: Server environment");
$doc_root=$_SERVER[\'DOCUMENT_ROOT\']??\'\';
s("Document root: $doc_root","info");
s("PHP: ".PHP_VERSION,"info");

$base_dir=\'\';
$roots=[$doc_root,\'/home/x2v8n84ca09w/public_html\',dirname(__FILE__)];
foreach($roots as $r){
    if(!empty($r)&&is_dir($r)&&is_writable($r)){$base_dir=rtrim($r,\'/\').\'/RunPayway\';s("Root: $r","ok");break;}
}
if(empty($base_dir)){$base_dir=dirname(__FILE__).\'/RunPayway\';s("Fallback","warn");$warnings++;}
$api_dir=$base_dir.\'/api\';
s("Deploy to: $base_dir","info");
es();

// STEP 2: Directories
st("STEP 2: Creating directories");
$dirs=[$base_dir,$api_dir,$api_dir.\'/lib\',$api_dir.\'/engine\',$api_dir.\'/pdf\',$api_dir.\'/reports\'];
foreach($dirs as $d){
    if(is_dir($d)){s(basename($d)."/","ok");}
    elseif(@mkdir($d,0755,true)){s("Created ".basename($d)."/","ok");}
    else{s("FAILED: $d","err");$errors++;}
}
@chmod($api_dir.\'/reports\',0755);
es();

// STEP 3: Deploy files
st("STEP 3: Deploying ' . $totalCount . ' files (' . $apiCount . ' API + ' . $webCount . ' frontend)");

$files=[
' . implode(",\n", $allEntries) . '
];

$deployed=0;$failed=0;
foreach($files as $k=>$b64){
    $content=base64_decode($b64);
    if($content===false){s("FAILED decode: $k","err");$failed++;$errors++;continue;}

    // Determine target path
    if(strpos($k,\'api/\')===0){
        $filepath=$api_dir.\'/\'.substr($k,4);
    }elseif(strpos($k,\'web/\')===0){
        $filepath=$base_dir.\'/\'.substr($k,4);
    }else{
        $filepath=$base_dir.\'/\'.$k;
    }

    $subdir=dirname($filepath);
    if(!is_dir($subdir))@mkdir($subdir,0755,true);

    if(@file_put_contents($filepath,$content)!==false){$deployed++;
        // Only show API files individually, batch frontend
        if(strpos($k,\'api/\')===0) s("$k (".strlen($content)." bytes)","ok");
    }else{s("FAILED: $k","err");$failed++;$errors++;}
}
s("Frontend files deployed silently: ' . $webCount . '","info");
s("Total deployed: $deployed/' . $totalCount . '".($failed>0?" ($failed failed)":""),$failed>0?"warn":"ok");
es();

// STEP 4: Database
st("STEP 4: MySQL database");
$conn=@new mysqli($db_host,$db_user,$db_pass);
if($conn->connect_error){
    s("Connection FAILED: ".$conn->connect_error,"err");$errors++;
    s("Create database via cPanel > MySQL Databases","warn");$warnings++;
    es();
}else{
    s("Connected","ok");
    $conn->query("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    // Try direct name, then prefixed
    $selected=false;
    if($conn->select_db($db_name)){s("Database: $db_name","ok");$selected=true;}
    else{
        $pf=$db_user.\'_\'.$db_name;
        if($conn->select_db($pf)){s("Database: $pf (GoDaddy prefixed)","ok");$selected=true;
            s("Update db_connect.php DB_NAME to \'$pf\'","warn");$warnings++;
        }
    }

    if(!$selected){
        s("Could not select database. Create it via cPanel:","err");
        s("1. cPanel > MySQL Databases > Create \'$db_name\'","info");
        s("2. Add user \'$db_user\' with ALL PRIVILEGES","info");
        $errors++;
    }else{
        // Run schema
        st("STEP 5: Database tables");
        $schema=base64_decode($files[\'api/schema.sql\']);
        $schema=preg_replace(\'/CREATE DATABASE.*?;\s*/i\',\'\',$schema);
        $schema=preg_replace(\'/USE\\s+\\w+;\s*/i\',\'\',$schema);
        $stmts=[];$cur=\'\';
        foreach(explode("\\n",$schema) as $ln){
            $tr=trim($ln);
            if(empty($tr)||strpos($tr,\'--\')===0)continue;
            $cur.=$ln."\\n";
            if(substr($tr,-1)===\';\'){$stmts[]=trim($cur);$cur=\'\';}
        }
        $tc=0;$te=0;$terr=0;
        foreach($stmts as $sql){
            if(empty(trim($sql)))continue;
            $tn=\'unknown\';
            if(preg_match(\'/CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?`?(\\w+)`?/i\',$sql,$m))$tn=$m[1];
            $sql=preg_replace(\'/CREATE\\s+TABLE\\s+(?!IF)/i\',\'CREATE TABLE IF NOT EXISTS \',$sql);
            if($conn->query($sql)){
                if($conn->warning_count>0){s("\'$tn\' exists","info");$te++;}
                else{s("Created: $tn","ok");$tc++;}
            }else{
                if(strpos($conn->error,\'already exists\')!==false){s("\'$tn\' exists","info");$te++;}
                else{s("Error \'$tn\': ".$conn->error,"err");$terr++;$errors++;}
            }
        }
        s("$tc created, $te existed, $terr errors",$terr>0?"warn":"ok");
        es();
    }
    $conn->close();
}
es();

// STEP 6: Verify
st("STEP 6: Verification");
$checks=[\'api/db_connect.php\',\'api/engine/ScoringEngineV1.php\',\'api/.htaccess\',\'index.html\',\'assess/index.html\',\'report/index.html\'];
foreach($checks as $cf){
    $p=$base_dir.\'/\'.$cf;
    if(file_exists($p))s("$cf","ok");
    else{s("MISSING: $cf","err");$errors++;}
}

$protocol=(!empty($_SERVER[\'HTTPS\'])&&$_SERVER[\'HTTPS\']!==\'off\')?\'https\':\'http\';
$host=$_SERVER[\'HTTP_HOST\']??\'peoplestar.com\';
$site_url=$protocol.\'://\'.$host.\'/RunPayway\';
$api_url=$site_url.\'/api\';
s("Site: <a href=\\"$site_url\\" style=\\"color:#3B82F6\\">$site_url</a>","info");
s("API:  <a href=\\"$api_url\\" style=\\"color:#3B82F6\\">$api_url</a>","info");
es();

// SUMMARY
echo \'<div class="sum">\';
if($errors===0) echo \'<h2 class="ok">DEPLOYMENT SUCCESSFUL</h2>\';
else echo \'<h2 class="err">COMPLETED WITH \'.$errors.\' ERROR(S)</h2>\';
echo "<p>Files: $deployed/' . $totalCount . '</p>";
echo "<p>Warnings: $warnings | Errors: $errors</p>";
echo "<p>&nbsp;</p><p class=\\"info\\">Next Steps:</p><ol>";
echo "<li>SSH in: <code>cd ~/public_html/RunPayway/api && composer install</code></li>";
echo "<li>Edit <code>api/stripe_config.php</code> with your Stripe keys</li>";
echo "<li>Set Stripe webhook → <code>$api_url/webhook_handler.php</code></li>";
echo "<li>Visit: <a href=\\"$site_url\\" style=\\"color:#3B82F6\\">$site_url</a></li>";
echo "</ol></div>";

// Self-destruct
st("STEP 7: Cleanup");
if(@unlink(__FILE__))s("Deployer deleted","ok");
else{s("Delete this file manually!","warn");$warnings++;}
es();

echo \'<p style="color:#666;margin-top:30px;font-size:11px">RunPayway Deployer | \'.date(\'Y-m-d H:i:s T\').\'</p></div></body></html>\';
';

$outputPath = __DIR__ . '/deploy_package.php';
file_put_contents($outputPath, $deployer);

$size = filesize($outputPath);
echo "\n";
echo "========================================\n";
echo "SUCCESS: deploy_package.php generated\n";
echo "========================================\n";
echo "Size: " . number_format($size) . " bytes (" . round($size/1024, 1) . " KB)\n";
echo "API files: $apiCount\n";
echo "Frontend files: $webCount\n";
echo "Total embedded: $totalCount\n";
echo "Path: $outputPath\n";
echo "\n";
echo "DEPLOY TO GODADDY:\n";
echo "1. Upload deploy_package.php to public_html via cPanel\n";
echo "2. Visit: https://peoplestar.com/deploy_package.php?key=runpaywaydeploy2026\n";
echo "3. Done! Site at: https://peoplestar.com/RunPayway/\n";
