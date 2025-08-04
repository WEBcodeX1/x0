# Example #9: (Table Rowspan with Bootstrap)

This example demonstrates how to use the **x0-framework** to create single div elements
spanning multiple lines (rowspan) using Bootstrap styling. It showcases the integration of
HTML table features like rowspan into declarative, configuration-driven **x0** UI components.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example9`

## Video

This example is too simple, no video provided.

## Main Components

### 1. Object Metadata

Inspect the example’s JSON object metadata in `./static/object.json`.

### 2. Purpose

- Demonstrates how to align rowspans with static-provided data.

### 3. Rowspan Configuration Example

Below is a JSON excerpt showing how to configure **x0-objects** of type `sysObjDiv`
with bootstrap rowspan `short-div` CSS styles in `object.json`:

```json
{
"Container":
    {
        "Type": "Div",
        "Attributes": {
            "Style": "container"
        }
    },
    "Row":
    {
        "Type": "Div",
        "Attributes": {
            "Style": "row"
        }
    },
    "Col1":
    {
        "Type": "Div",
        "Attributes": {
            "Style": "col-md-5",
            "Value": "Col-1"
        }
    },
    "Col2":
    {
        "Type": "Div",
        "Attributes": {
            "Style": "col-md-3"
        }
    },
    "Col3":
    {
        "Type": "Div",
        "Attributes": {
            "Style": "col-md-2",
            "Value": "Col-3"
        }
    },
    "Col4":
    {
        "Type": "Div",
        "Attributes": {
            "Style": "col-md-2",
            "Value": "Col-4"
        }
    },
    "Span1":
    {
        "Type": "Div",
        "Attributes": {
            "Style": "short-div",
            "Value": "Span-1"
        }
    },
    "Span2":
    {
        "Type": "Div",
        "Attributes": {
            "Style": "short-div",
            "Value": "Span-2"
        }
    }
}
```

`skeleton.json` metadata needed for positioning / referencing:

```json
{
	"Screen1":
	[
		{
			"Container":
			{
				"RefID": "Screen1"
			}
		},
		{
			"Row":
			{
				"RefID": "Container"
			}
		},
		{
			"Col1":
			{
				"RefID": "Row"
			}
		},
		{
			"Col2":
			{
				"RefID": "Row"
			}
		},
		{
			"Col3":
			{
				"RefID": "Row"
			}
		},
		{
			"Col4":
			{
				"RefID": "Row"
			}
		},
		{
			"Span1":
			{
				"RefID": "Col2"
			}
		},
		{
			"Span2":
			{
				"RefID": "Col2"
			}
		}
	]
}
```

## How It Works

1. On initialization, the div objects get rendered as defined in the metadata, applying the `short-div` attribute where specified.
2. The UI uses Bootstrap classes for visually consistent, responsive table layouts.
3. The configuration allows for extension to dynamic data sources as demonstrated in other **x0-examples**.

## Usage

This example can be used as a template for:

- Building tables with grouped rows or merged cells in **x0-applications**.
- Demonstrating advanced table features (like rowspan) with Bootstrap styling.
- Demonstrating modular UI construction using the **x0-framework**.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
