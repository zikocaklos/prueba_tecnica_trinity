$body = @{type='TRANSFER'; amount=100.00; sourceAccountId=14; destinationAccountId=15} | ConvertTo-Json -Depth 5
try {
  $res = Invoke-RestMethod -Uri 'http://localhost:8080/api/transactions' -Method Post -ContentType 'application/json' -Body $body -ErrorAction Stop
  $res | ConvertTo-Json -Depth 10
} catch {
  if ($_.Exception.Response -ne $null) {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $reader.ReadToEnd()
  } else {
    $_ | Out-String
  }
}
