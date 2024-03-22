// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function getType(p) {
	let str = Object.prototype.toString.call(p);
	let arr = str.substring(1, str.length - 1).split(" ");
	let type = arr[1].toLowerCase();
	return type;
}

function isObjectOrArray(type) {
	return type == "object" || type == "array";
}

function getAllFileds(obj) {
	if (!obj) {
		return [];
	}

	let res = [];
	let type = getType(obj)
	if (type == "object") {
		let keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = obj[key];
			if (!obj.hasOwnProperty(key)) {
				continue;
			}
			let type = getType(value);
			res.push({
				key,
				type
			});
			if (isObjectOrArray(type)) {
				res.push(...getAllFileds(value));
			}
		}
	} else if (type == "array") {
		let keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = obj[key];
			if (!obj.hasOwnProperty(key)) {
				continue;
			}
			let type = getType(value);
			if (isObjectOrArray(type)) {
				res.push(...getAllFileds(value));
			}
		}
	}

	return res;
}

/**
 * @param {string} json 
 */
function jsonToMarkdownTable(json) {
	let arr = getAllFileds(json);
	let res = "";

	res += "|字段|类型|必填|名称|描述|\n";
	res += "|:----|:---|:----- |:----- |:-----   |\n";
	for (const item of arr) {
		res += `|${item.key} | ${item.type} | |   | | \n`;
	}

	return res;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('editor.jsonToMarkdownTable', function () {
		const global = vscode.window;
		const activeTextEditor = global.activeTextEditor;
		if (!activeTextEditor) {
			return;
		}
		let activeText = activeTextEditor.document.getText(activeTextEditor.selection);
		if (!activeText) {
			vscode.window.showWarningMessage('未选中任何json文本');
			return;
		}

		let json = "";
		try {
			let text = activeText.replace(/[\r\n\t\s]/g, "");
			text = text.replace(/(,)((\\r)|(\\n)|(\\t)|(\\b))*(})/g, "$7");
			text = text.replace(/([\w0-9]+)(\s*:)/g, `"$1"$2`);
			json = JSON.parse(text);
		} catch (error) {
			vscode.window.showErrorMessage("选中文本非JSON文本, 请重新选择");
			return;
		}

		try {
			let markdownTable = jsonToMarkdownTable(json);
			vscode.env.clipboard.writeText(markdownTable)
				.then(() => {
					vscode.window.showInformationMessage('转换结果已存至粘贴板');
				})
		} catch (error) {
			vscode.window.showErrorMessage("将转换结果至粘贴板失败:" + error);
			return;
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
