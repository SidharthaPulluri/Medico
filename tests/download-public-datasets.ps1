$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataDir = Join-Path $root "public_data"
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null

$files = @(
  @{
    Name = "symptom_train.csv"
    Url = "https://huggingface.co/datasets/dux-tecblic/symptom-disease-dataset/resolve/main/symptom-disease-train-dataset.csv"
  },
  @{
    Name = "symptom_test.csv"
    Url = "https://huggingface.co/datasets/dux-tecblic/symptom-disease-dataset/resolve/main/symptom-disease-test-dataset.csv"
  },
  @{
    Name = "medquad.json"
    Url = "https://huggingface.co/datasets/Tonic/medquad/resolve/main/data/train-00000-of-00001.parquet"
  }
)

foreach ($file in $files) {
  $outPath = Join-Path $dataDir $file.Name
  Write-Host "Downloading $($file.Name)..."
  Invoke-WebRequest -Uri $file.Url -OutFile $outPath
}

Write-Host "Downloaded public datasets into $dataDir"
