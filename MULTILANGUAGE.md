# Multiple Language Support

The **x0** JavaScript framework provides robust multilanguage support as a core feature. Here’s a summary of how it works:

### Key Features

- **Multiple Language Support**: x0 supports multiple display languages, currently including English and German.
- **Real-Time Language Switching**: Users can switch the application language in real time without needing to reload the page.
- **Centralized Text Management**: All display texts are stored in a database table called `webui.text`. Each text entry can have multiple language variants (e.g., `value_en` for English and `value_de` for German).
- **Easy Configuration**: The display language can be set via the `display_language` property in the application configuration (e.g., `'en'` or `'de'`).
- **Metadata Integration**: Multilanguage text IDs can be referenced directly in x0-object metadata JSON configurations, making it easy to internationalize UI components.

### Example: Adding Multilanguage Texts

To add multilanguage support for UI texts, insert them into the system text table:

```sql
INSERT INTO webui.text
(id, "group", value_en, value_de)
VALUES
('TXT.TEXTID.1', 'group1', 'English Text #1', 'German Text #1');

INSERT INTO webui.text
(id, "group", value_en, value_de)
VALUES
('TXT.TEXTID.2', 'group1', 'English Text #2', 'German Text #2');
```

These text IDs can then be referenced in your UI object metadata for automatic language switching.

### How It Works for Users

- The user selects their language preference.
- All UI texts update instantly to the selected language.
- No reload or loss of application state occurs.

### Summary

**x0’s multilanguage system is designed for seamless, dynamic language changes and easy integration into real-time Single Page Applications.** It is well-suited for international projects and teams who need to support multiple languages with minimal overhead.
