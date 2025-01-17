# Build Debian Packages

## 1. Prerequisites

Install debian build tools and gnupg (as root).

```
apt-get -y install debuild gnupg
```

## 2. Setup pgp key / Maintainer

As your user setup gpg key for signing the Debian Packages.

```
gpg --full-generate-key
```

:memo: The maintainer User-ID in `control` file must match your GPG User Name and E-Mail Address. It is advisable that your GIT metadata will also match this data.

```
Maintainer: Claus Prüfer (CTO) <c.pruefer@click-it.online>
```

## 3. Build Packages

Run the following command to build, lint and sign the Debian Packages.

```
debuild
```

If your data has been setup correctly the Packages will be built in `../../`.
