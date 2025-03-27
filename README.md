# obsidian-vibe-components

[![GitHub Release](https://img.shields.io/github/v/release/your-username/obsidian-vibe-components?style=flat-square)](https://github.com/your-username/obsidian-vibe-components/releases)
[![GitHub Issues](https://img.shields.io/github/issues/your-username/obsidian-vibe-components?style=flat-square)](https://github.com/your-username/obsidian-vibe-components/issues)
[![GitHub Stars](https://img.shields.io/github/stars/your-username/obsidian-vibe-components?style=flat-square)](https://github.com/your-username/obsidian-vibe-components)

> 为 Obsidian 插件开发者提供一套内置的可交互 UI 组件库，方便预览效果和复制代码。

**✨ 特性**

* **丰富的 UI 组件:** 提供各种常用的界面元素，例如按钮、输入框、下拉菜单、模态框等。
* **交互式演示:** 每个组件都可以在 Obsidian 内部进行实时交互，方便开发者了解其行为和样式。
* **源码查看:** 可以直接查看每个组件的实现代码，方便开发者学习和集成到自己的插件中。
* **易于集成:** 设计简洁，方便其他插件开发者快速上手和使用。
* **持续更新:** 计划不断增加新的组件和功能。

**📦 如何使用**

1.  在 Obsidian 的社区插件中搜索 "obsidian-vibe-components" 并安装。
2.  启用该插件。
3.  在 Obsidian 中打开一个新的笔记。
4.  使用特定的命令或视图（你需要在插件中实现）来浏览和交互组件。
5.  在组件演示界面，你可以查看组件的实时效果和源代码。

**⌨️ 如何为其他插件开发者使用这些组件**

（在这里你需要详细说明其他开发者如何在自己的插件中引入和使用你的组件。这可能涉及到你的 API 设计、组件的命名规范、以及如何通过你的插件提供的接口来渲染这些组件。）

例如：

```typescript
// 假设你的插件提供了一个可以获取组件实例的方法
import { Button } from 'obsidian-vibe-components';

export class MyPlugin extends Plugin {
  async onload() {
    const myButton = new Button({
      label: '点击我',
      onClick: () => {
        new Notice('按钮被点击了！');
      }
    });

    // 假设你的插件提供了一个方法将组件渲染到某个元素
    this.renderComponent(this.containerEl, myButton);
  }

  // ... 其他方法
}
