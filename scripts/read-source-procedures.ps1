param([switch]$SlidesOnly)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$review = Join-Path $root 'review/source-import'
New-Item -ItemType Directory -Force $review | Out-Null
$sources = @(
  @('glass-cleaning', '411焊机各光栅、摄像头玻璃片清洁  操作手顺.pptx'),
  @('rofin-laser', '411罗芬激光源     操作手顺.docx'),
  @('width-alarm-check', 'C411焊机测宽装置使用及报警功能确认  操作手顺 .wps'),
  @('laser-alarm-history', 'C411激光焊机 查找激光报警信息  操作手册.docx'),
  @('qcds-sensor-parameters', 'QCDS图像 修改传感器参数 操作手顺.docx'),
  @('qcds-camera-change', 'QCDS系统 修改传感器摄像头  操作手顺.docx'),
  @('tia-program-download', '博图程序下载  操作手顺.wps'),
  @('guide-wheel-height', '调整411焊机导向轮高度   维护手顺.wps')
)
if (-not $SlidesOnly) {
$word = New-Object -ComObject KWPS.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  foreach ($source in $sources) {
    $id, $name = $source
    if ($name.EndsWith('.pptx')) { continue }
    $file = Join-Path ([Environment]::GetFolderPath('Desktop')) $name
    $doc = $word.Documents.Open($file, $false, $true)
    try {
      [IO.File]::WriteAllText((Join-Path $review "$id.txt"), $doc.Content.Text)
      $doc.ExportAsFixedFormat((Join-Path $review "$id.pdf"), 17)
      Write-Output "Exported $id"
    } finally { $doc.Close(0) }
  }
} finally { $word.Quit() }
}
$ppt = New-Object -ComObject PowerPoint.Application
try {
  $file = Join-Path ([Environment]::GetFolderPath('Desktop')) $sources[0][1]
  $deck = $ppt.Presentations.Open($file, $true, $false, $false)
  try {
    $deck.SaveAs((Join-Path $review 'glass-cleaning.pdf'), 32)
    $texts = @()
    foreach ($slide in $deck.Slides) {
      $text = @()
      foreach ($shape in $slide.Shapes) {
        if ($shape.HasTextFrame -and $shape.TextFrame.HasText) { $text += $shape.TextFrame.TextRange.Text }
      }
      $texts += "PAGE $($slide.SlideIndex)`n$($text -join "`n")"
    }
    [IO.File]::WriteAllText((Join-Path $review 'glass-cleaning.txt'), ($texts -join "`n`n"))
    Write-Output "Exported glass-cleaning"
  } finally { $deck.Close() }
} finally { $ppt.Quit() }
