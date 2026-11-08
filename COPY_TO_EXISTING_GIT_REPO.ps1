param(
    [string]$RepositoryPath = 'C:\Users\tienq\Vung_Con_Xanh_Repo'
)
$ErrorActionPreference = 'Stop'
$source = $PSScriptRoot
$target = (Resolve-Path -LiteralPath $RepositoryPath -ErrorAction Stop).Path

if (-not (Test-Path -LiteralPath (Join-Path $target '.git'))) {
    throw "Đích chưa phải Git repository hoặc chưa tìm thấy .git: $target"
}
if ($source.TrimEnd('\') -eq $target.TrimEnd('\')) {
    throw "Bạn đang chạy trong chính repo đích. Không cần copy."
}
Write-Host "Nguồn: $source"
Write-Host "Đích: $target"
Write-Host "Sẽ sao chép (không xóa) toàn bộ website ba phần và giữ nguyên .git." -ForegroundColor Green

# Robocopy /E copies the entire site. /XD excludes .git even if someone adds one to the archive later.
& robocopy $source $target /E /XD .git /XF '*.zip' /R:2 /W:1 /NFL /NDL /NP
$robocopyStatus = $LASTEXITCODE
if ($robocopyStatus -ge 8) { throw "Robocopy thất bại (exit code $robocopyStatus)." }

Write-Host "Sao chép hoàn thành. Những thay đổi dưới đây CHƯA được commit/push:" -ForegroundColor Yellow
& git -C $target status --short
Write-Host 'Hãy mở index.html kiểm tra trước. Sau đó chạy git add -A, git commit và git push origin main.'
