.. enhanced-objects

.. _enhancedobjects:

14. Enhanced Objects / Chaining
===============================

14.1 Overview
-------------

The following example shows how to combine two system objects, 1. **Type::FileUpload** with 2. **Type::List**).

Also the Type::FileUpload is constructed from referenced sysObjects shown in the following graphical explanation.

.. image:: /images/x0-enhanced-object-creation1.png
  :alt: Image - x0 Architecture

The x0-sysObject::List is able to integrate **ANY** x0-SystemObject including **UserDefined** inherited Objects
into a column.

.. note::

	For example, a Type::FormField Object can be used and **cloned** including the User-Input-Data.

.. image:: /images/x0-enhanced-object-creation2.png
  :alt: Image - x0 Architecture

The x0-System is able to clone an sysObject in realtime (if you push the "Add file" button.

.. _dataserialization:

14.2 Data-Serialization
-----------------------

If you will call **Method::getRuntimeData()** of the sysObject::List, you will get the following JSON result data:

  .. code-block:: javascript
	:linenos:

	"ResultData":
	[0]: {
		"SelectedFile": "upload1.pdf",
		"UploadStatus": 1
	},
	[1]: {
		"SelectedFile": "upload2.pdf",
		"UploadStatus": 0,
		"UploadException": 123
	},
	[2]: {
		"SelectedFile": null
	}


14.3 Building Objects
---------------------

#TODO: Add description.

14.2 Developer Documentation
----------------------------

#TODO: Add description.

14.2.1 Example Code (FileUpload)
********************************

.. literalinclude:: ../www/sysObjFileUpload.js
   :linenos:
