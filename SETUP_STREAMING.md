# Guide de Configuration Streaming (Icecast + Liquidsoap)

Ce guide vous explique comment configurer votre VPS Hetzner pour la diffusion de Saphir FM avec un système de fallback (Auto-DJ).

## 1. Installation des paquets
Connectez-vous à votre VPS et exécutez :
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install icecast2 liquidsoap -y
```

## 2. Configuration Icecast2
Éditez le fichier `/etc/icecast2/icecast.xml` :
- Changez les mots de passe `<source-password>`, `<relay-password>`, et `<admin-password>`.
- Assurez-vous que le port est bien `8000`.

Redémarrez Icecast :
```bash
sudo systemctl restart icecast2
```

## 3. Configuration Liquidsoap (Le Fallback)
Créez un dossier pour votre musique de secours :
```bash
mkdir -p /home/radio/fallback
```
*(Déposez vos fichiers .mp3 dans ce dossier)*

Créez le script de diffusion `/etc/liquidsoap/radio.liq` :
```liquidsoap
# Configuration du log
set("log.file.path", "/var/log/liquidsoap/radio.log")

# Source 1 : Le flux live (Icecast mount /live)
live = input.http("http://localhost:8000/live")

# Source 2 : La playlist de secours (fichiers locaux)
security = playlist("/home/radio/fallback")

# Mixage avec fallback : si live s'arrête, security prend le relais
radio = fallback(track_sensitive=false, [live, security])

# Sortie vers Icecast (le flux final écouté par les auditeurs)
output.icecast(%mp3,
  host = "localhost", port = 8000,
  password = "VOTRE_MOT_DE_PASSE_SOURCE",
  mount = "stream",
  name = "Saphir FM 106.8",
  description = "Écoutez. Informez-vous. Vivez.",
  url = "https://saphirfm.fr",
  radio)
```

## 4. Lancement
```bash
sudo systemctl enable liquidsoap
sudo systemctl start liquidsoap
```

Votre flux final sera disponible sur : `http://VOTRE_IP_VPS:8000/stream`
