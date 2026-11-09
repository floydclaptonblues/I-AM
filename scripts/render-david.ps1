# Run with PowerShell 7 on the Windows machine with the approved David voice.
# Generates source recordings only; the build compresses them for the website.
$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot -Parent
Add-Type -AssemblyName System.Security
$entries=Get-Content (Join-Path $root '.voice-work/script.json') -Raw | ConvertFrom-Json
$token=New-Object -ComObject SAPI.SpObjectToken
$token.SetId('HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_MS_EN-US_DAVID_11.0')
$voice=New-Object -ComObject SAPI.SpVoice
$voice.Voice=$token
$voice.Rate=0
$voice.Volume=100
foreach($entry in $entries) {
    $index=0
    foreach($sentence in $entry.sentences) {
        $stream=New-Object -ComObject SAPI.SpFileStream
        $path=Join-Path $root ('.voice-work/'+$entry.id+'-'+$index+'.wav')
        $stream.Open($path,3,$false)
        try {
            $voice.AudioOutputStream=$stream
            # Chromium maps the site's pitch .35636 to SAPI absmiddle -6.
            $xml='<pitch absmiddle="-6">'+[System.Security.SecurityElement]::Escape($sentence.text)+'</pitch>'
            $null=$voice.Speak($xml,8)
        } finally { $stream.Close() }
        $index++
    }
    Write-Output ('Recorded '+$entry.id)
}
