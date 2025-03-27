[中文版本Readme](./README_zh.md)

# obsidian-vibe-components

[![GitHub Release](https://img.shields.io/github/v/release/LIUBINfighter/obsidian-vibe-components?style=flat-square)](https://github.com/your-username/obsidian-vibe-components/releases)
[![GitHub Issues](https://img.shields.io/github/issues/LIUBINfighter/obsidian-vibe-components?style=flat-square)](https://github.com/your-username/obsidian-vibe-components/issues)
[![GitHub Stars](https://img.shields.io/github/stars/LIUBINfighter/obsidian-vibe-components?style=flat-square)](https://github.com/your-username/obsidian-vibe-components)

> Your go-to for built-in, interactive UI components for Obsidian plugin developers. Preview, interact, and copy source code directly within Obsidian with a smooth vibe.

**✨ Features**

* **Rich UI Components:** Provides a variety of commonly used interface elements such as buttons, input fields, dropdown menus, modal windows, and more.
* **Interactive Demonstrations:** Each component can be interacted with in real-time within Obsidian, allowing developers to understand its behavior and styling easily.
* **Source Code Viewing:** Directly view the implementation code of each component, facilitating learning and integration into your own plugins.
* **Easy Integration:** Designed to be simple and straightforward for other plugin developers to quickly adopt and use.
* **Continuously Updated:** We plan to continuously add new components and features.

**📦 How to Use**

1.  Search for "obsidian-vibe-components" in the Obsidian community plugins and install it.
2.  Enable the plugin.
3.  Open a new note in Obsidian.
4.  Use specific commands or views (which you will need to implement in your plugin) to browse and interact with the components.
5.  In the component demonstration interface, you can view the real-time effect and source code of the components.

**⌨️ How to Use These Components for Other Plugins**

(Here you need to provide detailed instructions on how other developers can import and use your components in their own plugins. This might involve your API design, component naming conventions, and how to render these components through the interfaces your plugin provides.)

For example:

```typescript
// Assuming your plugin provides a method to get component instances
import { Button } from 'obsidian-vibe-components';

export class MyPlugin extends Plugin {
  async onload() {
    const myButton = new Button({
      label: 'Click Me',
      onClick: () => {
        new Notice('Button was clicked!');
      }
    });

    // Assuming your plugin provides a method to render components to a specific element
    this.renderComponent(this.containerEl, myButton);
  }

  // ... other methods
}
```
