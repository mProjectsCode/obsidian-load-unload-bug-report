import {MarkdownRenderChild, Plugin} from 'obsidian';

/**
 * This demonstration plugin provides a reproduction for bugs in loading and unloading markdown render childes in both reading and live preview mode.
 */
export default class MarkdownRenderChildLifetimeBugDemoPlugin extends Plugin {
	/**
	 * A list of all active markdown render childes created by this plugin.
	 * When the `onload` method of a render child is called, it gets added to this list.
	 * When the `onunload` method of a render child is called, it gets removed from this list.
	 */
	codeblocks: Emoji[];


	async onload() {
		this.codeblocks = [];

		/**
		 * A command to print out the list of currently loaded render childes.
		 */
		this.addCommand({
			id: 'debug-log-active-code-blocks',
			name: 'Debug log active code blocks',
			callback: () => {
				console.log(`The current number of loaded code blocks is ${this.codeblocks.length}.`, this.codeblocks);
			},
		});

		/**
		 * Register our markdown render child.
		 */
		this.registerMarkdownCodeBlockProcessor('bug-report', (source, el, context) => {
			context.addChild(
				new Emoji(this, el, source.trim(), context.sourcePath)
			);
		});
	}

	onunload() {
		// for this showcase it is not necessary to unload anything here
	}
}

class Emoji extends MarkdownRenderChild {
	static ALL_EMOJIS: Record<string, string> = {
		':+1:': '👍',
		':sunglasses:': '😎',
		':smile:': '😄',
	};

	text: string;
	fileName: string;
	id: string;
	plugin: MarkdownRenderChildLifetimeBugDemoPlugin;

	constructor(plugin: MarkdownRenderChildLifetimeBugDemoPlugin, containerEl: HTMLElement, text: string, fileName: string) {
		super(containerEl);

		this.id = crypto.randomUUID();

		this.plugin = plugin;
		this.text = text;
		this.fileName = fileName;
	}

	onload() {
		// add this render child to the code block list
		this.plugin.codeblocks.push(this);

		console.log(`Loaded markdown render child in file "${this.fileName}" with content "${this.text}" with id "${this.id}". The current number of loaded render childes is ${this.plugin.codeblocks.length}.`);

		// add an emoji to the content of the code block. This has nothing to do with the bug itself.
		this.containerEl.createSpan({
			text: Emoji.ALL_EMOJIS[this.text] ?? this.text,
		});
	}

	onunload(): void {
		// remove this render child from the code block list
		this.plugin.codeblocks = this.plugin.codeblocks.filter(x => x.id !== this.id);

		console.log(`Unloaded markdown render child in file "${this.fileName}" with content "${this.text}" with id "${this.id}". The remaining number of loaded render childes is ${this.plugin.codeblocks.length}.`);
	}
}
