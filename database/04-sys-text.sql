INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.BASICEXAMPLE.TEXT1', 'global', 'Hello world!', 'Hello world!');

INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.OVERLAY-CLOSE', 'overlay', 'Fenster schließen', 'Close window');

INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('SYS_DEFAULT_ERROR_TEXT', 'error', 'Default Fehler.', 'Default Error.');

INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.DEFAULT', 'error', 'Einige Formularfelder konnten nicht korrekt überprüft werden, diese werden rot umrandet dargestellt.', 'Some formfield values are incorrect, they are marked red.');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.FIELDS-2ITEMS-OR-LENGTH', 'error', 'Beide Felder weisen keinen Inhalt auf', 'Both fields do not contain data');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.USERPASS', 'error', 'Das Passwort muss aus min. 5, max 20 Zeichen bestehen und nur die Zeichen a-zA-Z und die Sonderzeoichen !?_# beinhalten',  'The password must be min. 5, max 20 chars long and consist of the characters a-zA-Z and !?_# only');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.TABLE-NO-ROWS', 'error', 'Die Tabelle muss mindestens eine Zeile enthalten', 'The table must contain min one row');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.IPv4ADDRESS-OCTET', 'error', 'Eine IPv4 Adresse muss aus 4 Oktett-Werten jeweils getrennt durch einen Punkt bestehen', 'An IPv4 address must contain 4 octets separated by a dot');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.IPv4ADDRESS-INTEGER', 'error', 'Einem Oktett einer IPv4 Adresse muss der Wert 1-255 zugewiesen sein', 'An IPv4 address octet must be between 1 and 255');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.IPv4SUBNET-OCTET', 'error', 'Eine IPv4 Subnet-Maske muss aus 4 Oktett-Werten jeweils getrennt durch einen Punkt bestehen', 'An IPv4 Address must contain 4 octets separated by a dot');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.IPv4SUBNET-BITMASK', 'error', 'Die Subnet-Maske ist inkorrekt', 'The Subnet-Mask is incorrect');

INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.IP-PORT-EMPTY', 'error', 'Kein Wert angegeben', 'No value given');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.IP-PORT-RANGE', 'error', 'Der Wert des IP tcp/udp Ports muss zwischen 1 und 65535 liegen', 'The value of the IP tcp/udp ports must be between 1 and 65535');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.IPv6ADDRESS-QUADNIBBLE-COUNT', 'error', 'IPv6 Adress-Format fehlerhaft', 'IPv6 Address format invalid');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.IPv4ADDRESS-QUADNIBBLE-SYNTAX', 'error', 'IPv6 Hex-Format fehlerhaft', 'IPv6 hex format invalid');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.DNSNAME-LENGTH', 'error', 'Ein DNS Eintrag muss mindestens 1 Zeichen enthalten', 'A dns record must contain at least 1 character');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.DNSNAME', 'error', 'Ein DNS Eintrag darf nur aus folgenden Zeichen bestehen: a-z, 0-9 und Bindestrich nicht zu Beginn und Ende des Eintrags', 'A dns record may only consist of the following characters: a-z, 0-9 and hyphen not at the end and beginning');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.MIN-VALUE', 'error', 'Der eingegebene Wert muss mindestens den folgenden Wert aufweisen:', 'The entered value must be at least the following value:');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.MAX-VALUE', 'error', 'Der eingegebene Wert darf maximal den folgenden Wert aufweisen:', 'The entered value may not exceed the following value:');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.MINMAX-NAN', 'error', 'Der eingegebene Wert muss numerisch sein', 'The entered value must be numeric');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.MAX-LENGTH', 'error', 'Maximale Länge überschritten', 'Maximum length exceeded');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.DATE-INTERNATIONAL-FORMAT', 'error', 'Internationales Datumsformat (JJJJ-MM-TT) fehlerhaft', 'International date format wrong (YYYY-MM-DD)');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.DATE-GERMAN-FORMAT', 'error', 'Deutsches Datumsformat (TT.MM.JJJJ) fehlerhaft', 'German date format wrong (DD.MM.YYYY)');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.FORMVALIDATE.DATE-GLOBAL-INVALIDDATE', 'error', 'Datum liegt außerhalb des Gültigkeits-Bereich', 'Date is outside the validity range');

INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.TABLE.MAX-ROW-COUNT', 'error', 'Maximalanzahl Tabellen-Zeilen erlaubt:', 'Maximum table-row count allowed:');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.ERROR.TABLE.DOUBLE-ENTRIES-NOTALLOWED', 'error', 'Doppelte Einträge sind nicht erlaubt in Spalte:', 'Double entries are not allowed in column:');

INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.BUTTON.LEFT', 'button', 'Nav links', 'Nav left');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.BUTTON.RIGHT', 'button', 'Nav rechts', 'Nav right');

INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.UPLOAD.BUTTON1', 'button', 'Upload Button', 'Upload Button');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('SYSTEM.UPLOAD.BUTTON', 'button', 'Upload Button', 'Upload Button');

INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.LOADING-INDICATOR-SEND-SERVER', 'notify-indicator', 'Die Daten werden zum Server gesendet und verarbeitet.', 'The data is currently sent to the server.');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.LOADING-INDICATOR-TITLE-CLOSE', 'notify-indicator', 'Notifikation schließen', 'Close notification');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.LOADING-INDICATOR-SUCCESS', 'notify-indicator', 'Die durchgeführte Aktion war erfolgreich:', 'The server action was successful:');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.LOADING-INDICATOR-ERROR', 'notify-indicator', 'Bei der Aktion ist ein Fehler aufgetreten:', 'The server action was unsuccessful:');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.LOADING-INDICATOR-SYSTEMERROR', 'notify-indicator', 'Es is ein Systemfehler aufgetreten.', 'A system error has occured.');

INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.SYS.INDICATOR.NETEVENT', 'notify-indicator', 'Netzwerk Event empfangen.', 'Network event received.');
INSERT INTO webui.text (id, "group", value_de, value_en) VALUES ('TXT.CONTEXTMENU.METHOD.REMOVE', 'ctxt-menu', 'Entfernen', 'Remove');
