# JsonToMarkdown README

> 这是一款在vscode中选中json然后快速转成markdown table 格式的小工具

## 为什么需要它?
当数据结构字段非常多时，要编写接口文档时，你需要定义每一个字段和类型，然后再补充其他描述信息，
通过它可以选择一段数据结构，可快速转成markdown table，这样就省去写变量名和字段类型，这样就大大节省一部分时间。(提示：如何还不明白，看下面的转换过程示例，想想一下你要写下面的markdown table 来给每个字段进行描述要多干多少活)

## 转换过程

### 1.输入
	```javascript
	{
		ccc: "123",
		b: {
			c: "123",
			d: "c"
		},
		a: 234,
		e: {
			f: "123",
			g: [],
		}
	}
	```
### 2.输出

 | 字段 | 类型   | 必填 | 名称 | 描述 |
 | :--- | :----- | :--- | :--- | :--- |
 | ccc  | string |      |      |      |
 | b    | object |      |      |      |
 | c    | string |      |      |      |
 | d    | string |      |      |      |
 | a    | number |      |      |      |
 | e    | object |      |      |      |
 | f    | string |      |      |      |
 | g    | array  |      |      |      |

## 如何使用
1. 光标选择一段json or js 对象
2. 按默认快捷键ctrl+shift+alt+t，就会将输出结果保存至粘贴板
  
